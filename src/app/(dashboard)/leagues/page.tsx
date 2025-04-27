"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/dashboard/header";
import { PlusIcon, EllipsisVerticalIcon, CalendarIcon } from "lucide-react";
import {
  DataTable,
  type FilterOption,
} from "@/components/dashboard/data-table/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useKategorije,
  useCreateKategorija,
  useUpdateKategorija,
} from "@/hooks/queries/useKategorije";
import { useSports, useSport } from "@/hooks/queries/useSports";
import { mockAssignees } from "@/utils/mockData";
import type { Assignee } from "@/utils/mockData";

// Define the League type based on KategorijaRecord
export type League = {
  id: string;
  naziv: string;
  sport: string;
  vrstaLige: string;
  organizator: string;
  assigneeEmail: string;
  pocetak: string;
  kraj: string;
  status: string;
};

// League Form Component
type LeagueFormProps = {
  onSubmit: (data: LeagueFormData) => void;
  onCancel: () => void;
  initialData?: League;
  sports: { id: string; name: string }[];
  vrstaLige: string[];
  statuses: string[];
  assignees: Assignee[];
  isSubmitting?: boolean;
};

type LeagueFormData = {
  naziv: string;
  sport: string;
  vrstaLige: string;
  assigneeEmail: string;
  pocetak: string;
  kraj: string;
  status: string;
};

function LeagueForm({
  onSubmit,
  onCancel,
  initialData,
  sports,
  vrstaLige,
  statuses,
  assignees,
  isSubmitting = false,
}: LeagueFormProps) {
  const [formData, setFormData] = useState<LeagueFormData>({
    naziv: initialData?.naziv || "",
    sport: initialData?.sport || "",
    vrstaLige: initialData?.vrstaLige || "",
    assigneeEmail: initialData?.assigneeEmail || "",
    pocetak: initialData?.pocetak || "",
    kraj: initialData?.kraj || "",
    status: initialData?.status || "Todo",
  });

  // Helper function to parse Croatian date format
  const parseCroatianDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;

    // Remove trailing period if present
    const cleaned = dateString.endsWith(".")
      ? dateString.slice(0, -1)
      : dateString;

    // Split by periods
    const parts = cleaned.split(".");
    if (parts.length !== 3) return undefined;

    // Parse parts to numbers
    const day = parseInt(parts[0] || "0", 10);
    const month = parseInt(parts[1] || "0", 10) - 1; // Month is 0-indexed in Date
    const year = parseInt(parts[2] || "0", 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;

    const date = new Date(year, month, day);
    return !isNaN(date.getTime()) ? date : undefined;
  };

  // For Calendar components
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    if (initialData?.pocetak) {
      // Handle the Croatian date format (DD.MM.YYYY.)
      const dateParts = initialData.pocetak.replace(/\.$/, "").split(".");
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0] || "0", 10);
        const month = parseInt(dateParts[1] || "0", 10) - 1; // Month is 0-indexed in Date
        const year = parseInt(dateParts[2] || "0", 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          return !isNaN(date.getTime()) ? date : undefined;
        }
      }
      return undefined;
    }
    return undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    if (initialData?.kraj) {
      // Handle the Croatian date format (DD.MM.YYYY.)
      const dateParts = initialData.kraj.replace(/\.$/, "").split(".");
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0] || "0", 10);
        const month = parseInt(dateParts[1] || "0", 10) - 1; // Month is 0-indexed in Date
        const year = parseInt(dateParts[2] || "0", 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          return !isNaN(date.getTime()) ? date : undefined;
        }
      }
      return undefined;
    }
    return undefined;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update form data when dates change
  useEffect(() => {
    if (startDate && !isNaN(startDate.getTime())) {
      setFormData((prev) => ({
        ...prev,
        pocetak: format(startDate, "yyyy-MM-dd"),
      }));
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate && !isNaN(endDate.getTime())) {
      setFormData((prev) => ({
        ...prev,
        kraj: format(endDate, "yyyy-MM-dd"),
      }));
    }
  }, [endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="naziv">Naziv lige</Label>
        <Input
          id="naziv"
          name="naziv"
          placeholder="Unesite naziv lige"
          value={formData.naziv}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigneeEmail">Dodijeli osobi</Label>
        <Select
          value={formData.assigneeEmail}
          onValueChange={(value) => handleSelectChange("assigneeEmail", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Odaberite osobu" />
          </SelectTrigger>
          <SelectContent>
            {assignees.map((assignee) => (
              <SelectItem key={assignee.email} value={assignee.email}>
                {assignee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sport">Sport</Label>
          <Select
            value={formData.sport}
            onValueChange={(value) => handleSelectChange("sport", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Odaberite sport" />
            </SelectTrigger>
            <SelectContent>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.name}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vrstaLige">Vrsta lige</Label>
          <Select
            value={formData.vrstaLige}
            onValueChange={(value) => handleSelectChange("vrstaLige", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Odaberite vrstu" />
            </SelectTrigger>
            <SelectContent>
              {vrstaLige.length > 0 ? (
                vrstaLige.map((vrsta) => (
                  <SelectItem key={vrsta} value={vrsta}>
                    {vrsta}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Privatna">Privatna</SelectItem>
                  <SelectItem value="Službena">Službena</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pocetak">Datum početka</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd.MM.yyyy") : "Odaberite datum"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kraj">Datum završetka</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd.MM.yyyy") : "Odaberite datum"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Odaberite status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.length > 0 ? (
              statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In progress">In progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Odustani
        </Button>
        <Button
          className="bg-[#BBFA01] text-black hover:bg-[#99cc00]"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Spremanje..." : "Spremi ligu"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function Leagues() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const {
    data: kategorije,
    isLoading: kategorijLoading,
    error: kategorijeError,
  } = useKategorije();
  const {
    data: sports,
    isLoading: sportsLoading,
    error: sportsError,
  } = useSports();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [sportMap, setSportMap] = useState<Record<string, string>>({});
  const [uniqueVrstaLige, setUniqueVrstaLige] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const { mutate: createLeague, isPending: isCreating } = useCreateKategorija();
  const { mutate: updateLeague, isPending: isUpdating } = useUpdateKategorija();

  // Create a map of sport IDs to sport names
  useEffect(() => {
    if (sports) {
      const map: Record<string, string> = {};
      sports.forEach((sport) => {
        map[sport.id] = sport.name;
      });
      setSportMap(map);
    }
  }, [sports]);

  // Convert Kategorija records to League format and extract unique values for filters
  useEffect(() => {
    if (kategorije && sportMap) {
      const mappedLeagues = kategorije.map((category) => {
        // Get the first sport ID from the category's sport array
        const sportId =
          category.sport && category.sport.length > 0
            ? category.sport[0]
            : null;

        const sportName = sportId
          ? sportMap[sportId] || "Nepoznat"
          : "Nepoznat";

        // Find the assignee in our mockup data or set to default
        const assigneeEmail = category.assignee?.email || "";
        const assigneeName = category.assignee?.name || "Nepoznat";

        return {
          id: category.id,
          naziv: category.name,
          sport: sportName,
          vrstaLige: category?.vrstaLige || "",
          organizator: assigneeName,
          assigneeEmail: assigneeEmail,
          pocetak: category.startdate || "",
          kraj: category.enddate || "",
          status: category.status || "Todo",
        };
      });

      setLeagues(mappedLeagues);

      // Extract unique values for vrstaLige
      const vrstaSet = new Set<string>();
      // Extract unique values for status
      const statusSet = new Set<string>();

      mappedLeagues.forEach((league) => {
        if (league.vrstaLige) vrstaSet.add(league.vrstaLige);
        if (league.status) statusSet.add(league.status);
      });

      setUniqueVrstaLige(Array.from(vrstaSet));
      setUniqueStatuses(Array.from(statusSet));
    }
  }, [kategorije, sportMap]);

  const handleCreateLeague = (data: LeagueFormData) => {
    // Find the sport ID from the selected sport name
    const sportId = Object.entries(sportMap).find(
      ([_, name]) => name === data.sport,
    )?.[0];

    if (!sportId) {
      console.error("Sport not found");
      return;
    }

    // Find the selected assignee
    const selectedAssignee = mockAssignees.find(
      (a) => a.email === data.assigneeEmail,
    );

    // Create the league data object
    const leagueData = {
      name: data.naziv,
      sport: [sportId],
      notes: "",
      vrstaLige: data.vrstaLige,
      status: data.status,
      startdate: data.pocetak, // Already in YYYY-MM-DD format from the Calendar
      enddate: data.kraj, // Already in YYYY-MM-DD format from the Calendar
      assignee: selectedAssignee
        ? {
            id: selectedAssignee.id,
            email: selectedAssignee.email,
            name: selectedAssignee.name,
          }
        : undefined,
    };

    // Create the league
    createLeague(leagueData, {
      onSuccess: () => {
        setDialogOpen(false);
      },
      onError: (error) => {
        console.error("Error creating league:", error);
        // Could add an error toast notification here
      },
    });
  };

  const handleEditLeague = (data: LeagueFormData) => {
    // Find the sport ID from the selected sport name
    const sportId = Object.entries(sportMap).find(
      ([_, name]) => name === data.sport,
    )?.[0];

    if (!sportId) {
      console.error("Sport not found");
      return;
    }

    // Make sure we have the current league
    if (!currentLeague) {
      console.error("No league selected for editing");
      return;
    }

    // Find the selected assignee
    const selectedAssignee = mockAssignees.find(
      (a) => a.email === data.assigneeEmail,
    );

    // Create the league data object for update
    const leagueData = {
      id: currentLeague.id,
      name: data.naziv,
      sport: [sportId],
      notes: "",
      vrstaLige: data.vrstaLige,
      status: data.status,
      startdate: data.pocetak,
      enddate: data.kraj,
      assignee: selectedAssignee
        ? {
            id: selectedAssignee.id,
            email: selectedAssignee.email,
            name: selectedAssignee.name,
          }
        : undefined,
    };

    // Update the league
    updateLeague(leagueData, {
      onSuccess: () => {
        setEditDialogOpen(false);
        setCurrentLeague(null);
      },
      onError: (error) => {
        console.error("Error updating league:", error);
        // Could add an error toast notification here
      },
    });
  };

  const openEditDialog = (league: League) => {
    setCurrentLeague(league);
    setEditDialogOpen(true);
  };

  const leagueColumns: ColumnDef<League>[] = [
    {
      accessorKey: "naziv",
      header: "Naziv",
      cell: ({ row }) => <div>{row.getValue("naziv")}</div>,
    },
    {
      accessorKey: "sport",
      header: "Sport",
      cell: ({ row }) => <div>{row.getValue("sport")}</div>,
    },
    {
      accessorKey: "vrstaLige",
      header: "Vrsta lige",
      cell: ({ row }) => <div>{row.getValue("vrstaLige")}</div>,
    },
    {
      accessorKey: "organizator",
      header: "Organizator",
      cell: ({ row }) => <div>{row.getValue("organizator")}</div>,
    },
    {
      accessorKey: "pocetak",
      header: "Početak",
      cell: ({ row }) => <div>{row.getValue("pocetak")}</div>,
    },
    {
      accessorKey: "kraj",
      header: "Kraj",
      cell: ({ row }) => <div>{row.getValue("kraj")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let bgColor = "bg-[#ff646633]";
        let dotColor = "bg-[#C40D10]";

        if (status === "Todo") {
          bgColor = "bg-[#ff646633]";
          dotColor = "bg-[#C40D10]";
        } else if (status === "In progress") {
          bgColor = "bg-[#facc1533]";
          dotColor = "bg-[#E7A600]";
        } else if (status === "Done") {
          bgColor = "bg-[#5dcc4e33]";
          dotColor = "bg-[#0D8C37]";
        }

        return (
          <Badge variant={"status"} className={bgColor}>
            <div className={`size-1.5 rounded-full ${dotColor}`} />
            <span className="text-sm font-normal">{status}</span>
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const league = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVerticalIcon className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(league)}>
                Uredi ligu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Define the filter options for leagues
  const leagueFilterOptions: FilterOption[] = [
    {
      label: "Sport",
      column: "sport",
      options: sports
        ? sports.map((sport) => ({ label: sport.name, value: sport.name }))
        : [],
    },
    {
      label: "Status",
      column: "status",
      options:
        uniqueStatuses.length > 0
          ? uniqueStatuses.map((status) => ({ label: status, value: status }))
          : [
              { label: "Todo", value: "Todo" },
              { label: "In progress", value: "In progress" },
              { label: "Done", value: "Done" },
            ],
    },
    {
      label: "Vrsta lige",
      column: "vrstaLige",
      options:
        uniqueVrstaLige.length > 0
          ? uniqueVrstaLige.map((vrsta) => ({ label: vrsta, value: vrsta }))
          : [
              { label: "Privatna", value: "Privatna" },
              { label: "Službena", value: "Službena" },
            ],
    },
  ];

  if (kategorijLoading || sportsLoading) return <div>Učitavanje...</div>;
  if (kategorijeError || sportsError)
    return <div>Greška pri učitavanju podataka</div>;

  return (
    <div>
      <Header
        title="Upravljanje liga"
        buttonText="Nova liga"
        buttonIcon={<PlusIcon className="size-5" />}
        onClick={() => setDialogOpen(true)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Dodaj novu ligu</DialogTitle>
            <DialogDescription>
              Unesite podatke za novu ligu. Kliknite spremi kada završite.
            </DialogDescription>
          </DialogHeader>
          <LeagueForm
            onSubmit={handleCreateLeague}
            onCancel={() => setDialogOpen(false)}
            sports={sports || []}
            vrstaLige={uniqueVrstaLige}
            statuses={uniqueStatuses}
            assignees={mockAssignees}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Uredi ligu</DialogTitle>
            <DialogDescription>
              Uredite podatke za ligu. Kliknite spremi kada završite.
            </DialogDescription>
          </DialogHeader>
          {currentLeague && (
            <LeagueForm
              initialData={currentLeague}
              onSubmit={handleEditLeague}
              onCancel={() => {
                setEditDialogOpen(false);
                setCurrentLeague(null);
              }}
              sports={sports || []}
              vrstaLige={uniqueVrstaLige}
              statuses={uniqueStatuses}
              assignees={mockAssignees}
              isSubmitting={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <DataTable
        columns={leagueColumns}
        data={leagues}
        filterOptions={leagueFilterOptions}
        searchPlaceholder="Pretraži lige"
      />
    </div>
  );
}
