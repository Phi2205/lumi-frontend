import axiosInstance from './axiosInstance';
import { ApiResponse } from '../types/response.type';

export interface Upload {
    public_id: string;
    type: string;
}

export interface UploadResponse {
    data: Upload[];
    message: string;
    status: string;
}

export interface SignatureUpload {
    signature: string;
    timestamp: string;
    api_key: string;
    cloud_name: string;
}


export const uploadApi = {
    uploadFiles: async (files: File[] | File) => {
        const formData = new FormData();
        if (Array.isArray(files)) {
            files.forEach((file) => {
                formData.append("files", file);
            });
        } else {
            formData.append("files", files);
        }
        const response = await axiosInstance.post<UploadResponse>("/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    }
}

export const signatureUploadApi = (folder: string, upload_preset: string) =>
    axiosInstance.post<ApiResponse<SignatureUpload>>(
        "/upload/signature",
        {
            params: { folder } // Đưa vào đây (Request Body)
        }
    );
