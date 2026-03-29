import * as recommendApi from "@/apis/recommend.api";

export const getRecommendedUsers = async (limit: number = 10) => {
    try {
        const response = await recommendApi.getRecommendedUsers(limit);
        return response.data;
    } catch (error) {
        console.error("Fetch recommended users failed:", error);
        throw error;
    }
}

export const getSimilarUsers = async (userId: string, limit: number = 10) => {
    try {
        const response = await recommendApi.getSimilarUsers(userId, limit);
        return response.data;
    } catch (error) {
        console.error("Fetch similar users failed:", error);
        throw error;
    }
}

export const ingestInteraction = async (data: recommendApi.IngestInteractionPayload) => {
    try {
        const response = await recommendApi.ingestInteraction(data);
        return response.data;
    } catch (error) {
        console.error("Ingest interaction failed:", error);
        throw error;
    }
}
