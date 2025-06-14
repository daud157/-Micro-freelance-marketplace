import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Micro freelance{' '}
            <span className="text-teal-600">
            Marketplace
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A platform for students to find and work on real-world database projects.
            Connect with employers, showcase your skills, and build your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink
              to="/projects"
              className="w-full sm:w-auto bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md"
            >
              Browse Projects
            </RouterLink>
            <RouterLink
              to="/register"
              className="w-full sm:w-auto border border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
            >
              Register as Student
            </RouterLink>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DBRM?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Projects</h3>
              <p className="text-gray-600">
                Work on real-world database projects from industry partners.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">
                Build your portfolio and connect with potential employers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Grow</h3>
              <p className="text-gray-600">
                Gain practical experience and enhance your database skills.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="bg-teal-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
              Join our community of database enthusiasts and start your journey today.
            </p>
            <RouterLink
              to="/register"
              className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
            >
              Create Account
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;