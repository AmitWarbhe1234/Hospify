import axios from "axios";

const API = axios.create({
  baseURL: "https://hospify-rut5.onrender.com/api",
});;

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

export default API;

export const createBill = (data) => API.post("/bills/create/", data);

export const getBillDetail = (billId) =>
  API.get(`/bills/${billId}/`);

export const getPatientsForBilling = () =>
  API.get("/patients/billing-list/");

export const downloadBillPDF = (billId) =>
  API.get(`/bills/${billId}/pdf/`, {
    responseType: "blob",
  });

export const getMyBills = () =>
  API.get("/bills/my-bills/");


// Payment APIs

export const createPaymentOrder = async (billId) => {
  const response = await API.post(
    `/bills/${billId}/create-payment/`
  );

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await API.post(
    `/bills/payment/verify/`,
    paymentData
  );

  return response.data;
};


// Chatbot API
export const sendChatMessage = (message) =>
  API.post("/chatbot/chat/", {
    message: message,
  });