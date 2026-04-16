/*
  # Add defect_reports and documents tables

  1. New Tables
    - `defect_reports` - Customer-submitted defect/breakdown reports linked to user_id
    - `documents` - Downloadable documents linked to user_id

  2. Security
    - RLS enabled on both tables
    - Customers can only view/insert their own reports and documents
*/

CREATE TABLE IF NOT EXISTS defect_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_point_id uuid REFERENCES service_points(id),
  meter_id uuid REFERENCES meters(id),
  defect_type text NOT NULL,
  defect_date date NOT NULL,
  contact_name text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  address_city text DEFAULT '',
  address_street text DEFAULT '',
  address_house_number text DEFAULT '',
  description text NOT NULL DEFAULT '',
  status text DEFAULT 'reported',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE defect_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own defect reports"
  ON defect_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own defect reports"
  ON defect_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  document_type text DEFAULT 'general',
  file_name text DEFAULT '',
  file_url text DEFAULT '',
  issue_date date,
  is_contract boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_defect_reports_user_id ON defect_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
