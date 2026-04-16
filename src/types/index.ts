export interface Profile {
  id: string;
  account_number: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ServicePoint {
  id: string;
  user_id: string;
  point_code: string;
  point_name: string;
  address_street: string;
  address_city: string;
  is_active: boolean;
  created_at: string;
}

export interface Meter {
  id: string;
  service_point_id: string;
  meter_number: string;
  status: string;
  installation_date: string | null;
  created_at: string;
}

export interface MeterReading {
  id: string;
  meter_id: string;
  reading_date: string;
  reading_value: number;
  consumption: number;
  settlement_status: string;
  notes: string;
  created_at: string;
  meters?: Meter & { service_points?: ServicePoint };
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  amount: number;
  vat_amount: number;
  total_amount: number;
  status: string;
  service_period_from: string | null;
  service_period_to: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  payment_date: string;
  amount: number;
  description: string;
  reference_number: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  parent_id: string | null;
  subject: string;
  content: string;
  sender_type: string;
  is_read: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  ip_address: string;
  created_at: string;
}

export interface Agreement {
  id: string;
  user_id: string;
  agreement_number: string;
  agreement_type: string;
  signed_date: string | null;
  valid_from: string | null;
  valid_to: string | null;
  status: string;
  storage_path: string;
  created_at: string;
}
