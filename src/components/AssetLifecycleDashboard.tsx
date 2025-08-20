// src/components/AssetLifecycleDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { api } from '@/utils/api';
import { 
  Building2, 
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface AssetLifecycleStats {
  totalAssets: number;
  activeAssets: number;
  underMaintenance: number;
  retiredAssets: number;
  totalValue: number;
  depreciationValue: number;
  netBookValue: number;
  averageAge: number;
  replacementNeeded: number;
}

interface AssetAnalytics {
  predictiveMaintenance: {
    highRiskAssets: number;
    mediumRiskAssets: number;
    lowRiskAssets: number;
    totalSavings: number;
  };
  performanceMetrics: {
    averageUptime: number;
    averageEfficiency: number;
    averageUtilization: number;
    averageROI: number;
  };
  financialMetrics: {
    totalCostOfOwnership: number;
    maintenanceCosts: number;
    depreciationExpense: number;
    assetROI: number;
  };
}

export const AssetLifecycleDashboard: React.FC = () => {
  const [stats, setStats] = useState<AssetLifecycleStats | null>(null);
  const [analytics, setAnalytics] = useState<AssetAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Use tRPC query for asset lifecycle data
  const { data: assetData, isLoading: assetLoading } = api.rentalMaintenance.getDashboardData.useQuery();

  useEffect(() => {
    if (assetData?.summary) {
      // Transform API data to match our interface
      const apiStats: AssetLifecycleStats = {
        totalAssets: assetData.summary.totalEquipment,
        activeAssets: assetData.summary.availableEquipment + assetData.summary.inUseEquipment,
        underMaintenance: assetData.summary.maintenanceEquipment,
        retiredAssets: 0, // TODO: Add retired assets to API
        totalValue: 0, // TODO: Calculate from equipment purchase prices
        depreciationValue: 0, // TODO: Calculate depreciation
        netBookValue: 0, // TODO: Calculate net book value
        averageAge: 0, // TODO: Calculate from equipment purchase dates
        replacementNeeded: assetData.summary.pendingMaintenanceRecords
      };

      const apiAnalytics: AssetAnalytics = {
        predictiveMaintenance: {
          highRiskAssets: assetData.summary.pendingMaintenanceRecords,
          mediumRiskAssets: Math.floor(assetData.summary.totalEquipment * 0.1),
          lowRiskAssets: assetData.summary.availableEquipment,
          totalSavings: 0, // TODO: Calculate from maintenance costs
        },
        performanceMetrics: {
          averageUptime: 0, // TODO: Calculate from equipment logs
          averageEfficiency: 0, // TODO: Calculate from performance data
          averageUtilization: assetData.summary.totalEquipment > 0 ? 
            Math.round((assetData.summary.inUseEquipment / assetData.summary.totalEquipment) * 100) : 0,
          averageROI: 0 // TODO: Calculate ROI
        },
        financialMetrics: {
          totalCostOfOwnership: 0, // TODO: Calculate TCO
          maintenanceCosts: 0, // TODO: Calculate from maintenance records
          depreciationExpense: 0, // TODO: Calculate depreciation
          assetROI: 0 // TODO: Calculate ROI
        }
      };

      setStats(apiStats);
      setAnalytics(apiAnalytics);
      setLoading(false);
    }
  }, [assetData]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Asset Lifecycle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssets.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.activeAssets} active, {stats?.underMaintenance} under maintenance
            </div>
            <Progress 
              value={stats ? ((stats.activeAssets + stats.underMaintenance) / stats.totalAssets) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Net Book Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Book Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.netBookValue ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ${(stats?.totalValue ?? 0).toLocaleString()} total value
            </div>
            <div className="text-xs text-muted-foreground">
              ${(stats?.depreciationValue ?? 0).toLocaleString()} accumulated depreciation
            </div>
          </CardContent>
        </Card>

        {/* Asset Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.performanceMetrics.averageUptime}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Average uptime
            </div>
            <div className="text-xs text-muted-foreground">
              {analytics?.performanceMetrics.averageEfficiency}% efficiency
            </div>
          </CardContent>
        </Card>

        {/* Predictive Maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictive Savings</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(analytics?.predictiveMaintenance.totalSavings ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Potential savings
            </div>
            <div className="text-xs text-muted-foreground">
              {analytics?.predictiveMaintenance.highRiskAssets} high-risk assets
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Lifecycle Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Asset Lifecycle Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats?.activeAssets}</div>
              <div className="text-sm font-medium">Active</div>
              <div className="text-xs text-muted-foreground">In operation</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats?.underMaintenance}</div>
              <div className="text-sm font-medium">Maintenance</div>
              <div className="text-xs text-muted-foreground">Under service</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats?.replacementNeeded}</div>
              <div className="text-sm font-medium">Replacement</div>
              <div className="text-xs text-muted-foreground">Due for replacement</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats?.retiredAssets}</div>
              <div className="text-sm font-medium">Retired</div>
              <div className="text-xs text-muted-foreground">Disposed/retired</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Cost of Ownership</span>
                <span className="text-sm font-bold">
                  ${(analytics?.financialMetrics.totalCostOfOwnership ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Maintenance Costs</span>
                <span className="text-sm font-bold">
                  ${(analytics?.financialMetrics.maintenanceCosts ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Depreciation Expense</span>
                <span className="text-sm font-bold">
                  ${(analytics?.financialMetrics.depreciationExpense ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Asset ROI</span>
                <span className="text-sm font-bold text-green-600">
                  {analytics?.financialMetrics.assetROI}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Building2 className="h-5 w-5" />
                <span className="text-sm">Add Asset</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Schedule Maintenance</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Asset Analytics</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Target className="h-5 w-5" />
                <span className="text-sm">Optimize Lifecycle</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
