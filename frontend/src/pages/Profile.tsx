import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import type { Student, Application, Task, Submission } from '../types';

// Dummy data for testing
const dummyApplications: Application[] = [
  {
    application_id: '1',
    student_id: '1',
    project_id: '1',
    status: 'pending',
    application_date: '2024-03-15'
  },
  {
    application_id: '2',
    student_id: '1',
    project_id: '2',
    status: 'accepted',
    application_date: '2024-03-10'
  }
];

const dummyTasks: Task[] = [
  {
    task_id: '1',
    project_id: '1',
    student_id: '1',
    task_description: 'Complete the frontend implementation',
    status: 'in_progress',
    due_date: '2024-03-25'
  },
  {
    task_id: '2',
    project_id: '2',
    student_id: '1',
    task_description: 'Review and test the API endpoints',
    status: 'pending',
    due_date: '2024-03-30'
  }
];

const dummySubmissions: Submission[] = [
  {
    submission_id: '1',
    task_id: '1',
    student_id: '1',
    file_path: 'submissions/task1.zip',
    status: 'pending',
    submitted_at: '2024-03-20'
  }
];

const statusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
    case 'completed':
    case 'submitted':
      return 'bg-teal-100 text-teal-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Profile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'tasks' | 'submissions'>('overview');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <p className="text-center text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'applications', label: 'Applications', icon: '📄' },
    { id: 'tasks', label: 'Tasks', icon: '📝' },
    { id: 'submissions', label: 'Submissions', icon: '✅' },
  ];

  // Filter tabs based on user role
  const filteredTabs = user.role === 'employer' 
    ? tabs.filter(tab => tab.id !== 'applications' && tab.id !== 'tasks' && tab.id !== 'submissions')
    : tabs;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 space-y-4 md:space-y-0 md:space-x-6">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-teal-600">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              {user.role === 'employer' && user.company_name && (
                <p className="text-teal-600 font-medium mt-1">{user.company_name}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                Edit Profile
              </button>
              {user.role === 'student' && (
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                  Update Skills
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
              <p className="text-gray-600">{user.bio || 'No bio provided'}</p>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-teal-50 text-teal-700 border border-teal-100"
                  >
                    {skill}
                  </span>
                )) || <p className="text-gray-500">No skills listed</p>}
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                {user.role === 'student' ? (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-600">{dummyApplications.length}</div>
                      <div className="text-sm text-gray-500">Applications</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-600">{dummyTasks.filter(t => t.status === 'completed').length}</div>
                      <div className="text-sm text-gray-500">Completed Tasks</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-600">5</div>
                      <div className="text-sm text-gray-500">Posted Projects</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-teal-600">12</div>
                      <div className="text-sm text-gray-500">Total Applications</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {user.role === 'student' ? (
                  <>
                    <div className="flex items-center text-sm">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                        <span className="text-teal-600">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-900">Applied to Project #123</p>
                        <p className="text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600">📝</span>
                      </div>
                      <div>
                        <p className="text-gray-900">Completed Task #456</p>
                        <p className="text-gray-500">5 days ago</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-sm">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                        <span className="text-teal-600">📢</span>
                      </div>
                      <div>
                        <p className="text-gray-900">Posted new project</p>
                        <p className="text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600">👥</span>
                      </div>
                      <div>
                        <p className="text-gray-900">Received 3 new applications</p>
                        <p className="text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && user.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyApplications.map((application) => (
              <div
                key={application.application_id}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(application.status)}`}>
                    {application.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(application.application_date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Project #{application.project_id}</h4>
                <div className="flex items-center space-x-4 mt-4">
                  <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                    View Details
                  </button>
                  {application.status === 'pending' && (
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && user.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyTasks.map((task) => (
              <div
                key={task.task_id}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{task.task_description}</h4>
                <div className="flex items-center space-x-4 mt-4">
                  <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                    View Details
                  </button>
                  {task.status === 'pending' && (
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                      Start Task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submissions' && user.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummySubmissions.map((submission) => (
              <div
                key={submission.submission_id}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Task #{submission.task_id}</h4>
                <p className="text-gray-500 text-sm mb-4">{submission.file_path}</p>
                <div className="flex items-center space-x-4">
                  <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                    View Submission
                  </button>
                  <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 