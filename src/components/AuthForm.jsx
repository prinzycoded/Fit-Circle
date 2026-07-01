import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Dumbbell, Mail, Lock, Globe, Loader2, Shield } from "lucide-react";

export default function AuthForm({ role = "client", onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const saveRole = () => {
    try {
      localStorage.setItem("fitcircle_role", role);
    } catch (e) {
      console.warn("localStorage write denied", e);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    saveRole();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setSubmitting(true);
    saveRole();
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const getErrorMessage = (code) => {
    const messages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/popup-closed-by-user": "Sign-in cancelled.",
      "auth/cancelled-popup-request": "Sign-in cancelled.",
    };
    return messages[code] || "Something went wrong. Please try again.";
  };

  const isOwner = role === "owner";

  return (
    <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
      <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
        <Dumbbell size={180} />
      </div>
      <div className="relative z-10 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOwner ? "bg-theme-warning text-[#1D202B]" : "bg-white/20"}`}>
            {isOwner ? <Shield size={20} /> : <Dumbbell size={20} className="rotate-45" />}
          </div>
          <span className="text-xl font-display font-extrabold tracking-tight">FitCircle</span>
        </div>

        <h2 className="text-2xl font-display font-extrabold tracking-tight">
          {isSignUp
            ? isOwner ? "Register your gym" : "Create your account"
            : isOwner ? "Owner sign in" : "Welcome back"}
        </h2>
        <p className="text-white/70 text-sm mt-1 font-body">
          {isSignUp
            ? isOwner ? "Set up your gym management dashboard." : "Sign up to start your gamified fitness journey."
            : isOwner ? "Access your gym management panel." : "Sign in to track your progress and compete."}
        </p>

        <form onSubmit={handleEmailAuth} className="mt-6 space-y-3">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-white/40 font-medium outline-none focus:border-white/40 transition-all"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-white/40 font-medium outline-none focus:border-white/40 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-300 font-medium bg-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-white text-[#D95C42] hover:bg-white/90 text-sm font-display font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-transparent text-white/50 font-medium">or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-display font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Globe size={16} />
          Google
        </button>

        <p className="text-center text-xs text-white/60 mt-5 font-medium">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-white font-bold underline underline-offset-2 hover:text-white/80 transition-all cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
