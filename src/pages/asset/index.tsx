import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import EnhancedAssetIntegration from '@/components/EnhancedAssetIntegration';

export default function AssetPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <EnhancedAssetIntegration />
      </div>
    </DashboardLayout>
  );
}
