export interface StoredUpload {
    id: string;
    file: File;
    caption: string;
    musicName: string;
    duration: number;
    progress: number;
    status: "uploading" | "creating" | "error";
    lastByte: number;
}

const DB_NAME = "LumiUploadDB";
const STORE_NAME = "pending_uploads";

export const uploadDb = {
    open: () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    save: async (upload: StoredUpload) => {
        const db = await uploadDb.open();
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(upload);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    getAll: async (): Promise<StoredUpload[]> => {
        const db = await uploadDb.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    remove: async (id: string) => {
        const db = await uploadDb.open();
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};
