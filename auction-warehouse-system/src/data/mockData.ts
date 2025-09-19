import { Item, StorageLocation, Case, Lot, Auction, User, InventoryStats } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@auctionhouse.com',
    role: 'Admin',
    department: 'Management',
    active: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@auctionhouse.com',
    role: 'Cataloger',
    department: 'Cataloging',
    active: true
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@auctionhouse.com',
    role: 'Warehouse',
    department: 'Warehouse',
    active: true
  }
];

// Mock Storage Locations
export const mockStorageLocations: StorageLocation[] = [
  {
    id: '1',
    locationId: 'A1-SHELF-3',
    zone: 'A',
    aisle: '1',
    shelf: '3',
    maxCapacity: 50,
    currentOccupancy: 35,
    availableSpace: 15,
    storageType: 'Shelf',
    status: 'Available',
    notes: 'High shelf for smaller items'
  },
  {
    id: '2',
    locationId: 'B-FLOOR-1',
    zone: 'B',
    aisle: 'N/A',
    shelf: 'N/A',
    maxCapacity: 20,
    currentOccupancy: 12,
    availableSpace: 8,
    storageType: 'Floor',
    status: 'Available',
    notes: 'Large item floor storage area'
  },
  {
    id: '3',
    locationId: 'C2-RACK-5',
    zone: 'C',
    aisle: '2',
    shelf: '5',
    maxCapacity: 75,
    currentOccupancy: 75,
    availableSpace: 0,
    storageType: 'Rack',
    status: 'Full',
    notes: 'Electronics storage rack'
  }
];

// Mock Cases
export const mockCases: Case[] = [
  {
    id: '1',
    caseNumber: 'CASE-2024-001',
    title: 'Estate Sale - Johnson Family',
    description: 'Complete household contents including furniture, electronics, and collectibles',
    clientName: 'Johnson Family Estate',
    clientContact: 'estate@johnsonlaw.com',
    receivedDate: new Date('2024-01-15'),
    expectedAuctionDate: new Date('2024-02-15'),
    status: 'Processing',
    totalItems: 45,
    estimatedTotalValue: 25000,
    notes: 'High-value antiques included'
  },
  {
    id: '2',
    caseNumber: 'CASE-2024-002',
    title: 'Business Liquidation - Tech Startup',
    description: 'Office equipment, computers, and furniture from failed startup',
    clientName: 'TechFlow Solutions LLC',
    clientContact: 'liquidation@techflow.com',
    receivedDate: new Date('2024-01-20'),
    expectedAuctionDate: new Date('2024-02-20'),
    status: 'Active',
    totalItems: 28,
    estimatedTotalValue: 15000,
    notes: 'Mostly modern electronics'
  }
];

// Mock Auctions
export const mockAuctions: Auction[] = [
  {
    id: '1',
    auctionNumber: 'AUC-2024-001',
    title: 'February Estate & Consignment Auction',
    description: 'Monthly auction featuring estate items, antiques, and consignments',
    auctionDate: new Date('2024-02-15'),
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    location: 'Main Auction Hall',
    auctioneer: 'Robert Anderson',
    status: 'Scheduled',
    totalLots: 125,
    totalEstimatedValue: 75000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

// Mock Lots
export const mockLots: Lot[] = [
  {
    id: '1',
    lotNumber: 'LOT-001',
    title: 'Vintage Oak Dining Set',
    description: 'Complete 6-piece oak dining set with table and chairs',
    caseId: '1',
    auctionId: '1',
    items: ['1', '2'],
    startingBid: 200,
    estimatedValue: 800,
    category: 'Furniture',
    status: 'Ready',
    createdBy: '2',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    lotNumber: 'LOT-002',
    title: 'Electronics Bundle',
    description: 'Laptop, tablet, and accessories',
    caseId: '2',
    auctionId: '1',
    items: ['3', '4'],
    startingBid: 150,
    estimatedValue: 600,
    category: 'Electronics',
    status: 'Draft',
    createdBy: '2',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

// Mock Items
export const mockItems: Item[] = [
  {
    id: '1',
    barcode: '123456789012',
    name: 'Oak Dining Table',
    brand: 'Heritage Furniture',
    model: 'Classic Oak',
    year: 1995,
    description: 'Solid oak dining table with extension leaf, seats 6-8 people',
    category: 'Furniture',
    condition: 'Good',
    estimatedValue: 500,
    images: ['/images/oak-table-1.jpg', '/images/oak-table-2.jpg'],
    dimensions: {
      length: 72,
      width: 36,
      height: 30,
      weight: 85
    },
    caseId: '1',
    lotId: '1',
    auctionId: '1',
    storageLocationId: '2',
    status: 'Cataloged',
    loggedBy: '3',
    loggedAt: new Date('2024-01-16T09:30:00'),
    updatedAt: new Date('2024-01-16T14:20:00'),
    notes: 'Minor scratches on surface, otherwise excellent condition'
  },
  {
    id: '2',
    name: 'Oak Dining Chairs (Set of 6)',
    brand: 'Heritage Furniture',
    model: 'Classic Oak',
    year: 1995,
    description: 'Set of 6 matching oak dining chairs with upholstered seats',
    category: 'Furniture',
    condition: 'Good',
    estimatedValue: 300,
    images: ['/images/oak-chairs-1.jpg'],
    dimensions: {
      length: 18,
      width: 20,
      height: 36,
      weight: 12
    },
    caseId: '1',
    lotId: '1',
    auctionId: '1',
    storageLocationId: '2',
    status: 'Cataloged',
    loggedBy: '3',
    loggedAt: new Date('2024-01-16T09:45:00'),
    updatedAt: new Date('2024-01-16T14:25:00'),
    notes: 'One chair needs seat reupholstering'
  },
  {
    id: '3',
    barcode: '987654321098',
    name: 'Dell Laptop',
    brand: 'Dell',
    model: 'Inspiron 15 3000',
    year: 2022,
    description: 'Dell Inspiron laptop with Intel i5 processor, 8GB RAM, 256GB SSD',
    category: 'Electronics',
    condition: 'Like New',
    estimatedValue: 400,
    images: ['/images/dell-laptop-1.jpg'],
    dimensions: {
      length: 14.96,
      width: 9.99,
      height: 0.78,
      weight: 3.78
    },
    caseId: '2',
    lotId: '2',
    auctionId: '1',
    storageLocationId: '3',
    status: 'Photographed',
    loggedBy: '2',
    loggedAt: new Date('2024-01-18T11:15:00'),
    updatedAt: new Date('2024-01-18T16:30:00'),
    notes: 'Includes original charger and documentation'
  },
  {
    id: '4',
    barcode: '456789123456',
    name: 'iPad Air',
    brand: 'Apple',
    model: 'iPad Air (4th generation)',
    year: 2021,
    description: 'Apple iPad Air with 64GB storage, Wi-Fi model in Space Gray',
    category: 'Electronics',
    condition: 'Good',
    estimatedValue: 200,
    images: ['/images/ipad-air-1.jpg'],
    dimensions: {
      length: 9.74,
      width: 7.02,
      height: 0.24,
      weight: 1.0
    },
    caseId: '2',
    lotId: '2',
    auctionId: '1',
    storageLocationId: '3',
    status: 'Listed',
    loggedBy: '2',
    loggedAt: new Date('2024-01-18T11:30:00'),
    updatedAt: new Date('2024-01-19T09:15:00'),
    notes: 'Screen protector applied, minor wear on corners'
  }
];

// Mock Inventory Stats
export const mockInventoryStats: InventoryStats = {
  totalItems: 73,
  itemsByStatus: {
    'Received': 15,
    'Cataloged': 28,
    'Photographed': 18,
    'Listed': 8,
    'Sold': 3,
    'Returned': 1
  },
  itemsByCategory: {
    'Furniture': 25,
    'Electronics': 20,
    'Collectibles': 12,
    'Jewelry': 8,
    'Art': 5,
    'Tools': 3
  },
  storageUtilization: 68.5,
  recentActivity: {
    itemsAdded: 12,
    itemsSold: 8,
    itemsPhotographed: 15
  }
};

// Helper functions for mock data
export const getMockItemById = (id: string): Item | undefined => {
  return mockItems.find(item => item.id === id);
};

export const getMockItemsByCase = (caseId: string): Item[] => {
  return mockItems.filter(item => item.caseId === caseId);
};

export const getMockItemsByLot = (lotId: string): Item[] => {
  return mockItems.filter(item => item.lotId === lotId);
};

export const getMockItemsByStorageLocation = (locationId: string): Item[] => {
  return mockItems.filter(item => item.storageLocationId === locationId);
};

