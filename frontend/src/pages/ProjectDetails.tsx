import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import ApplicationForm from '../components/ApplicationForm';
import { submitApplication } from '../services/applicationService';
import { toast } from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  duration: string;
  status: string;
  employer_id: string;
  employer?: {
    name: string;
    company_name: string;
  };
}

interface ProjectDetailsProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (projectId: string) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, isOpen, onClose, onApply }) => {
  const { user } = useUser();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async (coverLetter: string) => {
    try {
      if (!project) return;
      
      const response = await submitApplication(project.id, coverLetter);
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
      throw err;
    }
  };

  if (!isOpen || !project) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                <p className="mt-1 text-sm text-gray-500">Project Details</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'open' ? 'bg-green-100 text-green-800' :
                project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Description</h3>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Requirements</h3>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{project.requirements}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Required Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Duration</h3>
                  </div>
                  <p className="text-gray-600">{project.duration}</p>
                </div>

                {/* Employer Info */}
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="font-medium text-gray-900">Posted by</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 font-medium">{project.employer?.company_name || 'Unknown Company'}</p>
                    {project.employer?.name && (
                      <p className="text-gray-600 text-sm mt-1">{project.employer.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Close
              </button>
              {user?.role === 'student' && project.status === 'open' && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <ApplicationForm
          projectId={project.id}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleApply}
        />
      )}
    </>
  );
};

export default ProjectDetails; 