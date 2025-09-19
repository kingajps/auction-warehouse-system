import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Package, DollarSign, Users } from 'lucide-react';

interface AuctionCase {
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

const CaseManager: React.FC = () => {
  const [cases, setCases] = useState<AuctionCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    caseId: '',
    caseName: '',
    auctionId: '',
    auctionDate: '',
    description: '',
    createdBy: 'Warehouse Manager'
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/taskade/projects/qTzXU7gP4fzZznPV/nodes');
      const result = await response.json();
      
      if (result.ok) {
        setCases(result.payload.nodes);
      }
    } catch (error) {
      console.error('Error fetching auction cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        '/text': formData.caseName,
        '/attributes/@cas01': formData.caseId,
        '/attributes/@cas02': formData.caseName,
        '/attributes/@cas03': formData.auctionId,
        '/attributes/@cas04': formData.auctionDate,
        '/attributes/@cas05': 0,
        '/attributes/@cas06': 0,
        '/attributes/@cas07': 'active',
        '/attributes/@cas08': formData.description,
        '/attributes/@cas09': formData.createdBy
      };

      const response = await fetch('/api/taskade/projects/qTzXU7gP4fzZznPV/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({
          caseId: '',
          caseName: '',
          auctionId: '',
          auctionDate: '',
          description: '',
          createdBy: 'Warehouse Manager'
        });
        fetchCases();
      }
    } catch (error) {
      console.error('Error adding case:', error);
    }
  };

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/taskade/projects/qTzXU7gP4fzZznPV/nodes/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '/attributes/@cas07': newStatus,
        }),
      });

      if (response.ok) {
        fetchCases();
      }
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
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
          <h2 className="text-2xl font-bold text-gray-900">Cases & Lots Management</h2>
          <p className="text-gray-600">Organize items into auction cases and lots</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Case
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-semibold text-gray-900">{cases.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-semibold text-gray-900">
                {cases.filter(c => c.fieldValues['/attributes/@cas07'] === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Lots</p>
              <p className="text-2xl font-semibold text-gray-900">
                {cases.reduce((sum, c) => sum + (c.fieldValues['/attributes/@cas05'] || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {cases.reduce((sum, c) => sum + (c.fieldValues['/attributes/@cas06'] || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((auctionCase) => (
          <div key={auctionCase.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {auctionCase.fieldValues['/attributes/@cas02'] || auctionCase.fieldValues['/text']}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {auctionCase.fieldValues['/attributes/@cas01']}
                    </p>
                  </div>
                </div>
                <select
                  value={auctionCase.fieldValues['/attributes/@cas07'] || 'active'}
                  onChange={(e) => updateCaseStatus(auctionCase.id, e.target.value)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${getStatusColor(auctionCase.fieldValues['/attributes/@cas07'])}`}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Auction Date: {formatDate(auctionCase.fieldValues['/attributes/@cas04'])}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-2" />
                  <span>
                    {auctionCase.fieldValues['/attributes/@cas05'] || 0} lots, {auctionCase.fieldValues['/attributes/@cas06'] || 0} items
                  </span>
                </div>
                
                
                
                
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Created by: {auctionCase.fieldValues['/attributes/@cas09']}</span>
                </div>

                {auctionCase.fieldValues['/attributes/@cas08'] && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">
                      {auctionCase.fieldValues['/attributes/@cas08']}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Edit Case
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Case Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Auction Case</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddCase} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Case ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.caseId}
                      onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                      placeholder="e.g., CASE-001"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Case Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.caseName}
                      onChange={(e) => setFormData(prev => ({ ...prev, caseName: e.target.value }))}
                      placeholder="e.g., Estate Sale Collection"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Auction ID *</label>
                                        <input
                      type="text"
                      required
                      value={formData.auctionId}
                      onChange={(e) => setFormData(prev => ({ ...prev, auctionId: e.target.value }))}
                      placeholder="e.g., AUC-2024-001"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Auction Date</label>
                    <input
                      type="date"
                      value={formData.auctionDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, auctionDate: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Created By</label>
                    <input
                      type="text"
                      value={formData.createdBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, createdBy: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the auction case..."
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
                    Create Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText className="h-5 w-5 mr-2" />
            Generate Lot Report
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Package className="h-5 w-5 mr-2" />
            Bulk Assign Items
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <DollarSign className="h-5 w-5 mr-2" />
            Export for GAP Office
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseManager;
