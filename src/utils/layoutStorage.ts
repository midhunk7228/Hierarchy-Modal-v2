// IndexedDB utility for storing dashboard layouts by navigation path
export interface StoredLayout {
  navigationPath: string;
  layout: ReactGridLayout.Layout[];
  selectedDashboard: string;
  timestamp: number;
}

class LayoutStorage {
  private dbName = "DashboardLayoutDB";
  private dbVersion = 1;
  private storeName = "layouts";
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        debugger;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "navigationPath",
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async saveLayout(
    navigationPath: string,
    layout: ReactGridLayout.Layout[],
    selectedDashboard: string
  ): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      const layoutData: StoredLayout = {
        navigationPath,
        layout,
        selectedDashboard,
        timestamp: Date.now(),
      };

      const request = store.put(layoutData);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getLayout(
    navigationPath: string
  ): Promise<ReactGridLayout.Layout[] | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(navigationPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as StoredLayout | undefined;
        resolve(result ? result.layout : null);
      };
    });
  }

  async getAllLayouts(): Promise<StoredLayout[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteLayout(navigationPath: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(navigationPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllLayouts(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const layoutStorage = new LayoutStorage();
