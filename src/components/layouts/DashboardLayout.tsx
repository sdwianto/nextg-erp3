import { 
  BarChart3, 
  Package, 
  Users, 
  Building2, 
  DollarSign, 
  Settings,
  Truck,
  Activity,
  TrendingUp,
  PieChart,
  Shield,
  Database,
  Cloud,
  Wrench,
  ShoppingCart
} from "lucide-react";
import React, { type ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/router";
import { ThemeToggle } from "../ThemeToggle";


// Dashboard header component
interface DashboardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DashboardHeader = ({
  children,
  className = "",
}: DashboardHeaderProps) => {
  return <header className={`mb-6 space-y-2 ${className}`}>{children}</header>;
};

// Dashboard title component
interface DashboardTitleProps {
  children: ReactNode;
  className?: string;
}

export const DashboardTitle = ({
  children,
  className = "",
}: DashboardTitleProps) => {
  return (
    <h1 className={`text-2xl font-bold tracking-tight ${className}`}>
      {children}
    </h1>
  );
};

// Dashboard description component
interface DashboardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const DashboardDescription = ({
  children,
  className = "",
}: DashboardDescriptionProps) => {
  return <p className={`text-muted-foreground ${className}`}>{children}</p>;
};

// Main dashboard layout component
interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();


  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold">NextGen ERP</h2>
            <p className="text-xs text-muted-foreground">Enterprise Resource Planning</p>
          </SidebarHeader>
          <SidebarContent className="px-4">
            
            {/* Main Dashboard */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={isActive("/dashboard")}
                  onClick={() => router.push('/dashboard')}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-2" />

            {/* Operations */}
            <SidebarMenu>


              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Inventory Management"
                  isActive={isActive("/inventory")}
                  onClick={() => router.push('/inventory')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Inventory
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Procurement Management"
                  isActive={isActive("/procurement")}
                  onClick={() => router.push('/procurement')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Procurement
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Asset Management"
                  isActive={isActive("/asset")}
                  onClick={() => router.push('/asset')}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Asset Management
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Operations Management"
                  isActive={isActive("/operations")}
                  onClick={() => router.push('/operations')}
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Operations
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Rental & Maintenance"
                  isActive={isActive("/rental")}
                  onClick={() => router.push('/rental')}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Rental & Maintenance
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-2" />

            {/* Business Management */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Finance & Accounting"
                  isActive={isActive("/finance")}
                  onClick={() => router.push('/finance')}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Finance
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Human Resources"
                  isActive={isActive("/hrms")}
                  onClick={() => router.push('/hrms')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  HRMS
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Customer Management"
                  isActive={isActive("/crm")}
                  onClick={() => router.push('/crm')}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  CRM
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-2" />

            {/* Analytics & Reports */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Reports & Analytics"
                  isActive={isActive("/reports")}
                  onClick={() => router.push('/reports')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reports
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Business Intelligence"
                  isActive={isActive("/bi")}
                  onClick={() => router.push('/bi')}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Business Intelligence
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Data Analytics"
                  isActive={isActive("/analytics")}
                  onClick={() => router.push('/analytics')}
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Analytics
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-2" />

            {/* System */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="User Management"
                  isActive={isActive("/users")}
                  onClick={() => router.push('/users')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Users & Roles
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="System Settings"
                  isActive={isActive("/settings")}
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Data Management"
                  isActive={isActive("/data")}
                  onClick={() => router.push('/data')}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Data Management
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Offline Sync"
                  isActive={isActive("/sync")}
                  onClick={() => router.push('/sync')}
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  Offline Sync
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <p className="text-muted-foreground text-xs">NextGen ERP v1.1</p>
            <p className="text-muted-foreground text-xs">Papua New Guinea</p>
            <div className="flex items-center gap-2 mt-2">
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="relative flex-1 overflow-auto p-6">
          <div className="md:hidden mb-4">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
