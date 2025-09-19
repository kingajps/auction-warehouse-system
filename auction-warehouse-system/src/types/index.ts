// TypeScript type definitions for Auction Warehouse System

export interface Item {
  id: string;
  barcode?: string;
  name: string;
  brand?: string;
  model?: string;
  year?: number;
  description: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor' | 'For Parts';
  estimatedValue: number;
  images: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  caseId: string;
  lotId: string;
  auctionId: string;
  storageLocationId: string;
  status: 'Received' | 'Cataloged' | 'Photographed' | 'Listed' | 'Sold' | 'Returned';
  loggedBy: string;
  loggedAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface StorageLocation {
  id: string;
  locationId: string;
  zone: string;
  aisle?: string;
  shelf?: string;
  maxCapacity: number;
  currentOccupancy: number;
  availableSpace: number;
  storageType: 'Shelf' | 'Floor' | 'Rack' | 'Cage';
  status: 'Available' | 'Full' | 'Maintenance';
  notes?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  clientName: string;
  clientContact: string;
  receivedDate: Date;
  expectedAuctionDate?: Date;
  status: 'Active' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  totalItems: number;
  estimatedTotalValue: number;
  notes?: string;
}

export interface Lot {
  id: string;
  lotNumber: string;
  title: string;
  description: string;
  caseId: string;
  auctionId: string;
  items: string[];
  startingBid: number;
  estimatedValue: number;
  category: string;
  status: 'Draft' | 'Ready' | 'Live' | 'Sold' | 'Unsold';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Auction {
  id: string;
  auctionNumber: string;
  title: string;
  description: string;
  auctionDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  auctioneer: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  totalLots: number;
  totalEstimatedValue: number;
  actualRevenue?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Cataloger' | 'Photographer' | 'Warehouse';
  department: string;
  active: boolean;
}

export interface InventoryStats {
  totalItems: number;
  itemsByStatus: RecordRecord<string, number>;
  itemsByCategory: RecordRecord<string, number>;
  storageUtilization: number;
  recentActivity: {
    itemsAdded: number;
    itemsSold: number;
    itemsPhotographed: number;
  };
}
