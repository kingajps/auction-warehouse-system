import React, { useState, useEffect } from 'react';
import { Package, MapPin, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryItem {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@itm01': string; // Barcode
    '/attributes/@itm02': string; // Item Name
    '/attributes/@itm08': number; // Quantity
    '/attributes/@itm15': string; // Status
    '/attributes/@itm17': number; // Estimated Value
  };
}

interface StorageLocation {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@loc01': string; // Location ID
    '/attributes/@loc05': number; // Max Capacity
    '/attributes/@loc06': number; // Current Occupancy
    '/attributes/@loc09': string; // Status
  };
}

const Dashboard: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [storageData, setStorageData] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory data
        const inventoryResponse = await fetch('/api/taskade/projects/CBBEXc3ihA2EasxL/nodes');
        const inventoryResult = await inventoryResponse.json();
        
        // Fetch storage data
        const storageResponse = await fetch('/api/taskade/projects/e8FqqAWjzzdcZBYY/nodes');
        const storageResult = await storageResponse.json();

        if (inventoryResult.ok) {
          setInventoryData(inventoryResult.payload.nodes);
        }
        
        if (storageResult.ok) {
          setStorageData(storageResult.payload.nodes);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalItems = inventoryData.reduce((sum, item) => sum + (item.fieldValues['/attributes/@itm08'] || 0), 0);
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.fieldValues['/attributes/@itm17'] || 0), 0);
  const pendingItems = inventoryData.filter(item => item.fieldValues['/attributes/@itm15'] === 'pending').length;
  const availableLocations = storageData.filter(location => location.fieldValues['/attributes/@loc09'] === 'available').length;

  const stats = [
    {
      name: 'Total Items',
      value: totalItems.toLocaleString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Value',
      value: `£${totalValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Pending Items',
      value: pendingItems.toString(),
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'negative'
    },
    {
      name: 'Available Locations',
      value: availableLocations.toString(),
      icon: MapPin,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const recentItems = inventoryData.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your warehouse operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Items</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-md p-2">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {item.fieldValues['/attributes/@itm02'] || item.fieldValues['/text']}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.fieldValues['/attributes/@itm08'] || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.fieldValues['/attributes/@itm15'] === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.fieldValues['/attributes/@itm15'] === 'lotted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.fieldValues['/attributes/@itm15'] || 'pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Storage Utilization */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Storage Utilization</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {storageData.slice(0, 5).map((location) => {
                const maxCapacity = location.fieldValues['/attributes/@loc05'] || 0;
                const currentOccupancy = location.fieldValues['/attributes/@loc06'] || 0;
                const utilizationPercent = maxCapacity > 0 ? (currentOccupancy / maxCapacity) * 100 : 0;
                
                return (
                  <div key={location.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">
                        {location.fieldValues['/attributes/@loc01'] || location.fieldValues['/text']}
                      </span>
                            <span className="text-gray-500">
                        {currentOccupancy}/{maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          utilizationPercent > 80 ? 'bg-red-500' : 
                          utilizationPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${utilizationPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Package className="h-5 w-5 mr-2" />
            Add New Item
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText className="h-5 w-5 mr-2" />
            Create New Case
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <MapPin className="h-5 w-5 mr-2" />
            Update Storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
