const DB_NAME = "GeminiDB";
const LAYOUT_STORE_NAME = "Layouts";
const API_DATA_STORE_NAME = "ApiData";
const DB_VERSION = 2;

export function useIndexedDB() {
  // Open DB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(LAYOUT_STORE_NAME)) {
          db.createObjectStore(LAYOUT_STORE_NAME, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(API_DATA_STORE_NAME)) {
          db.createObjectStore(API_DATA_STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Save layout by id
  const saveLayout = async (id: string, layout: unknown) => {
    const db = await openDB();
    const tx = db.transaction(LAYOUT_STORE_NAME, "readwrite");
    const store = tx.objectStore(LAYOUT_STORE_NAME);
    store.put({ id, layout });
    return new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
  };

  // Get layout by id
  const getLayout = async <T = unknown>(id: string): Promise<T | null> => {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(LAYOUT_STORE_NAME, "readonly");
      const store = tx.objectStore(LAYOUT_STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.layout ?? null);
      request.onerror = () => resolve(null);
    });
  };

  // Save API data by id
  const saveData = async (id: string, data: unknown) => {
    const db = await openDB();
    const tx = db.transaction(API_DATA_STORE_NAME, "readwrite");
    const store = tx.objectStore(API_DATA_STORE_NAME);
    store.put({ id, data });
    return new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
  };

  // Get API data by id
  const getData = async <T = unknown>(id: string): Promise<T | null> => {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(API_DATA_STORE_NAME, "readonly");
      const store = tx.objectStore(API_DATA_STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.data ?? null);
      request.onerror = () => resolve(null);
    });
  };

  // Get all API data
  const getAllData = async <T = unknown>(): Promise<T[]> => {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(API_DATA_STORE_NAME, "readonly");
      const store = tx.objectStore(API_DATA_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result?.map((item: any) => item.data) ?? [];
        resolve(results);
      };

      request.onerror = () => resolve([]);
    });
  };

  return { saveLayout, getLayout, saveData, getData, getAllData };
}
