import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  X, 
  Calendar, 
  Shield, 
  KeyRound, 
  Wrench,
  Plus,
  Filter,
  Search,
  Clock,
  User,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertType, AlertSeverity, AlertStatus } from '../../types';
import apiService from '../../services/api';

interface AlertsManagerProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export default function AlertsManager({ alerts, onAcknowledge, onResolve, onDismiss }: AlertsManagerProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    warrantyDays: 30,
    licenseDays: 60,
    maintenanceDays: 7,
    emailNotifications: true,
    autoResolve: false
  });

  useEffect(() => {
    loadAlertSettings();
  }, []);

  const loadAlertSettings = async () => {
    try {
      const response = await apiService.request('/alerts/settings');
      if (response.data) {
        setAlertSettings(response.data);
      }
    } catch (error) {
      console.warn('Failed to load alert settings, using defaults');
    }
  };

  const handleCreateAlert = async (alertData: Omit<Alert, 'id'>) => {
    setLoading(true);
    try {
      const response = await apiService.createAlert(alertData);
      if (response.data) {
        // Alert created successfully via API
        console.log('Alert created:', response.data);
        // Refresh alerts list or add to local state
        window.location.reload(); // Simple refresh for demo
      } else {
        // Fallback to local creation
        const newAlert: Alert = {
          ...alertData,
          id: Date.now().toString()
        };
        console.log('Alert created locally:', newAlert);
      }
    } catch (error) {
      console.warn('Failed to create alert via API');
      // Fallback to local creation
      const newAlert: Alert = {
        ...alertData,
        id: Date.now().toString()
      };
      console.log('Alert created locally:', newAlert);
    } finally {
      setLoading(false);
      setShowCreateForm(false);
    }
  };

  const handleBulkAction = async (action: 'acknowledge' | 'resolve' | 'dismiss', alertIds: string[]) => {
    setLoading(true);
    try {
      const response = await apiService.bulkUpdateAlerts(action, alertIds);
      if (response.data) {
        // Update alerts based on action
        alertIds.forEach(id => {
          switch (action) {
            case 'acknowledge':
              onAcknowledge(id);
              break;
            case 'resolve':
              onResolve(id);
              break;
            case 'dismiss':
              onDismiss(id);
              break;
          }
        });
      }
    } catch (error) {
      console.warn('Failed to perform bulk action via API');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (newSettings: typeof alertSettings) => {
    try {
      const response = await apiService.updateAlertSettings(newSettings);
      if (response.data) {
        setAlertSettings(newSettings);
        console.log('Alert settings updated successfully');
      }
    } catch (error) {
      console.warn('Failed to update alert settings');
    }
  };
        method: 'POST',
        body: JSON.stringify(alertData)
      });
      if (response.data) {
        // Alert created successfully via API
        console.log('Alert created:', response.data);
      } else {
        // Fallback to local creation
        const newAlert: Alert = {
          ...alertData,
          id: Date.now().toString()
        };
        // This would be handled by parent component
      }
    } catch (error) {
      console.warn('Failed to create alert via API');
    } finally {
      setLoading(false);
      setShowCreateForm(false);
    }
  };

  const handleBulkAction = async (action: 'acknowledge' | 'resolve' | 'dismiss', alertIds: string[]) => {
    setLoading(true);
    try {
      await apiService.request('/alerts/bulk', {
        method: 'PUT',
        body: JSON.stringify({ action, alertIds })
      });
      // Update alerts based on action
      alertIds.forEach(id => {
        switch (action) {
          case 'acknowledge':
            onAcknowledge(id);
            break;
          case 'resolve':
            onResolve(id);
            break;
          case 'dismiss':
            onDismiss(id);
            break;
        }
      });
    } catch (error) {
      console.warn('Failed to perform bulk action via API');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (newSettings: typeof alertSettings) => {
    try {
      await apiService.request('/alerts/settings', {
        method: 'PUT',
        body: JSON.stringify(newSettings)
      });
      setAlertSettings(newSettings);
    } catch (error) {
      console.warn('Failed to update alert settings');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'active' && alert.status === 'Active') ||
                     (activeTab === 'acknowledged' && alert.status === 'Acknowledged') ||
                     (activeTab === 'resolved' && alert.status === 'Resolved');
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesSearch = searchTerm === '' || 
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSeverity && matchesType && matchesSearch;
  });

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'Error': return 'text-red-600 bg-red-50 border-red-200';
      case 'Warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'Active': return 'text-red-600';
      case 'Acknowledged': return 'text-yellow-600';
      case 'Resolved': return 'text-green-600';
      case 'Dismissed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'Warranty Expiry': return <Shield className="w-5 h-5" />;
      case 'License Expiry': return <KeyRound className="w-5 h-5" />;
      case 'Maintenance Due': return <Wrench className="w-5 h-5" />;
      case 'Compliance Warning': return <AlertTriangle className="w-5 h-5" />;
      case 'Security Alert': return <Shield className="w-5 h-5" />;
      case 'Cost Threshold': return <Calendar className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'Critical' && alert.status === 'Active');
  const activeAlerts = alerts.filter(alert => alert.status === 'Active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'Acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'Resolved');

  const tabs = [
    { id: 'active', label: 'Active', count: activeAlerts.length, color: 'text-red-600' },
    { id: 'acknowledged', label: 'Acknowledged', count: acknowledgedAlerts.length, color: 'text-yellow-600' },
    { id: 'resolved', label: 'Resolved', count: resolvedAlerts.length, color: 'text-green-600' },
    { id: 'all', label: 'All Alerts', count: alerts.length, color: 'text-gray-600' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600">Monitor and manage system alerts, notifications, and automated warnings</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {criticalAlerts.length} Critical
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {activeAlerts.length} Active
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
              <div className="text-sm font-medium text-red-700">Critical Alerts</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.type === 'Warranty Expiry' && a.status === 'Active').length}
              </div>
              <div className="text-sm font-medium text-yellow-700">Warranty Expiring</div>
            </div>
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.type === 'License Expiry' && a.status === 'Active').length}
              </div>
              <div className="text-sm font-medium text-orange-700">Licenses Expiring</div>
            </div>
            <KeyRound className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {alerts.filter(a => a.type === 'Maintenance Due' && a.status === 'Active').length}
              </div>
              <div className="text-sm font-medium text-purple-700">Maintenance Due</div>
            </div>
            <Wrench className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Alert Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 ${tab.color}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as AlertSeverity | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Error">Error</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as AlertType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Warranty Expiry">Warranty Expiry</option>
              <option value="License Expiry">License Expiry</option>
              <option value="Maintenance Due">Maintenance Due</option>
              <option value="Compliance Warning">Compliance Warning</option>
              <option value="Security Alert">Security Alert</option>
              <option value="Cost Threshold">Cost Threshold</option>
            </select>

            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh Alerts"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500">
                {activeTab === 'active' ? 'All systems are running smoothly!' : 'No alerts match your current filters.'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-6 border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-md ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created: {new Date(alert.createdDate).toLocaleDateString()}</span>
                        </span>
                        {alert.dueDate && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                          </span>
                        )}
                        {alert.assetId && (
                          <span className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>Asset: {alert.assetId}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {alert.status === 'Active' && (
                      <>
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => onResolve(alert.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    {alert.status === 'Acknowledged' && (
                      <button
                        onClick={() => onResolve(alert.id)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {alert.actions.length > 0 && (
                  <div className="mt-4 pl-12">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Actions Taken:</h4>
                    <div className="space-y-2">
                      {alert.actions.map((action) => (
                        <div key={action.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3" />
                            <span className="font-medium">{action.action}</span>
                            {action.performedBy && (
                              <span>by {action.performedBy}</span>
                            )}
                            {action.performedDate && (
                              <span>on {new Date(action.performedDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          {action.notes && (
                            <div className="text-gray-500 mt-1 ml-5">{action.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alert Settings & Configuration</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Alert Days
              </label>
              <input
                type="number"
                value={alertSettings.warrantyDays}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, warrantyDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Days before warranty expiry to alert</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Alert Days
              </label>
              <input
                type="number"
                value={alertSettings.licenseDays}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, licenseDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Days before license expiry to alert</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Alert Days
              </label>
              <input
                type="number"
                value={alertSettings.maintenanceDays}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, maintenanceDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Days before maintenance due to alert</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={alertSettings.emailNotifications}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={alertSettings.autoResolve}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, autoResolve: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-resolve Fixed Issues</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleUpdateSettings(alertSettings)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Alert</h2>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateAlert({
                type: formData.get('type') as AlertType,
                severity: formData.get('severity') as AlertSeverity,
                title: formData.get('title') as string,
                message: formData.get('message') as string,
                assetId: formData.get('assetId') as string || undefined,
                createdDate: new Date().toISOString(),
                dueDate: formData.get('dueDate') as string || undefined,
                status: 'Active',
                actions: []
              });
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                  <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Warranty Expiry">Warranty Expiry</option>
                    <option value="License Expiry">License Expiry</option>
                    <option value="Maintenance Due">Maintenance Due</option>
                    <option value="Compliance Warning">Compliance Warning</option>
                    <option value="Security Alert">Security Alert</option>
                    <option value="Cost Threshold">Cost Threshold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select name="severity" required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Info">Info</option>
                    <option value="Warning">Warning</option>
                    <option value="Error">Error</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="title" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" name="dueDate" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Asset (Optional)</label>
                <input type="text" name="assetId" placeholder="Asset ID" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}