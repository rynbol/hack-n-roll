-- Migration: Add AI-powered profile generation and student-specific features
-- Date: 2026-01-17
-- Description: Creates tables for AI-generated profiles, student information, majors, and classes

-- AI-generated profile content
CREATE TABLE IF NOT EXISTS ai_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  photo_url TEXT NOT NULL,
  generated_bio TEXT NOT NULL,
  personality_traits JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  conversation_starters JSONB DEFAULT '[]'::jsonb,
  ai_provider TEXT NOT NULL CHECK (ai_provider IN ('claude', 'openai')),
  generation_timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student-specific information
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  university TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  major TEXT,
  graduation_year INTEGER,
  classes JSONB DEFAULT '[]'::jsonb,
  study_interests JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Academic majors lookup table
CREATE TABLE IF NOT EXISTS majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes/courses table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code, university)
);

-- User-class relationships (many-to-many)
CREATE TABLE IF NOT EXISTS student_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(user_id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  semester TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_profiles_user_id ON ai_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_profiles_is_active ON ai_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_university ON student_profiles(university);
CREATE INDEX IF NOT EXISTS idx_student_profiles_major ON student_profiles(major);
CREATE INDEX IF NOT EXISTS idx_classes_university ON classes(university);
CREATE INDEX IF NOT EXISTS idx_student_classes_student_id ON student_classes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_classes_class_id ON student_classes(class_id);

-- Add columns to existing profiles table to link AI and student profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS student_profile_id UUID REFERENCES student_profiles(id),
ADD COLUMN IF NOT EXISTS active_ai_profile_id UUID REFERENCES ai_profiles(id);

-- Create indexes on new foreign key columns
CREATE INDEX IF NOT EXISTS idx_profiles_student_profile_id ON profiles(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_active_ai_profile_id ON profiles(active_ai_profile_id);

-- Enable Row Level Security
ALTER TABLE ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_classes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_profiles
CREATE POLICY "Users can view their own AI profiles"
  ON ai_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI profiles"
  ON ai_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI profiles"
  ON ai_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Users can view their own student profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own student profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for majors (public read)
CREATE POLICY "Anyone can view majors"
  ON majors FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for classes (public read for same university)
CREATE POLICY "Authenticated users can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for student_classes
CREATE POLICY "Users can view their own classes"
  ON student_classes FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Users can create their own class enrollments"
  ON student_classes FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can delete their own class enrollments"
  ON student_classes FOR DELETE
  USING (auth.uid() = student_id);

-- Seed common majors
INSERT INTO majors (name, category) VALUES
  ('Computer Science', 'STEM'),
  ('Software Engineering', 'STEM'),
  ('Data Science', 'STEM'),
  ('Information Systems', 'STEM'),
  ('Mathematics', 'STEM'),
  ('Physics', 'STEM'),
  ('Chemistry', 'STEM'),
  ('Biology', 'STEM'),
  ('Engineering', 'STEM'),
  ('Mechanical Engineering', 'STEM'),
  ('Electrical Engineering', 'STEM'),
  ('Civil Engineering', 'STEM'),
  ('Business Administration', 'Business'),
  ('Economics', 'Business'),
  ('Finance', 'Business'),
  ('Marketing', 'Business'),
  ('Accounting', 'Business'),
  ('Psychology', 'Social Sciences'),
  ('Sociology', 'Social Sciences'),
  ('Political Science', 'Social Sciences'),
  ('International Relations', 'Social Sciences'),
  ('English', 'Humanities'),
  ('History', 'Humanities'),
  ('Philosophy', 'Humanities'),
  ('Fine Arts', 'Arts'),
  ('Music', 'Arts'),
  ('Theater', 'Arts'),
  ('Graphic Design', 'Arts'),
  ('Communications', 'Communications'),
  ('Journalism', 'Communications'),
  ('Media Studies', 'Communications')
ON CONFLICT (name) DO NOTHING;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at automatically
CREATE TRIGGER update_ai_profiles_updated_at
  BEFORE UPDATE ON ai_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get student profiles with AI-generated content (updated get_profiles)
CREATE OR REPLACE FUNCTION get_student_profiles(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  profile_id UUID,
  user_id UUID,
  name TEXT,
  age INTEGER,
  city TEXT,
  country TEXT,
  photo_url TEXT,
  bio TEXT,
  major TEXT,
  university TEXT,
  classes JSONB,
  study_interests JSONB,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS profile_id,
    p.user_id,
    p.name,
    p.age,
    p.city,
    p.country,
    ap.photo_url,
    ap.generated_bio AS bio,
    sp.major,
    sp.university,
    sp.classes,
    sp.study_interests,
    ST_Distance(
      p.location::geography,
      (SELECT location::geography FROM profiles WHERE user_id = p_user_id)
    ) / 1000 AS distance_km
  FROM profiles p
  LEFT JOIN ai_profiles ap ON p.active_ai_profile_id = ap.id
  LEFT JOIN student_profiles sp ON p.student_profile_id = sp.id
  WHERE p.user_id != p_user_id
    AND p.user_id NOT IN (
      SELECT CASE
        WHEN user_id_1 = p_user_id THEN user_id_2
        WHEN user_id_2 = p_user_id THEN user_id_1
      END
      FROM interactions
      WHERE (user_id_1 = p_user_id OR user_id_2 = p_user_id)
        AND action IN ('like', 'skip')
    )
    -- Same university filter
    AND sp.university = (
      SELECT university FROM student_profiles WHERE user_id = p_user_id
    )
  ORDER BY distance_km ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
