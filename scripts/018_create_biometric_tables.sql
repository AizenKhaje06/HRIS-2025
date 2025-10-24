-- Create attendance_devices table for registered tablets
CREATE TABLE IF NOT EXISTS attendance_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name VARCHAR(255) NOT NULL,
  device_id VARCHAR(255) NOT NULL UNIQUE,
  device_type VARCHAR(50) DEFAULT 'android_tablet',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  registered_by UUID NOT NULL REFERENCES profiles(id),
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create device_employees table for biometric enrollment
CREATE TABLE IF NOT EXISTS device_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES attendance_devices(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  biometric_template BYTEA,
  enrollment_status VARCHAR(20) DEFAULT 'pending' CHECK (enrollment_status IN ('pending', 'enrolled', 'failed')),
  enrolled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, employee_id)
);

-- Create biometric_attendance table for biometric time records
CREATE TABLE IF NOT EXISTS biometric_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES attendance_devices(id),
  employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attendance_id UUID REFERENCES attendance(id),
  record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('time_in', 'lunch_out', 'lunch_in', 'time_out')),
  recorded_at TIMESTAMPTZ NOT NULL,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_devices_status ON attendance_devices(status);
CREATE INDEX IF NOT EXISTS idx_device_employees_device_id ON device_employees(device_id);
CREATE INDEX IF NOT EXISTS idx_device_employees_employee_id ON device_employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_biometric_attendance_device_id ON biometric_attendance(device_id);
CREATE INDEX IF NOT EXISTS idx_biometric_attendance_employee_id ON biometric_attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_biometric_attendance_recorded_at ON biometric_attendance(recorded_at);

-- Enable RLS
ALTER TABLE attendance_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance_devices
CREATE POLICY "HR admins can view all devices"
  ON attendance_devices FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can manage devices"
  ON attendance_devices FOR INSERT
  WITH CHECK (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can update devices"
  ON attendance_devices FOR UPDATE
  USING (public.is_hr_admin(auth.uid()));

-- RLS Policies for device_employees
CREATE POLICY "HR admins can view enrollments"
  ON device_employees FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "HR admins can manage enrollments"
  ON device_employees FOR INSERT
  WITH CHECK (public.is_hr_admin(auth.uid()));

-- RLS Policies for biometric_attendance
CREATE POLICY "Employees can view their biometric records"
  ON biometric_attendance FOR SELECT
  USING (auth.uid() = employee_id);

CREATE POLICY "HR admins can view all biometric records"
  ON biometric_attendance FOR SELECT
  USING (public.is_hr_admin(auth.uid()));

CREATE POLICY "System can insert biometric records"
  ON biometric_attendance FOR INSERT
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE TRIGGER update_attendance_devices_updated_at
  BEFORE UPDATE ON attendance_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_employees_updated_at
  BEFORE UPDATE ON device_employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
