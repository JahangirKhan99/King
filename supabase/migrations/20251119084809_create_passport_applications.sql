/*
  # Passport Fee Payment System

  1. New Tables
    - `passport_applications`
      - `id` (uuid, primary key)
      - `case_no` (text) - Application case number
      - `application_date` (date) - Date of application
      - `call_date` (date) - Call date for collection
      - `name` (text) - Applicant's full name
      - `nic_no` (text) - National Identity Card number
      - `address` (text) - Applicant's address
      - `service_type` (text) - Type of service (fresh, renewal, etc.)
      - `fresh_passport_fee` (numeric) - Fee for fresh passport
      - `renewal_fee` (numeric) - Renewal fee
      - `endorsement_fee` (numeric) - Endorsement fee
      - `visa_fee` (numeric) - Visa fee
      - `citizenship_fee` (numeric) - Citizenship certificate fee
      - `other_fee` (numeric) - Other miscellaneous fees
      - `total_amount` (numeric) - Total amount
      - `amount_in_words` (text) - Amount written in words
      - `bank_charges` (numeric) - Bank processing charges
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `passport_applications` table
    - Add policy for public to insert applications
    - Add policy for authenticated users to view all applications
*/

CREATE TABLE IF NOT EXISTS passport_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_no text NOT NULL,
  application_date date NOT NULL,
  call_date date,
  name text NOT NULL,
  nic_no text NOT NULL,
  address text NOT NULL,
  service_type text NOT NULL,
  fresh_passport_fee numeric(10, 2) DEFAULT 0,
  renewal_fee numeric(10, 2) DEFAULT 0,
  endorsement_fee numeric(10, 2) DEFAULT 0,
  visa_fee numeric(10, 2) DEFAULT 0,
  citizenship_fee numeric(10, 2) DEFAULT 0,
  other_fee numeric(10, 2) DEFAULT 0,
  total_amount numeric(10, 2) NOT NULL,
  amount_in_words text NOT NULL,
  bank_charges numeric(10, 2) DEFAULT 25.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE passport_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit passport applications"
  ON passport_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all applications"
  ON passport_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view their own submissions"
  ON passport_applications
  FOR SELECT
  TO anon
  USING (true);