"use client";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedName) {
      setError("Email and password cannot be empty.");
      setSubmitting(false);
      return;
    }

    try {
      await signup({ name, email, password });
    } catch (err: any) {
      setError(err?.message || "Signup failed");
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
