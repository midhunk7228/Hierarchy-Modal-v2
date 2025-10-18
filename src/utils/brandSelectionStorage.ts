import type { BrandSelectionState } from "../redux/brandSelectionSlice";

const DB_NAME = "BrandSelectionDB";
const STORE_NAME = "brandSelections";
const DB_VERSION = 1;

let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject("Error opening database");
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function saveBrandSelection(selection: BrandSelectionState) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.put({ id: "currentSelection", ...selection });
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function loadBrandSelection(): Promise<BrandSelectionState | null> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get("currentSelection");

  return new Promise((resolve) => {
    request.onsuccess = () => {
      resolve(
        request.result
          ? {
              selectedBrand: request.result.selectedBrand,
              selectedSubBrands: request.result.selectedSubBrands,
            }
          : null
      );
    };
    request.onerror = () => {
      resolve(null);
    };
  });
}
