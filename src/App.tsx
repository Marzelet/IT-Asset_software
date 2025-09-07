import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard';
import AssetForm from './components/Assets/AssetForm';
import AssetsList from './components/Assets/AssetsList';
import PeopleList from './components/People/PeopleList';
import UserForm from './components/People/UserForm';
import LicensesList from './components/Licenses/LicensesList';
import LicenseForm from './components/Licenses/LicenseForm';
import ComponentsList from './components/Components/ComponentsList';
import ComponentForm from './components/Components/ComponentForm';
import AccessoriesList from './components/Accessories/AccessoriesList';
import AccessoryForm from './components/Accessories/AccessoryForm';
import ConsumablesList from './components/Consumables/ConsumablesList';
import ConsumableForm from './components/Consumables/ConsumableForm';
import PredefinedKitsList from './components/PredefinedKits/PredefinedKitsList';
import PredefinedKitForm from './components/PredefinedKits/PredefinedKitForm';
import RequestableItemsList from './components/RequestableItems/RequestableItemsList';
import RequestableItemForm from './components/RequestableItems/RequestableItemForm';
import MaintenanceManager from './components/Maintenance/MaintenanceManager';
import AlertsManager from './components/Alerts/AlertsManager';
import ReportsManager from './components/Reports/ReportsManager';
import AnalyticsManager from './components/Analytics/AnalyticsManager';
import SettingsManager from './components/Settings/SettingsManager';
import ComplianceManager from './components/Compliance/ComplianceManager';
import FinancialManager from './components/Financial/FinancialManager';
import IntegrationsManager from './components/Integrations/IntegrationsManager';
import ImportManager from './components/Import/ImportManager';
import ProfileModal from './components/Profile/ProfileModal';
import DatabaseStatus from './components/Common/DatabaseStatus';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Asset, User, License, Component, Accessory, Consumable, PredefinedKit, RequestableItem, UserProfile } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Data states
  const [assets, setAssets] = useLocalStorage<Asset[]>('assets', []);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [licenses, setLicenses] = useLocalStorage<License[]>('licenses', []);
  const [components, setComponents] = useLocalStorage<Component[]>('components', []);
  const [accessories, setAccessories] = useLocalStorage<Accessory[]>('accessories', []);
  const [consumables, setConsumables] = useLocalStorage<Consumable[]>('consumables', []);
  const [predefinedKits, setPredefinedKits] = useLocalStorage<PredefinedKit[]>('predefinedKits', []);
  const [requestableItems, setRequestableItems] = useLocalStorage<RequestableItem[]>('requestableItems', []);
  
  // User profile state
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    avatar: '',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    }
  });

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        const dashboardMetrics = {
          totalAssets: assets.length,
          totalUsers: users.length,
          totalLicenses: licenses.length,
          totalComponents: components.length,
          totalAccessories: accessories.length,
          totalConsumables: consumables.length,
          totalKits: predefinedKits.length,
          totalRequestableItems: requestableItems.length,
          alerts: 0,
          totalValue: 0,
          maintenanceDue: 0,
          lowStock: 0
        };
        
        return (
          <EnhancedDashboard
            metrics={dashboardMetrics}
            onSectionChange={setCurrentView}
            onCreateNew={(section) => setCurrentView(`add-${section}`)}
          />
        );
      case 'assets':
        return <AssetsList assets={assets} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-asset':
        return <AssetForm onSubmit={(asset) => setAssets([...assets, asset])} onCancel={() => setCurrentView('assets')} />;
      case 'people':
        return <PeopleList users={users} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-user':
        return <UserForm onSubmit={(user) => setUsers([...users, user])} onCancel={() => setCurrentView('people')} />;
      case 'licenses':
        return <LicensesList licenses={licenses} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-license':
        return <LicenseForm onSubmit={(license) => setLicenses([...licenses, license])} onCancel={() => setCurrentView('licenses')} />;
      case 'components':
        return <ComponentsList components={components} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-component':
        return <ComponentForm onSubmit={(component) => setComponents([...components, component])} onCancel={() => setCurrentView('components')} />;
      case 'accessories':
        return <AccessoriesList accessories={accessories} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-accessory':
        return <AccessoryForm onSubmit={(accessory) => setAccessories([...accessories, accessory])} onCancel={() => setCurrentView('accessories')} />;
      case 'consumables':
        return <ConsumablesList consumables={consumables} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-consumable':
        return <ConsumableForm onSubmit={(consumable) => setConsumables([...consumables, consumable])} onCancel={() => setCurrentView('consumables')} />;
      case 'kits':
        return <PredefinedKitsList kits={predefinedKits} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-kit':
        return <PredefinedKitForm onSubmit={(kit) => setPredefinedKits([...predefinedKits, kit])} onCancel={() => setCurrentView('kits')} />;
      case 'requestable':
        return <RequestableItemsList items={requestableItems} onEdit={() => {}} onDelete={() => {}} />;
      case 'add-requestable':
        return <RequestableItemForm onSubmit={(item) => setRequestableItems([...requestableItems, item])} onCancel={() => setCurrentView('requestable')} />;
      case 'maintenance':
        return <MaintenanceManager />;
      case 'alerts':
        return <AlertsManager />;
      case 'reports':
        return <ReportsManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'settings':
        return <SettingsManager />;
      case 'compliance':
        return <ComplianceManager />;
      case 'financial':
        return <FinancialManager />;
      case 'integrations':
        return <IntegrationsManager />;
      case 'import':
        return <ImportManager />;
      default:
        return (
          <EnhancedDashboard
            assets={assets}
            users={users}
            licenses={licenses}
            components={components}
            accessories={accessories}
            consumables={consumables}
            predefinedKits={predefinedKits}
            requestableItems={requestableItems}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={userProfile}
          onProfileClick={() => setShowProfileModal(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <DatabaseStatus />
          {renderContent()}
        </main>
      </div>

      {showProfileModal && (
        <ProfileModal
          profile={userProfile}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onUpdate={(updatedProfile) => {
            setUserProfile(updatedProfile);
            setShowProfileModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;