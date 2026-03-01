import { uploadApi } from "@/apis/upload.api";

export const uploadService = async (files: File[] | File) => {
    try {
        const response = await uploadApi.uploadFiles(files);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
