-- Create compliance policies table
CREATE TABLE IF NOT EXISTS compliance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  version VARCHAR(20),
  description TEXT,
  effective_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create compliance audits table
CREATE TABLE IF NOT EXISTS compliance_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_name VARCHAR(255) NOT NULL,
  audit_type VARCHAR(100),
  description TEXT,
  status VARCHAR(50) DEFAULT 'scheduled',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  findings TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create employee acknowledgments table
CREATE TABLE IF NOT EXISTS employee_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES profiles(id),
  policy_id UUID REFERENCES compliance_policies(id),
  acknowledged_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE compliance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_acknowledgments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "HR admins can manage compliance policies" ON compliance_policies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hr_admin'
    )
  );

CREATE POLICY "Employees can view compliance policies" ON compliance_policies
  FOR SELECT USING (true);

CREATE POLICY "HR admins can manage audits" ON compliance_audits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hr_admin'
    )
  );

CREATE POLICY "HR admins can manage acknowledgments" ON employee_acknowledgments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'hr_admin'
    )
  );

CREATE POLICY "Employees can view their acknowledgments" ON employee_acknowledgments
  FOR SELECT USING (employee_id = auth.uid());
