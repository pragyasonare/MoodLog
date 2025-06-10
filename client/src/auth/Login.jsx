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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return; // Stop form submission
    }

    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Toast message={error} onClose={() => setError("")} />}
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 ...">
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4">
          {/* Animated music notes in background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <MusicalNoteIcon
                key={i}
                className="absolute text-white opacity-10"
                style={{
                  fontSize: `${Math.random() * 30 + 20}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  // animation: `float ${Math.random() * 10 + 10 }s linear infinite`,
                  // animationDelay: `${Math.random() * 5}s`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite ${Math.random() * 5}s`,

                }}
              />
            ))}
          </div>

          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative z-10">
            {/* Decorative soundwave at top */}
            <div className="h-2 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center space-x-1 animate-soundwave">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-white rounded-full"
                    style={{
                      width: "2px",
                      height: `${Math.random() * 100}%`,
                      // animation: `pulse ${ 0.5 + Math.random() * 2 }s ease-in-out infinite alternate`,
                      // animationDelay: `${i * 0.1}s`,
                      animation: `pulse ${0.5 + Math.random() * 2}s ease-in-out infinite alternate ${i * 0.1}s`,

                    }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-full border border-white/20">
                  <MusicalNoteIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Welcome to MoodLog
              </h2>
              <p className="text-purple-100 mt-2">
                Login to Track your mood & Tune your mind.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-400/20 text-red-100 p-3 rounded-lg text-sm flex items-center border border-red-400/30">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-purple-200" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-purple-200" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-purple-200 hover:text-white" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-purple-200 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>



              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 transition-all duration-300 ${
                  isLoading
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Tuning your mood...
                  </>
                ) : (
                  <>
                    <MusicalNoteIcon className="w-5 h-5 mr-2" />
                    Login to your mood
                  </>
                )}
              </button>
            </form>

            <div className="px-8 py-4 bg-white/5 text-center border-t border-white/10">
              <p className="text-sm text-purple-100">
                New to Moodify?{" "}
                <Link
                  to="/register"
                  className="font-medium text-white hover:text-purple-200 transition-colors"
                >
                  Create your mood profile
                </Link>
              </p>
            </div>
          </div>

          {/* Add these animations to your CSS */}
          <style >{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0) rotate(0deg);
              }
              50% {
                transform: translateY(-20px) rotate(5deg);
              }
            }
            @keyframes pulse {
              0% {
                height: 20%;
              }
              100% {
                height: 100%;
              }
            }
            @keyframes soundwave {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-soundwave {
              animation: soundwave 5s linear infinite;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
