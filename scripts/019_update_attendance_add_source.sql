-- Add source column to attendance table to track manual vs biometric
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'biometric'));

-- Create index for source filtering
CREATE INDEX IF NOT EXISTS idx_attendance_source ON attendance(source);

-- Add comment to explain the source field
COMMENT ON COLUMN attendance.source IS 'Indicates whether attendance was recorded manually (manual) or via biometric system (biometric)';
