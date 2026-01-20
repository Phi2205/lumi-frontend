import axios from 'axios';

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Lấy base URL từ biến môi trường
  withCredentials: true, // Cho phép gửi và nhận cookies (cần thiết cho JWT token trong cookie)
  headers: {
    'Content-Type': 'application/json', // Đặt header Content-Type
    // Có thể thêm các header khác nếu cần
    // 'Authorization': `Bearer ${token}` // nếu có token
  },
});

// Bắt lỗi toàn cục (nếu cần)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi
    return Promise.reject(error);
  }
);

export default axiosInstance;