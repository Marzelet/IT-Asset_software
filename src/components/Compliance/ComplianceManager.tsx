import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Calendar, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { ComplianceCheck, ComplianceStatus, ComplianceType, PolicyViolation } from '../../types';
import apiService from '../../services/api';

interface ComplianceManagerProps {
  assets: any[];
  licenses: any[];
}

export default function ComplianceManager({ assets, licenses }: ComplianceManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState<ComplianceType | 'all'>('all');
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [policyViolations, setPolicyViolations] = useState<PolicyViolation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      // Load compliance checks from API
      const checksResponse = await apiService.request('/compliance/checks');
      if (checksResponse.data) {
        setComplianceChecks(checksResponse.data);
      } else {
        // Generate sample compliance data
        generateSampleComplianceData();
      }

      // Load policy violations from API
      const violationsResponse = await apiService.request('/compliance/violations');
      if (violationsResponse.data) {
        setPolicyViolations(violationsResponse.data);
      } else {
        // Generate sample violations
        generateSampleViolations();
      }
    } catch (error) {
      console.warn('Failed to load compliance data, using sample data');
      generateSampleComplianceData();
      generateSampleViolations();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleComplianceData = () => {
    const sampleChecks: ComplianceCheck[] = [
      {
        id: '1',
        type: 'License Compliance',
        status: 'Compliant',
        lastChecked: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        violations: [],
        auditor: 'System Administrator',
        notes: 'All software licenses are properly tracked and within limits'
      },
      {
        id: '2',
        type: 'Security Compliance',
        status: 'Non-Compliant',
        lastChecked: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        violations: [],
        auditor: 'Security Team',
        notes: 'Some assets missing security patches'
      }
    ];
    setComplianceChecks(sampleChecks);
  };

  const generateSampleViolations = () => {
    const sampleViolations: PolicyViolation[] = [
      {
        id: '1',
        type: 'License Overuse',
        severity: 'Critical',
        description: 'Microsoft Office licenses exceeded by 5 seats',
        detectedDate: new Date().toISOString(),
        assignedTo: 'IT Manager',
        status: 'Open'
      },
      {
        id: '2',
        type: 'Unauthorized Software',
        severity: 'High',
        description: 'Unauthorized software detected on 3 workstations',
        detectedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Security Team',
        status: 'In Progress'
      }
    ];
    setPolicyViolations(sampleViolations);
  };

  const handleCreateComplianceCheck = async (checkData: Omit<ComplianceCheck, 'id'>) => {
    try {
      const response = await apiService.request('/compliance/checks', {
        method: 'POST',
        body: JSON.stringify(checkData)
      });
      
      if (response.data) {
        setComplianceChecks(prev => [...prev, response.data]);
      } else {
        // Fallback to local state
        const newCheck: ComplianceCheck = {
          ...checkData,
          id: Date.now().toString()
        };
        setComplianceChecks(prev => [...prev, newCheck]);
      }
    } catch (error) {
      console.warn('Failed to create compliance check, using local state');
      const newCheck: ComplianceCheck = {
        ...checkData,
        id: Date.now().toString()
      };
      setComplianceChecks(prev => [...prev, newCheck]);
    }
  };

  const handleResolveViolation = async (violationId: string) => {
    try {
      await apiService.request(`/compliance/violations/${violationId}/resolve`, {
        method: 'PUT'
      });
      
      setPolicyViolations(prev => prev.map(violation => 
        violation.id === violationId 
          ? { ...violation, status: 'Resolved', resolvedDate: new Date().toISOString() }
          : violation
      ));
    } catch (error) {
      console.warn('Failed to resolve violation via API, updating locally');
      setPolicyViolations(prev => prev.map(violation => 
        violation.id === violationId 
          ? { ...violation, status: 'Resolved', resolvedDate: new Date().toISOString() }
          : violation
      ));
    }
  };

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case 'Compliant': return 'text-green-600 bg-green-100';
      case 'Non-Compliant': return 'text-red-600 bg-red-100';
      case 'Under Review': return 'text-yellow-600 bg-yellow-100';
      case 'Remediation Required': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'Compliant': return <CheckCircle className="w-5 h-5" />;
      case 'Non-Compliant': return <XCircle className="w-5 h-5" />;
      case 'Under Review': return <AlertTriangle className="w-5 h-5" />;
      case 'Remediation Required': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const complianceScore = complianceChecks.length > 0 ? 
    (complianceChecks.filter(c => c.status === 'Compliant').length / complianceChecks.length) * 100 : 100;

  const criticalViolations = policyViolations.filter(v => v.severity === 'Critical' && v.status === 'Open');
  const openViolations = policyViolations.filter(v => v.status === 'Open');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Audits</h1>
          <p className="text-gray-600">Monitor compliance status and manage policy violations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{complianceScore.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Compliance Score</div>
          </div>
          <button
            onClick={() => handleCreateComplianceCheck({
              type: 'License Compliance',
              status: 'Under Review',
              lastChecked: new Date().toISOString(),
              nextCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              violations: [],
              auditor: 'System Administrator'
            })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Check</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {complianceChecks.filter(c => c.status === 'Compliant').length}
              </div>
              <div className="text-sm font-medium text-green-700">Compliant</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{criticalViolations.length}</div>
              <div className="text-sm font-medium text-red-700">Critical Issues</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{openViolations.length}</div>
              <div className="text-sm font-medium text-yellow-700">Open Violations</div>
            </div>
            <XCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{complianceChecks.length}</div>
              <div className="text-sm font-medium text-blue-700">Total Checks</div>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: <Shield className="w-4 h-4" /> },
              { id: 'checks', label: 'Compliance Checks', icon: <CheckCircle className="w-4 h-4" /> },
              { id: 'violations', label: 'Policy Violations', icon: <AlertTriangle className="w-4 h-4" /> },
              { id: 'audits', label: 'Audit Reports', icon: <FileText className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance Score Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Score Breakdown</h3>
                  <div className="space-y-4">
                    {['License Compliance', 'Security Compliance', 'Regulatory Compliance', 'Policy Compliance'].map((type) => {
                      const typeChecks = complianceChecks.filter(c => c.type === type);
                      const typeScore = typeChecks.length > 0 ? 
                        (typeChecks.filter(c => c.status === 'Compliant').length / typeChecks.length) * 100 : 100;
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">{type}</span>
                            <span className="text-sm text-gray-500">{typeScore.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                typeScore >= 90 ? 'bg-green-600' : 
                                typeScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${typeScore}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Violations */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Violations</h3>
                  <div className="space-y-3">
                    {policyViolations.slice(0, 5).map((violation) => (
                      <div key={violation.id} className="flex items-start space-x-3 p-3 bg-white rounded-md">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          violation.severity === 'Critical' ? 'text-red-600' :
                          violation.severity === 'High' ? 'text-orange-600' :
                          violation.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{violation.description}</p>
                          <p className="text-xs text-gray-500">
                            {violation.type} • {new Date(violation.detectedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checks' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as ComplianceType | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="License Compliance">License Compliance</option>
                  <option value="Security Compliance">Security Compliance</option>
                  <option value="Regulatory Compliance">Regulatory Compliance</option>
                  <option value="Policy Compliance">Policy Compliance</option>
                </select>
              </div>

              <div className="space-y-4">
                {complianceChecks
                  .filter(check => filterType === 'all' || check.type === filterType)
                  .map((check) => (
                    <div key={check.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-md ${getStatusColor(check.status)}`}>
                            {getStatusIcon(check.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{check.type}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Last checked: {new Date(check.lastChecked).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Next check: {new Date(check.nextCheck).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Auditor: {check.auditor}
                            </p>
                            {check.notes && (
                              <p className="text-sm text-gray-500 mt-2">{check.notes}</p>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(check.status)}`}>
                          {check.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'violations' && (
            <div className="space-y-4">
              {policyViolations.map((violation) => (
                <div key={violation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        violation.severity === 'Critical' ? 'text-red-600' :
                        violation.severity === 'High' ? 'text-orange-600' :
                        violation.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{violation.description}</h4>
                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                          <p>Type: {violation.type}</p>
                          <p>Severity: {violation.severity}</p>
                          <p>Detected: {new Date(violation.detectedDate).toLocaleDateString()}</p>
                          <p>Assigned to: {violation.assignedTo}</p>
                          {violation.resolvedDate && (
                            <p>Resolved: {new Date(violation.resolvedDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        violation.status === 'Open' ? 'bg-red-100 text-red-800' :
                        violation.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {violation.status}
                      </span>
                      {violation.status === 'Open' && (
                        <button
                          onClick={() => handleResolveViolation(violation.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">License Audit Report</h4>
                    <p className="text-sm text-gray-600 mb-3">Complete audit of all software licenses</p>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Security Compliance</h4>
                    <p className="text-sm text-gray-600 mb-3">Security policy compliance status</p>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Generate Report
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Asset Compliance</h4>
                    <p className="text-sm text-gray-600 mb-3">Asset management compliance audit</p>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}