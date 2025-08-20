import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealtime } from '@/hooks/use-realtime';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface EquipmentLocation {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'REPAIR' | 'RETIRED';
  lastUpdate: Date;
  operatingHours: number;
  nextMaintenance: Date | null;
  assignedTo?: string;
}

export const EquipmentGPSMap: React.FC = () => {
  const { data: realtimeData, isConnected, emitEvent } = useRealtime();
  const [equipment, setEquipment] = useState<EquipmentLocation[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  // Empty equipment data - ready for real data
  const mockEquipmentData: EquipmentLocation[] = [];

  useEffect(() => {
    setEquipment(mockEquipmentData);
  }, []);

  useEffect(() => {
    if (isConnected) {
      // Join equipment tracking rooms
      equipment.forEach(eq => {
        emitEvent('join-equipment-tracking', eq.id);
      });
    }
  }, [isConnected, equipment, emitEvent]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'IN_USE': return 'bg-blue-500';
      case 'MAINTENANCE': return 'bg-yellow-500';
      case 'REPAIR': return 'bg-red-500';
      case 'RETIRED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <CheckCircle className="w-4 h-4" />;
      case 'IN_USE': return <Navigation className="w-4 h-4" />;
      case 'MAINTENANCE': return <Clock className="w-4 h-4" />;
      case 'REPAIR': return <AlertTriangle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const isMaintenanceOverdue = (nextMaintenance: Date | null) => {
    return nextMaintenance && nextMaintenance < new Date();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Equipment GPS Tracking
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Interactive GPS Map</p>
              <p className="text-sm text-gray-500">Showing {equipment.length} equipment locations</p>
            </div>
          </div>

          {/* Equipment List */}
          <div className="space-y-2">
            <h3 className="font-semibold">Equipment Locations</h3>
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedEquipment === eq.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedEquipment(eq.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(eq.status)}`} />
                    <div>
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-gray-600">{eq.code}</p>
                      <p className="text-xs text-gray-500">
                        {eq.latitude.toFixed(4)}, {eq.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(eq.status)}
                      <span className="text-sm capitalize">{eq.status.replace('_', ' ')}</span>
                    </div>
                    {eq.assignedTo && (
                      <p className="text-xs text-gray-500">Assigned: {eq.assignedTo}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Hours: {eq.operatingHours.toLocaleString()}
                    </p>
                    {eq.nextMaintenance && (
                      <div className="flex items-center gap-1 mt-1">
                        {isMaintenanceOverdue(eq.nextMaintenance) ? (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        ) : (
                          <Clock className="w-3 h-3 text-yellow-500" />
                        )}
                        <span className={`text-xs ${
                          isMaintenanceOverdue(eq.nextMaintenance) ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                          {isMaintenanceOverdue(eq.nextMaintenance) 
                            ? 'Maintenance Overdue' 
                            : `Maintenance: ${eq.nextMaintenance.toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Alerts */}
          {realtimeData?.alerts && realtimeData.alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Real-time Alerts</h3>
              {realtimeData.alerts.slice(0, 3).map((alert) => (
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
                // Refresh equipment locations
                console.log('Refreshing equipment locations...');
              }}
            >
              Refresh Locations
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Send test GPS update
                emitEvent('gps-update', {
                  equipmentId: '1',
                  latitude: -6.2088 + (Math.random() - 0.5) * 0.01,
                  longitude: 106.8456 + (Math.random() - 0.5) * 0.01,
                  timestamp: new Date()
                });
              }}
            >
              Test GPS Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
