-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS weego_db;
USE weego_db;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio TEXT,
    skills TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    employer_name TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    application_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    application_date TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    task_description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'submitted',
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    rating INTEGER,
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Indexes for better query performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Create a view for active projects with application counts
CREATE VIEW active_projects_view AS
SELECT 
    p.project_id,
    p.title,
    p.employer_name,
    p.deadline,
    COUNT(a.application_id) as application_count
FROM projects p
LEFT JOIN applications a ON p.project_id = a.project_id
WHERE p.status = 'open'
GROUP BY p.project_id;

-- Create a view for student performance metrics
CREATE VIEW student_performance_view AS
SELECT 
    s.student_id,
    s.name,
    COUNT(DISTINCT p.project_id) as completed_projects,
    AVG(f.rating) as average_rating,
    COUNT(DISTINCT sub.submission_id) as total_submissions
FROM students s
LEFT JOIN applications a ON s.student_id = a.student_id
LEFT JOIN projects p ON a.project_id = p.project_id
LEFT JOIN feedback f ON s.student_id = f.student_id
LEFT JOIN submissions sub ON s.student_id = sub.student_id
GROUP BY s.student_id; 