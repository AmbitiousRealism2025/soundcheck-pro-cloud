export type ID = string;

export type TaskStatus = 'open' | 'closed';

export interface Task {
  id: ID;
  title: string;
  note?: string;
  status: TaskStatus; // open|closed
  order: number;      // sortable index
}

export interface Rehearsal {
  id: ID;
  eventName: string;
  date: string;           // ISO8601
  location?: string;
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
}

export interface Venue {
  name: string;
  address?: string;
  contact?: string; // email/phone
}

export interface Gig {
  id: ID;
  date: string;        // ISO8601 (downbeat)
  callTime?: string;   // ISO8601
  venue: Venue;
  compensation?: number;
  notes?: string;
  mileage?: number;    // optional cache
  createdAt: number;
  updatedAt: number;
}
