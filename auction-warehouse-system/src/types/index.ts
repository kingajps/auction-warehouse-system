// Common types used across the application

export interface InventoryItem {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@itm01': string; // Barcode
    '/attributes/@itm02': string; // Item Name
    '/attributes/@itm03': string; // Brand
    '/attributes/@itm04': string; // Model
    '/attributes/@itm05': number; // Year
    '/attributes/@itm06': string; // Description
    '/attributes/@itm07': string; // Category
    '/attributes/@itm08': number; // Quantity
    '/attributes/@itm09': string; // Case ID
    '/attributes/@itm10': string; // Lot Number
    '/attributes/@itm11': string; // Auction ID
    '/attributes/@itm12': string; // Storage Location
    '/attributes/@itm13': string; // Date Logged
    '/attributes/@itm14': string; // Logged By
    '/attributes/@itm15': string; // Status
    '/attributes/@itm16': string; // Photo URLs
    '/attributes/@itm17': number; // Estimated Value
  };
}

export interface StorageLocation {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@loc01': string; // Location ID
    '/attributes/@loc02': string; // Zone
    '/attributes/@loc03': string; // Aisle
    '/attributes/@loc04': string; // Shelf
    '/attributes/@loc05': number; // Max Capacity
    '/attributes/@loc06': number; // Current Occupancy
    '/attributes/@loc07': number; // Available Space
    '/attributes/@loc08': string; // Storage Type
    '/attributes/@loc09': string; // Status
    '/attributes/@loc10': string; // Notes
  };
}

export interface AuctionCase {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@cas01': string; // Case ID
    '/attributes/@cas02': string; // Case Name
    '/attributes/@cas03': string; // Auction ID
    '/attributes/@cas04': string; // Auction Date
    '/attributes/@cas05': number; // Total Lots
    '/attributes/@cas06': number; // Total Items
    '/attributes/@cas07': string; // Status
    '/attributes/@cas08': string; // Description
    '/attributes/@cas09': string; // Created By
  };
}

export interface ProductData {
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  description?: string;
  category?: string;
  estimatedValue?: number;
}
