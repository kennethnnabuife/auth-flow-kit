"use client";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { httpJSON, makeURL } from "../http";

export default function PasswordResetScreen() {
  const { config } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formStyle: React.CSSProperties = {
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
    animation: "fadeIn 0.25s ease",
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: 30,
    color: "#060f22",
    fontWeight: 700,
    fontSize: 30,
    textAlign: "center",
    letterSpacing: "-0.5px",
  };

  const inputStyle: React.CSSProperties = {
    width: "90%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #d2d2d2",
    fontSize: 15,
    outline: "none",
    transition: "0.25s",
    background: "rgba(255,255,255,0.85)",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 12,
    background: sent
      ? "linear-gradient(90deg, #7aff9d, #34c759)"
      : "linear-gradient(90deg, #5353aaff, #060f22ff)",
    color: "white",
    border: "none",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.3px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 8px 20px rgba(75,75,255,0.25)",
  };

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const url = makeURL(config.baseURL, config.endpoints.forgot);

    try {
      await httpJSON(url, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSent(true);
    } catch (err: any) {
      const message = err?.message ?? "Failed to request reset";
      setError(message);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid #4b4bff";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(75,75,255,0.25)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid #d2d2d2";
    e.currentTarget.style.boxShadow = "0 0 0 transparent";
  };

  return (
    <form onSubmit={requestReset} style={formStyle}>
      <h2 style={titleStyle}>Reset Password 🔑</h2>

      <div style={{ position: "relative", marginBottom: 26 }}>
        <label
          style={{
            position: "absolute",
            top: sent ? "-18px" : "-10px",
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
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <button type="submit" style={buttonStyle}>
        {sent ? "Link Sent ✔" : "Send reset link"}
      </button>

      {sent && (
        <p
          style={{
            marginTop: 20,
            color: "#2ecc71",
            textAlign: "center",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Check your email for reset instructions.
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: 20,
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
