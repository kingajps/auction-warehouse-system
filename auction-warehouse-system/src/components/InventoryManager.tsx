import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Package, Plus } from 'lucide-react';

interface InventoryItem {
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

const InventoryManager: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, statusFilter, categoryFilter]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/taskade/projects/CBBEXc3ihA2EasxL/nodes');
      const result = await response.json();
      
      if (result.ok) {
        setItems(result.payload.nodes);
      }
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.fieldValues['/attributes/@itm02']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fieldValues['/attributes/@itm03']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fieldValues['/attributes/@itm01']?.includes(searchTerm) ||
        item.fieldValues['/text']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.fieldValues['/attributes/@itm15'] === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.fieldValues['/attributes/@itm07'] === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'lotted':
        return 'bg-blue-100 text-blue-800';
      case 'auctioned':
        return 'bg-purple-100 text-purple-800';
      case 'sold':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleUpdateStatus = async (itemId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/taskade/projects/CBBEXc3ihA2EasxL/nodes/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '/attributes/@itm15': newStatus,
        }),
      });

      if (response.ok) {
        // Refresh the items list
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const categories = [...new Set(items.map(item => item.fieldValues['/attributes/@itm07']).filter(Boolean))];

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
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your warehouse inventory items</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="lotted">Lotted</option>
              <option value="auctioned">Auctioned</option>
              <option value="sold">Sold</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredItems.filter(item => item.fieldValues['/attributes/@itm15'] === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Lotted</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredItems.filter(item => item.fieldValues['/attributes/@itm15'] === 'lotted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Sold</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredItems.filter(item => item.fieldValues['/attributes/@itm15'] === 'sold').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.fieldValues['/attributes/@itm02'] || item.fieldValues['/text']}
                      </div>
                                  <div className="text-sm text-gray-500">
                        {item.fieldValues['/attributes/@itm03']} {item.fieldValues['/attributes/@itm04']}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.fieldValues['/attributes/@itm01']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.fieldValues['/attributes/@itm07']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.fieldValues['/attributes/@itm08']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.fieldValues['/attributes/@itm15'] || 'pending'}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${getStatusColor(item.fieldValues['/attributes/@itm15'])}`}
                    >
                            <option value="pending">Pending</option>
                      <option value="lotted">Lotted</option>
                      <option value="auctioned">Auctioned</option>
                            <option value="sold">Sold</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{item.fieldValues['/attributes/@itm17']?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.fieldValues['/attributes/@itm12']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Details Modal */}
      {showDetails && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Item Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm02']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Barcode</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm01']}</p>
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm03']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm04']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm05']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm07']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm08']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Value</label>
                  <p className="mt-1 text-sm text-gray-900">£{selectedItem.fieldValues['/attributes/@itm17']?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Case ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm09']}</p>
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700">Lot Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm10']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Storage Location</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm12']}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.fieldValues['/attributes/@itm15'])}`}>
                    {selectedItem.fieldValues['/attributes/@itm15']}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.fieldValues['/attributes/@itm06']}</p>
                </div>
              </div>
              
              
              
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
