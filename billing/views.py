from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.styles import ParagraphStyle
import io
import razorpay
from django.conf import settings
from .models import Bill, Payment
from .serializers import BillSerializer





client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)


@api_view(['POST'])
def create_bill(request):
    serializer = BillSerializer(data=request.data)
    if serializer.is_valid():
        bill = serializer.save()
        return Response(BillSerializer(bill).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def bill_detail(request, bill_id):
    try:
        bill = Bill.objects.get(id=bill_id)
    except Bill.DoesNotExist:
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(BillSerializer(bill).data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bill_pdf(request, bill_id):
    try:
        bill = Bill.objects.get(id=bill_id)
    except Bill.DoesNotExist:
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role != "PATIENT" or bill.patient.user != request.user:
        return Response({'error': 'You are not allowed to download this bill.'}, status=status.HTTP_403_FORBIDDEN)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=40, bottomMargin=40, leftMargin=50, rightMargin=50
    )
    styles = getSampleStyleSheet()
    elements = []

    primary_color = colors.HexColor('#4F46E5')
    light_gray = colors.HexColor('#F3F4F6')
    dark_gray = colors.HexColor('#374151')

    title_style = ParagraphStyle(
        'HospitalName', parent=styles['Title'],
        fontSize=26, textColor=primary_color, spaceAfter=2, alignment=0
    )
    subtitle_style = ParagraphStyle(
        'Subtitle', parent=styles['Normal'],
        fontSize=10, textColor=colors.grey, spaceAfter=20
    )
    invoice_label_style = ParagraphStyle(
        'InvoiceLabel', parent=styles['Normal'],
        fontSize=11, textColor=colors.grey, alignment=2
    )
    invoice_number_style = ParagraphStyle(
        'InvoiceNumber', parent=styles['Heading2'],
        fontSize=18, textColor=dark_gray, alignment=2, spaceAfter=2
    )
    section_heading_style = ParagraphStyle(
        'SectionHeading', parent=styles['Normal'],
        fontSize=9, textColor=colors.grey, spaceAfter=4
    )
    value_style = ParagraphStyle(
        'Value', parent=styles['Normal'],
        fontSize=11, textColor=dark_gray, spaceAfter=2
    )

    # ---------- Header: Hospital name (left) + Invoice info (right) ----------
    header_data = [
        [
            Paragraph("Hospify", title_style),
            Paragraph(f"INVOICE<br/><font size=18 color='#374151'>#{bill.id:05d}</font>", invoice_label_style),
        ],
    ]
    header_table = Table(header_data, colWidths=[300, 195])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    elements.append(header_table)
    elements.append(Paragraph("Healthcare Management System", subtitle_style))

    # Divider line
    elements.append(Table([['']], colWidths=[495], rowHeights=[2],
                           style=TableStyle([('BACKGROUND', (0, 0), (-1, -1), primary_color)])))
    elements.append(Spacer(1, 20))

    # ---------- Patient info + Bill date ----------
    info_data = [
        [
            Paragraph("BILLED TO", section_heading_style),
            Paragraph("DATE", section_heading_style),
        ],
        [
            Paragraph(f"{bill.patient.user.get_full_name()}", value_style),
            Paragraph(f"{bill.created_at.strftime('%d %B, %Y')}", value_style),
        ],
        [
            Paragraph(f"Patient ID: {bill.patient.patient_id}", subtitle_style),
            Paragraph(f"Status: <font color='{'#16A34A' if bill.status == 'paid' else '#D97706'}'><b>{bill.status.upper()}</b></font>", subtitle_style),
        ],
    ]
    info_table = Table(info_data, colWidths=[300, 195])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 30))

    # ---------- Line items table ----------
    data = [
        ['DESCRIPTION', 'AMOUNT (₹)'],
        ['Registration Fee', f"{bill.registration_fee:.2f}"],
        ['Consultation Fee', f"{bill.consultation_fee:.2f}"],
    ]

    table = Table(data, colWidths=[350, 145])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), primary_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, light_gray]),
        ('LINEBELOW', (0, 0), (-1, 0), 1, primary_color),
        ('LINEBELOW', (0, 1), (-1, -2), 0.5, colors.HexColor('#E5E7EB')),
    ]))
    elements.append(table)

    # ---------- Total row ----------
    total_data = [['TOTAL', f"₹{bill.total_amount:.2f}"]]
    total_table = Table(total_data, colWidths=[350, 145])
    total_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), dark_gray),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(total_table)
    elements.append(Spacer(1, 40))

    # ---------- Footer ----------
    footer_style = ParagraphStyle(
        'Footer', parent=styles['Normal'],
        fontSize=9, textColor=colors.grey, alignment=1
    )
    elements.append(Paragraph("Thank you for choosing Hospify.", footer_style))
    elements.append(Paragraph("This is a system-generated invoice and does not require a signature.", footer_style))

    doc.build(elements)
    buffer.seek(0)

    return FileResponse(buffer, as_attachment=True, filename=f'bill_{bill.id}.pdf')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bills(request):
    if request.user.role != "PATIENT":
        return Response({'error': 'Only patients can view their bills.'}, status=status.HTTP_403_FORBIDDEN)

    patient = request.user.patient_profile
    bills = Bill.objects.filter(patient=patient).order_by('-created_at')
    serializer = BillSerializer(bills, many=True)
    return Response(serializer.data)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request, bill_id):

    if request.user.role != "PATIENT":
        return Response(
            {'error': 'Only patients can make payment.'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        bill = Bill.objects.get(id=bill_id)
    except Bill.DoesNotExist:
        return Response(
            {'error': 'Bill not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check whether this bill belongs to logged-in patient
    if bill.patient.user != request.user:
        return Response(
            {'error': 'You are not allowed to pay this bill.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Already paid
    if bill.status == "paid":
        return Response(
            {'error': 'This bill is already paid.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Amount in paise
    amount = int(bill.total_amount * 100)

    # Create Razorpay order
    razorpay_order = client.order.create({
        'amount': amount,
        'currency': 'INR',
        'payment_capture': 1
    })

    # Save payment information
    payment = Payment.objects.create(
        bill=bill,
        razorpay_order_id=razorpay_order['id'],
        amount=bill.total_amount,
        status='created'
    )

    return Response({
        'message': 'Payment order created successfully.',
        'order_id': razorpay_order['id'],
        'amount': amount,
        'currency': 'INR',
        'razorpay_key_id': settings.RAZORPAY_KEY_ID,
        'payment_id': payment.id
    }, status=status.HTTP_201_CREATED)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):

    if request.user.role != "PATIENT":
        return Response(
            {'error': 'Only patients can verify payment.'},
            status=status.HTTP_403_FORBIDDEN
        )

    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    if not all([
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    ]):
        return Response(
            {'error': 'Payment details are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        payment = Payment.objects.select_related(
            'bill',
            'bill__patient',
            'bill__patient__user'
        ).get(
            razorpay_order_id=razorpay_order_id
        )
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment record not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    bill = payment.bill

    # Check bill ownership
    if bill.patient.user != request.user:
        return Response(
            {'error': 'You are not allowed to verify this payment.'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

    except razorpay.errors.SignatureVerificationError:
        payment.status = 'failed'
        payment.save()

        return Response(
            {'error': 'Payment verification failed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Payment successful
    payment.razorpay_payment_id = razorpay_payment_id
    payment.razorpay_signature = razorpay_signature
    payment.status = 'success'
    payment.save()

    # Mark bill as paid
    bill.status = 'paid'
    bill.save()

    return Response({
        'message': 'Payment verified successfully.',
        'bill_id': bill.id,
        'payment_id': payment.id,
        'status': 'paid'
    }, status=status.HTTP_200_OK)