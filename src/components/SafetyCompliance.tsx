import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRealtime } from '@/hooks/use-realtime';
import { Shield, AlertTriangle, FileText } from 'lucide-react';

interface SafetyCertification {
  id: string;
  employeeId: string;
  employeeName: string;
  certificationType: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'VALID' | 'EXPIRING' | 'EXPIRED';
  daysUntilExpiry: number;
}

interface SafetyIncident {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  reportedBy: string;
  reportedDate: Date;
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVING' | 'RESOLVED';
}

export const SafetyCompliance: React.FC = () => {
  const { data: realtimeData, isConnected, emitEvent } = useRealtime();
  const [certifications, setCertifications] = useState<SafetyCertification[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [complianceRate, setComplianceRate] = useState(0);



  useEffect(() => {
    // Empty safety data - ready for real data
    const mockCertifications: SafetyCertification[] = [];
    const mockIncidents: SafetyIncident[] = [];
    
    setCertifications(mockCertifications);
    setIncidents(mockIncidents);
    
    // Calculate compliance rate
    const validCerts = mockCertifications.filter(cert => cert.status === 'VALID').length;
    const totalCerts = mockCertifications.length;
    setComplianceRate(totalCerts > 0 ? (validCerts / totalCerts) * 100 : 0);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-orange-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const sendSafetyAlert = (message: string, severity: string) => {
    emitEvent('safety-alert', {
      message,
      severity,
      location: 'Mining Site A',
      timestamp: new Date()
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Safety & Compliance
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{complianceRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
              <Progress value={complianceRate} className="mt-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {certifications.filter(c => c.status === 'VALID').length}
              </div>
              <div className="text-sm text-gray-600">Valid Certifications</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {certifications.filter(c => c.status === 'EXPIRED').length}
              </div>
              <div className="text-sm text-gray-600">Expired Certifications</div>
            </div>
          </div>

          {/* Certification Alerts */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Certification Alerts
            </h3>
            {certifications
              .filter(cert => cert.status !== 'VALID')
              .map((cert) => (
                <div key={cert.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">{cert.employeeName}</p>
                      <p className="text-sm text-red-600">{cert.certificationType}</p>
                      <p className="text-xs text-red-500">
                        Expires: {cert.expiryDate.toLocaleDateString()}
                        {cert.daysUntilExpiry < 0 
                          ? ` (${Math.abs(cert.daysUntilExpiry)} days overdue)`
                          : ` (${cert.daysUntilExpiry} days remaining)`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={cert.status === 'EXPIRED' ? 'destructive' : 'secondary'}>
                        {cert.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Schedule certification renewal
                        }}
                      >
                        Schedule Renewal
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Safety Incidents */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Recent Safety Incidents
            </h3>
            {incidents.map((incident) => (
              <div key={incident.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-gray-600">{incident.description}</p>
                    <p className="text-xs text-gray-500">
                      Location: {incident.location} | Reported: {incident.reportedDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`} />
                    <Badge variant="outline" className="capitalize">
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Safety Alerts */}
          {realtimeData?.alerts && realtimeData.alerts.filter(alert => alert.title.includes('Safety')).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Real-time Safety Alerts</h3>
              {realtimeData.alerts
                .filter(alert => alert.title.includes('Safety'))
                .slice(0, 3)
                .map((alert) => (
                  <div key={alert.id} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="font-medium text-red-800">{alert.title}</p>
                        <p className="text-sm text-red-600">{alert.message}</p>
                        <p className="text-xs text-red-500">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Generate safety report
              }}
            >
              Generate Report
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Send test safety alert
                sendSafetyAlert('Test safety alert - Equipment malfunction detected', 'HIGH');
              }}
            >
              Test Safety Alert
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Schedule safety training
              }}
            >
              Schedule Training
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
