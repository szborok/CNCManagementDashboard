import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  Download,
  Play,
  Pause,
  Square,
  CheckCircle,
  Edit3,
  Calendar,
  User,
  MapPin,
  Box
} from 'lucide-react';
import { User as UserType, Plate } from '../App';
import { toast } from 'sonner@2.0.3';
import StopWorkModal from './StopWorkModal';
import AdminEditModal from './AdminEditModal';
import FinishWorkModal from './FinishWorkModal';

interface PlateDetailModalProps {
  plate: Plate;
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (plate: Plate) => void;
}

export default function PlateDetailModal({ plate, user, isOpen, onClose, onUpdate }: PlateDetailModalProps) {
  const [showStopModal, setShowStopModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

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

  const canStartWork = plate.health !== 'locked' && plate.occupancy === 'free';
  const canPauseWork = plate.occupancy === 'in-use';
  const canStopWork = plate.occupancy === 'in-use';
  const canFinishWork = plate.occupancy === 'in-use';

  const handleStartWork = () => {
    const updatedPlate = {
      ...plate,
      occupancy: 'in-use' as const,
      lastModifiedBy: user.name,
      lastModifiedDate: new Date(),
      history: [
        {
          id: Date.now().toString(),
          action: 'Work started',
          user: user.name,
          date: new Date(),
          details: 'Work session began'
        },
        ...plate.history
      ]
    };
    onUpdate(updatedPlate);
    toast.success('Work started successfully');
  };

  const handlePauseWork = () => {
    const updatedPlate = {
      ...plate,
      health: 'used' as const,
      occupancy: 'free' as const,
      lastModifiedBy: user.name,
      lastModifiedDate: new Date(),
      history: [
        {
          id: Date.now().toString(),
          action: 'Work paused',
          user: user.name,
          date: new Date(),
          details: 'Work session paused'
        },
        ...plate.history
      ]
    };
    onUpdate(updatedPlate);
    toast.success('Work paused successfully');
  };

  const handleStopWork = (message: string) => {
    const updatedPlate = {
      ...plate,
      occupancy: 'free' as const,
      lastModifiedBy: user.name,
      lastModifiedDate: new Date(),
      notes: message,
      history: [
        {
          id: Date.now().toString(),
          action: 'Work stopped',
          user: user.name,
          date: new Date(),
          details: message
        },
        ...plate.history
      ]
    };
    onUpdate(updatedPlate);
    setShowStopModal(false);
    toast.success('Work stopped successfully');
    // Close the main modal after stopping work to make the action feel more definitive
    setTimeout(() => onClose(), 500);
  };

  const handleFinishWork = (xtFile: File, previewImage: File, notes?: string) => {
    const updatedPlate = {
      ...plate,
      health: 'used' as const,
      occupancy: 'free' as const,
      lastModifiedBy: user.name,
      lastModifiedDate: new Date(),
      lastWorkName: `W${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: notes,
      history: [
        {
          id: Date.now().toString(),
          action: 'Work completed',
          user: user.name,
          date: new Date(),
          details: `Work finished with file updates${notes ? ': ' + notes : ''}`
        },
        ...plate.history
      ]
    };
    onUpdate(updatedPlate);
    setShowFinishModal(false);
    toast.success('Work completed successfully');
  };

  const handleDownload = () => {
    toast.success('X_T file download started');
    // In a real app, this would download the actual file
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Plate Details - {plate.id}</span>
              <div className="flex gap-2">
                {getHealthBadge(plate.health)}
                {getOccupancyBadge(plate.occupancy)}
              </div>
            </DialogTitle>
            <DialogDescription>
              {plate.name && `${plate.name} • `}Shelf: {plate.shelf}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - 3D Viewer (Larger) */}
              <div className="xl:col-span-2 space-y-4">
                <div className="bg-muted rounded-lg aspect-video xl:aspect-square flex items-center justify-center border-2 border-dashed border-muted-foreground/25 min-h-[400px]">
                  <div className="text-center">
                    <Box className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">3D Viewer Placeholder</p>
                    <p className="text-muted-foreground">3D model would display here</p>
                    <p className="text-sm text-muted-foreground mt-2">Click and drag to rotate • Scroll to zoom</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Details and Controls */}
              <div className="space-y-6 overflow-y-auto">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span>Shelf Location: {plate.shelf}</span>
                    </div>
                    
                    {plate.lastWorkName && (
                      <div>
                        <Label>Last Work</Label>
                        <p className="font-mono">{plate.lastWorkName}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Modified by {plate.lastModifiedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{plate.lastModifiedDate.toLocaleString()}</span>
                      </div>
                    </div>

                    {plate.notes && (
                      <div>
                        <Label>Notes</Label>
                        <p className="text-muted-foreground">{plate.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Download Button */}
                <div>
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download X_T File
                  </Button>
                </div>
              </div>
            </div>

            {/* History - Full Width Section */}
            <div className="space-y-4">
              <Separator />
              <Label>Change History</Label>
              <ScrollArea className="h-40 w-full border rounded-md p-4">
                <div className="space-y-3">
                  {plate.history
                    .filter((entry) => {
                      // Admin users see all history
                      if (user.isAdmin) return true;
                      
                      // Normal users only see completion/upload entries
                      return entry.action === 'Work completed' || 
                             entry.action === 'File uploaded' || 
                             entry.action === 'Plate created';
                    })
                    .map((entry) => (
                      <div key={entry.id}>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p>
                              <span className="font-medium">{entry.action}</span>
                              <span className="text-muted-foreground"> by {entry.user}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.date.toLocaleString()}
                            </p>
                            {entry.details && (
                              <p className="text-sm text-muted-foreground">
                                {entry.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  {plate.history
                    .filter((entry) => {
                      if (user.isAdmin) return true;
                      return entry.action === 'Work completed' || 
                             entry.action === 'File uploaded' || 
                             entry.action === 'Plate created';
                    }).length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No relevant history available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Action Buttons at Bottom */}
          <div className="border-t pt-6">
            <div className="flex flex-wrap gap-3 justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Play/Pause Button */}
                {canStartWork && (
                  <Button onClick={handleStartWork} size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Start Work
                  </Button>
                )}
                {canPauseWork && (
                  <Button onClick={handlePauseWork} variant="outline" size="lg">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Work
                  </Button>
                )}

                {/* Stop Button */}
                {canStopWork && (
                  <Button onClick={() => setShowStopModal(true)} variant="destructive" size="lg">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Work
                  </Button>
                )}

                {/* Admin Edit Button */}
                {user.isAdmin && (
                  <Button onClick={() => setShowAdminModal(true)} variant="outline" size="lg">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Admin Edit
                  </Button>
                )}
              </div>

              {/* Finish Button at the end */}
              {canFinishWork && (
                <Button onClick={() => setShowFinishModal(true)} className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finish Work
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stop Work Modal */}
      <StopWorkModal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        onConfirm={handleStopWork}
        plateId={plate.id}
      />

      {/* Finish Work Modal */}
      <FinishWorkModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleFinishWork}
        plateId={plate.id}
      />

      {/* Admin Edit Modal */}
      {user.isAdmin && (
        <AdminEditModal
          plate={plate}
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onUpdate={onUpdate}
          user={user}
        />
      )}
    </>
  );
}