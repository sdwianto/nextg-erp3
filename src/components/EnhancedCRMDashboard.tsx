import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  DollarSign,
  Calendar,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Star,
  Target,
  Activity,
  BarChart3,
  UserPlus,
  PhoneCall,
  Mail as MailIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Download,
  RefreshCw
} from 'lucide-react';

const EnhancedCRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data for CRM Dashboard
  const crmOverview = {
    totalCustomers: 1247,
    activeCustomers: 892,
    newCustomers: 45,
    totalRevenue: 2847500,
    avgDealSize: 3200,
    conversionRate: 23.5,
    customerSatisfaction: 4.6,
    responseTime: 2.3
  };

  const pipeline = [
    { stage: 'Lead', count: 156, value: 468000, conversion: 15 },
    { stage: 'Qualified', count: 89, value: 356000, conversion: 35 },
    { stage: 'Proposal', count: 67, value: 268000, conversion: 55 },
    { stage: 'Negotiation', count: 34, value: 136000, conversion: 75 },
    { stage: 'Closed Won', count: 23, value: 92000, conversion: 100 },
    { stage: 'Closed Lost', count: 12, value: 48000, conversion: 0 }
  ];

  const customers = [
    { id: 1, name: 'PT Maju Bersama', type: 'Enterprise', status: 'active', value: 125000, lastContact: '2 days ago', source: 'Website', rating: 5 },
    { id: 2, name: 'CV Sukses Mandiri', type: 'SMB', status: 'active', value: 45000, lastContact: '1 week ago', source: 'Referral', rating: 4 },
    { id: 3, name: 'UD Makmur Jaya', type: 'SMB', status: 'inactive', value: 15000, lastContact: '3 weeks ago', source: 'Cold Call', rating: 3 },
    { id: 4, name: 'PT Global Solutions', type: 'Enterprise', status: 'active', value: 89000, lastContact: '5 days ago', source: 'Trade Show', rating: 5 },
    { id: 5, name: 'CV Berkah Abadi', type: 'SMB', status: 'prospect', value: 25000, lastContact: '1 day ago', source: 'Website', rating: 4 }
  ];

  const activities = [
    { id: 1, type: 'call', customer: 'PT Maju Bersama', description: 'Follow-up call for proposal', date: '2 hours ago', status: 'completed', duration: '15 min' },
    { id: 2, type: 'meeting', customer: 'CV Sukses Mandiri', description: 'Product demonstration', date: '1 day ago', status: 'scheduled', duration: '1 hour' },
    { id: 3, type: 'email', customer: 'UD Makmur Jaya', description: 'Quote sent', date: '3 days ago', status: 'completed', duration: '5 min' },
    { id: 4, type: 'call', customer: 'PT Global Solutions', description: 'Contract discussion', date: '1 week ago', status: 'completed', duration: '30 min' },
    { id: 5, type: 'meeting', customer: 'CV Berkah Abadi', description: 'Initial consultation', date: '2 days ago', status: 'scheduled', duration: '45 min' }
  ];

  const trends = [
    { id: 1, metric: 'New Leads', current: 45, previous: 38, change: 18.4, unit: '' },
    { id: 2, metric: 'Conversion Rate', current: 23.5, previous: 21.2, change: 10.8, unit: '%' },
    { id: 3, metric: 'Avg Deal Size', current: 3200, previous: 2950, change: 8.5, unit: 'USD' },
    { id: 4, metric: 'Customer Satisfaction', current: 4.6, previous: 4.4, change: 4.5, unit: '/5' }
  ];

  const kpis = [
    { id: 1, name: 'Lead Response Time', value: 2.3, target: 2.0, unit: 'hours', trend: 'down' },
    { id: 2, name: 'Customer Acquisition Cost', value: 450, target: 400, unit: 'USD', trend: 'up' },
    { id: 3, name: 'Customer Lifetime Value', value: 8500, target: 9000, unit: 'USD', trend: 'up' },
    { id: 4, name: 'Sales Cycle Length', value: 28, target: 25, unit: 'days', trend: 'down' },
    { id: 5, name: 'Win Rate', value: 68, target: 70, unit: '%', trend: 'up' },
    { id: 6, name: 'Customer Retention Rate', value: 92, target: 95, unit: '%', trend: 'up' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'High-value lead not contacted for 3 days', customer: 'PT Maju Bersama', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New customer signed up', customer: 'CV Berkah Abadi', time: '1 day ago' },
    { id: 3, type: 'error', message: 'Follow-up overdue', customer: 'UD Makmur Jaya', time: '3 days ago' },
    { id: 4, type: 'success', message: 'Deal closed successfully', customer: 'PT Global Solutions', time: '1 week ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'email': return <MailIcon className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'prospect': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
             case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-600">Manage customer relationships and sales pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmOverview.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{crmOverview.newCustomers} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(crmOverview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg deal: {formatCurrency(crmOverview.avgDealSize)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmOverview.conversionRate}%</div>
            <Progress value={crmOverview.conversionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Lead to customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crmOverview.customerSatisfaction}/5</div>
                         <div className="flex items-center mt-1">
               {Array.from({ length: 5 }, (_, i) => (
                 <Star key={i} className={`h-3 w-3 ${i < Math.floor(crmOverview.customerSatisfaction) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
               ))}
             </div>
            <p className="text-xs text-muted-foreground mt-1">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Pipeline Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Sales Pipeline Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pipeline.slice(0, 4).map((stage, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium">{stage.stage}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{stage.count} deals</span>
                      <span className="text-sm font-medium">{formatCurrency(stage.value)}</span>
                      <Progress value={stage.conversion} className="w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.customer}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.date}</span>
                        <Badge variant="outline" className="text-xs">{activity.duration}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trends.map((trend) => (
                  <div key={trend.id} className="text-center">
                    <div className="text-2xl font-bold">{trend.current}{trend.unit}</div>
                    <div className="flex items-center justify-center mt-1">
                      {trend.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${trend.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(trend.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{trend.metric}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipeline.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <div>
                        <h3 className="font-medium">{stage.stage}</h3>
                        <p className="text-sm text-gray-600">{stage.count} deals</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Value</div>
                        <div className="text-lg font-bold">{formatCurrency(stage.value)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Conversion</div>
                        <div className="text-lg font-bold">{stage.conversion}%</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Search customers..." className="max-w-sm" />
            </div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(customer.status)}`} />
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{customer.type}</Badge>
                          <Badge variant="outline" className="text-xs">{customer.source}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Value</div>
                        <div className="text-lg font-bold">{formatCurrency(customer.value)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Rating</div>
                                                 <div className="flex items-center">
                           {Array.from({ length: 5 }, (_, i) => (
                             <Star key={i} className={`h-3 w-3 ${i < customer.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                           ))}
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.customer}</h3>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">{activity.date}</span>
                        <Badge variant="outline" className="text-xs">{activity.duration}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{kpi.name}</h3>
                      <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'}>
                        {kpi.trend === 'up' ? 'Improving' : 'Declining'}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{kpi.value}{kpi.unit}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target: {kpi.target}{kpi.unit}</span>
                      <Progress value={(kpi.value / kpi.target) * 100} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                CRM Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{alert.customer}</Badge>
                        <span className="text-xs text-gray-600">{alert.time}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCRMDashboard;
