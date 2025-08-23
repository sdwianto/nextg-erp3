import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { api } from '@/utils/api';
import EnhancedHRMSDashboard from '@/components/EnhancedHRMSDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Calendar, Clock, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Search, FileText, Building2, Briefcase, X, Shield } from 'lucide-react';

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: {
    name: string;
    code: string;
  };
  employmentStatus: string;
  hireDate: string;
  baseSalary: number;
  allowances: number;
}

interface LeaveRequest {
  id: string;
  employee: {
    firstName: string;
    lastName: string;
    employeeNumber: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  reason: string;
}

interface FilterState {
  search: string;
  department: string;
  status: string;
  position: string;
  location: string;
}

const HRMSPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: 'all',
    status: 'all',
    position: 'all',
    location: 'all'
  });

  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [isViewEmployeeDialogOpen, setIsViewEmployeeDialogOpen] = useState(false);
  const [isViewLeaveDialogOpen, setIsViewLeaveDialogOpen] = useState(false);
  const [isNewLeaveDialogOpen, setIsNewLeaveDialogOpen] = useState(false);
  const [isLeaveApprovalDialogOpen, setIsLeaveApprovalDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  // tRPC API calls
  const { data: dashboardData, isLoading: dashboardLoading } = api.hrms.getDashboardData.useQuery();
  const { data: employeesData, isLoading: employeesLoading } = api.hrms.getEmployees.useQuery({
    page: 1,
    limit: 50,
    search: filters.search || undefined,
    departmentId: filters.department !== 'all' ? filters.department : undefined,
    status: filters.status !== 'all' ? filters.status as "ACTIVE" | "INACTIVE" | "TERMINATED" | "ON_LEAVE" : undefined,
  });
  const { data: leaveRequestsData, isLoading: leaveRequestsLoading } = api.hrms.getLeaveRequests.useQuery({
    page: 1,
    limit: 20,
  });

  // Derived data from API
  const _hrStats = useMemo(() => {
    if (!dashboardData?.data) {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        onLeave: 0,
        newHires: 0,
        attendance: 0,
        payroll: {
          monthly: 0,
          pending: 0,
          processed: 0
        }
      };
    }

    const stats = dashboardData.data;
    return {
      totalEmployees: stats.totalEmployees,
      activeEmployees: stats.activeEmployees,
      onLeave: stats.onLeaveEmployees,
      newHires: 0, // Not available in current API
      attendance: 0, // Default value
      payroll: {
        monthly: 0, // Not available in current API
        pending: 0,
        processed: 0
      }
    };
  }, [dashboardData]);

  const employees = useMemo(() => {
    return employeesData?.data || [];
  }, [employeesData]);

  const leaveRequests = useMemo(() => {
    return leaveRequestsData?.data || [];
  }, [leaveRequestsData]);

  // Loading states
  const isLoading = dashboardLoading || employeesLoading || leaveRequestsLoading;

  const [departments] = useState<Array<{id: string; name: string; count: number; manager: string}>>([]);

  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    salary: '',
    location: '',
    status: 'active'
  });

  const [editEmployee, setEditEmployee] = useState({
    employeeId: '',
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    salary: '',
    location: '',
    status: 'active'
  });

  // New leave request form state
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employeeId: '',
    employeeName: '',
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });



  const filteredEmployees = useMemo(() => {
    return employees.filter(item => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        item.firstName.toLowerCase().includes(searchLower) ||
        item.lastName.toLowerCase().includes(searchLower) ||
        item.employeeNumber.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.position.toLowerCase().includes(searchLower) ||
        item.department.name.toLowerCase().includes(searchLower);

      const matchesDepartment = !filters.department || filters.department === 'all' || item.department.name === filters.department;
      const matchesStatus = !filters.status || filters.status === 'all' || item.employmentStatus === filters.status;
      const matchesPosition = !filters.position || filters.position === 'all' || item.position === filters.position;
      const matchesLocation = !filters.location || filters.location === 'all' || item.department.name === filters.location;

      return matchesSearch && matchesDepartment && matchesStatus && matchesPosition && matchesLocation;
    });
  }, [employees, filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      department: 'all',
      status: 'all',
      position: 'all',
      location: 'all'
    });
  };

  const addNewEmployee = () => {
    // TODO: Implement API call to create employee
    // const employee: Employee = {
    //   id: 'emp-001', // Placeholder, will be generated by API
    //   employeeNumber: newEmployee.employeeId,
    //   firstName: newEmployee.name.split(' ')[0] || '',
    //   lastName: newEmployee.name.split(' ')[1] || '',
    //   email: newEmployee.email,
    //   phone: newEmployee.phone,
    //   position: newEmployee.position,
    //   department: { name: newEmployee.department, code: 'dep-001' }, // Placeholder
    //   employmentStatus: newEmployee.status,
    //   hireDate: new Date().toISOString().split('T')[0] || '',
    //   baseSalary: parseFloat(newEmployee.salary) || 0,
    //   allowances: 0 // Placeholder
    // };

    // setEmployees(prevEmployees => [...prevEmployees, employee]); // API call
    
    setNewEmployee({
      employeeId: '',
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      salary: '',
      location: '',
      status: 'active'
    });
    setIsAddEmployeeDialogOpen(false);
  };

  const _editEmployeeItem = () => {
    if (!selectedEmployee) return;

    // TODO: Implement API call to update employee
    // const updatedEmployee: Employee = {
    //   ...selectedEmployee,
    //   employeeNumber: editEmployee.employeeId,
    //   firstName: editEmployee.name.split(' ')[0] || '',
    //   lastName: editEmployee.name.split(' ')[1] || '',
    //   email: editEmployee.email,
    //   phone: editEmployee.phone,
    //   baseSalary: parseFloat(editEmployee.salary) || 0,
    //   department: { name: editEmployee.department, code: 'dep-001' }, // Placeholder
    //   employmentStatus: editEmployee.status
    // };

    // setEmployees(prevEmployees => 
    //   prevEmployees.map(item => item.id === selectedEmployee.id ? updatedEmployee : item) // API call
    // );
    
    setEditEmployee({
      employeeId: '',
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      salary: '',
      location: '',
      status: 'active'
    });
    setSelectedEmployee(null);
    setIsEditEmployeeDialogOpen(false);
  };

  const _handleEditEmployeeClick = () => {
    // TODO: Implement edit employee functionality
    setIsEditEmployeeDialogOpen(true);
  };

  const _handleViewEmployeeClick = () => {
    // TODO: Implement view employee functionality
    setIsViewEmployeeDialogOpen(true);
  };

  // Handle view leave details
  const _handleViewLeaveClick = () => {
    // TODO: Implement view leave functionality
    setIsViewLeaveDialogOpen(true);
  };

  // Add new leave request
  const addNewLeaveRequest = () => {
    // TODO: Implement API call to create leave request
    // const startDate = new Date(newLeaveRequest.startDate);
    // const endDate = new Date(newLeaveRequest.endDate);
    // const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    // const leaveRequest: LeaveRequest = {
    //   id: 'leave-001', // Placeholder, will be generated by API
    //   employee: {
    //     firstName: newLeaveRequest.employeeName.split(' ')[0] || '',
    //     lastName: newLeaveRequest.employeeName.split(' ')[1] || '',
    //     employeeNumber: newLeaveRequest.employeeId
    //   },
    //   leaveType: newLeaveRequest.type,
    //   startDate: newLeaveRequest.startDate,
    //   endDate: newLeaveRequest.endDate,
    //   totalDays: days,
    //   status: 'pending',
    //   reason: newLeaveRequest.reason
    // };

    // setLeaveRequests(prevRequests => [...prevRequests, leaveRequest]); // API call
    
                      setNewLeaveRequest({
                    employeeId: '',
                    employeeName: '',
                    type: '',
                    startDate: '',
                    endDate: '',
                    reason: ''
                  });
    setIsNewLeaveDialogOpen(false);
  };

  // Handle leave approval status change
  const _handleLeaveApproval = (leaveId: string, newStatus: string) => {
    // TODO: Implement API call to update leave request status
    // setLeaveRequests(prevRequests => 
    //   prevRequests.map(request => 
    //     request.id === leaveId 
    //       ? { ...request, status: newStatus }
    //       : request
    //   )
    // ); // API call
    // eslint-disable-next-line no-console
    // console.log('Updating leave request:', leaveId, 'to status:', newStatus);
    setIsLeaveApprovalDialogOpen(false);
    setSelectedLeave(null);
  };

  // Handle leave approval button click
  const _handleLeaveApprovalClick = () => {
    // TODO: Implement leave approval functionality
    setIsLeaveApprovalDialogOpen(true);
  };

  const _getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'on-leave':
        return <Badge variant="outline">On Leave</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const _getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isNewEmployeeFormValid = newEmployee.employeeId && newEmployee.name && newEmployee.position && 
    newEmployee.department && newEmployee.email && newEmployee.phone && newEmployee.salary && newEmployee.location;

  const _isEditEmployeeFormValid = editEmployee.employeeId && editEmployee.name && editEmployee.position && 
    editEmployee.department && editEmployee.email && editEmployee.phone && editEmployee.salary && editEmployee.location;

  // Check if new leave request form is valid
  const isNewLeaveRequestFormValid = newLeaveRequest.employeeId && newLeaveRequest.employeeName && 
    newLeaveRequest.type && newLeaveRequest.startDate && newLeaveRequest.endDate && newLeaveRequest.reason;

  const hasActiveFilters = filters.search || 
    (filters.department && filters.department !== 'all') || 
    (filters.status && filters.status !== 'all') || 
    (filters.position && filters.position !== 'all') || 
    (filters.location && filters.location !== 'all');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HRMS & Payroll</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage _employees, attendance, leave, and payroll</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        placeholder="e.g., EMP-001"
                        value={newEmployee.employeeId}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name *</Label>
                                             <Input
                         id="name"
                         placeholder="e.g., Employee Full Name"
                         value={newEmployee.name}
                         onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="position">Position *</Label>
                      <Input
                        id="position"
                        placeholder="e.g., Equipment Operator"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                      />
                    </div>
                                           <div className="grid gap-2">
                         <Label htmlFor="department">Department *</Label>
                         <Select 
                           value={newEmployee.department} 
                           onValueChange={(value) => setNewEmployee(prev => ({ ...prev, department: value }))}
                         >
                           <SelectTrigger>
                             <SelectValue placeholder="Select department" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="no-departments">No departments available</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g., john.smith@nextgen.com"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        placeholder="e.g., +675 1234 5678"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="salary">Salary *</Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder="e.g., 3500"
                        value={newEmployee.salary}
                        onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location *</Label>
                      <Select 
                        value={newEmployee.location} 
                        onValueChange={(value) => setNewEmployee(prev => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-locations">No locations available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setNewEmployee({
                        employeeId: '',
                        name: '',
                        position: '',
                        department: '',
                        email: '',
                        phone: '',
                        salary: '',
                        location: '',
                        status: 'active'
                      });
                      setIsAddEmployeeDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={addNewEmployee}
                    disabled={!isNewEmployeeFormValid}
                  >
                    Add Employee
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* HR Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_hrStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <UserPlus className="inline h-3 w-3 text-green-500" /> +{_hrStats.newHires} new hires this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_hrStats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <AlertTriangle className="inline h-3 w-3 text-yellow-500" /> {_hrStats.onLeave} on leave
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_hrStats.attendance}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" /> +2.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_formatCurrency(_hrStats.payroll.monthly)}</div>
              <p className="text-xs text-muted-foreground">
                <Clock className="inline h-3 w-3 text-yellow-500" /> {_formatCurrency(_hrStats.payroll.pending)} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="standard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Standard HRMS
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Enhanced HRMS
            </TabsTrigger>
          </TabsList>

          {/* Standard HRMS Tab */}
          <TabsContent value="standard" className="space-y-6">
            {/* Employee Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle>Employee Management</CardTitle>
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search _employees by name, ID, email, position, or department..." 
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-500">
                  {isLoading ? 'Loading...' : `Showing ${filteredEmployees.length} of ${employees.length} employees`}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Employee</th>
                        <th className="text-left p-3 font-medium">Position</th>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Salary</th>
                        <th className="text-left p-3 font-medium">Attendance</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <tr key={employee.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3">
                              <div>
                                <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
                                <div className="text-sm text-gray-500">{employee.employeeNumber}</div>
                                <div className="text-sm text-gray-500">{employee.email}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-gray-400" />
                                <span>{employee.position}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-gray-400" />
                                <span>{employee.department.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              {_getStatusBadge(employee.employmentStatus)}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span>{_formatCurrency(employee.baseSalary)}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`font-medium ${_getAttendanceColor(0)}`}>
                                {0}%
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => _handleViewEmployeeClick()}>View</Button>
                                <Button size="sm" variant="outline" onClick={() => _handleEditEmployeeClick()}>Edit</Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500">
                            No _employees found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Leave Management */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle>Leave Management</CardTitle>
                  <Button 
                    onClick={() => setIsNewLeaveDialogOpen(true)}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    New Leave Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">{`${request.employee.firstName} ${request.employee.lastName}`}</div>
                          <div className="text-sm text-gray-500">
                            {request.employee.employeeNumber} • {request.leaveType} • {request.totalDays} _days
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.startDate instanceof Date ? request.startDate.toLocaleDateString() : request.startDate} to {request.endDate instanceof Date ? request.endDate.toLocaleDateString() : request.endDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-medium">Reason</div>
                          <div className="text-sm text-gray-500">{request.reason}</div>
                        </div>
                        {_getStatusBadge(request.status)}
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => _handleViewLeaveClick()}>View Details</Button>
                           {request.status === 'PENDING' && (
                             <Button size="sm" className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700" onClick={() => _handleLeaveApprovalClick()}>
                              Leave Approval
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{dept.name}</h3>
                        <Badge variant="outline">{dept.count} _employees</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Manager: {dept.manager}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          View Team
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          Reports
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsAddEmployeeDialogOpen(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Employee
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Employee Directory
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Training Records
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Attendance & Leave
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Attendance Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Leave Requests
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Absence Alerts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Process Payroll
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Payroll Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Salary Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced HRMS Tab */}
          <TabsContent value="enhanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Enhanced HRMS - Mining Operations
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Advanced features for mining-specific safety management, equipment certification, and 24/7 shift operations
                </p>
              </CardHeader>
              <CardContent>
                <EnhancedHRMSDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editEmployeeId">Employee ID *</Label>
                  <Input
                    id="editEmployeeId"
                    placeholder="e.g., EMP-001"
                    value={editEmployee.employeeId}
                    onChange={(e) => setEditEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editName">Full Name *</Label>
                  <Input
                    id="editName"
                    placeholder="e.g., Employee Full Name"
                    value={editEmployee.name}
                    onChange={(e) => setEditEmployee(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editPosition">Position *</Label>
                  <Input
                    id="editPosition"
                    placeholder="e.g., Equipment Operator"
                    value={editEmployee.position}
                    onChange={(e) => setEditEmployee(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                                     <div className="grid gap-2">
                       <Label htmlFor="editDepartment">Department *</Label>
                       <Select 
                         value={editEmployee.department} 
                         onValueChange={(value) => setEditEmployee(prev => ({ ...prev, department: value }))}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Select department" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="no-departments">No departments available</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    placeholder="e.g., john.smith@nextgen.com"
                    value={editEmployee.email}
                    onChange={(e) => setEditEmployee(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPhone">Phone *</Label>
                  <Input
                    id="editPhone"
                    placeholder="e.g., +675 1234 5678"
                    value={editEmployee.phone}
                    onChange={(e) => setEditEmployee(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editSalary">Salary *</Label>
                  <Input
                    id="editSalary"
                    type="number"
                    placeholder="e.g., 3500"
                    value={editEmployee.salary}
                    onChange={(e) => setEditEmployee(prev => ({ ...prev, salary: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editLocation">Location *</Label>
                  <Select 
                    value={editEmployee.location} 
                    onValueChange={(value) => setEditEmployee(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-locations">No locations available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select 
                  value={editEmployee.status} 
                  onValueChange={(value) => setEditEmployee(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditEmployee({
                    employeeId: '',
                    name: '',
                    position: '',
                    department: '',
                    email: '',
                    phone: '',
                    salary: '',
                    location: '',
                    status: 'active'
                  });
                  setSelectedEmployee(null);
                  setIsEditEmployeeDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={_editEmployeeItem}
                disabled={!_isEditEmployeeFormValid}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Employee Dialog */}
        <Dialog open={isViewEmployeeDialogOpen} onOpenChange={setIsViewEmployeeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            {selectedEmployee ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Employee ID</Label>
                    <div className="font-medium">{selectedEmployee.employeeNumber}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <div className="font-medium">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Position</Label>
                    <div className="font-medium">{selectedEmployee.position}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Department</Label>
                    <div className="font-medium">{selectedEmployee.department.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <div className="font-medium">{selectedEmployee.email}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <div className="font-medium">{selectedEmployee.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Salary</Label>
                    <div className="font-medium">{_formatCurrency(selectedEmployee.baseSalary)}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <div className="font-medium">{selectedEmployee.department.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <div className="font-medium">{_getStatusBadge(selectedEmployee.employmentStatus)}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Hire Date</Label>
                    <div className="font-medium">{selectedEmployee.hireDate}</div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Attendance</Label>
                  <div className="font-medium">
                    <span className={`${_getAttendanceColor(0)}`}>
                      {0}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No employee selected for viewing.</div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsViewEmployeeDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Leave Details Dialog */}
        <Dialog open={isViewLeaveDialogOpen} onOpenChange={setIsViewLeaveDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
            </DialogHeader>
            {selectedLeave ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Employee Name</Label>
                    <div className="font-medium">{`${selectedLeave.employee.firstName} ${selectedLeave.employee.lastName}`}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Employee ID</Label>
                    <div className="font-medium">{selectedLeave.employee.employeeNumber}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Leave Type</Label>
                    <div className="font-medium">{selectedLeave.leaveType}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <div className="font-medium">{_getStatusBadge(selectedLeave.status)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <div className="font-medium">{selectedLeave.startDate}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <div className="font-medium">{selectedLeave.endDate}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Duration</Label>
                    <div className="font-medium">{selectedLeave.totalDays} days</div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Reason</Label>
                  <div className="font-medium">{selectedLeave.reason}</div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No leave request selected for viewing.</div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsViewLeaveDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Leave Request Dialog */}
        <Dialog open={isNewLeaveDialogOpen} onOpenChange={setIsNewLeaveDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Leave Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newLeaveEmployeeId">Employee ID *</Label>
                  <Input
                    id="newLeaveEmployeeId"
                    placeholder="e.g., EMP-001"
                    value={newLeaveRequest.employeeId}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, employeeId: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newLeaveEmployeeName">Full Name *</Label>
                  <Input
                    id="newLeaveEmployeeName"
                    placeholder="e.g., Employee Full Name"
                    value={newLeaveRequest.employeeName}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, employeeName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newLeaveType">Leave Type *</Label>
                  <Select 
                    value={newLeaveRequest.type} 
                    onValueChange={(value) => setNewLeaveRequest(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                      <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                      <SelectItem value="Bereavement Leave">Bereavement Leave</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newLeaveStartDate">Start Date *</Label>
                  <Input
                    id="newLeaveStartDate"
                    type="date"
                    value={newLeaveRequest.startDate}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newLeaveEndDate">End Date *</Label>
                  <Input
                    id="newLeaveEndDate"
                    type="date"
                    value={newLeaveRequest.endDate}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newLeaveReason">Reason *</Label>
                  <Input
                    id="newLeaveReason"
                    placeholder="Enter leave reason"
                    value={newLeaveRequest.reason}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewLeaveRequest({
                    employeeId: '',
                    employeeName: '',
                    type: '',
                    startDate: '',
                    endDate: '',
                    reason: ''
                  });
                  setIsNewLeaveDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={addNewLeaveRequest}
                disabled={!isNewLeaveRequestFormValid}
              >
                Submit Leave Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Leave Approval Dialog */}
        <Dialog open={isLeaveApprovalDialogOpen} onOpenChange={setIsLeaveApprovalDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Leave Approval</DialogTitle>
            </DialogHeader>
            {selectedLeave && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="font-medium">{`${selectedLeave.employee.firstName} ${selectedLeave.employee.lastName}`}</div>
                  <div className="text-sm text-gray-500">{selectedLeave.employee.employeeNumber}</div>
                  <div className="text-sm font-medium mt-2">{selectedLeave.leaveType}</div>
                  <div className="text-sm text-gray-500">
                    {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.totalDays} days)
                  </div>
                  <div className="text-sm mt-2">
                    <span className="font-medium">Reason:</span> {selectedLeave.reason}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium">Select Approval Status:</div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12 flex flex-col items-center justify-center gap-1"
                      onClick={() => _handleLeaveApproval(selectedLeave.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs">Approve</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 flex flex-col items-center justify-center gap-1"
                      onClick={() => _handleLeaveApproval(selectedLeave.id, 'declined')}
                    >
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-xs">Decline</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 flex flex-col items-center justify-center gap-1"
                      onClick={() => _handleLeaveApproval(selectedLeave.id, 'postponed')}
                    >
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs">Postpone</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsLeaveApprovalDialogOpen(false);
                  setSelectedLeave(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default HRMSPage;
