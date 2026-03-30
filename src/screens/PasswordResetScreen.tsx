"use client";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { httpJSON, makeURL } from "../http";

export default function PasswordResetScreen() {
  const { config } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const url = makeURL(config.baseURL, config.endpoints.forgot);

      await httpJSON(url, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to request reset");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <form
        onSubmit={requestReset}
        style={{
          width: 420,
          padding: 36,
          borderRadius: 16,
          background: "#0b1220",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        <h2
          style={{
            marginBottom: 28,
            color: "#f1f5f9",
            fontWeight: 600,
            fontSize: 26,
            textAlign: "center",
          }}
        >
          Password Reset
        </h2>

        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 13,
              color: "#94a3b8",
            }}
          >
            Email Address
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "1px solid #1f2a44",
              background: "#020617",
              color: "#e2e8f0",
              fontSize: 14,
              outline: "none",
              transition: "0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid #6366f1";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(99,102,241,0.25)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid #1f2a44";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            background: sent
              ? "linear-gradient(90deg, #22c55e, #4ade80)"
              : "linear-gradient(90deg, #6366f1, #4f46e5)",
            color: "white",
            transition: "0.25s",
          }}
        >
          {sent ? "Email Sent ✔" : "Send Reset Link"}
        </button>

        {sent && (
          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              color: "#4ade80",
              textAlign: "center",
            }}
          >
            Check your inbox for reset instructions.
          </p>
        )}

        {error && (
          <p
            style={{
              marginTop: 18,
              fontSize: 13,
              color: "#f87171",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
