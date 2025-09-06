import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { checkDatabaseConnection } from '../../lib/supabase';

interface DatabaseStatusProps {
  onConnectionChange?: (connected: boolean) => void;
}

export default function DatabaseStatus({ onConnectionChange }: DatabaseStatusProps) {
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    error?: string;
    checking: boolean;
  }>({
    connected: false,
    checking: true
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const result = await checkDatabaseConnection();
      setConnectionStatus({
        connected: result.connected,
        error: result.error,
        checking: false
      });
      
      if (onConnectionChange) {
        onConnectionChange(result.connected);
      }
    } catch (error) {
      setConnectionStatus({
        connected: false,
        error: 'Failed to check database connection',
        checking: false
      });
      
      if (onConnectionChange) {
        onConnectionChange(false);
      }
    }
  };

  const getStatusIcon = () => {
    if (connectionStatus.checking) {
      return <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />;
    }
    if (connectionStatus.connected) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = () => {
    if (connectionStatus.checking) return 'border-blue-200 bg-blue-50';
    if (connectionStatus.connected) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  const getStatusText = () => {
    if (connectionStatus.checking) return 'Checking connection...';
    if (connectionStatus.connected) return 'Database connected';
    return connectionStatus.error || 'Database disconnected';
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border ${getStatusColor()}`}>
      <Database className="w-5 h-5 text-gray-600" />
      {getStatusIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{getStatusText()}</p>
        {!connectionStatus.connected && !connectionStatus.checking && (
          <p className="text-xs text-gray-600">
            Click "Connect to Supabase" in the top right to set up your database
          </p>
        )}
      </div>
      <button
        onClick={checkConnection}
        disabled={connectionStatus.checking}
        className="text-blue-600 hover:text-blue-500 disabled:opacity-50"
        title="Refresh connection status"
      >
        <RefreshCw className={`w-4 h-4 ${connectionStatus.checking ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}