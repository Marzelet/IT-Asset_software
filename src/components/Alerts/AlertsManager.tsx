import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Settings, Filter, Search } from 'lucide-react';
import { apiService } from '../../services/api';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  category: string;
  createdAt: string;
  updatedAt: string;
  assetId?: string;
  userId?: string;
}

interface AlertSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  warningThreshold: number;
  criticalThreshold: number;
  autoResolve: boolean;
}

export default function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    emailNotifications: true,
    pushNotifications: true,
    warningThreshold: 30,
    criticalThreshold: 7,
    autoResolve: false,
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadAlerts();
    loadSettings();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, filterType, filterStatus]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAlerts();
      if (response.data) {
        setAlerts(response.data);
      } else {
        // Demo data when backend unavailable
        setAlerts(generateDemoAlerts());
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setAlerts(generateDemoAlerts());
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await apiService.getAlertSettings();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load alert settings:', error);
    }
  };

  const generateDemoAlerts = (): Alert[] => [
    {
      id: '1',
      title: 'License Expiring Soon',
      message: 'Microsoft Office 365 license expires in 15 days',
      type: 'warning',
      priority: 'medium',
      status: 'active',
      category: 'License Management',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      title: 'Hardware Warranty Expired',
      message: 'Dell Laptop DL-001 warranty has expired',
      type: 'error',
      priority: 'high',
      status: 'active',
      category: 'Asset Management',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      title: 'Low Stock Alert',
      message: 'USB cables inventory below minimum threshold (5 remaining)',
      type: 'warning',
      priority: 'medium',
      status: 'acknowledged',
      category: 'Inventory',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '4',
      title: 'Maintenance Due',
      message: 'Server maintenance scheduled for this weekend',
      type: 'info',
      priority: 'low',
      status: 'active',
      category: 'Maintenance',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];

  const filterAlerts = () => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    setFilteredAlerts(filtered);
  };

  const handleAlertAction = async (alertId: string, action: 'acknowledge' | 'resolve' | 'dismiss') => {
    try {
      let response;
      switch (action) {
        case 'acknowledge':
          response = await apiService.acknowledgeAlert(alertId);
          break;
        case 'resolve':
          response = await apiService.resolveAlert(alertId);
          break;
        case 'dismiss':
          response = await apiService.dismissAlert(alertId);
          break;
      }

      if (response.data || !response.error) {
        setAlerts(prev => prev.map(alert =>
          alert.id === alertId
            ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : action === 'resolve' ? 'resolved' : 'dismissed' }
            : alert
        ));
      }
    } catch (error) {
      console.error(`Failed to ${action} alert:`, error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedAlerts.length === 0) return;

    try {
      const response = await apiService.bulkUpdateAlerts(action, selectedAlerts);
      if (response.data || !response.error) {
        setAlerts(prev => prev.map(alert =>
          selectedAlerts.includes(alert.id)
            ? { ...alert, status: action as Alert['status'] }
            : alert
        ));
        setSelectedAlerts([]);
      }
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const response = await apiService.updateAlertSettings(settings);
      if (response.data || !response.error) {
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600">Monitor and manage system alerts</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAlerts.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {selectedAlerts.length} alert(s) selected
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleBulkAction('acknowledged')}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Acknowledge
              </button>
              <button
                onClick={() => handleBulkAction('resolved')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Resolve
              </button>
              <button
                onClick={() => handleBulkAction('dismissed')}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'All systems are running smoothly'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                alert.type === 'error' ? 'border-l-red-500' :
                alert.type === 'warning' ? 'border-l-yellow-500' :
                alert.type === 'success' ? 'border-l-green-500' :
                'border-l-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlerts(prev => [...prev, alert.id]);
                      } else {
                        setSelectedAlerts(prev => prev.filter(id => id !== alert.id));
                      }
                    }}
                    className="mt-1"
                  />
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Category: {alert.category}</span>
                      <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleAlertAction(alert.id, 'resolve')}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Resolve
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleAlertAction(alert.id, 'dismiss')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Alert Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                  className="rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warning Threshold (days)
                </label>
                <input
                  type="number"
                  value={settings.warningThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, warningThreshold: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Critical Threshold (days)
                </label>
                <input
                  type="number"
                  value={settings.criticalThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, criticalThreshold: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto-resolve expired alerts</label>
                <input
                  type="checkbox"
                  checked={settings.autoResolve}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoResolve: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}