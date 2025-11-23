"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// ==== Types ====
export interface Volunteer {
  id: number;
  name: string;
  preferredShift?: string;
  weekOffDays: string[];
}

export interface Shift {
  id: number;
  name: string;
  startTime?: string;
  endTime?: string;
  [key: string]: any;
}

export interface WeekSettings {
  workingDays: string[];
  weekOffDays: string[];
}

interface AppContextType {
  volunteers: Volunteer[];
  shifts: Shift[];
  weekSettings: WeekSettings;

  addVolunteer: (volunteer: Omit<Volunteer, "id">) => void;
  updateVolunteer: (
    id: number,
    updatedVolunteer: Omit<Volunteer, "id">
  ) => void;
  removeVolunteer: (id: number) => void;
  bulkRemoveVolunteer: (ids: number[]) => void;
  bulkAddVolunteers: (newVolunteers: Volunteer[]) => void;
  setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;

  addShift: (shift: Omit<Shift, "id">) => void;
  removeShift: (id: number) => void;
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;

  updateWeekSettings: (newSettings: WeekSettings) => void;
  setWeekSettings: React.Dispatch<React.SetStateAction<WeekSettings>>;
}

// ==== Context ====
const AppContext = createContext<AppContextType | undefined>(undefined);

// ==== Provider ====
export function AppProvider({ children }: { children: ReactNode }) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [weekSettings, setWeekSettings] = useState<WeekSettings>({
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    weekOffDays: ["Saturday", "Sunday"],
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVolunteers = localStorage.getItem("shift-roster-volunteers");
    const savedShifts = localStorage.getItem("shift-roster-shifts");
    const savedWeekSettings = localStorage.getItem("shift-roster-weekSettings");

    if (savedVolunteers) setVolunteers(JSON.parse(savedVolunteers));
    if (savedShifts) setShifts(JSON.parse(savedShifts));
    if (savedWeekSettings) setWeekSettings(JSON.parse(savedWeekSettings));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shift-roster-volunteers", JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem("shift-roster-shifts", JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(
      "shift-roster-weekSettings",
      JSON.stringify(weekSettings)
    );
  }, [weekSettings]);

  // ==== Actions ====
  const addVolunteer = (volunteer: Omit<Volunteer, "id">) => {
    const newVolunteer: Volunteer = {
      ...volunteer,
      id: Date.now() + Math.random(),
    };
    setVolunteers((prev) => [...prev, newVolunteer]);
  };
  const updateVolunteer = (
    id: number,
    updatedVolunteer: Omit<Volunteer, "id">
  ) => {
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const updated: Volunteer = { ...v, ...updatedVolunteer, id };
          return updated;
        }
        return v;
      })
    );
  };

  const removeVolunteer = (id: number) => {
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  const bulkRemoveVolunteer = (ids: number[]) => {
    setVolunteers((prev) => prev.filter((v) => !ids.includes(v.id)));
  };

  const bulkAddVolunteers = (newVolunteers: Volunteer[]) => {
    setVolunteers((prev) => [...prev, ...newVolunteers]);
  };

  const addShift = (shift: Partial<Omit<Shift, "id">>) => {
    const newShift: Shift = {
      id: Date.now() + Math.random(),
      name: shift.name ?? "Unnamed Shift",
      startTime: shift.startTime ?? "",
      endTime: shift.endTime ?? "",
      ...shift,
    };

    setShifts((prev) => [...prev, newShift]);
  };

  const removeShift = (id: number) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const updateWeekSettings = (newSettings: WeekSettings) => {
    setWeekSettings(newSettings);
  };

  const value: AppContextType = {
    volunteers,
    shifts,
    weekSettings,

    addVolunteer,
    updateVolunteer,
    removeVolunteer,
    bulkRemoveVolunteer,
    bulkAddVolunteers,
    setVolunteers,

    addShift,
    removeShift,
    setShifts,

    updateWeekSettings,
    setWeekSettings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ==== Hook ====
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
