import React, { useState, useRef } from 'react';
import { Scan, Camera, Upload, Search, Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface ProductData {
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  description?: string;
  category?: string;
  estimatedValue?: number;
}

const BarcodeScanner: React.FC = () => {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    brand: '',
    model: '',
    year: '',
    description: '',
    category: '',
    quantity: '1',
    caseId: '',
    lotNumber: '',
    auctionId: '',
    storageLocation: '',
    estimatedValue: '',
    photoUrls: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate barcode scanning (in real implementation, you'd use a camera library)
  const handleBarcodeInput = (barcode: string) => {
    setScannedBarcode(barcode);
    setError('');
    fetchProductData(barcode);
  };

  // Simulate fetching product data from online databases
  const fetchProductData = async (barcode: string) => {
    setLoading(true);
    setProductData(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock product data based on barcode patterns
      let mockData: ProductData = {};
      
      if (barcode.startsWith('123')) {
        mockData = {
          name: 'Vintage Electric Guitar',
          brand: 'Fender',
          model: 'Stratocaster',
          year: 1985,
          description: 'Classic electric guitar in excellent condition',
          category: 'Musical Instruments',
          estimatedValue: 1500
        };
      } else if (barcode.startsWith('456')) {
        mockData = {
          name: 'Antique Pocket Watch',
          brand: 'Hamilton',
          model: 'Railway Special',
          year: 1920,
          description: 'Gold-filled railroad pocket watch',
          category: 'Timepieces',
          estimatedValue: 800
        };
      } else if (barcode.startsWith('789')) {
        mockData = {
          name: 'Vintage Camera',
          brand: 'Canon',
          model: 'AE-1',
          year: 1976,
          description: '35mm SLR camera with original lens',
          category: 'Photography Equipment',
          estimatedValue: 300
        };
      } else {
        // No data found
        setError('No product data found for this barcode. Please enter details manually.');
        setLoading(false);
        return;
      }
      
      setProductData(mockData);
      
      // Auto-fill form with fetched data
      setFormData(prev => ({
        ...prev,
        itemName: mockData.name || '',
        brand: mockData.brand || '',
        model: mockData.model || '',
        year: mockData.year?.toString() || '',
        description: mockData.description || '',
        category: mockData.category || '',
        estimatedValue: mockData.estimatedValue?.toString() || ''
      }));
      
    } catch (err) {
      setError('Failed to fetch product data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        '/text': formData.itemName,
        '/attributes/@itm01': scannedBarcode,
        '/attributes/@itm02': formData.itemName,
        '/attributes/@itm03': formData.brand,
        '/attributes/@itm04': formData.model,
        '/attributes/@itm05': formData.year ? parseInt(formData.year) : undefined,
        '/attributes/@itm06': formData.description,
        '/attributes/@itm07': formData.category,
        '/attributes/@itm08': parseInt(formData.quantity),
        '/attributes/@itm09': formData.caseId,
        '/attributes/@itm10': formData.lotNumber,
        '/attributes/@itm11': formData.auctionId,
        '/attributes/@itm12': formData.storageLocation,
        '/attributes/@itm13': new Date().toISOString(),
        '/attributes/@itm14': 'Warehouse Manager',
        '/attributes/@itm15': 'pending',
        '/attributes/@itm16': formData.photoUrls,
        '/attributes/@itm17': formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined
      };

      const response = await fetch('/api/taskade/projects/CBBEXc3ihA2EasxL/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess('Item successfully added to inventory!');
        // Reset form
        setScannedBarcode('');
        setProductData(null);
        setFormData({
          itemName: '',
          brand: '',
          model: '',
          year: '',
          description: '',
          category: '',
          quantity: '1',
          caseId: '',
          lotNumber: '',
          auctionId: '',
          storageLocation: '',
          estimatedValue: '',
          photoUrls: ''
        });
      } else {
        throw new Error('Failed to add item');
      }
    } catch (err) {
      setError('Failed to add item to inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real implementation, you'd upload these files and get URLs
      const fileNames = Array.from(files).map(file => file.name).join(',');
      setFormData(prev => ({ ...prev, photoUrls: fileNames }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Barcode Scanner</h2>
        <p className="text-gray-600">Scan items to automatically retrieve product information</p>
      </div>

      {/* Scanner Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Scan Barcode</h3>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </button>
          </div>
        </div>

        {/* Manual Barcode Input */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter barcode manually or scan..."
              value={scannedBarcode}
              onChange={(e) => setScannedBarcode(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => handleBarcodeInput(scannedBarcode)}
            disabled={!scannedBarcode || loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Demo Barcodes */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Try these demo barcodes:</p>
          <div className="flex flex-wrap gap-2">
            {['123456789012', '456789012345', '789012345678'].map((barcode) => (
              <button
                key={barcode}
                onClick={() => handleBarcodeInput(barcode)}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {barcode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Fetching product information...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Data Display */}
      {productData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-4">Product Information Found</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-green-800">Name:</p>
              <p className="text-sm text-green-700">{productData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Brand:</p>
              <p className="text-sm text-green-700">{productData.brand}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Model:</p>
              <p className="text-sm text-green-700">{productData.model}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Year:</p>
              <p className="text-sm text-green-700">{productData.year}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-green-800">Description:</p>
              <p className="text-sm text-green-700">{productData.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Item Details</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name *</label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category...</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Timepieces">Timepieces</option>
                <option value="Photography Equipment">Photography Equipment</option>
                <option value="Antiques">Antiques</option>
                <option value="Collectibles">Collectibles</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Art">Art</option>
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Case ID</label>
              <input
                type="text"
                value={formData.caseId}
                onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lot Number</label>
              <input
                type="text"
                value={formData.lotNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Auction ID</label>
              <input
                type="text"
                value={formData.auctionId}
                onChange={(e) => setFormData(prev => ({ ...prev, auctionId: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Storage Location</label>
              <input
                type="text"
                value={formData.storageLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, storageLocation: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Value (£)</label>
              <input
                type="number"
                step="0.01"
                value={formData.estimatedValue}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: e.target.value }))}
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photos</label>
            <div className="mt-1 flex items-center space-x-4">
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </button>
              {formData.photoUrls && (
                <span className="text-sm text-gray-500">{formData.photoUrls}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setScannedBarcode('');
                setProductData(null);
                setFormData({
                  itemName: '',
                  brand: '',
                  model: '',
                  year: '',
                  description: '',
                  category: '',
                  quantity: '1',
                  caseId: '',
                  lotNumber: '',
                  auctionId: '',
                  storageLocation: '',
                  estimatedValue: '',
                  photoUrls: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loading ? 'Adding...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarcodeScanner;
