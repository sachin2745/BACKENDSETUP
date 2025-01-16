import React from "react";

const AdminLogin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg ">
        <div className="flex flex-col items-center mb-6">
          {/* Logo/Icon */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c.654 0 1.296-.158 1.863-.448a3.001 3.001 0 10-3.726 0A3.98 3.98 0 0012 11zm0 10c-4.418 0-8-1.79-8-4v-1a4 4 0 013.645-3.972A7.978 7.978 0 0112 18c2.21 0 4.21-.895 5.645-2.355A4 4 0 0120 16v1c0 2.21-3.582 4-8 4z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 ">
            Login to Your Account
          </h2>
          <p className="text-sm text-gray-600  text-center">
            Get started with our app, and enjoy the experience.
          </p>
        </div>

        <form>
          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 "
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="current-username"
              className="mt-1 w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 "
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="mt-1 w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
