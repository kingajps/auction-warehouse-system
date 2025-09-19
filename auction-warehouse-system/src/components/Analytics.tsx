import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Calendar, PieChart } from 'lucide-react';

interface InventoryItem {
  id: string;
  fieldValues: {
    '/attributes/@itm07': string; // Category
    '/attributes/@itm08': number; // Quantity
    '/attributes/@itm15': string; // Status
    '/attributes/@itm17': number; // Estimated Value
    '/attributes/@itm13': string; // Date Logged
  };
}

interface StorageLocation {
  id: string;
  fieldValues: {
    '/attributes/@loc05': number; // Max Capacity
    '/attributes/@loc06': number; // Current Occupancy
    '/attributes/@loc08': string; // Storage Type
    '/attributes/@loc09': string; // Status
  };
}

const Analytics: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [storageData, setStorageData] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryResponse, storageResponse] = await Promise.all([
        fetch('/api/taskade/projects/CBBEXc3ihA2EasxL/nodes'),
        fetch('/api/taskade/projects/e8FqqAWjzzdcZBYY/nodes')
      ]);

      const inventoryResult = await inventoryResponse.json();
      const storageResult = await storageResponse.json();

      if (inventoryResult.ok) {
        setInventoryData(inventoryResult.payload.nodes);
      }
      
      if (storageResult.ok) {
        setStorageData(storageResult.payload.nodes);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics
  const totalItems = inventoryData.reduce((sum, item) => sum + (item.fieldValues['/attributes/@itm08'] || 0), 0);
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.fieldValues['/attributes/@itm17'] || 0), 0);
  const averageValue = totalItems > 0 ? totalValue / totalItems : 0;

  // Status distribution
  const statusCounts = inventoryData.reduce((acc, item) => {
    const status = item.fieldValues['/attributes/@itm15'] || 'pending';
    acc[status] = (acc[status] || 0) + (item.fieldValues['/attributes/@itm08'] || 0);
    return acc;
  }, {} as RecordRecord<string, number>);

  // Category distribution
  const categoryCounts = inventoryData.reduce((acc, item) => {
    const category = item.fieldValues['/attributes/@itm07'] || 'Uncategorized';
    acc[category] = (acc[category] || 0) + (item.fieldValues['/attributes/@itm08'] || 0);
    return acc;
  }, {} as RecordRecord<string, number>);

  // Storage utilization
  const totalCapacity = storageData.reduce((sum, loc) => sum + (loc.fieldValues['/attributes/@loc05'] || 0), 0);
  const totalOccupied = storageData.reduce((sum, loc) => sum + (loc.fieldValues['/attributes/@loc06'] || 0), 0);
  const utilizationPercent = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

  // Storage type distribution
  const storageTypeCounts = storageData.reduce((acc, loc) => {
    const type = loc.fieldValues['/attributes/@loc08'] || 'Unknown';
    acc[type] = (acc[type] || 0) + (loc.fieldValues['/attributes/@loc05'] || 0);
    return acc;
  }, {} as RecordRecord<string, number>);

  // Recent activity (items added in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentItems = inventoryData.filter(item => {
    const dateLogged = item.fieldValues['/attributes/@itm13'];
    if (!dateLogged) return false;
    return new Date(dateLogged) >= thirtyDaysAgo;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'lotted': return 'bg-blue-500';
      case 'auctioned': return 'bg-purple-500';
      case 'sold': return 'bg-green-500';
      case 'returned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'];
    return colors[index % colors.length];
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Insights into your warehouse operations</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-md p-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{totalItems.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">
              +{recentItems.length}
            </span>
            <span className="text-sm text-gray-500 ml-1">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">£{totalValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">
              £{averageValue.toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 ml-1">avg per item</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-md p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Storage Utilization</p>
              <p className="text-2xl font-semibold text-gray-900">{utilizationPercent.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {totalOccupied}/{totalCapacity} capacity
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Items</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.pending || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {((statusCounts.pending || 0) / totalItems * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Item Status Distribution</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / totalItems) * 100;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 capitalize">{status}</span>
                    <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Category Distribution</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(categoryCounts).slice(0, 6).map(([category, count], index) => {
              const percentage = (count / totalItems) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{category}</span>
                    <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(index)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Storage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Type Capacity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Storage Type Capacity</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(storageTypeCounts).map(([type, capacity], index) => {
              const percentage = (capacity / totalCapacity) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 capitalize">{type}</span>
                    <span className="text-gray-500">{capacity} capacity ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(index)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-2">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Items Added</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-green-600">{recentItems.length}</span>
            </div>
            
            
            
            
            
            
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Avg Daily Additions</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                {(recentItems.length / 30).toFixed(1)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-full p-2">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Recent Value Added</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-purple-600">
                £{recentItems.reduce((sum, item) => sum + (item.fieldValues['/attributes/@itm17'] || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Inventory Growth</h4>
            <p className="text-2xl font-semibold text-green-600">+{recentItems.length}</p>
            <p className="text-xs text-gray-500">items this month</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Storage Efficiency</h4>
            <p className="text-2xl font-semibold text-blue-600">{utilizationPercent.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">space utilized</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900">Average Item Value</h4>
            <p className="text-2xl font-semibold text-purple-600">£{averageValue.toFixed(0)}</p>
            <p className="text-xs text-gray-500">per item</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
