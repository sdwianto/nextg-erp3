import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  BarChart3,
  Wrench,
  Shield,
  Gauge,
  Bell
} from 'lucide-react';

interface MaintenanceSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceScheduler: React.FC<MaintenanceSchedulerProps> = ({ isOpen, onClose }) => {
  const [scheduleData, setScheduleData] = useState({
    equipment: '',
    maintenanceType: '',
    frequency: '',
    startDate: '',
    assignedTechnician: '',
    estimatedDuration: ''
  });

  const [conditionData, setConditionData] = useState({
    equipment: '',
    sensorThreshold: '',
    monitoringInterval: '',
    alertLevel: ''
  });

  // Empty equipment conditions - ready for real data
  const equipmentConditions: Record<string, unknown>[] = [];

  const handleScheduleInputChange = (field: string, value: string) => {
    setScheduleData(prev => ({ ...prev, [field]: value }));
  };

  const handleConditionInputChange = (field: string, value: string) => {
    setConditionData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleSubmit = () => {
    // eslint-disable-next-line no-alert
    alert('Maintenance scheduled successfully!');
    onClose();
  };

  const handleConditionSubmit = () => {
    // eslint-disable-next-line no-alert
    alert('Condition-based monitoring configured successfully!');
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 80) return 'text-green-600 dark:text-green-400';
    if (condition >= 60) return 'text-blue-600 dark:text-blue-400';
    if (condition >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Maintenance Scheduler - PM & Condition-based Monitoring
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                PM Scheduling
              </TabsTrigger>
              <TabsTrigger value="condition" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Condition Monitoring
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Equipment Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PM Scheduling Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      Preventive Maintenance Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Equipment</Label>
                        <Select value={scheduleData.equipment} onValueChange={(value) => handleScheduleInputChange('equipment', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-equipment">No equipment available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Maintenance Type</Label>
                        <Select value={scheduleData.maintenanceType} onValueChange={(value) => handleScheduleInputChange('maintenanceType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                            <SelectItem value="predictive">Predictive Maintenance</SelectItem>
                            <SelectItem value="condition-based">Condition-based</SelectItem>
                            <SelectItem value="inspection">Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Frequency</Label>
                        <Select value={scheduleData.frequency} onValueChange={(value) => handleScheduleInputChange('frequency', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={scheduleData.startDate}
                          onChange={(e) => handleScheduleInputChange('startDate', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Assigned Technician</Label>
                        <Select value={scheduleData.assignedTechnician} onValueChange={(value) => handleScheduleInputChange('assignedTechnician', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select technician" />
                          </SelectTrigger>
                          <SelectContent>
                                                    <SelectItem value="no-technicians">No technicians available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Estimated Duration (hours)</Label>
                        <Input
                          type="number"
                          value={scheduleData.estimatedDuration}
                          onChange={(e) => handleScheduleInputChange('estimatedDuration', e.target.value)}
                          placeholder="Enter duration"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PM Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      PM Guidelines & Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Preventive Maintenance</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Regular maintenance to prevent equipment failure</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <Activity className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">Predictive Maintenance</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">Data-driven maintenance based on condition monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <Gauge className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">Condition-based</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">Maintenance triggered by sensor data thresholds</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleScheduleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="condition" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Condition Monitoring Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Condition-based Monitoring Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Equipment</Label>
                        <Select value={conditionData.equipment} onValueChange={(value) => handleConditionInputChange('equipment', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-equipment">No equipment available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Sensor Threshold (%)</Label>
                        <Input
                          type="number"
                          value={conditionData.sensorThreshold}
                          onChange={(e) => handleConditionInputChange('sensorThreshold', e.target.value)}
                          placeholder="Enter threshold"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Monitoring Interval</Label>
                        <Select value={conditionData.monitoringInterval} onValueChange={(value) => handleConditionInputChange('monitoringInterval', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5min">5 minutes</SelectItem>
                            <SelectItem value="15min">15 minutes</SelectItem>
                            <SelectItem value="1hour">1 hour</SelectItem>
                            <SelectItem value="4hours">4 hours</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Alert Level</Label>
                        <Select value={conditionData.alertLevel} onValueChange={(value) => handleConditionInputChange('alertLevel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select alert level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monitoring Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Monitoring Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">Normal Operation</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">Equipment operating within normal parameters</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-1">Warning Level</h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">Monitor closely, schedule maintenance soon</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">Critical Level</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">Immediate attention required</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleConditionSubmit} className="bg-green-600 hover:bg-green-700">
                  <Activity className="h-4 w-4 mr-2" />
                  Configure Monitoring
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              {/* Equipment Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Equipment</p>
                        <p className="text-2xl font-bold">{equipmentConditions.length}</p>
                      </div>
                      <Wrench className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Critical Alerts</p>
                        <p className="text-2xl font-bold text-red-600">{equipmentConditions.filter(e => (e.alerts as number) > 0).length}</p>
                      </div>
                      <Bell className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Avg Condition</p>
                        <p className="text-2xl font-bold">
                          {Math.round(equipmentConditions.reduce((acc, e) => acc + (e.condition as number), 0) / equipmentConditions.length)}%
                        </p>
                      </div>
                      <Gauge className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Next Maintenance</p>
                                                 <p className="text-2xl font-bold">0</p>
                      </div>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Equipment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentConditions.map((equipment) => {
                  const eq = equipment as Record<string, unknown>;
                  return (
                    <Card key={eq.id as string} className="hover:shadow-lg transition-shadow border-l-4" style={{
                      borderLeftColor: (eq.status as string) === 'critical' ? '#ef4444' : 
                                      (eq.status as string) === 'warning' ? '#f59e0b' : 
                                      (eq.status as string) === 'good' ? '#3b82f6' : '#10b981'
                    }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-sm font-semibold">{eq.name as string}</CardTitle>
                          <Badge className={`${getStatusColor(eq.status as string)} text-xs`}>
                            {eq.status as string}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{eq.type as string} • {eq.location as string}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Condition</span>
                            <span className={`font-semibold ${getConditionColor(eq.condition as number)}`}>
                              {eq.condition as number}%
                            </span>
                          </div>
                          <Progress value={eq.condition as number} className="h-2" />
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Last Maintenance:</span>
                            <span className="font-medium">{eq.lastMaintenance as string}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next Maintenance:</span>
                            <span className="font-medium">{eq.nextMaintenance as string}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Alerts:</span>
                            <span className={`font-semibold ${(eq.alerts as number) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                              {eq.alerts as number}
                            </span>
                          </div>
                        </div>

                                             <div className="flex space-x-2 pt-2">
                         <Button size="sm" variant="outline" className="flex-1 text-xs">
                           <Wrench className="h-3 w-3 mr-1" />
                           Schedule
                         </Button>
                         <Button size="sm" variant="outline" className="flex-1 text-xs">
                           <Activity className="h-3 w-3 mr-1" />
                           Monitor
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 );
               })}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onClose}>Close</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
