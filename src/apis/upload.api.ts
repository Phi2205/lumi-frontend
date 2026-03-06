import axiosInstance from './axiosInstance';

export interface Upload {
    public_id: string;
    type: string;
}

export interface UploadResponse {
    data: Upload[];
    message: string;
    status: string;
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