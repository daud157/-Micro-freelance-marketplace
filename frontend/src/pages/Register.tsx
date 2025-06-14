import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { UserRole, StudentRegistration, EmployerRegistration } from '../types';

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState<UserRole | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        skills: '',
        company_name: '',
        company_description: '',
    });

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(formData.password)) {
            setError('Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(formData.password)) {
            setError('Password must contain at least one number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!role) {
            setError('Please select a role');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            if (role === 'student') {
                const studentData: StudentRegistration = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    bio: formData.bio,
                    skills: formData.skills.split(',').map(s => s.trim()),
                    role: 'student'
                };
                await api.registerStudent(studentData);
            } else {
                const employerData: EmployerRegistration = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    company_name: formData.company_name,
                    company_description: formData.company_description,
                    role: 'employer'
                };
                await api.registerEmployer(employerData);
            }
            navigate('/login');
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-block p-3 rounded-2xl bg-teal-100 mb-4">
                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Create your account
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                        Join our community of database professionals
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                            <p className="text-sm text-red-600 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email and Password (always shown first) */}
                        <div className="space-y-4">
                            <div className="group">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                    Email address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be at least 8 characters with uppercase, lowercase, and numbers
                                </p>
                            </div>

                            <div className="group">
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Selection Dropdown */}
                        <div className="group">
                            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                I want to join as
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    required
                                    className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base appearance-none bg-white"
                                >
                                    <option value="" disabled>Select role</option>
                                    <option value="student">Student</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>
                        </div>

                        {/* Name field (shown for both roles) */}
                        {role && (
                            <div className="group animate-fade-in">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                    {role === 'student' ? 'Full Name' : 'Contact Person Name'}
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base"
                                        placeholder={role === 'student' ? 'Daud' : 'Daud'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Role-specific fields */}
                        {role === 'student' ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="group">
                                    <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                        Bio
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                            </svg>
                                        </div>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={3}
                                            required
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base resize-none"
                                            placeholder="Tell us about yourself and your database interests..."
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                        Skills (comma-separated)
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="skills"
                                            name="skills"
                                            required
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="e.g., SQL, Python, Data Analysis"
                                            className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : role === 'employer' ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="group">
                                    <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                        Company Name
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="company_name"
                                            name="company_name"
                                            required
                                            value={formData.company_name}
                                            onChange={handleChange}
                                            className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base"
                                            placeholder="Your Company Ltd."
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="company_description" className="block text-sm font-semibold text-gray-700 group-focus-within:text-teal-600 transition-colors duration-200">
                                        Company Description
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                            </svg>
                                        </div>
                                        <textarea
                                            id="company_description"
                                            name="company_description"
                                            rows={3}
                                            required
                                            value={formData.company_description}
                                            onChange={handleChange}
                                            className="pl-10 py-3.5 block w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200 text-base resize-none"
                                            placeholder="Tell us about your company and what you do..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors duration-200">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 