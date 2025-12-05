export interface PropertyDocument {
  id: string;
  name: string;
  type: 'license' | 'permit' | 'insurance' | 'contract' | 'certificate' | 'other';
  description: string;
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  renewalDate?: string;
  status: 'active' | 'expiring-soon' | 'expired' | 'renewed';
  propertyId?: string;
  reminderDays?: number; // Days before expiry to remind
  notes?: string;
}

export interface RentSchedule {
  id: string;
  roomId: string;
  roomName: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  monthlyRent: number;
  dueDay: number; // Day of month (1-31)
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  paymentHistory: RentPayment[];
}

export interface RentPayment {
  id: string;
  scheduleId: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paymentMethod?: string;
  notes?: string;
}

export interface DocumentReminder {
  id: string;
  documentId: string;
  documentName: string;
  reminderDate: string;
  type: 'renewal' | 'expiry' | 'inspection';
  dismissed: boolean;
}

export interface RentReminder {
  id: string;
  scheduleId: string;
  roomName: string;
  tenantName: string;
  dueDate: string;
  amount: number;
  dismissed: boolean;
}
