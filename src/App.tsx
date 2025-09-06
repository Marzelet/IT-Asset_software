import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard';
import AssetsList from './components/Assets/AssetsList';
import LicensesList from './components/Licenses/LicensesList';
import PeopleList from './components/People/PeopleList';
import AccessoriesList from './components/Accessories/AccessoriesList';
import ConsumablesList from './components/Consumables/ConsumablesList';
import ComponentsList from './components/Components/ComponentsList';
import PredefinedKitsList from './components/PredefinedKits/PredefinedKitsList';
import RequestableItemsList from './components/RequestableItems/RequestableItemsList';
import AlertsManager from './components/Alerts/AlertsManager';
import ReportsManager from './components/Reports/ReportsManager';
import SettingsManager from './components/Settings/SettingsManager';
import AnalyticsManager from './components/Analytics/AnalyticsManager';
import ComplianceManager from './components/Compliance/ComplianceManager';
import MaintenanceManager from './components/Maintenance/MaintenanceManager';
import FinancialManager from './components/Financial/FinancialManager';
import IntegrationsManager from './components/Integrations/IntegrationsManager';
import ImportManager from './components/Import/ImportManager';
import ProfileModal from './components/Profile/ProfileModal';
import AssetForm from './components/Assets/AssetForm';
import LicenseForm from './components/Licenses/LicenseForm';
import UserForm from './components/People/UserForm';
import AccessoryForm from './components/Accessories/AccessoryForm';
import ConsumableForm from './components/Consumables/ConsumableForm';
import ComponentForm from './components/Components/ComponentForm';
import PredefinedKitForm from './components/PredefinedKits/PredefinedKitForm';
import RequestableItemForm from './components/RequestableItems/RequestableItemForm';
import type { 
  Asset, 
  License, 
  User, 
  Accessory, 
  Consumable, 
  Component, 
  PredefinedKit, 
  RequestableItem,
  DashboardMetrics 
} from './types';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Form modal states
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAccessoryForm, setShowAccessoryForm] = useState(false);
  const [showConsumableForm, setShowConsumableForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showKitForm, setShowKitForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  // Editing states
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(null);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [editingKit, setEditingKit] = useState<PredefinedKit | null>(null);
  const [editingItem, setEditingItem] = useState<RequestableItem | null>(null);

  // Data states
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'MacBook Pro 16"',
      type: 'laptop',
      status: 'deployed',
      assignedTo: 'John Doe',
      location: 'New York Office',
      serialNumber: 'MBP2023001',
      model: 'MacBook Pro',
      manufacturer: 'Apple',
      purchaseDate: '2023-01-15',
      warrantyExpiry: '2026-01-15',
      cost: 2499.99,
      depreciation: 833.33
    }
  ]);

  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      name: 'Microsoft Office 365',
      type: 'subscription',
      totalSeats: 100,
      usedSeats: 85,
      expiryDate: '2024-12-31',
      cost: 1200.00,
      vendor: 'Microsoft'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      location: 'New York Office',
      manager: 'Jane Smith',
      employeeId: 'EMP001',
      startDate: '2022-03-15',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ]);

  const [accessories, setAccessories] = useState<Accessory[]>([
    {
      id: '1',
      name: 'Wireless Mouse',
      category: 'peripherals',
      quantity: 25,
      location: 'Storage Room A',
      cost: 29.99,
      supplier: 'Logitech'
    }
  ]);

  const [consumables, setConsumables] = useState<Consumable[]>([
    {
      id: '1',
      name: 'Printer Paper A4',
      category: 'office-supplies',
      quantity: 50,
      minQuantity: 10,
      location: 'Supply Closet',
      cost: 8.99,
      supplier: 'Office Depot'
    }
  ]);

  const [components, setComponents] = useState<Component[]>([
    {
      id: '1',
      name: '16GB DDR4 RAM',
      category: 'memory',
      quantity: 15,
      location: 'IT Storage',
      cost: 89.99,
      supplier: 'Corsair',
      compatibility: 'DDR4-3200'
    }
  ]);

  const [kits, setKits] = useState<PredefinedKit[]>([
    {
      id: '1',
      name: 'Developer Workstation',
      description: 'Complete setup for software developers',
      items: [
        { type: 'asset', id: '1', quantity: 1 },
        { type: 'accessory', id: '1', quantity: 1 }
      ],
      totalCost: 2529.98
    }
  ]);

  const [requestableItems, setRequestableItems] = useState<RequestableItem[]>([
    {
      id: '1',
      name: 'Laptop Stand',
      category: 'ergonomics',
      description: 'Adjustable aluminum laptop stand',
      cost: 49.99,
      supplier: 'Ergotron',
      requestable: true
    }
  ]);

  const [userProfile] = useState({
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    username: 'admin',
    department: 'IT',
    jobTitle: 'System Administrator',
    location: 'Main Office',
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

  const dashboardMetrics: DashboardMetrics = {
    assets: assets.length,
    licenses: licenses.length,
    accessories: accessories.length,
    consumables: consumables.length,
    components: components.length,
    people: users.length,
    predefinedKits: kits.length,
    requestableItems: requestableItems.length,
    alerts: 3,
    expiringWarranties: 2,
    expiringLicenses: 1,
    maintenanceDue: 1,
    complianceIssues: 0,
    totalValue: assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0) +
                licenses.reduce((sum, license) => sum + (license.cost || 0), 0) +
                accessories.reduce((sum, acc) => sum + (acc.purchaseCost || 0), 0) +
                components.reduce((sum, comp) => sum + (comp.purchaseCost || 0), 0)
  });

  // Create handlers
  const handleCreateNew = (type: string) => {
    switch (type) {
      case 'asset':
        setEditingAsset(null);
        setShowAssetForm(true);
        break;
      case 'license':
        setEditingLicense(null);
        setShowLicenseForm(true);
        break;
      case 'user':
        setEditingUser(null);
        setShowUserForm(true);
        break;
      case 'accessory':
        setEditingAccessory(null);
        setShowAccessoryForm(true);
        break;
      case 'consumable':
        setEditingConsumable(null);
        setShowConsumableForm(true);
        break;
      case 'component':
        setEditingComponent(null);
        setShowComponentForm(true);
        break;
      case 'kit':
        setEditingKit(null);
        setShowKitForm(true);
        break;
      case 'item':
        setEditingItem(null);
        setShowItemForm(true);
        break;
    }
  };

  // Save handlers with backend integration
  const handleSaveAsset = async (assetData: Omit<Asset, 'id'>) => {
    try {
      if (editingAsset) {
        const updatedAsset = { ...editingAsset, ...assetData };
        setAssets(prev => prev.map(asset => asset.id === editingAsset.id ? updatedAsset : asset));
      } else {
        const newAsset: Asset = {
          ...assetData,
          id: Date.now().toString()
        };
        setAssets(prev => [...prev, newAsset]);
      }
      setShowAssetForm(false);
      setEditingAsset(null);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const handleSaveLicense = async (licenseData: Omit<License, 'id'>) => {
    try {
      if (editingLicense) {
        const updatedLicense = { ...editingLicense, ...licenseData };
        setLicenses(prev => prev.map(license => license.id === editingLicense.id ? updatedLicense : license));
      } else {
        const newLicense: License = {
          ...licenseData,
          id: Date.now().toString()
        };
        setLicenses(prev => [...prev, newLicense]);
      }
      setShowLicenseForm(false);
      setEditingLicense(null);
    } catch (error) {
      console.error('Error saving license:', error);
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
    try {
      if (editingUser) {
        const updatedUser = { ...editingUser, ...userData };
        setUsers(prev => prev.map(user => user.id === editingUser.id ? updatedUser : user));
      } else {
        const newUser: User = {
          ...userData,
          id: Date.now().toString()
        };
        setUsers(prev => [...prev, newUser]);
      }
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleSaveAccessory = async (accessoryData: Omit<Accessory, 'id'>) => {
    try {
      if (editingAccessory) {
        const updatedAccessory = { ...editingAccessory, ...accessoryData };
        setAccessories(prev => prev.map(accessory => accessory.id === editingAccessory.id ? updatedAccessory : accessory));
      } else {
        const newAccessory: Accessory = {
          ...accessoryData,
          id: Date.now().toString()
        };
        setAccessories(prev => [...prev, newAccessory]);
      }
      setShowAccessoryForm(false);
      setEditingAccessory(null);
    } catch (error) {
      console.error('Error saving accessory:', error);
    }
  };

  const handleSaveConsumable = async (consumableData: Omit<Consumable, 'id'>) => {
    try {
      if (editingConsumable) {
        const updatedConsumable = { ...editingConsumable, ...consumableData };
        setConsumables(prev => prev.map(consumable => consumable.id === editingConsumable.id ? updatedConsumable : consumable));
      } else {
        const newConsumable: Consumable = {
          ...consumableData,
          id: Date.now().toString()
        };
        setConsumables(prev => [...prev, newConsumable]);
      }
      setShowConsumableForm(false);
      setEditingConsumable(null);
    } catch (error) {
      console.error('Error saving consumable:', error);
    }
  };

  const handleSaveComponent = async (componentData: Omit<Component, 'id'>) => {
    try {
      if (editingComponent) {
        const updatedComponent = { ...editingComponent, ...componentData };
        setComponents(prev => prev.map(component => component.id === editingComponent.id ? updatedComponent : component));
      } else {
        const newComponent: Component = {
          ...componentData,
          id: Date.now().toString()
        };
        setComponents(prev => [...prev, newComponent]);
      }
      setShowComponentForm(false);
      setEditingComponent(null);
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const handleSaveKit = async (kitData: Omit<PredefinedKit, 'id'>) => {
    try {
      if (editingKit) {
        const updatedKit = { ...editingKit, ...kitData };
        setKits(prev => prev.map(kit => kit.id === editingKit.id ? updatedKit : kit));
      } else {
        const newKit: PredefinedKit = {
          ...kitData,
          id: Date.now().toString()
        };
        setKits(prev => [...prev, newKit]);
      }
      setShowKitForm(false);
      setEditingKit(null);
    } catch (error) {
      console.error('Error saving kit:', error);
    }
  };

  const handleSaveItem = async (itemData: Omit<RequestableItem, 'id'>) => {
    try {
      if (editingItem) {
        const updatedItem = { ...editingItem, ...itemData };
        setRequestableItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
      } else {
        const newItem: RequestableItem = {
          ...itemData,
          id: Date.now().toString()
        };
        setRequestableItems(prev => [...prev, newItem]);
      }
      setShowItemForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Edit handlers
  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetForm(true);
  };

  const handleEditLicense = (license: License) => {
    setEditingLicense(license);
    setShowLicenseForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleEditAccessory = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setShowAccessoryForm(true);
  };

  const handleEditConsumable = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setShowConsumableForm(true);
  };

  const handleEditComponent = (component: Component) => {
    setEditingComponent(component);
    setShowComponentForm(true);
  };

  const handleEditKit = (kit: PredefinedKit) => {
    setEditingKit(kit);
    setShowKitForm(true);
  };

  const handleEditItem = (item: RequestableItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  // Delete handlers
  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleDeleteLicense = (id: string) => {
    setLicenses(prev => prev.filter(license => license.id !== id));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleDeleteAccessory = (id: string) => {
    setAccessories(prev => prev.filter(accessory => accessory.id !== id));
  };

  const handleDeleteConsumable = (id: string) => {
    setConsumables(prev => prev.filter(consumable => consumable.id !== id));
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(prev => prev.filter(component => component.id !== id));
  };

  const handleDeleteKit = (id: string) => {
    setKits(prev => prev.filter(kit => kit.id !== id));
  };

  const handleDeleteItem = (id: string) => {
    setRequestableItems(prev => prev.filter(item => item.id !== id));
  };

  const handleProfileUpdate = (profileData: any) => {
    console.log('Profile updated:', profileData);
    setShowProfileModal(false);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <EnhancedDashboard 
            metrics={dashboardMetrics}
            onSectionChange={setCurrentSection}
            onCreateNew={handleCreateNew}
          />
        );
      case 'assets':
        return (
          <AssetsList 
            assets={assets}
            onEdit={handleEditAsset}
            onDelete={handleDeleteAsset}
            onCreateNew={() => handleCreateNew('asset')}
          />
        );
      case 'licenses':
        return (
          <LicensesList 
            licenses={licenses}
            onEdit={handleEditLicense}
            onDelete={handleDeleteLicense}
            onCreateNew={() => handleCreateNew('license')}
          />
        );
      case 'people':
        return (
          <PeopleList 
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onCreateNew={() => handleCreateNew('user')}
          />
        );
      case 'accessories':
        return (
          <AccessoriesList 
            accessories={accessories}
            onEdit={handleEditAccessory}
            onDelete={handleDeleteAccessory}
            onCreateNew={() => handleCreateNew('accessory')}
          />
        );
      case 'consumables':
        return (
          <ConsumablesList 
            consumables={consumables}
            onEdit={handleEditConsumable}
            onDelete={handleDeleteConsumable}
            onCreateNew={() => handleCreateNew('consumable')}
          />
        );
      case 'components':
        return (
          <ComponentsList 
            components={components}
            onEdit={handleEditComponent}
            onDelete={handleDeleteComponent}
            onCreateNew={() => handleCreateNew('component')}
          />
        );
      case 'kits':
        return (
          <PredefinedKitsList 
            kits={kits}
            onEdit={handleEditKit}
            onDelete={handleDeleteKit}
            onCreateNew={() => handleCreateNew('kit')}
          />
        );
      case 'requestable':
        return (
          <RequestableItemsList 
            items={requestableItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onCreateNew={() => handleCreateNew('item')}
          />
        );
      case 'alerts':
        return <AlertsManager />;
      case 'reports':
        return <ReportsManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'compliance':
        return <ComplianceManager />;
      case 'maintenance':
        return <MaintenanceManager />;
      case 'financial':
        return <FinancialManager />;
      case 'integrations':
        return <IntegrationsManager />;
      case 'import':
        return <ImportManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return (
          <EnhancedDashboard 
            metrics={dashboardMetrics}
            onSectionChange={setCurrentSection}
            onCreateNew={handleCreateNew}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="lg:ml-64">
        <Header 
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="min-h-screen bg-gray-50">
          {renderContent()}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          profile={userProfile}
          onSave={handleProfileUpdate}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Asset Form Modal */}
      {showAssetForm && (
        <AssetForm
          asset={editingAsset}
          onSave={handleSaveAsset}
          onClose={() => {
            setShowAssetForm(false);
            setEditingAsset(null);
          }}
        />
      )}

      {/* License Form Modal */}
      {showLicenseForm && (
        <LicenseForm
          license={editingLicense}
          onSave={handleSaveLicense}
          onClose={() => {
            setShowLicenseForm(false);
            setEditingLicense(null);
          }}
        />
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Accessory Form Modal */}
      {showAccessoryForm && (
        <AccessoryForm
          accessory={editingAccessory}
          onSave={handleSaveAccessory}
          onClose={() => {
            setShowAccessoryForm(false);
            setEditingAccessory(null);
          }}
        />
      )}

      {/* Consumable Form Modal */}
      {showConsumableForm && (
        <ConsumableForm
          consumable={editingConsumable}
          onSave={handleSaveConsumable}
          onClose={() => {
            setShowConsumableForm(false);
            setEditingConsumable(null);
          }}
        />
      )}

      {/* Component Form Modal */}
      {showComponentForm && (
        <ComponentForm
          component={editingComponent}
          onSave={handleSaveComponent}
          onClose={() => {
            setShowComponentForm(false);
            setEditingComponent(null);
          }}
        />
      )}

      {/* Kit Form Modal */}
      {showKitForm && (
        <PredefinedKitForm
          kit={editingKit}
          onSave={handleSaveKit}
          onClose={() => {
            setShowKitForm(false);
            setEditingKit(null);
          }}
        />
      )}

      {/* Requestable Item Form Modal */}
      {showItemForm && (
        <RequestableItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default App;