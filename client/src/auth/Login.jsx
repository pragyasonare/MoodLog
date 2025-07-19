import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import Toast from "../components/Toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Added success state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await register(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess("Registration successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500); // Give user time to see the toast
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141010] flex items-center justify-center p-4">
      {/* ✅ Toasts */}
      {error && <Toast message={error} onClose={() => setError("")} />}
      {success && (
        <Toast message={success} isSuccess onClose={() => setSuccess("")} />
      )}

      {/* Animated music notes in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <MusicalNoteIcon
            key={i}
            className="absolute text-white opacity-5"
            style={{
              fontSize: `${Math.random() * 30 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md bg-[#1e1a1a] rounded-xl shadow-2xl overflow-hidden border border-[#2a2525] relative z-10">
        <div className="bg-gradient-to-r from-[#ff4d4d] to-[#f9cb28] p-6 text-center">
          <div className="flex justify-center mb-2">
            <MusicalNoteIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Join MoodLog</h2>
          <p className="text-[#f0e6e6] mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-[#a5a5a5]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#2a2525] border border-[#3a3434] rounded-lg focus:ring-2 focus:ring-[#f9cb28] focus:border-transparent text-white placeholder-[#a5a5a5]"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-[#a5a5a5]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-3 bg-[#2a2525] border border-[#3a3434] rounded-lg focus:ring-2 focus:ring-[#f9cb28] focus:border-transparent text-white placeholder-[#a5a5a5]"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-[#a5a5a5] hover:text-white" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-[#a5a5a5] hover:text-white" />
                )}
              </button>

              {password.length > 0 && password.length < 6 && (
                <p className="text-xs text-red-400 mt-1 pl-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#141010] bg-gradient-to-r from-[#f9cb28] to-[#ff8a4d] hover:from-[#ffd95b] hover:to-[#ff9d6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f9cb28] transition-all duration-300 ${
              isLoading ? "opacity-80 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#141010]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              <>
                <MusicalNoteIcon className="w-5 h-5 mr-2" />
                Register
              </>
            )}
          </button>
        </form>

        <div className="px-8 py-4 bg-[#1e1a1a] text-center border-t border-[#2a2525]">
          <p className="text-sm text-[#a5a5a5]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#f9cb28] hover:text-[#ffd95b]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
