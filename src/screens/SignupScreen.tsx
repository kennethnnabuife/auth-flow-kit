"use client";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getPasswordStrength = (value: string) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (!value) return { label: "", color: "" };
    if (score <= 1) return { label: "Weak", color: "crimson" };
    if (score === 2) return { label: "Medium", color: "#f39c12" };
    return { label: "Strong", color: "#2ecc71" };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedName) {
      setError("Name is required.");
      setSubmitting(false);
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      setSubmitting(false);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Enter a valid email address.");
      setSubmitting(false);
      return;
    }

    if (!trimmedPassword) {
      setError("Password is required.");
      setSubmitting(false);
      return;
    }

    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setSubmitting(false);
      return;
    }

    if (!trimmedConfirm) {
      setError("Please confirm your password.");
      setSubmitting(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      await signup({ name: trimmedName, email: trimmedEmail, password: trimmedPassword });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 32,
        borderRadius: 20,
        fontFamily: "Inter, sans-serif",

        // GLASS EFFECT
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",

        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.4)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <h2
        style={{
          marginBottom: 30,
          color: "#060f22",
          fontWeight: 700,
          fontSize: 30,
          textAlign: "center",
          letterSpacing: "-0.5px",
        }}
      >
        Create Account ✨
      </h2>

      <div style={{ position: "relative", marginBottom: 26 }}>
        <label
          htmlFor="afk-signup-name"
          style={{
            position: "absolute",
            top: "-10px",
            left: "14px",
            background: "rgba(255,255,255,0.85)",
            padding: "0 6px",
            fontSize: 13,
            color: "#444",
            borderRadius: 6,
          }}
        >
          Name
        </label>

        <input
          id="afk-signup-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            width: "80%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid #d2d2d2",
            fontSize: 15,
            outline: "none",
            transition: "0.25s",
            background: "rgba(255,255,255,0.85)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #4b4bff";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,75,255,0.25)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #d2d2d2";
            e.currentTarget.style.boxShadow = "0 0 0 transparent";
          }}
        />
      </div>

      <div style={{ position: "relative", marginBottom: 26 }}>
        <label
          htmlFor="afk-signup-email"
          style={{
            position: "absolute",
            top: "-10px",
            left: "14px",
            background: "rgba(255,255,255,0.85)",
            padding: "0 6px",
            fontSize: 13,
            color: "#444",
            borderRadius: 6,
          }}
        >
          Email
        </label>

        <input
          id="afk-signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          style={{
            width: "80%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid #d2d2d2",
            fontSize: 15,
            outline: "none",
            transition: "0.25s",
            background: "rgba(255,255,255,0.85)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #4b4bff";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,75,255,0.25)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #d2d2d2";
            e.currentTarget.style.boxShadow = "0 0 0 transparent";
          }}
        />
      </div>

      <div style={{ position: "relative", marginBottom: 26 }}>
        <label
          htmlFor="afk-signup-password"
          style={{
            position: "absolute",
            top: "-10px",
            left: "14px",
            background: "rgba(255,255,255,0.85)",
            padding: "0 6px",
            fontSize: 13,
            color: "#444",
            borderRadius: 6,
          }}
        >
          Password
        </label>

        <input
          id="afk-signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          style={{
            width: "80%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid #d2d2d2",
            fontSize: 15,
            outline: "none",
            transition: "0.25s",
            background: "rgba(255,255,255,0.85)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #4b4bff";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,75,255,0.25)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #d2d2d2";
            e.currentTarget.style.boxShadow = "0 0 0 transparent";
          }}
        />
      </div>

      <div style={{ position: "relative", marginBottom: 18 }}>
        <label
          htmlFor="afk-signup-confirm-password"
          style={{
            position: "absolute",
            top: "-10px",
            left: "14px",
            background: "rgba(255,255,255,0.85)",
            padding: "0 6px",
            fontSize: 13,
            color: "#444",
            borderRadius: 6,
          }}
        >
          Confirm password
        </label>

        <input
          id="afk-signup-confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Repeat your password"
          style={{
            width: "80%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid #d2d2d2",
            fontSize: 15,
            outline: "none",
            transition: "0.25s",
            background: "rgba(255,255,255,0.85)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid #4b4bff";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,75,255,0.25)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid #d2d2d2";
            e.currentTarget.style.boxShadow = "0 0 0 transparent";
          }}
        />
      </div>

      <div
        style={{
          marginBottom: 20,
          fontSize: 12,
          color: "#555",
        }}
      >
        <p style={{ marginBottom: 6 }}>
          Use at least 8 characters, including letters, numbers, and symbols.
        </p>
        {password && (
          <p
            style={{
              fontWeight: 600,
              color: getPasswordStrength(password).color,
            }}
          >
            Password strength: {getPasswordStrength(password).label}
          </p>
        )}
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#4b4bff",
          cursor: "pointer",
          marginBottom: 24,
        }}
        onClick={() => {
          // This allows parent components to handle navigation
          // Developers can override this behavior in their app
          window.dispatchEvent(new CustomEvent("auth-flow-kit:navigate-to-login"));
        }}
      >
        Already have an account? Sign in
      </p>

      <button
        disabled={submitting}
        type="submit"
        style={{
          width: "100%",
          padding: "14px 20px",
          borderRadius: 12,
          background: submitting
            ? "linear-gradient(90deg, #b2bdfd, #8da0ff)"
            : "linear-gradient(90deg, #5353aaff, #060f22ff)",

          color: "white",
          border: "none",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.3px",
          cursor: "pointer",
          transition: "0.25s",
          boxShadow: "0 8px 20px rgba(75,75,255,0.25)",
        }}
      >
        {submitting ? "Creating..." : "Create account"}
      </button>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          style={{
            marginTop: 18,
            color: "crimson",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
