// src/components/AssetLifecycleDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

  // Mock data for Oracle JDE-inspired asset management
  const mockStats: AssetLifecycleStats = {
    totalAssets: 156,
    activeAssets: 142,
    underMaintenance: 14,
    retiredAssets: 8,
    totalValue: 25000000, // $25M
    depreciationValue: 8750000, // $8.75M
    netBookValue: 16250000, // $16.25M
    averageAge: 4.2,
    replacementNeeded: 12
  };

  const mockAnalytics: AssetAnalytics = {
    predictiveMaintenance: {
      highRiskAssets: 8,
      mediumRiskAssets: 15,
      lowRiskAssets: 119,
      totalSavings: 1250000 // $1.25M
    },
    performanceMetrics: {
      averageUptime: 94.5,
      averageEfficiency: 87.2,
      averageUtilization: 82.1,
      averageROI: 156.8
    },
    financialMetrics: {
      totalCostOfOwnership: 3125000, // $3.125M
      maintenanceCosts: 875000, // $875K
      depreciationExpense: 2187500, // $2.1875M
      assetROI: 156.8
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setStats(mockStats);
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error loading asset lifecycle data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void loadData();
  }, []);

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
