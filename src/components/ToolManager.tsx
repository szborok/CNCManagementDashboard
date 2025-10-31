import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Activity, AlertCircle, Plus } from 'lucide-react';

interface Tool {
  id: string;
  toolCode: string;
  toolName: string;
  diameter: number;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  usageTime: number;
  maxUsageTime: number;
  lastUsed?: Date;
}

interface ToolManagerProps {
  currentUser: any;
}

const ToolManager: React.FC<ToolManagerProps> = ({ currentUser }) => {
  // Mock data - this will be replaced with API calls
  const mockTools: Tool[] = [
    {
      id: '1',
      toolCode: 'ECUT_001',
      toolName: 'End Mill 10mm',
      diameter: 10,
      type: 'ECUT',
      status: 'active',
      location: 'Rack A1',
      usageTime: 45,
      maxUsageTime: 120,
      lastUsed: new Date('2024-10-29T08:30:00')
    },
    {
      id: '2',
      toolCode: 'MFC_005',
      toolName: 'Face Mill 25mm',
      diameter: 25,
      type: 'MFC',
      status: 'active',
      location: 'Rack B2',
      usageTime: 89,
      maxUsageTime: 100,
      lastUsed: new Date('2024-10-29T07:15:00')
    },
    {
      id: '3',
      toolCode: 'XF_012',
      toolName: 'Drill 8mm',
      diameter: 8,
      type: 'XF',
      status: 'maintenance',
      location: 'Maintenance Bay',
      usageTime: 95,
      maxUsageTime: 90,
      lastUsed: new Date('2024-10-28T16:45:00')
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      maintenance: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getUsagePercentage = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const activeTools = mockTools.filter(tool => tool.status === 'active').length;
  const maintenanceTools = mockTools.filter(tool => tool.status === 'maintenance').length;
  const criticalTools = mockTools.filter(tool => getUsagePercentage(tool.usageTime, tool.maxUsageTime) >= 90).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tool Manager</h1>
          <p className="text-muted-foreground">
            Manage CNC tools, track usage, and monitor tool health
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTools.length}</div>
            <p className="text-xs text-muted-foreground">
              In inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTools}</div>
            <p className="text-xs text-muted-foreground">
              Ready for use
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{maintenanceTools}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Usage</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{criticalTools}</div>
            <p className="text-xs text-muted-foreground">
              >90% usage
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tool Inventory</CardTitle>
          <CardDescription>
            Current tool status and usage information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTools.map((tool) => {
              const usagePercentage = getUsagePercentage(tool.usageTime, tool.maxUsageTime);
              return (
                <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{tool.toolCode} - {tool.toolName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tool.type} • Ø{tool.diameter}mm • {tool.location}
                      </p>
                      {tool.lastUsed && (
                        <p className="text-xs text-muted-foreground">
                          Last used: {tool.lastUsed.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className={getUsageColor(usagePercentage)}>
                        {tool.usageTime}h / {tool.maxUsageTime}h
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {usagePercentage}% usage
                      </div>
                    </div>
                    {getStatusBadge(tool.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolManager;