export type ID = string;

export type TaskStatus = 'open' | 'closed';

export interface Task {
  id: ID;
  title: string;
  note?: string;
  status: TaskStatus; // open|closed
  order: number;      // sortable index
}

export interface Note {
  id: ID;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Attachment {
  id: ID;
  name: string;
  url: string; // blob URL or data URI
  type: string; // MIME type
  size: number; // bytes
  uploadedAt: number;
}

export interface Rehearsal {
  id: ID;
  eventName: string;
  date: string;           // ISO8601
  location?: string;
  tasks: Task[];
  templateId?: string;    // Optional reference to template
  attachments?: Attachment[];
  notes?: Note[];
  createdAt: number;
  updatedAt: number;
}

export interface RehearsalTemplate {
  id: ID;
  name: string;
  description?: string;
  defaultTasks: Omit<Task, 'id'>[]; // Tasks without IDs (will be generated on use)
  createdAt: number;
}

export interface Venue {
  name: string;
  address?: string;
  contact?: string; // email/phone
}

export type CompensationStatus = 'pending' | 'paid';

export interface Compensation {
  amount: number;
  currency: string;
  status: CompensationStatus;
  paidAt?: number;
  method?: string; // e.g., 'cash', 'check', 'venmo', 'paypal'
}

export type GigStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Gig {
  id: ID;
  eventName?: string;  // Optional event/band name
  date: string;        // ISO8601 (downbeat)
  callTime?: string;   // ISO8601
  venue: Venue;
  compensation?: Compensation;
  status: GigStatus;
  notes?: string;
  mileage?: number;    // optional cache
  attachments?: Attachment[];
  createdAt: number;
  updatedAt: number;
}

export interface MileageLog {
  id: ID;
  gigId: ID;
  date: string; // ISO8601
  origin: string;
  destination: string;
  distance: number; // miles
  rate: number; // per mile
  amount: number; // total reimbursement
  createdAt: number;
}

export type SyncOperationStatus = 'pending' | 'processing' | 'failed' | 'completed';

export interface SyncOperation {
  id: ID;
  type: 'create' | 'update' | 'delete';
  entity: 'rehearsal' | 'gig' | 'template' | 'mileage';
  data: unknown;
  timestamp: number;
  status: SyncOperationStatus;
  retryCount: number;
  nextAttemptAt: number;
  lastError?: string;
}
