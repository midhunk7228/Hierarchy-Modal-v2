import type { DashboardLayout } from "../DashbiardExampleProps";

// IndexedDB utility for storing dashboard layouts by navigation path
export interface StoredLayout {
  navigationPath: string;
  widget: DashboardLayout;
  selectedDashboard: string;
  timestamp: number;
}

class WidgetStorage {
  private dbName = "DashboardWidgetDB";
  private dbVersion = 1;
  private storeName = "widgets";
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
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: "navigationPath",
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async saveWidget(
    navigationPath: string,
    widget: DashboardLayout,
    selectedDashboard: string
  ): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);

      const widgetData: StoredLayout = {
        navigationPath,
        widget,
        selectedDashboard,
        timestamp: Date.now(),
      };

      const request = store.put(widgetData);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getWidget(navigationPath: string): Promise<DashboardLayout | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(navigationPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as StoredLayout | undefined;
        resolve(result ? result.widget : null);
      };
    });
  }

  async getAllWidgets(): Promise<StoredLayout[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteWidget(navigationPath: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(navigationPath);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllWidgets(): Promise<void> {
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

export const widgetStorage = new WidgetStorage();
