import React, { useState } from 'react';
import { Package, MapPin, FileText, BarChart3, Settings, Scan } from 'lucide-react';
import Dashboard from './components/Dashboard';
import InventoryManager from './components/InventoryManager';
import StorageMap from './components/StorageMap';
import CaseManager from './components/CaseManager';
import BarcodeScanner from './components/BarcodeScanner';
import Analytics from './components/Analytics';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'scanner', name: 'Barcode Scanner', icon: Scan },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'storage', name: 'Storage Map', icon: MapPin },
    { id: 'cases', name: 'Cases & Lots', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'scanner':
        return <BarcodeScanner />;
      case 'inventory':
        return <InventoryManager />;
      case 'storage':
        return <StorageMap />;
      case 'cases':
        return <CaseManager />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Auction House Warehouse
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome back, Warehouse Manager
              </span>
              <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
