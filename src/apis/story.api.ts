import axiosInstance from "./axiosInstance";

export interface CreateStoryPayload {
  file: File; // Image or video file
}

export const createStoryApi = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return axiosInstance.post("/stories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
