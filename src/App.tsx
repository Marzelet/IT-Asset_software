import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Package, 
  HardDrive, 
  Wrench, 
  FileText, 
  Upload, 
  Settings,
  Bell,
  ShoppingCart,
  Package2,
  BarChart3,
  DollarSign,
  Shield,
  Zap,
  Link
} from 'lucide-react';
import { 
  Asset, 
  License, 
  User, 
  Accessory, 
  Consumable, 
  Component, 
  PredefinedKit, 
  RequestableItem, 
  Alert, 
  Report, 
  ImportRecord, 
  DashboardMetrics,
  UserProfile
} from './types';

import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/EnhancedDashboard';
import AssetsList from './components/Assets/AssetsList';
import PeopleList from './components/People/PeopleList';
import LicensesList from './components/Licenses/LicensesList';
import AccessoriesList from './components/Accessories/AccessoriesList';
import ConsumablesList from './components/Consumables/ConsumablesList';
import ComponentsList from './components/Components/ComponentsList';
import ReportsManager from './components/Reports/ReportsManager';
import ImportManager from './components/Import/ImportManager';
import SettingsManager from './components/Settings/SettingsManager';
import AlertsManager from './components/Alerts/AlertsManager';
import RequestableItemsList from './components/RequestableItems/RequestableItemsList';
import PredefinedKitsList from './components/PredefinedKits/PredefinedKitsList';
import AnalyticsManager from './components/Analytics/AnalyticsManager';
import FinancialManager from './components/Financial/FinancialManager';
import ComplianceManager from './components/Compliance/ComplianceManager';
import MaintenanceManager from './components/Maintenance/MaintenanceManager';
import IntegrationsManager from './components/Integrations/IntegrationsManager';

// Import all form components
import AssetForm from './components/Assets/AssetForm';
import LicenseForm from './components/Licenses/LicenseForm';
import UserForm from './components/People/UserForm';
import AccessoryForm from './components/Accessories/AccessoryForm';
import ConsumableForm from './components/Consumables/ConsumableForm';
import ComponentForm from './components/Components/ComponentForm';
import PredefinedKitForm from './components/PredefinedKits/PredefinedKitForm';
import RequestableItemForm from './components/RequestableItems/RequestableItemForm';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'assets', label: 'Assets', icon: Building2 },
  { id: 'licenses', label: 'Licenses', icon: FileText },
  { id: 'accessories', label: 'Accessories', icon: Package },
  { id: 'consumables', label: 'Consumables', icon: Package2 },
  { id: 'components', label: 'Components', icon: HardDrive },
  { id: 'people', label: 'People', icon: Users },
  { id: 'requestable-items', label: 'Requestable Items', icon: ShoppingCart },
  { id: 'predefined-kits', label: 'Predefined Kits', icon: Package2 },
  { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
  { id: 'maintenance', label: 'Maintenance & Repairs', icon: Wrench },
  { id: 'compliance', label: 'Compliance & Audits', icon: Shield },
  { id: 'financial', label: 'Financial Management', icon: DollarSign },
  { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Link },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize all data states
  const [assets, setAssets] = useState<Asset[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [predefinedKits, setPredefinedKits] = useState<PredefinedKit[]>([]);
  const [requestableItems, setRequestableItems] = useState<RequestableItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [imports, setImports] = useState<ImportRecord[]>([]);

  // Initialize user profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    username: 'johndoe',
    department: 'IT',
    jobTitle: 'System Administrator',
    phone: '+1 (555) 123-4567',
    location: 'New York Office',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    permissions: ['admin'],
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: true
    }
  });

  // Form states
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);
  const [showConsumableForm, setShowConsumableForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showKitForm, setShowKitForm] = useState(false);
  const [showRequestableForm, setShowRequestableForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Initialize dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    assets: assets.length,
    licenses: licenses.length,
    accessories: accessories.length,
    consumables: consumables.length,
    components: components.length,
    people: users.length,
    predefinedKits: predefinedKits.length,
    requestableItems: requestableItems.length,
    alerts: alerts.length,
    expiringWarranties: 0,
    expiringLicenses: 0,
    maintenanceDue: 0,
    complianceIssues: 0,
    totalValue: 0
  });

  // Create new item handlers
  const handleCreateNew = (type?: string) => {
    setEditingItem(null);
    switch (type) {
      case 'asset':
        setShowAssetForm(true);
        break;
      case 'license':
        setShowLicenseForm(true);
        break;
      case 'user':
        setShowUserForm(true);
        break;
      case 'accessory':
        setShowAccessoryForm(true);
        break;
      case 'consumable':
        setShowConsumableForm(true);
        break;
      case 'component':
        setShowComponentForm(true);
        break;
      case 'kit':
        setShowKitForm(true);
        break;
      case 'requestable':
        setShowRequestableForm(true);
        break;
      default:
        console.log('Create new item:', type);
    }
  };

  // Edit item handlers
  const handleEdit = (item: any) => {
    setEditingItem(item);
    // Determine which form to show based on item properties
    if (item.tag && item.category) {
      setShowAssetForm(true);
    } else if (item.productKey || item.seats) {
      setShowLicenseForm(true);
    } else if (item.username || item.email) {
      setShowUserForm(true);
    } else if (item.availableQuantity !== undefined) {
      setShowAccessoryForm(true);
    } else if (item.minQuantity !== undefined) {
      setShowConsumableForm(true);
    } else if (item.serialNumber !== undefined && item.quantity !== undefined) {
      setShowComponentForm(true);
    } else if (item.assets && Array.isArray(item.assets)) {
      setShowKitForm(true);
    } else if (item.requestable !== undefined) {
      setShowRequestableForm(true);
    }
  };

  // Delete handlers with confirmation
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setAssets(prev => prev.filter(item => item.id !== id));
      setLicenses(prev => prev.filter(item => item.id !== id));
      setUsers(prev => prev.filter(item => item.id !== id));
      setAccessories(prev => prev.filter(item => item.id !== id));
      setConsumables(prev => prev.filter(item => item.id !== id));
      setComponents(prev => prev.filter(item => item.id !== id));
      setPredefinedKits(prev => prev.filter(item => item.id !== id));
      setRequestableItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleView = (item: any) => {
    console.log('View item:', item);
    // Could open a detailed view modal here
  };

  // Save handlers for each type
  const handleSaveAsset = async (assetData: Omit<Asset, 'id'>) => {
    try {
      const response = await apiService.createAsset(assetData);
      if (response.data) {
        setAssets(prev => [...prev, response.data]);
      } else {
        // Fallback to local state
        const newAsset: Asset = {
          ...assetData,
          id: Date.now().toString(),
          custodianHistory: [],
          lifecycle: {
            procurementDate: assetData.purchaseDate || new Date().toISOString(),
            stage: 'Active',
            deploymentDate: new Date().toISOString(),
            lastCalculated: new Date().toISOString()
          },
          depreciation: {
            method: 'Straight Line',
            usefulLife: 5,
            salvageValue: 0,
            currentValue: assetData.purchaseCost || 0,
            depreciationRate: 20,
            lastCalculated: new Date().toISOString()
          },
          maintenanceRecords: [],
          complianceStatus: 'Compliant',
          warrantyStatus: 'Active',
          specifications: {}
        };
        setAssets(prev => [...prev, newAsset]);
      }
    } catch (error) {
      console.warn('Failed to create asset via API, using local state');
      // Fallback creation
      const newAsset: Asset = {
        ...assetData,
        id: Date.now().toString(),
        custodianHistory: [],
        lifecycle: {
          procurementDate: assetData.purchaseDate || new Date().toISOString(),
          stage: 'Active',
          deploymentDate: new Date().toISOString(),
          lastCalculated: new Date().toISOString()
        },
        depreciation: {
          method: 'Straight Line',
          usefulLife: 5,
          salvageValue: 0,
          currentValue: assetData.purchaseCost || 0,
          depreciationRate: 20,
          lastCalculated: new Date().toISOString()
        },
        maintenanceRecords: [],
        complianceStatus: 'Compliant',
        warrantyStatus: 'Active',
        specifications: {}
      };
      setAssets(prev => [...prev, newAsset]);
    }
    setShowAssetForm(false);
    setEditingItem(null);
  };

  const handleSaveLicense = async (licenseData: Omit<License, 'id'>) => {
    try {
      const response = await apiService.createLicense(licenseData);
      if (response.data) {
        setLicenses(prev => [...prev, response.data]);
      } else {
        const newLicense: License = {
          ...licenseData,
          id: Date.now().toString()
        };
        setLicenses(prev => [...prev, newLicense]);
      }
    } catch (error) {
      console.warn('Failed to create license via API, using local state');
      const newLicense: License = {
        ...licenseData,
        id: Date.now().toString()
      };
      setLicenses(prev => [...prev, newLicense]);
    }
    setShowLicenseForm(false);
    setEditingItem(null);
  };

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
    try {
      const response = await apiService.createUser(userData);
      if (response.data) {
        setUsers(prev => [...prev, response.data]);
      } else {
        const newUser: User = {
          ...userData,
          id: Date.now().toString()
        };
        setUsers(prev => [...prev, newUser]);
      }
    } catch (error) {
      console.warn('Failed to create user via API, using local state');
      const newUser: User = {
        ...userData,
        id: Date.now().toString()
      };
      setUsers(prev => [...prev, newUser]);
    }
    setShowUserForm(false);
    setEditingItem(null);
  };

  const handleSaveAccessory = async (accessoryData: Omit<Accessory, 'id'>) => {
    try {
      const response = await apiService.createAccessory(accessoryData);
      if (response.data) {
        setAccessories(prev => [...prev, response.data]);
      } else {
        const newAccessory: Accessory = {
          ...accessoryData,
          id: Date.now().toString()
        };
        setAccessories(prev => [...prev, newAccessory]);
      }
    } catch (error) {
      console.warn('Failed to create accessory via API, using local state');
      const newAccessory: Accessory = {
        ...accessoryData,
        id: Date.now().toString()
      };
      setAccessories(prev => [...prev, newAccessory]);
    }
    setShowAccessoryForm(false);
    setEditingItem(null);
  };

  const handleSaveConsumable = async (consumableData: Omit<Consumable, 'id'>) => {
    try {
      const response = await apiService.createConsumable(consumableData);
      if (response.data) {
        setConsumables(prev => [...prev, response.data]);
      } else {
        const newConsumable: Consumable = {
          ...consumableData,
          id: Date.now().toString()
        };
        setConsumables(prev => [...prev, newConsumable]);
      }
    } catch (error) {
      console.warn('Failed to create consumable via API, using local state');
      const newConsumable: Consumable = {
        ...consumableData,
        id: Date.now().toString()
      };
      setConsumables(prev => [...prev, newConsumable]);
    }
    setShowConsumableForm(false);
    setEditingItem(null);
  };

  const handleSaveComponent = async (componentData: Omit<Component, 'id'>) => {
    try {
      const response = await apiService.createComponent(componentData);
      if (response.data) {
        setComponents(prev => [...prev, response.data]);
      } else {
        const newComponent: Component = {
          ...componentData,
          id: Date.now().toString()
        };
        setComponents(prev => [...prev, newComponent]);
      }
    } catch (error) {
      console.warn('Failed to create component via API, using local state');
      const newComponent: Component = {
        ...componentData,
        id: Date.now().toString()
      };
      setComponents(prev => [...prev, newComponent]);
    }
    setShowComponentForm(false);
    setEditingItem(null);
  };

  const handleSaveKit = async (kitData: Omit<PredefinedKit, 'id'>) => {
    try {
      const response = await apiService.request('/kits', {
        method: 'POST',
        body: JSON.stringify(kitData)
      });
      if (response.data) {
        setPredefinedKits(prev => [...prev, response.data]);
      } else {
        const newKit: PredefinedKit = {
          ...kitData,
          id: Date.now().toString()
        };
        setPredefinedKits(prev => [...prev, newKit]);
      }
    } catch (error) {
      console.warn('Failed to create kit via API, using local state');
      const newKit: PredefinedKit = {
        ...kitData,
        id: Date.now().toString()
      };
      setPredefinedKits(prev => [...prev, newKit]);
    }
    setShowKitForm(false);
    setEditingItem(null);
  };

  const handleSaveRequestableItem = async (itemData: Omit<RequestableItem, 'id'>) => {
    try {
      const response = await apiService.request('/requestable-items', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
      if (response.data) {
        setRequestableItems(prev => [...prev, response.data]);
      } else {
        const newItem: RequestableItem = {
          ...itemData,
          id: Date.now().toString()
        };
        setRequestableItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.warn('Failed to create requestable item via API, using local state');
      const newItem: RequestableItem = {
        ...itemData,
        id: Date.now().toString()
      };
      setRequestableItems(prev => [...prev, newItem]);
    }
    setShowRequestableForm(false);
    setEditingItem(null);
  };
    if (editingItem) {
      setAssets(prev => prev.map(asset => 
        asset.id === editingItem.id ? { ...assetData, id: editingItem.id } : asset
      ));
    } else {
      const newAsset: Asset = {
        ...assetData,
        id: Date.now().toString(),
        custodianHistory: [],
        lifecycle: {
          procurementDate: assetData.purchaseDate || new Date().toISOString(),
          stage: 'Active',
          deploymentDate: new Date().toISOString(),
          lastCalculated: new Date().toISOString()
        },
        depreciation: {
          method: 'Straight Line',
          usefulLife: 5,
          salvageValue: 0,
          currentValue: assetData.purchaseCost || 0,
          depreciationRate: 20,
          lastCalculated: new Date().toISOString()
        },
        maintenanceRecords: [],
        complianceStatus: 'Compliant',
        warrantyStatus: 'Active',
        specifications: {}
      };
      setAssets(prev => [...prev, newAsset]);
    }
    setShowAssetForm(false);
    setEditingItem(null);
  };

  const handleSaveLicense = (licenseData: Omit<License, 'id'>) => {
    if (editingItem) {
      setLicenses(prev => prev.map(license => 
        license.id === editingItem.id ? { ...licenseData, id: editingItem.id } : license
      ));
    } else {
      const newLicense: License = {
        ...licenseData,
        id: Date.now().toString()
      };
      setLicenses(prev => [...prev, newLicense]);
    }
    setShowLicenseForm(false);
    setEditingItem(null);
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    if (editingItem) {
      setUsers(prev => prev.map(user => 
        user.id === editingItem.id ? { ...userData, id: editingItem.id } : user
      ));
    } else {
      const newUser: User = {
        ...userData,
        id: Date.now().toString()
      };
      setUsers(prev => [...prev, newUser]);
    }
    setShowUserForm(false);
    setEditingItem(null);
  };

  const handleSaveAccessory = (accessoryData: Omit<Accessory, 'id'>) => {
    if (editingItem) {
      setAccessories(prev => prev.map(accessory => 
        accessory.id === editingItem.id ? { ...accessoryData, id: editingItem.id } : accessory
      ));
    } else {
      const newAccessory: Accessory = {
        ...accessoryData,
        id: Date.now().toString()
      };
      setAccessories(prev => [...prev, newAccessory]);
    }
    setShowAccessoryForm(false);
    setEditingItem(null);
  };

  const handleSaveConsumable = (consumableData: Omit<Consumable, 'id'>) => {
    if (editingItem) {
      setConsumables(prev => prev.map(consumable => 
        consumable.id === editingItem.id ? { ...consumableData, id: editingItem.id } : consumable
      ));
    } else {
      const newConsumable: Consumable = {
        ...consumableData,
        id: Date.now().toString()
      };
      setConsumables(prev => [...prev, newConsumable]);
    }
    setShowConsumableForm(false);
    setEditingItem(null);
  };

  const handleSaveComponent = (componentData: Omit<Component, 'id'>) => {
    if (editingItem) {
      setComponents(prev => prev.map(component => 
        component.id === editingItem.id ? { ...componentData, id: editingItem.id } : component
      ));
    } else {
      const newComponent: Component = {
        ...componentData,
        id: Date.now().toString()
      };
      setComponents(prev => [...prev, newComponent]);
    }
    setShowComponentForm(false);
    setEditingItem(null);
  };

  const handleSaveKit = (kitData: Omit<PredefinedKit, 'id'>) => {
    if (editingItem) {
      setPredefinedKits(prev => prev.map(kit => 
        kit.id === editingItem.id ? { ...kitData, id: editingItem.id } : kit
      ));
    } else {
      const newKit: PredefinedKit = {
        ...kitData,
        id: Date.now().toString()
      };
      setPredefinedKits(prev => [...prev, newKit]);
    }
    setShowKitForm(false);
    setEditingItem(null);
  };

  const handleSaveRequestableItem = (itemData: Omit<RequestableItem, 'id'>) => {
    if (editingItem) {
      setRequestableItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
      ));
    } else {
      const newItem: RequestableItem = {
        ...itemData,
        id: Date.now().toString()
      };
      setRequestableItems(prev => [...prev, newItem]);
    }
    setShowRequestableForm(false);
    setEditingItem(null);
  };

  const handleProfileUpdate = (profile: UserProfile) => setUserProfile(profile);
  const handleSettingsSave = (settings: any) => console.log('Save settings:', settings);
  const handleImport = (file: File, type: string) => console.log('Import file:', file, type);
  const handleRunReport = (reportId: string) => console.log('Run report:', reportId);
  const handleRequest = (item: RequestableItem) => console.log('Request item:', item);
  const handleDeploy = (kit: PredefinedKit) => console.log('Deploy kit:', kit);
  const handleAcknowledge = (alertId: string) => console.log('Acknowledge alert:', alertId);
  const handleResolve = (alertId: string) => console.log('Resolve alert:', alertId);
  const handleDismiss = (alertId: string) => console.log('Dismiss alert:', alertId);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard 
          metrics={dashboardMetrics} 
          onSectionChange={setActiveSection} 
          onCreateNew={handleCreateNew} 
        />;
      case 'assets':
        return <AssetsList 
          assets={assets} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
        />;
      case 'people':
        return <PeopleList 
          users={users} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
        />;
      case 'licenses':
        return <LicensesList 
          licenses={licenses} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
        />;
      case 'accessories':
        return <AccessoriesList 
          accessories={accessories} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
        />;
      case 'consumables':
        return <ConsumablesList 
          consumables={consumables} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
        />;
      case 'components':
        return <ComponentsList 
          components={components} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
        />;
      case 'requestable-items':
        return <RequestableItemsList 
          items={requestableItems} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
          onRequest={handleRequest} 
        />;
      case 'predefined-kits':
        return <PredefinedKitsList 
          kits={predefinedKits} 
          onCreateNew={handleCreateNew} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onView={handleView} 
          onDeploy={handleDeploy} 
        />;
      case 'alerts':
        return <AlertsManager 
          alerts={alerts} 
          onAcknowledge={handleAcknowledge} 
          onResolve={handleResolve} 
          onDismiss={handleDismiss} 
        />;
      case 'maintenance':
        return <MaintenanceManager assets={assets} />;
      case 'compliance':
        return <ComplianceManager assets={assets} licenses={licenses} />;
      case 'financial':
        return <FinancialManager 
          assets={assets} 
          licenses={licenses} 
          accessories={accessories} 
          consumables={consumables} 
          components={components} 
        />;
      case 'analytics':
        return <AnalyticsManager 
          assets={assets} 
          licenses={licenses} 
          accessories={accessories} 
          consumables={consumables} 
          components={components} 
          users={users} 
        />;
      case 'integrations':
        return <IntegrationsManager assets={assets} licenses={licenses} />;
      case 'reports':
        return <ReportsManager 
          reports={reports} 
          onRunReport={handleRunReport} 
          onCreateReport={handleCreateNew} 
          assets={assets} 
          licenses={licenses} 
          accessories={accessories} 
          consumables={consumables} 
          components={components} 
          users={users} 
          predefinedKits={predefinedKits} 
          requestableItems={requestableItems} 
        />;
      case 'import':
        return <ImportManager imports={imports} onImport={handleImport} />;
      case 'settings':
        return <SettingsManager onSave={handleSettingsSave} />;
      default:
        return <Dashboard 
          metrics={dashboardMetrics} 
          onSectionChange={setActiveSection} 
          onCreateNew={handleCreateNew} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} min-h-screen`}>
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
        
        {/* Asset Form */}
        {showAssetForm && (
          <AssetForm
            asset={editingItem}
            onSave={handleSaveAsset}
            onCancel={() => {
              setShowAssetForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* License Form */}
        {showLicenseForm && (
          <LicenseForm
            license={editingItem}
            onSave={handleSaveLicense}
            onCancel={() => {
              setShowLicenseForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* User Form */}
        {showUserForm && (
          <UserForm
            user={editingItem}
            onSave={handleSaveUser}
            onCancel={() => {
              setShowUserForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Accessory Form */}
        {showAccessoryForm && (
          <AccessoryForm
            accessory={editingItem}
            onSave={handleSaveAccessory}
            onCancel={() => {
              setShowAccessoryForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Consumable Form */}
        {showConsumableForm && (
          <ConsumableForm
            consumable={editingItem}
            onSave={handleSaveConsumable}
            onCancel={() => {
              setShowConsumableForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Component Form */}
        {showComponentForm && (
          <ComponentForm
            component={editingItem}
            onSave={handleSaveComponent}
            onCancel={() => {
              setShowComponentForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Predefined Kit Form */}
        {showKitForm && (
          <PredefinedKitForm
            kit={editingItem}
            onSave={handleSaveKit}
            onCancel={() => {
              setShowKitForm(false);
              setEditingItem(null);
            }}
            availableAssets={assets}
            availableAccessories={accessories}
            availableLicenses={licenses}
            availableConsumables={consumables}
          />
        )}

        {/* Requestable Item Form */}
        {showRequestableForm && (
          <RequestableItemForm
            item={editingItem}
            onSave={handleSaveRequestableItem}
            onCancel={() => {
              setShowRequestableForm(false);
              setEditingItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;