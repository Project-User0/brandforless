"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RecoveryStep =
  | "EMAIL_ENTRY"
  | "OTP_VERIFICATION"
  | "PASSWORD_RESET"
  | "SUCCESS_REDIRECT";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Workflow control state
  const [step, setStep] = useState<RecoveryStep>("EMAIL_ENTRY");
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Obfuscation states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback notifications
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Generated reference information for demo persistence mockup
  const [simulatedOTP, setSimulatedOTP] = useState("");
  const [otpExpiryText, setOtpExpiryText] = useState("");

  // Clear system notifications automatically when user interacts with inputs
  useEffect(() => {
    setErrorMessage("");
  }, [email, otpInput, newPassword, confirmPassword]);

  // --- STEP 1: Process and Validate Email presence ---
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim())
      return setErrorMessage("Please enter your email address.");

    try {
      const storedUserString = localStorage.getItem("user");

      const storedUser = JSON.parse(storedUserString || "{}");

      // Check account record matching constraints
      if (storedUser?.email.toLowerCase() !== email.toLowerCase().trim()) {
        return setErrorMessage(
          "No account matching this email address was located.",
        );
      }

      // Generate a cryptographically structured 6-digit dynamic OTP pin code
      const generatedOTP = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const expiryTime = Date.now() + 3 * 60 * 1000; // Valid for a 5-minute timeline window

      // Commit OTP security metadata parameters to localStorage
      const otpPayload = {
        code: generatedOTP,
        expiresAt: expiryTime,
        targetEmail: email.toLowerCase().trim(),
      };
      localStorage.setItem("recovery_otp_session", JSON.stringify(otpPayload));

      // Update state contexts to allow visual presentation values on screen layout
      setSimulatedOTP(generatedOTP);
      setOtpExpiryText(
        new Date(expiryTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      setStep("OTP_VERIFICATION");
    } catch (err) {
      setErrorMessage("A file configuration fallback error occurred.");
    }
  };

  // --- STEP 2: Validate Submitted Passphrase Token ---
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim())
      return setErrorMessage("Please provide the 6-digit authorization key.");

    try {
      const sessionData = localStorage.getItem("recovery_otp_session");
      if (!sessionData)
        return setErrorMessage("No session sequence exists. Start over.");

      const { code, expiresAt, targetEmail } = JSON.parse(sessionData);

      if (Date.now() > expiresAt) {
        return setErrorMessage(
          "This credentials verification key has expired. Please try again.",
        );
      }

      if (code !== otpInput.trim()) {
        return setErrorMessage("The authorization key entered is invalid.");
      }

      setStep("PASSWORD_RESET");
    } catch (err) {
      setErrorMessage("Token verification state breakdown.");
    }
  };

  // --- STEP 3: Persist Mutated Key Modifications ---
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return setErrorMessage("All password inputs must be fulfilled.");
    if (newPassword !== confirmPassword)
      return setErrorMessage("Passwords do not match.");
    if (newPassword.length < 6)
      return setErrorMessage(
        "Password security requires at least 6 characters.",
      );

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser)
        return setErrorMessage("System profile resolution reference lost.");

      const userData = JSON.parse(storedUser);
      userData.password = newPassword; // Update targeted profile record

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("recovery_otp_session"); // Purge token security instance payload

      setStep("SUCCESS_REDIRECT");

      // Auto redirect to authentication base layout view page route after 3.5 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3500);
    } catch (err) {
      setErrorMessage("Critical mutation rewrite operations error.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8 rounded-none shadow-sm transition-all">
        {/* Step Progression Indicators */}
        {step !== "SUCCESS_REDIRECT" && (
          <div className="mb-8 flex items-center justify-between gap-2 border-b border-border pb-4">
            <span
              className={`text-[10px] uppercase font-medium tracking-widest ${step === "EMAIL_ENTRY" ? "text-primary" : "text-muted-foreground/50"}`}
            >
              01. Identification
            </span>
            <span
              className={`text-[10px] uppercase font-medium tracking-widest ${step === "OTP_VERIFICATION" ? "text-primary" : "text-muted-foreground/50"}`}
            >
              02. Verification
            </span>
            <span
              className={`text-[10px] uppercase font-medium tracking-widest ${step === "PASSWORD_RESET" ? "text-primary" : "text-muted-foreground/50"}`}
            >
              03. Reconfiguration
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL CAPTURE VIEWPORT ARCHITECTURE */}
          {step === "EMAIL_ENTRY" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-light tracking-tight text-foreground">
                  Recover Password
                </h1>
                <p className="mt-1.5 text-xs font-light text-muted-foreground leading-relaxed">
                  Provide your account registration email address below to
                  initialize the cryptographic credentials restoration
                  procedure.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-none bg-destructive/5 border border-destructive/20 p-3 text-xs font-medium text-destructive">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-none border border-border bg-background pl-10 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-none uppercase tracking-widest text-xs font-light py-5 mt-2"
                >
                  Generate Verification Code
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: SIMULATED SYSTEM TOKEN ENTRY VIEWPORT */}
          {step === "OTP_VERIFICATION" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-light tracking-tight text-foreground">
                  Secure Verification
                </h1>
                <p className="mt-1.5 text-xs font-light text-muted-foreground leading-relaxed">
                  An electronic transmission token has been provisioned. Enter
                  the corresponding code parameter details to authorize password
                  mutation properties.
                </p>
              </div>

              {/* Minimal Luxury Mockup Alert Banner displaying generated OTP context */}
              <div className="mb-5 bg-neutral-900 text-neutral-100 p-4 rounded-none text-xs space-y-2 border border-neutral-800 tracking-wide font-sans">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                    System Broadcast Emulator
                  </span>
                  <span className="text-[10px] text-amber-400 uppercase font-mono">
                    Expires: {otpExpiryText}
                  </span>
                </div>
                <p className="font-light text-neutral-300">
                  Your single-use dynamic access verification signature pin key
                  is:
                </p>
                <div className="text-center font-mono text-xl font-bold tracking-[0.5em] py-1 bg-white/5 border border-white/10 text-white select-all">
                  {simulatedOTP}
                </div>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-none bg-destructive/5 border border-destructive/20 p-3 text-xs font-medium text-destructive">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Verification PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpInput}
                      onChange={(e) =>
                        setOtpInput(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full tracking-[0.25em] font-mono rounded-none border border-border bg-background pl-10 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("EMAIL_ENTRY")}
                    className="rounded-none px-4 py-5 text-xs uppercase tracking-wider font-light"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-none uppercase tracking-widest text-xs font-light py-5"
                  >
                    Verify Code
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: PASSWORD RECONFIGURATION MUTATION CONTEXT */}
          {step === "PASSWORD_RESET" && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <h1 className="font-serif text-2xl font-light tracking-tight text-foreground">
                  Reconfigure Credentials
                </h1>
                <p className="mt-1.5 text-xs font-light text-muted-foreground leading-relaxed">
                  Establish a hardened alternative access token key structure
                  configuration baseline parameters context interface block.
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-none bg-destructive/5 border border-destructive/20 p-3 text-xs font-medium text-destructive">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-none border border-border bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-none border border-border bg-background pl-10 pr-10 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-none uppercase tracking-widest text-xs font-light py-5 mt-2"
                >
                  Update Account Password
                </Button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: TRANSACTION FINALIZATION REDIRECT SPLASH VIEWPORT */}
          {step === "SUCCESS_REDIRECT" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="rounded-full bg-neutral-900 p-3 text-white">
                  <CheckCircle2 className="h-8 w-8 text-white stroke-[1.5]" />
                </div>
              </div>
              <h2 className="font-serif text-xl tracking-tight text-foreground font-light">
                Security Update Succeeded
              </h2>
              <p className="text-xs text-muted-foreground font-light max-w-xs mx-auto leading-relaxed">
                Your new credential updates have successfully initialized into
                the profile framework configuration logs layer.
              </p>
              <div className="pt-4 flex flex-col items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-light">
                  Redirecting to login dashboard...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Route Navigation Links */}
        {step !== "SUCCESS_REDIRECT" && (
          <div className="mt-8 border-t border-border pt-4 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-xs font-light tracking-wide text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Return to Account Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
