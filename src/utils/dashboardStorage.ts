// IndexedDB utility for storing dashboard layouts by dashboard name

import type { DashboardLayout } from "../DashbiardExampleProps";

export interface StoredDashboard {
  dashboardName: string;
  dashboard: DashboardLayout;
  timestamp: number;
}

class DashboardStorage {
  private dbName = "DashboardDB";
  private dbVersion = 1;
  private storeName = "dashboards";
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
            keyPath: "dashboardName",
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async saveDashboard(
    dashboardName: string,
    dashboard: DashboardLayout
  ): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      // debugger;
      const dashboardData: StoredDashboard = {
        dashboardName,
        dashboard: { ...dashboard, dashboardName },
        timestamp: Date.now(),
      };

      const request = store.put(dashboardData);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getDashboard(dashboardName: string): Promise<DashboardLayout | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(dashboardName);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as StoredDashboard | undefined;
        resolve(result ? result.dashboard : null);
      };
    });
  }

  async getAllDashboards(): Promise<StoredDashboard[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteDashboard(dashboardName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(dashboardName);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllDashboards(): Promise<void> {
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

export const dashboardStorage = new DashboardStorage();
