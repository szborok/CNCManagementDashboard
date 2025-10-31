import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { User as UserType, Plate } from '../App';
import PlateDetailModal from './PlateDetailModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlatesTableProps {
  user: UserType;
  filter?: 'new-health' | 'used-health' | 'locked-health' | 'free-occupancy' | 'in-use-occupancy' | 'ongoing-work' | 'history';
}

// Mock data
const mockPlates: Plate[] = [
  {
    id: 'P001',
    name: 'Standard Clamp A1',
    shelf: 'A-12',
    previewImage: 'https://images.unsplash.com/photo-1581092916314-4c7d08839806?w=100&h=100&fit=crop',
    xtFile: '/files/P001.x_t',
    health: 'used',
    occupancy: 'in-use',
    notes: 'Regular maintenance completed',
    lastWorkName: 'W5222NS01_233',
    lastModifiedBy: 'John Smith',
    lastModifiedDate: new Date('2025-01-27T14:30:00'),
    history: [
      {
        id: '1',
        action: 'Work started',
        user: 'John Smith',
        date: new Date('2025-01-27T14:30:00'),
        details: 'Started work W5222NS01_233'
      },
      {
        id: '2',
        action: 'File uploaded',
        user: 'John Smith',
        date: new Date('2025-01-27T14:00:00'),
        details: 'Uploaded new X_T file'
      }
    ]
  },
  {
    id: 'P002',
    name: 'Heavy Duty B3',
    shelf: 'B-05',
    previewImage: 'https://images.unsplash.com/photo-1581092804894-f7058d0d4723?w=100&h=100&fit=crop',
    xtFile: '/files/P002.x_t',
    health: 'new',
    occupancy: 'free',
    lastWorkName: '',
    lastModifiedBy: 'Admin',
    lastModifiedDate: new Date('2025-01-26T10:15:00'),
    history: [
      {
        id: '1',
        action: 'Plate created',
        user: 'Admin',
        date: new Date('2025-01-26T10:15:00'),
        details: 'New plate added to system'
      }
    ]
  },
  {
    id: 'P003',
    name: 'Precision C2',
    shelf: 'C-08',
    previewImage: 'https://images.unsplash.com/photo-1581092786450-c0aea6c8c2b4?w=100&h=100&fit=crop',
    xtFile: '/files/P003.x_t',
    health: 'used',
    occupancy: 'free',
    lastWorkName: 'W5220NS01_554',
    lastModifiedBy: 'Sarah Johnson',
    lastModifiedDate: new Date('2025-01-25T16:45:00'),
    history: [
      {
        id: '1',
        action: 'Work completed',
        user: 'Sarah Johnson',
        date: new Date('2025-01-25T16:45:00'),
        details: 'Completed work W5220NS01_554'
      }
    ]
  },
  {
    id: 'P004',
    name: 'Compact D1',
    shelf: 'D-03',
    previewImage: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=100&h=100&fit=crop',
    xtFile: '/files/P004.x_t',
    health: 'locked',
    occupancy: 'free',
    notes: 'Damaged - requires inspection',
    lastWorkName: 'W5219NS01_332',
    lastModifiedBy: 'Admin',
    lastModifiedDate: new Date('2025-01-24T09:20:00'),
    history: [
      {
        id: '1',
        action: 'Plate locked',
        user: 'Admin',
        date: new Date('2025-01-24T09:20:00'),
        details: 'Locked due to damage report'
      }
    ]
  },
  {
    id: 'P005',
    name: 'Universal E5',
    shelf: 'E-10',
    previewImage: 'https://images.unsplash.com/photo-1581092513210-45d4b8e7f5a3?w=100&h=100&fit=crop',
    xtFile: '/files/P005.x_t',
    health: 'used',
    occupancy: 'free',
    lastWorkName: 'W5218NS01_776',
    lastModifiedBy: 'Mike Wilson',
    lastModifiedDate: new Date('2025-01-23T13:30:00'),
    history: [
      {
        id: '1',
        action: 'Work paused',
        user: 'Mike Wilson',
        date: new Date('2025-01-23T13:30:00'),
        details: 'Work paused for maintenance'
      }
    ]
  }
];

const getHealthBadge = (health: string) => {
  switch (health) {
    case 'new':
      return <Badge className="bg-green-100 text-green-800">🟢 New</Badge>;
    case 'used':
      return <Badge className="bg-blue-100 text-blue-800">🔵 Used</Badge>;
    case 'locked':
      return <Badge className="bg-red-100 text-red-800">🔴 Locked</Badge>;
    default:
      return <Badge variant="outline">{health}</Badge>;
  }
};

const getOccupancyBadge = (occupancy: string) => {
  switch (occupancy) {
    case 'free':
      return <Badge className="bg-orange-100 text-orange-800">🟠 Free</Badge>;
    case 'in-use':
      return <Badge className="bg-purple-100 text-purple-800">🟣 In Use</Badge>;
    default:
      return <Badge variant="outline">{occupancy}</Badge>;
  }
};

const getFilteredPlates = (plates: Plate[], filter?: string, search?: string) => {
  let filtered = plates;

  // Apply status filter
  if (filter) {
    switch (filter) {
      case 'new-health':
        filtered = plates.filter(p => p.health === 'new');
        break;
      case 'used-health':
        filtered = plates.filter(p => p.health === 'used');
        break;
      case 'locked-health':
        filtered = plates.filter(p => p.health === 'locked');
        break;
      case 'free-occupancy':
        filtered = plates.filter(p => p.occupancy === 'free');
        break;
      case 'in-use-occupancy':
        filtered = plates.filter(p => p.occupancy === 'in-use');
        break;
      case 'ongoing-work':
        filtered = plates.filter(p => p.occupancy === 'in-use');
        break;
      case 'history':
        filtered = plates.filter(p => p.lastWorkName);
        break;
    }
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.id.toLowerCase().includes(searchLower) ||
      p.name?.toLowerCase().includes(searchLower) ||
      p.lastWorkName?.toLowerCase().includes(searchLower) ||
      p.shelf.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

export default function PlatesTable({ user, filter }: PlatesTableProps) {
  const [selectedPlate, setSelectedPlate] = useState<Plate | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'shelf' | 'modified'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPlates = getFilteredPlates(mockPlates, filter, search);

  const sortedPlates = [...filteredPlates].sort((a, b) => {
    let aValue: string | Date, bValue: string | Date;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name || a.id;
        bValue = b.name || b.id;
        break;
      case 'status':
        aValue = a.health + a.occupancy;
        bValue = b.health + b.occupancy;
        break;
      case 'shelf':
        aValue = a.shelf;
        bValue = b.shelf;
        break;
      case 'modified':
      default:
        aValue = a.lastModifiedDate;
        bValue = b.lastModifiedDate;
        break;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getPageTitle = () => {
    switch (filter) {
      case 'new-health': return 'New Plates';
      case 'used-health': return 'Used Plates';
      case 'locked-health': return 'Locked Plates';
      case 'free-occupancy': return 'Free Plates';
      case 'in-use-occupancy': return 'In Use Plates';
      case 'ongoing-work': return 'Your Ongoing Work';
      case 'history': return 'Work History';
      default: return 'All Clamping Plates';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {sortedPlates.length} plate{sortedPlates.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plates by ID, name, work, or shelf..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="status">Sort by Status</SelectItem>
                  <SelectItem value="shelf">Sort by Shelf</SelectItem>
                  <SelectItem value="modified">Sort by Modified</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Plate Info
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Preview</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Work</TableHead>
                  <TableHead className="hidden sm:table-cell">Modified</TableHead>
                  <TableHead>
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlates.map((plate) => (
                  <TableRow 
                    key={plate.id}
                    className="cursor-pointer hover:bg-muted/50 h-16"
                    onClick={() => setSelectedPlate(plate)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-mono">{plate.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {plate.name || 'Unnamed Plate'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Shelf: {plate.shelf}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <ImageWithFallback
                        src={plate.previewImage}
                        alt={`Preview of ${plate.id}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div>
                        <div className="font-mono text-sm">
                          {plate.lastWorkName || 'No previous work'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          by {plate.lastModifiedBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-sm">
                        {plate.lastModifiedDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {plate.lastModifiedDate.toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getHealthBadge(plate.health)}
                        {getOccupancyBadge(plate.occupancy)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {sortedPlates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No plates found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plate Detail Modal */}
      {selectedPlate && (
        <PlateDetailModal
          plate={selectedPlate}
          user={user}
          isOpen={!!selectedPlate}
          onClose={() => setSelectedPlate(null)}
          onUpdate={(updatedPlate) => {
            // In a real app, this would update the backend
            setSelectedPlate(updatedPlate);
          }}
        />
      )}
    </div>
  );
}