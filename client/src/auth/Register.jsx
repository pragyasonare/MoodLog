import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Toast from "../components/Toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Added success state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(""); // Clear previous success message

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
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Register</h1>

        {error && (
          <Toast message={error} isError onClose={() => setError("")} />
        )}
        {success && (
          <Toast message={success} isSuccess onClose={() => setSuccess("")} />
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
