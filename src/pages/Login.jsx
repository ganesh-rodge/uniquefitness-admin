import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await adminLogin(formData.email, formData.password);
      console.log('Full login response:', res);
      if (res.data && res.data.data && res.data.data.accessToken) {
        localStorage.setItem('authToken', res.data.data.accessToken);
        setSuccess(res.data.message || 'Admin logged in successfully!');
        setError('');
        console.log('Admin Info:', res.data.data.admin);
        setTimeout(() => navigate('/dashboard'), 700);
      } else {
        setError(res.data?.message || 'Invalid credentials');
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSendOtp = async () => {
    if (!forgotPasswordData.email) {
      setError('Please enter your email address');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('OTP sent successfully to your email!');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!forgotPasswordData.otp || !forgotPasswordData.newPassword) {
      setError('Please enter both OTP and new password');
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to verify OTP and update password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password updated successfully!');
      
      // Reset forgot password state and go back to login
      setShowForgotPassword(false);
      setForgotPasswordData({ email: '', otp: '', newPassword: '' });
    } catch (err) {
      setError('Failed to update password. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setError('');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordData({ email: '', otp: '', newPassword: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto mb-4"
            src="/logoFull.jpeg"
            alt="Unique Fitness"
          />
          <h2 className="text-3xl font-bold text-white mb-2">
            Admin Panel
          </h2>
          <p className="text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        {!showForgotPassword ? (
          // Login Form
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 transition-all duration-200 sm:text-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 transition-all duration-200 sm:text-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-white focus:z-30"
                    tabIndex={-1}
                    onClick={() => setShowLoginPassword((v) => !v)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13M6.13 6.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.17 4.61M17.87 17.87A9.96 9.96 0 0112 21c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Success message */}
            {success && (
              <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            {/* Error message */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-4">
              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-primary cursor-pointer bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Forgot password button */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-center text-sm text-primary text-white cursor-pointer hover:text-yellow-300 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        ) : (
          // Forgot Password Form - Single Page with All Fields
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Reset Password</h3>
              <p className="text-gray-400 text-sm">
                Enter all details below to reset your password
              </p>
            </div>

            <div className="space-y-4">
              {/* Email with Send OTP Button */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex space-x-3">
                  <input
                    name="email"
                    type="email"
                    required
                    className="flex-1 px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 sm:text-sm"
                    placeholder="Enter your email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="px-6 py-3 bg-primary cursor-pointer bg-yellow-300 text-black font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {otpLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* OTP Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OTP
                </label>
                <input
                  name="otp"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 sm:text-sm"
                  placeholder="Enter OTP"
                  value={forgotPasswordData.otp}
                  onChange={handleForgotPasswordChange}
                />
              </div>

              {/* New Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 sm:text-sm"
                    placeholder="Enter new password"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-white focus:z-30"
                    tabIndex={-1}
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13M6.13 6.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.17 4.61M17.87 17.87A9.96 9.96 0 0112 21c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Update Password Button */}
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary cursor-pointer bg-yellow-300 text-black font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Back to login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default Login;