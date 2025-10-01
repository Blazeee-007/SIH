/*
  # Initial Schema for Prashikshan Platform

  ## Overview
  Complete database schema for the Academia-Industry Internship Platform connecting
  students with mentors through meaningful internship experiences.

  ## 1. New Tables

  ### `users`
  User profiles and authentication information
  - `id` (uuid, primary key)
  - `email` (text, unique) - User email address
  - `password` (text) - Hashed password
  - `name` (text) - Full name
  - `role` (text) - User role: student, mentor, or admin
  - `phone` (text) - Contact phone number
  - `bio` (text) - User biography
  - `skills` (text) - Skills and expertise
  - `resume_url` (text) - URL to uploaded resume
  - `avatar_url` (text) - Profile picture URL
  - `is_active` (boolean) - Account activation status
  - `is_verified` (boolean) - Email verification status
  - `login_attempts` (integer) - Failed login attempt counter
  - `locked_until` (timestamptz) - Account lock expiration
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `internships`
  Internship opportunities posted by mentors
  - `id` (uuid, primary key)
  - `mentor_id` (uuid, foreign key) - Reference to mentor user
  - `title` (text) - Internship title
  - `description` (text) - Detailed description
  - `company` (text) - Company name
  - `location` (text) - Work location
  - `duration` (text) - Internship duration
  - `stipend` (text) - Compensation details
  - `requirements` (text) - Required qualifications
  - `skills_required` (text) - Required skills
  - `start_date` (timestamptz) - Start date
  - `end_date` (timestamptz) - End date
  - `max_applicants` (integer) - Maximum number of applicants
  - `status` (text) - Status: draft, published, closed, completed
  - `is_approved` (boolean) - Admin approval status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `applications`
  Student applications to internships
  - `id` (uuid, primary key)
  - `internship_id` (uuid, foreign key)
  - `student_id` (uuid, foreign key)
  - `cover_letter` (text) - Application cover letter
  - `resume_url` (text) - Resume file URL
  - `status` (text) - Status: pending, accepted, rejected, withdrawn
  - `applied_at` (timestamptz) - Application submission time
  - `reviewed_at` (timestamptz) - Review timestamp
  - `reviewer_notes` (text) - Mentor's review notes

  ### `tasks`
  Tasks assigned to students during internships
  - `id` (uuid, primary key)
  - `internship_id` (uuid, foreign key)
  - `assigned_to` (uuid, foreign key) - Student ID
  - `title` (text) - Task title
  - `description` (text) - Task details
  - `due_date` (timestamptz) - Deadline
  - `priority` (text) - Priority: low, medium, high, urgent
  - `status` (text) - Status: assigned, in_progress, submitted, completed, overdue
  - `max_points` (integer) - Maximum score
  - `created_by` (uuid, foreign key) - Mentor who created task
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `task_submissions`
  Student submissions for assigned tasks
  - `id` (uuid, primary key)
  - `task_id` (uuid, foreign key)
  - `student_id` (uuid, foreign key)
  - `submission_text` (text) - Submission content
  - `submission_url` (text) - Submission file URL
  - `submitted_at` (timestamptz)
  - `graded_at` (timestamptz)
  - `grade` (integer) - Score received
  - `feedback` (text) - Mentor feedback
  - `graded_by` (uuid, foreign key) - Mentor ID

  ### `feedback`
  Mentor feedback and ratings for students
  - `id` (uuid, primary key)
  - `internship_id` (uuid, foreign key)
  - `student_id` (uuid, foreign key)
  - `mentor_id` (uuid, foreign key)
  - `rating` (integer) - Overall rating (1-5)
  - `comment` (text) - Feedback comment
  - `skills_rating` (text) - Skills assessment JSON
  - `communication_rating` (integer) - Communication score (1-5)
  - `technical_rating` (integer) - Technical skills score (1-5)
  - `professionalism_rating` (integer) - Professionalism score (1-5)
  - `created_at` (timestamptz)

  ### `notifications`
  System notifications for users
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `title` (text) - Notification title
  - `message` (text) - Notification content
  - `type` (text) - Type: info, success, warning, error
  - `link` (text) - Optional link URL
  - `is_read` (boolean) - Read status
  - `created_at` (timestamptz)

  ## 2. Security

  - Enable RLS on all tables
  - Users can read their own data
  - Students can view published internships
  - Mentors can manage their own internships
  - Admins have full access to all resources
  - Students can create applications and submissions
  - Mentors can review applications and grade submissions

  ## 3. Indexes

  Performance indexes on frequently queried columns:
  - user emails and roles
  - internship status and mentor
  - application status and relationships
  - task assignments and status
  - notification user and read status
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text CHECK(role IN ('student', 'mentor', 'admin')) NOT NULL,
  phone text,
  bio text,
  skills text,
  resume_url text,
  avatar_url text,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  login_attempts integer DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  company text NOT NULL,
  location text,
  duration text,
  stipend text,
  requirements text,
  skills_required text,
  start_date timestamptz,
  end_date timestamptz,
  max_applicants integer DEFAULT 10,
  status text CHECK(status IN ('draft', 'published', 'closed', 'completed')) DEFAULT 'draft',
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text,
  status text CHECK(status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewer_notes text,
  UNIQUE(internship_id, student_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  due_date timestamptz,
  priority text CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status text CHECK(status IN ('assigned', 'in_progress', 'submitted', 'completed', 'overdue')) DEFAULT 'assigned',
  max_points integer DEFAULT 100,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_text text,
  submission_url text,
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  grade integer,
  feedback text,
  graded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(task_id, student_id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer CHECK(rating >= 1 AND rating <= 5),
  comment text,
  skills_rating text,
  communication_rating integer CHECK(communication_rating >= 1 AND communication_rating <= 5),
  technical_rating integer CHECK(technical_rating >= 1 AND technical_rating <= 5),
  professionalism_rating integer CHECK(professionalism_rating >= 1 AND professionalism_rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(internship_id, student_id, mentor_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK(type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_internships_mentor ON internships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_applications_internship ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_tasks_internship ON tasks(internship_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can view published internships"
  ON internships FOR SELECT
  TO authenticated
  USING (
    status = 'published' AND is_approved = true
    OR mentor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Mentors can insert own internships"
  ON internships FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = mentor_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'mentor'
    )
  );

CREATE POLICY "Mentors can update own internships"
  ON internships FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentor_id)
  WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can delete own internships"
  ON internships FOR DELETE
  TO authenticated
  USING (auth.uid() = mentor_id);

CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM internships
      WHERE internships.id = applications.internship_id
      AND internships.mentor_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Students can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can view assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Mentors can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'mentor'
    )
  );

CREATE POLICY "Mentors can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Mentors can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can view own submissions"
  ON task_submissions FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_submissions.task_id
      AND tasks.created_by = auth.uid()
    )
  );

CREATE POLICY "Students can create submissions"
  ON task_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions"
  ON task_submissions FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view relevant feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR mentor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Mentors can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = mentor_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'mentor'
    )
  );
