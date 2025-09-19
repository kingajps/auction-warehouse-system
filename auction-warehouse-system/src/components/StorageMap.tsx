import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search, Grid, List } from 'lucide-react';

interface StorageLocation {
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

const StorageMap: React.FC = () => {
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useStateuseStateuseState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    locationId: '',
    zone: '',
    aisle: '',
    shelf: '',
    maxCapacity: '',
    storageType: 'shelf',
    notes: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, searchTerm, statusFilter, typeFilter]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/taskade/projects/e8FqqAWjzzdcZBYY/nodes');
      const result = await response.json();
      
      if (result.ok) {
        setLocations(result.payload.nodes);
      }
    } catch (error) {
      console.error('Error fetching storage locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLocations = () => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.fieldValues['/attributes/@loc01']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.fieldValues['/attributes/@loc02']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.fieldValues['/text']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(location => location.fieldValues['/attributes/@loc09'] === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(location => location.fieldValues['/attributes/@loc08'] === typeFilter);
    }

    setFilteredLocations(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shelf':
        return '📚';
      case 'floor':
        return '🏢';
      case 'rack':
        return '🗄️';
      case 'cage':
        return '🔒';
      default:
        return '📦';
    }
  };

  const getUtilizationColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        '/text': `${formData.zone}-${formData.aisle}-${formData.shelf}`,
        '/attributes/@loc01': formData.locationId,
        '/attributes/@loc02': formData.zone,
        '/attributes/@loc03': formData.aisle,
        '/attributes/@loc04': formData.shelf,
        '/attributes/@loc05': parseInt(formData.maxCapacity),
        '/attributes/@loc06': 0,
        '/attributes/@loc07': parseInt(formData.maxCapacity),
        '/attributes/@loc08': formData.storageType,
        '/attributes/@loc09': 'available',
        '/attributes/@loc10': formData.notes
      };

      const response = await fetch('/api/taskade/projects/e8FqqAWjzzdcZBYY/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({
          locationId: '',
          zone: '',
          aisle: '',
          shelf: '',
          maxCapacity: '',
          storageType: 'shelf',
          notes: ''
        });
        fetchLocations();
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const updateLocationOccupancy = async (locationId: string, newOccupancy: number) => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;

    const maxCapacity = location.fieldValues['/attributes/@loc05'] || 0;
    const availableSpace = maxCapacity - newOccupancy;
    const newStatus = newOccupancy >= maxCapacity ? 'full' : 'available';

    try {
      const response = await fetch(`/api/taskade/projects/e8FqqAWjzzdcZBYY/nodes/${locationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '/attributes/@loc06': newOccupancy,
          '/attributes/@loc07': availableSpace,
          '/attributes/@loc09': newStatus,
        }),
      });

      if (response.ok) {
        fetchLocations();
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Storage Map</h2>
          <p className="text-gray-600">Manage warehouse storage locations and capacity</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </button>
        </div>
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
                placeholder="Search locations..."
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
              <option value="available">Available</option>
              <option value="full">Full</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="shelf">Shelf</option>
              <option value="floor">Floor</option>
              <option value="rack">Rack</option>
              <option value="cage">Cage</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredLocations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredLocations.filter(loc => loc.fieldValues['/attributes/@loc09'] === 'available').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Full</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredLocations.filter(loc => loc.fieldValues['/attributes/@loc09'] === 'full').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredLocations.reduce((sum, loc) => sum + (loc.fieldValues['/attributes/@loc05'] || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Locations Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLocations.map((location) => {
            const maxCapacity = location.fieldValues['/attributes/@loc05'] || 0;
            const currentOccupancy = location.fieldValues['/attributes/@loc06'] || 0;
            const utilizationPercent = maxCapacity > 0 ? (currentOccupancy / maxCapacity) * 100 : 0;
            
            return (
              <div key={location.id} className="bg-white rounded-lg shadow-md border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">
                        {getTypeIcon(location.fieldValues['/attributes/@loc08'])}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {location.fieldValues['/attributes/@loc01']}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Zone {location.fieldValues['/attributes/@loc02']}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(location.fieldValues['/attributes/@loc09'])}`}>
                      {location.fieldValues['/attributes/@loc09']}
                    </span>
                  </div>
                  
                    
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Capacity</span>
                        <span className="font-medium">{currentOccupancy}/{maxCapacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getUtilizationColor(utilizationPercent)}`}
                          style={{ width: `${utilizationPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {utilizationPercent.toFixed(1)}% utilized
                      </p>
                    </div>
                    
                                <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{location.fieldValues['/attributes/@loc08']}</span>
                    </div>
                    
                    
                    
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-green-600">
                        {location.fieldValues['/attributes/@loc07']} spaces
                      </span>
                    </div>
                    
                    {location.fieldValues['/attributes/@loc10'] && (
                      <div>
                        <p className="text-xs text-gray-500 mt-2">
                          {location.fieldValues['/attributes/@loc10']}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  
                  
                  
                  <div className="mt-4 flex justify-between">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => updateLocationOccupancy(location.id, Math.max(0, currentOccupancy - 1))}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        disabled={currentOccupancy <= 0}
                      >
                        -1
                      </button>
                                  <button
                        onClick={() => updateLocationOccupancy(location.id, Math.min(maxCapacity, currentOccupancy + 1))}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        disabled={currentOccupancy >= maxCapacity}
                      >
                        +1
                      </button>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => {
                const maxCapacity = location.fieldValues['/attributes/@loc05'] || 0;
                const currentOccupancy = location.fieldValues['/attributes/@loc06'] || 0;
                const utilizationPercent = maxCapacity > 0 ? (currentOccupancy / maxCapacity) * 100 : 0;
                
                return (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">
                          {getTypeIcon(location.fieldValues['/attributes/@loc08'])}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {location.fieldValues['/attributes/@loc01']}
                          </div>
                          <div className="text-sm text-gray-500">
                            Zone {location.fieldValues['/attributes/@loc02']} - Aisle {location.fieldValues['/attributes/@loc03']}
                          </div>
                        </div>
                      </div>
                    </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {location.fieldValues['/attributes/@loc08']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentOccupancy}/{maxCapacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getUtilizationColor(utilizationPercent)}`}
                            style={{ width: `${utilizationPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{utilizationPercent.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(location.fieldValues['/attributes/@loc09'])}`}>
                        {location.fieldValues['/attributes/@loc09']}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => updateLocationOccupancy(location.id, Math.max(0, currentOccupancy - 1))}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                          disabled={currentOccupancy <= 0}
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateLocationOccupancy(location.id, Math.min(maxCapacity, currentOccupancy + 1))}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          disabled={currentOccupancy >= maxCapacity}
                        >
                          +1
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Location Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Storage Location</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddLocation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.locationId}
                      onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zone *</label>
                    <input
                      type="text"
                      required
                      value={formData.zone}
                      onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aisle</label>
                    <input
                      type="text"
                      value={formData.aisle}
                      onChange={(e) => setFormData(prev => ({ ...prev, aisle: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Shelf</label>
                    <input
                      type="text"
                      value={formData.shelf}
                      onChange={(e) => setFormData(prev => ({ ...prev, shelf: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Capacity *</label>
                                            <input
                      type="number"
                      required
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Storage Type *</label>
                    <select
                      required
                      value={formData.storageType}
                      onChange={(e) => setFormData(prev => ({ ...prev, storageType: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                            <option value="shelf">Shelf</option>
                            <option value="floor">Floor</option>
                      <option value="rack">Rack</option>
                            <option value="cage">Cage</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageMap;
