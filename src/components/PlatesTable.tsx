import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { LegacyUser, Plate } from "../App";
import PlateDetailModal from "./PlateDetailModal";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PlatesTableProps {
  user: LegacyUser;
  filter?:
    | "new-health"
    | "used-health"
    | "locked-health"
    | "free-occupancy"
    | "in-use-occupancy"
    | "ongoing-work"
    | "history";
}

// Helper to load real clamping plate data from backend results
const loadRealPlateData = (): Plate[] => {
  try {
    const storedData = localStorage.getItem("clampingPlateResults");
    if (storedData) {
      const clampingData = JSON.parse(storedData);
      if (clampingData.plates && Array.isArray(clampingData.plates)) {
        // Transform backend plate format to app Plate format
        return clampingData.plates.map((backendPlate: any) => {
          const health: "new" | "used" | "locked" = backendPlate.isLocked
            ? "locked"
            : backendPlate.health === "new"
            ? "new"
            : "used";

          const occupancy: "free" | "in-use" = backendPlate.isLocked
            ? "in-use"
            : "free";

          return {
            id: backendPlate.id,
            name: `Plate ${backendPlate.plateNumber}`,
            shelf: backendPlate.shelfNumber || backendPlate.shelf || "Unknown",
            previewImage: backendPlate.previewImage || "/placeholder-plate.png",
            xtFile: backendPlate.currentModelFile || "",
            health,
            occupancy,
            notes: backendPlate.notes || "",
            lastWorkName:
              backendPlate.workProjects?.[backendPlate.workProjects.length - 1]
                ?.workOrder || "",
            lastModifiedBy: "System",
            lastModifiedDate: new Date(
              backendPlate.metadata?.generatedDate || Date.now()
            ),
            history:
              backendPlate.workProjects?.map((wp: any, idx: number) => ({
                id: `${backendPlate.id}_${idx}`,
                action: "Work completed",
                user: "Operator",
                date: new Date(),
                details: `${wp.projectCode || ""}: ${wp.workOrder}`.trim(),
              })) || [],
          };
        });
      }
    }
  } catch (error) {
    console.warn("Failed to load real plate data:", error);
  }
  return [];
};

const getHealthBadge = (health: string) => {
  switch (health) {
    case "new":
      return <Badge className="bg-green-100 text-green-800">🟢 New</Badge>;
    case "used":
      return <Badge className="bg-blue-100 text-blue-800">🔵 Used</Badge>;
    case "locked":
      return <Badge className="bg-red-100 text-red-800">🔴 Locked</Badge>;
    default:
      return <Badge variant="outline">{health}</Badge>;
  }
};

const getOccupancyBadge = (occupancy: string) => {
  switch (occupancy) {
    case "free":
      return <Badge className="bg-orange-100 text-orange-800">🟠 Free</Badge>;
    case "in-use":
      return <Badge className="bg-purple-100 text-purple-800">🟣 In Use</Badge>;
    default:
      return <Badge variant="outline">{occupancy}</Badge>;
  }
};

const getFilteredPlates = (
  plates: Plate[],
  filter?: string,
  search?: string
) => {
  let filtered = plates;

  // Apply status filter
  if (filter) {
    switch (filter) {
      case "new-health":
        filtered = plates.filter((p) => p.health === "new");
        break;
      case "used-health":
        filtered = plates.filter((p) => p.health === "used");
        break;
      case "locked-health":
        filtered = plates.filter((p) => p.health === "locked");
        break;
      case "free-occupancy":
        filtered = plates.filter((p) => p.occupancy === "free");
        break;
      case "in-use-occupancy":
        filtered = plates.filter((p) => p.occupancy === "in-use");
        break;
      case "ongoing-work":
        filtered = plates.filter((p) => p.occupancy === "in-use");
        break;
      case "history":
        filtered = plates.filter((p) => p.lastWorkName);
        break;
    }
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.id.toLowerCase().includes(searchLower) ||
        p.name?.toLowerCase().includes(searchLower) ||
        p.lastWorkName?.toLowerCase().includes(searchLower) ||
        p.shelf.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

export default function PlatesTable({ user, filter }: PlatesTableProps) {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<Plate | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "status" | "shelf" | "modified"
  >("modified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Load real plate data on mount and when localStorage changes
  useEffect(() => {
    const loadPlates = () => {
      const realPlates = loadRealPlateData();
      console.log(`Loaded ${realPlates.length} plates from backend`);
      setPlates(realPlates);
    };

    loadPlates();

    // Listen for storage changes (when setup wizard loads data)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "clampingPlateResults") {
        loadPlates();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredPlates = getFilteredPlates(plates, filter, search);

  const sortedPlates = [...filteredPlates].sort((a, b) => {
    let aValue: string | Date, bValue: string | Date;

    switch (sortBy) {
      case "name":
        aValue = a.name || a.id;
        bValue = b.name || b.id;
        break;
      case "status":
        aValue = a.health + a.occupancy;
        bValue = b.health + b.occupancy;
        break;
      case "shelf":
        aValue = a.shelf;
        bValue = b.shelf;
        break;
      case "modified":
      default:
        aValue = a.lastModifiedDate;
        bValue = b.lastModifiedDate;
        break;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getPageTitle = () => {
    switch (filter) {
      case "new-health":
        return "New Plates";
      case "used-health":
        return "Used Plates";
      case "locked-health":
        return "Locked Plates";
      case "free-occupancy":
        return "Free Plates";
      case "in-use-occupancy":
        return "In Use Plates";
      case "ongoing-work":
        return "Your Ongoing Work";
      case "history":
        return "Work History";
      default:
        return "All Clamping Plates";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {sortedPlates.length} plate{sortedPlates.length !== 1 ? "s" : ""}{" "}
            found
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
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
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
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
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
                  <TableHead>Plate Info</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Preview
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Last Work
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Modified
                  </TableHead>
                  <TableHead>Status</TableHead>
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
                          {plate.name || "Unnamed Plate"}
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
                          {plate.lastWorkName || "No previous work"}
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
