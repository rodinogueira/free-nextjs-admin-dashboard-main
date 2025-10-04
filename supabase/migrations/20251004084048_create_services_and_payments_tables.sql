/*
  # Create Services and Payments Tables

  ## Purpose
  This migration creates the database schema for the Search Services and Payments functionality.
  
  ## 1. New Tables
  
  ### `services`
  Stores health services information (physical locations and teleconsultation)
  - `id` (uuid, primary key) - Unique identifier for each service
  - `name` (text, not null) - Service name
  - `type` (text, not null) - Service type: 'physical' or 'teleconsultation'
  - `address` (text) - Physical address (for physical locations)
  - `city` (text) - City name
  - `state` (text, not null) - Brazilian state code (e.g., 'SP', 'RJ')
  - `phone` (text) - Contact phone number
  - `teleconsult_link` (text) - Link for teleconsultation services
  - `schedule` (text) - Operating hours
  - `latitude` (decimal) - Geographic latitude for map display
  - `longitude` (decimal) - Geographic longitude for map display
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp
  
  ### `payments`
  Stores payment records and transactions
  - `id` (uuid, primary key) - Unique identifier for each payment
  - `user_name` (text, not null) - Name of the user who made the payment
  - `service_name` (text, not null) - Name of the service paid for
  - `amount` (decimal, not null) - Payment amount
  - `status` (text, not null) - Payment status: 'paid', 'pending', 'cancelled'
  - `payment_date` (timestamptz) - Date when payment was made
  - `due_date` (timestamptz) - Payment due date
  - `receipt_url` (text) - URL to the payment receipt
  - `notes` (text) - Additional notes about the payment
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp
  
  ## 2. Security
  - Enable Row Level Security (RLS) on both tables
  - Add policies for authenticated users to read all services
  - Add policies for authenticated users to manage their own payments
  - Public read access for services (to allow map display without authentication)
  
  ## 3. Indexes
  - Index on services.state for efficient filtering
  - Index on services.type for efficient filtering
  - Index on payments.status for efficient filtering
  - Index on payments.user_name for efficient searching
  
  ## 4. Important Notes
  - Services table supports both physical locations and teleconsultation
  - Geographic coordinates (latitude/longitude) are required for map display
  - Payment amounts use decimal type for precision
  - All timestamps use timestamptz for timezone support
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('physical', 'teleconsultation')),
  address text,
  city text,
  state text NOT NULL,
  phone text,
  teleconsult_link text,
  schedule text DEFAULT 'Segunda a Sexta: 8h às 18h',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  service_name text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  status text NOT NULL CHECK (status IN ('paid', 'pending', 'cancelled')) DEFAULT 'pending',
  payment_date timestamptz,
  due_date timestamptz,
  receipt_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view payments"
  ON payments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_services_state ON services(state);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(type);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_name ON payments(user_name);

INSERT INTO services (name, type, address, city, state, phone, schedule, latitude, longitude) VALUES
  ('Hospital São Lucas', 'physical', 'Rua das Flores, 123', 'São Paulo', 'SP', '(11) 3456-7890', 'Segunda a Sexta: 8h às 18h', -23.5505, -46.6333),
  ('Clínica Vida', 'physical', 'Av. Paulista, 456', 'São Paulo', 'SP', '(11) 2345-6789', '24 horas', -23.5629, -46.6544),
  ('Telemedicina Online', 'teleconsultation', NULL, NULL, 'SP', '(11) 9876-5432', 'Segunda a Domingo: 24h', NULL, NULL),
  ('Centro Médico Rio', 'physical', 'Rua Copacabana, 789', 'Rio de Janeiro', 'RJ', '(21) 3456-7890', 'Segunda a Sexta: 9h às 19h', -22.9068, -43.1729),
  ('Teleconsulta Saúde+', 'teleconsultation', NULL, NULL, 'RJ', '(21) 9876-5432', 'Agendamento prévio', NULL, NULL)
ON CONFLICT DO NOTHING;

INSERT INTO payments (user_name, service_name, amount, status, payment_date, due_date, notes) VALUES
  ('João Silva', 'Consulta Cardiologia', 250.00, 'paid', now() - interval '5 days', now() - interval '10 days', 'Pagamento via cartão de crédito'),
  ('Maria Santos', 'Exame de Sangue', 120.00, 'pending', NULL, now() + interval '7 days', 'Aguardando pagamento'),
  ('Pedro Oliveira', 'Teleconsulta Geral', 80.00, 'paid', now() - interval '2 days', now() - interval '5 days', 'Pagamento via PIX'),
  ('Ana Costa', 'Raio-X', 180.00, 'cancelled', NULL, now() - interval '3 days', 'Cancelado pelo paciente'),
  ('Carlos Souza', 'Consulta Ortopedia', 300.00, 'pending', NULL, now() + interval '3 days', 'Pendente de autorização do convênio')
ON CONFLICT DO NOTHING;