"use client";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import PasswordResetScreen from "./PasswordResetScreen";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  if (showReset) {
    return (
      <div style={{ animation: "fade .2s" }}>
        <PasswordResetScreen />
        <p
          onClick={() => setShowReset(false)}
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 14,
            color: "#4b4bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Back to login
        </p>
      </div>
    );
  }

  // Submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError("Email is required.");
      setSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      setSubmitting(false);
      return;
    }

    if (!trimmedPassword) {
      setError("Password is required.");
      setSubmitting(false);
      return;
    }

    try {
      await login(trimmedEmail, trimmedPassword);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
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
        Welcome Back 👋
      </h2>

      <div style={{ position: "relative", marginBottom: 26 }}>
        <label
          htmlFor="afk-login-email"
          style={{
            position: "absolute",
            top: "-10px",
            left: "14px",
            background: "rgba(255,255,255,0.8)",
            padding: "0 6px",
            fontSize: 13,
            color: "#444",
            borderRadius: 6,
          }}
        >
          Email
        </label>

        <input
          id="afk-login-email"
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

      <div style={{ position: "relative", marginBottom: 10 }}>
        <label
          htmlFor="afk-login-password"
          style={{
            position: "absolute",
            top: "-10px",
            left: "14px",
            background: "rgba(255,255,255,0.8)",
            padding: "0 6px",
            fontSize: 13,
            color: "#444",
            borderRadius: 6,
          }}
        >
          Password
        </label>

        <input
          id="afk-login-password"
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

      <div
        style={{
          textAlign: "right",
        }}
      >
        <button
          onClick={() => setShowReset(true)}
          style={{
            textAlign: "right",
            fontSize: 13,
            color: "#4b4bff",
            cursor: "pointer",
            marginBottom: 24,
            width: "fit-content",
            border: "none",
            background: "none",
          }}
        >
          Forgot password?
        </button>
      </div>

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
        {submitting ? "Signing in..." : "Sign in"}
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
