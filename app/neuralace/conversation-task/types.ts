import { LucideIcon } from "lucide-react";

export interface SessionDetail {
  sessionNumber: number;
  startTime: string;
  endTime: string;
  breakDuration: number;
  micDuration: number;
  sysDuration: number;
  maxDuration: number;
  micWav: "Y" | "N";
  sysWav: "Y" | "N";
  date: string; // YYYY-MM-DD
}

export interface SystemStats {
  cpuUsage: number; // Percentage (0-100)
  ramUsage: number; // Percentage (0-100)
  storageRemaining: string; // e.g., "120 GB"
  internetSpeed: string; // e.g., "50 Mbps"
  ipAddress: string;
}

export interface Volunteer {
  empId: string;
  name: string;
  email?: string;
  phone?: string;
  sessions: number;
  hours: number; // Total recording hours
  status: "Live" | "Offline" | "On Break";
  lastActive: string; // ISO Date string or formatted string
  sessionDetails: SessionDetail[];
  systemStats?: SystemStats; // Optional for offline volunteers
}

export interface SummaryStat {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
}
