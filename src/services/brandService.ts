import { brandHierarchy as mockBrandHierarchy } from '../data/brandHierarchy';
import { Brand } from '../types/brands';

export const fetchBrandHierarchyAPI = async (): Promise<{ brands: Brand[] }> => {
  console.log('Fetching brand hierarchy from API...');
  try {
    const response = await fetch('http://216.48.187.233:5303/api/header-menu', {
      headers: {
        'Authorization': 'Bearer 123'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API fetch complete.');
    return data;
  } catch (error) {
    console.error("Failed to fetch brand hierarchy from API:", error);
    // Fallback to mock data if API fails
    return Promise.resolve(mockBrandHierarchy);
  }
};