import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import Input from "../component/Input"; // Ensure correct file path
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../component/PasswordStrengthMeter";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetState } from "../store/AuthSlice"; // Ensure correct file path

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    dispatch(signupUser({ name, email, password }))
      .unwrap()
      .then(() => {
        navigate("/verify-email");
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch(() => {
        // Additional error handling if needed.
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordStrengthMeter password={password} />

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-2">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => dispatch(resetState())}
                className="text-green-500 hover:underline"
              >
                Clear Error
              </button>
            </div>
          )}

          {/* Success Message */}
          {user && (
            <div className="text-green-500 text-sm mt-2">
              <p>Signup successful! Welcome, {user.name}!</p>
            </div>
          )}

          {/* Signup Button */}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-1 border-green-500 font-bold rounded-lg shadow-lg
  hover:from-green-600 hover:to-emerald-700 hover:border-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
  focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
