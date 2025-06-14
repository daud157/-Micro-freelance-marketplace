import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, isLoading } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData.email, formData.password);
      
      // Redirect to the page they tried to visit or home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 min-h-[600px] flex flex-col justify-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-8 border border-gray-100/50 transform hover:scale-[1.01] transition-all duration-300">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <svg className="h-12 w-12 text-teal-600 transform hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
            Sign in to your account
          </h2>
          <p className="text-center text-base text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200 inline-flex items-center group"
            >
              create a new account
              <svg className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </p>
        </div>

        {(error || authError) && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error || authError}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="peer appearance-none relative block w-full pl-12 pr-4 pt-6 pb-2 bg-gray-50/50 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:z-10 text-base transition-all duration-200 rounded-xl shadow-inner hover:bg-gray-50/80 focus:bg-white"
                // placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              <label
                htmlFor="email"
                className="absolute left-12 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-sm peer-focus:top-2 peer-focus:text-teal-600"
              >
                Email address
              </label>
              <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-teal-500/20 group-focus-within:ring-offset-2"></div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="peer appearance-none relative block w-full pl-12 pr-4 pt-6 pb-2 bg-gray-50/50 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:z-10 text-base transition-all duration-200 rounded-xl shadow-inner hover:bg-gray-50/80 focus:bg-white"
                // placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <label
                htmlFor="password"
                className="absolute left-12 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-sm peer-focus:top-2 peer-focus:text-teal-600"
              >
                Password
              </label>
              <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-teal-500/20 group-focus-within:ring-offset-2"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center group">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-2 border-gray-200 rounded shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-teal-500/50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-base text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                Remember me
              </label>
            </div>

            <div className="text-base">
              <a href="#" className="font-medium text-teal-600 hover:text-teal-500 inline-flex items-center group">
                Forgot password?
                <svg className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-4 px-4 border-2 border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <svg className="h-6 w-6 text-teal-500 group-hover:text-teal-400 transform group-hover:scale-110 transition-all duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 