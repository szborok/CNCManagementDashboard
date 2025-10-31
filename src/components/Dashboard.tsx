import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Grid3X3, 
  Clock,
  Calendar,
  ExternalLink,
  FileJson,
  Upload,
  Archive,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { User as UserType } from '../App';

interface DashboardProps {
  user: UserType;
}

// Mock data for all applications
const dashboardData = {
  // Plates Manager Data
  plates: {
    total: 156,
    new: 12,
    inUse: 8,
    locked: 5,
    myActive: 3
  },
  
  // JSON File Analyzer Data
  jsonAnalyzer: {
    totalProcessed: 89,
    autoResults: 67,
    manualResults: 22,
    pendingUpload: 5,
    recentAnalysis: [
      { id: 1, filename: 'W5270NS01001A.json', status: 'complete', timestamp: '2 hours ago', issues: 3 },
      { id: 2, filename: 'W5270NS01003B.json', status: 'pending', timestamp: '4 hours ago', issues: 0 },
      { id: 3, filename: 'W5270NS01060A.json', status: 'complete', timestamp: '6 hours ago', issues: 1 }
    ]
  },
  
  // Matrix Tools Manager Data
  matrixTools: {
    totalTools: 45,
    available: 32,
    inUse: 13,
    activeProjects: 8,
    recentActivity: [
      { id: 1, project: 'W5270NS01001', operation: 'Tool Assignment', status: 'active' },
      { id: 2, project: 'W5270NS01003', operation: 'Matrix Update', status: 'completed' },
      { id: 3, project: 'W5270NS01060', operation: 'Calibration', status: 'active' }
    ]
  }
};

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.username}!</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's what's happening with your clamping plates today.
        </p>
      </div>

      {/* Multi-Application Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Plates Manager Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Plates Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="font-bold">{dashboardData.plates.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">In Use</span>
              <span className="font-bold text-purple-600">{dashboardData.plates.inUse}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">My Active</span>
              <span className="font-bold text-blue-600">{dashboardData.plates.myActive}</span>
            </div>
          </CardContent>
        </Card>

        {/* JSON Analyzer Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              JSON File Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total Processed</span>
              <span className="font-bold">{dashboardData.jsonAnalyzer.totalProcessed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Auto Results</span>
              <span className="font-bold text-green-600">{dashboardData.jsonAnalyzer.autoResults}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Pending Upload</span>
              <span className="font-bold text-orange-600">{dashboardData.jsonAnalyzer.pendingUpload}</span>
            </div>
          </CardContent>
        </Card>

        {/* Matrix Tools Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Matrix Tools Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Total Tools</span>
              <span className="font-bold">{dashboardData.matrixTools.totalTools}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Available</span>
              <span className="font-bold text-green-600">{dashboardData.matrixTools.available}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active Projects</span>
              <span className="font-bold text-blue-600">{dashboardData.matrixTools.activeProjects}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* JSON File Analyzer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              JSON File Analyzer - Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.jsonAnalyzer.recentAnalysis.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{analysis.filename}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {analysis.timestamp}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={analysis.status === 'complete' ? 'default' : 'secondary'}>
                      {analysis.status === 'complete' ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Upload className="h-3 w-3 mr-1" />
                      )}
                      {analysis.status}
                    </Badge>
                    <span className="text-sm font-medium">{analysis.issues} issues</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Results
            </Button>
          </CardContent>
        </Card>

        {/* Matrix Tools Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Matrix Tools - Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.matrixTools.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.project}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {activity.operation}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>
                      {activity.status === 'active' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <Archive className="h-3 w-3 mr-1" />
                      )}
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Matrix Manager
            </Button>
          </CardContent>
        </Card>

        {/* System Status Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">JSON Analyzer Service</span>
                <Badge variant="default">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Running
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Matrix Tools Engine</span>
                <Badge variant="default">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge variant="default">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Today 03:00
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <ExternalLink className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Across All Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across all applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <FileJson className="h-4 w-4" />
                    <p className="text-sm">JSON Analysis Completed</p>
                    <Badge variant="secondary">JSON Analyzer</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    W5270NS01001A.json processed successfully
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <p className="text-sm">Matrix Tool Assignment</p>
                    <Badge variant="secondary">Matrix Tools</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Project W5270NS01001 tool setup completed
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>3 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Grid3X3 className="h-4 w-4" />
                    <p className="text-sm">Plate Status Update</p>
                    <Badge variant="secondary">Plates Manager</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    P001 - Moved to shelf C-08
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>4 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks across applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload JSON File for Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Create New Matrix Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Grid3X3 className="h-4 w-4 mr-2" />
                Check Plate Status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                View Tool Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}