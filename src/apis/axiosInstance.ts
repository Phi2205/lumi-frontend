import axios from 'axios';
import { refreshTokenApi } from './auth.api';
import { Notification } from '@/lib/components/notification';
import { reconnectSocket } from '@/lib/socket';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
// Tạo instance của axios
const axiosInstance = axios.create({
    baseURL: baseURL, // Lấy base URL từ biến môi trường
    withCredentials: true, // Cho phép gửi và nhận cookies (cần thiết cho JWT token trong cookie)
    headers: {
        'Content-Type': 'application/json', // Đặt header Content-Type
        // Có thể thêm các header khác nếu cần
        // 'Authorization': `Bearer ${token}` // nếu có token
    },
});

// Bắt lỗi toàn cục (nếu cần)
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                console.log("Already refreshing token");
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch(err => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            console.log("Refreshing token");
            return refreshTokenApi()
                .then(() => {
                    console.log("Token refreshed successfully");
                    processQueue(null);
                    return axiosInstance(originalRequest);
                })
                .catch((refreshError) => {
                    console.log("Failed to refresh token:", refreshError);
                    processQueue(refreshError);

                    // Clear auth data: User from localStorage and Tokens from cookies
                    localStorage.removeItem('user');

                    // Clear cookies (Note: if HttpOnly, this won't work browser-side, but covers non-HttpOnly)
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                    // Show notification và redirect sau khi user đóng thông báo
                    window.confirm('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                })
                .finally(() => {
                    reconnectSocket();
                    isRefreshing = false;
                });
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;

// import axios from 'axios';
// import { refreshTokenApi } from './auth.api';
// import { Notification } from '@/lib/components/notification';

// const baseURL = process.env.NEXT_PUBLIC_API_URL;

// const axiosInstance = axios.create({
//     baseURL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue: Promise<any>[] = [];

// const processQueue = (error: any) => {
//     failedQueue.forEach(prom => {
//         if (error) prom.reject(error);
//         else prom.resolve();
//     });
//     failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;
//         if (error.response && error.response.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise(function (resolve, reject) {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then(() => axiosInstance(originalRequest))
//                     .catch(err => Promise.reject(err));
//             }
//             originalRequest._retry = true;
//             isRefreshing = true;

//             return refreshTokenApi()
//                 .then(() => {
//                     console.log("Token refreshed successfully");
//                     processQueue(null);
//                     return axiosInstance(originalRequest);
//                 })
//                 .catch((refreshError) => {
//                     console.log("Failed to refresh token:", refreshError);
//                     processQueue(refreshError, null);

//                     // Log the user out by clearing localStorage
//                     localStorage.removeItem('user');

//                     // Show toast notification
//                     // toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
//                     window.confirm('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

//                     // Redirect to home page
//                     window.location.href = '/';
//                     // window.location.reload();

//                     return Promise.reject(refreshError);
//                 })
//                 .finally(() => {
//                     isRefreshing = false;
//                 });
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance; 