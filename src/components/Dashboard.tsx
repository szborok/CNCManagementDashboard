import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Grid3X3, 
  Plus, 
  Play, 
  Lock, 
  User, 
  Clock,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { User as UserType } from '../App';

interface DashboardProps {
  user: UserType;
}

// Mock data
const summaryData = {
  totalPlates: 156,
  newPlates: 12,
  inUse: 8,
  locked: 5,
  myActivePlates: 3
};

const recentActivity = [
  {
    id: '1',
    plateId: 'P001',
    workName: 'W5222NS01_233',
    action: 'Started work',
    user: 'John Smith',
    date: new Date('2025-01-27T14:30:00'),
    status: 'in-use' as const
  },
  {
    id: '2',
    plateId: 'P045',
    workName: 'W5221NS01_445',
    action: 'Completed work',
    user: 'Sarah Johnson',
    date: new Date('2025-01-27T13:15:00'),
    status: 'free' as const
  },
  {
    id: '3',
    plateId: 'P023',
    workName: 'W5220NS01_881',
    action: 'Uploaded new X_T file',
    user: 'Mike Wilson',
    date: new Date('2025-01-27T11:45:00'),
    status: 'new' as const
  },
  {
    id: '4',
    plateId: 'P078',
    workName: 'W5219NS01_332',
    action: 'Plate locked',
    user: 'Admin',
    date: new Date('2025-01-27T09:20:00'),
    status: 'locked' as const
  }
];

const ongoingWork = [
  {
    id: '1',
    plateId: 'P001',
    plateName: 'Standard Clamp A1',
    workName: 'W5222NS01_233',
    startedAt: new Date('2025-01-27T14:30:00'),
    shelf: 'A-12'
  },
  {
    id: '2',
    plateId: 'P089',
    plateName: 'Heavy Duty B3',
    workName: 'W5221NS01_997',
    startedAt: new Date('2025-01-26T16:45:00'),
    shelf: 'B-05'
  },
  {
    id: '3',
    plateId: 'P134',
    plateName: 'Precision C2',
    workName: 'W5220NS01_554',
    startedAt: new Date('2025-01-26T10:15:00'),
    shelf: 'C-08'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">New</Badge>;
    case 'in-use':
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">In Use</Badge>;
    case 'free':
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Free</Badge>;
    case 'locked':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Locked</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your clamping plates today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Plates</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.totalPlates}</div>
            <p className="text-xs text-muted-foreground">
              All plates in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">New Plates</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.newPlates}</div>
            <p className="text-xs text-muted-foreground">
              Ready for first use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">In Use</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.inUse}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Locked Plates</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.locked}</div>
            <p className="text-xs text-muted-foreground">
              Restricted access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">My Active Plates</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{summaryData.myActivePlates}</div>
            <p className="text-xs text-muted-foreground">
              Your current work
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes across all plates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm">
                        <span className="font-mono">{activity.plateId}</span>
                        <span className="text-muted-foreground"> - {activity.action}</span>
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.workName} by {activity.user}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{activity.date.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ongoing Work */}
        <Card>
          <CardHeader>
            <CardTitle>Your Ongoing Work</CardTitle>
            <CardDescription>
              Plates you're currently working on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ongoingWork.map((work) => (
                <div key={work.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-sm">{work.plateId}</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {work.plateName}
                      </p>
                      <p className="text-sm">
                        Work: <span className="font-mono">{work.workName}</span>
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Started {work.startedAt.toLocaleString()}</span>
                        </div>
                        <span>Shelf: {work.shelf}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {ongoingWork.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No ongoing work</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}