export interface Student {
    student_id: number;
    name: string;
    email: string;
    password: string;
    bio: string;
    skills: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    project_id: number;
    title: string;
    description: string;
    requirements: string;
    skills: string[];
    duration: string;
    employer_id: number;
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface Application {
    application_id: number;
    student_id: number;
    project_id: number;
    application_date: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Task {
    task_id: number;
    project_id: number;
    task_description: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
}

export interface Submission {
    submission_id: number;
    task_id: number;
    student_id: number;
    file_path: string;
    submitted_at: string;
    status: 'submitted' | 'reviewed' | 'rejected';
}

export interface Feedback {
    feedback_id: number;
    project_id: number;
    student_id: number;
    rating: number;
    comment: string;
    created_at: string;
} 