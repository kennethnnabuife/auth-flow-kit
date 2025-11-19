# @kendevelops/auth-flow-kit

A lightweight authentication toolkit for **React** and **Next.js 13–16 (App Router)**.

## Features

- 🔐 **AuthProvider** manages login state, tokens, and user session
- 🎯 **useAuth() hook** gives access to user, login(), logout(), and more
- 🛡️ **Protected** helps guard pages and components
- 📄 Prebuilt **LoginScreen** and **SignupScreen**
- ⚡ Fully typed (TypeScript)
- 🌐 Backend agnostic

Made for modern React and Next.js applications.

---

## 📦 Installation

```
npm install @kendevelops/auth-flow-kit
```

or

```
bun add @kendevelops/auth-flow-kit
```

---

# 🚀 Usage (Next.js 16 App Router)

Next.js layouts are Server Components, but authentication must run on the client. So we wrap the AuthProvider inside a small client component.

## 1. Create `app/AuthProviderClient.tsx`

```tsx
"use client";

import { AuthProvider } from "@kendevelops/auth-flow-kit";

export default function AuthProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider
      config={{
        baseURL: "http://localhost:4000",
        endpoints: {
          login: "/auth/login",
          signup: "/auth/signup",
          refresh: "/auth/refresh",
          me: "/auth/me",
        },
        onLoginSuccess: () => (window.location.href = "/dashboard"),
        onLogout: () => (window.location.href = "/login"),
      }}
    >
      {children}
    </AuthProvider>
  );
}
```

---

## 2. Wrap your app with AuthProvider (Server Layout)

`app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProviderClient from "./AuthProviderClient";

export const metadata: Metadata = {
  title: "Auth Demo",
  description: "Auth Flow Kit Example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProviderClient>{children}</AuthProviderClient>
      </body>
    </html>
  );
}
```

---

## 3. Create Login Page

`app/login/page.tsx`

```tsx
"use client";

import { LoginScreen } from "@kendevelops/auth-flow-kit";

export default function LoginPage() {
  return <LoginScreen />;
}
```

---

## 4. Create Signup Page

`app/signup/page.tsx`

```tsx
"use client";

import { SignupScreen } from "@kendevelops/auth-flow-kit";

export default function SignupPage() {
  return <SignupScreen />;
}
```

---

## 5. Create Protected Dashboard Page

`app/dashboard/page.tsx`

```tsx
"use client";

import { Protected, useAuth } from "@kendevelops/auth-flow-kit";

export default function DashboardPage() {
  return (
    <Protected>
      <Dashboard />
    </Protected>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>No user loaded</p>
      )}
    </div>
  );
}
```

---

# 🧠 API Requirements

Your backend must return the following format:

### Login — `POST /auth/login`

```json
{
  "accessToken": "jwt123",
  "refreshToken": "refresh123",
  "user": {
    "id": 1,
    "name": "Kenneth",
    "email": "kenny@example.com"
  }
}
```

### Get Current User — `GET /auth/me`

```json
{
  "id": 1,
  "name": "Kenneth",
  "email": "kenny@example.com"
}
```

Works with Express, Nest, Django, Laravel, Go, and more.

---

# ⚙️ Custom Response Mapping

If your backend returns different field names:

```tsx
<AuthProvider
  config={{
    mapLoginResponse: (res) => ({
      accessToken: res.token,
      user: {
        id: res.data.user_id,
        name: res.data.full_name,
        email: res.data.mail,
      }
    }),
    mapMeResponse: (res) => ({
      id: res.data.user_id,
      name: res.data.full_name,
      email: res.data.mail
    }),
  }}
>
```

---

# 🔒 Protecting Components

```tsx
<Protected>
  <SecretComponent />
</Protected>
```

Automatically redirects to `/login` if user is not authenticated.

---

# 🔄 Using `useAuth()`

```tsx
"use client";
import { useAuth } from "@kendevelops/auth-flow-kit";

export default function NavBar() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login("email", "password")}>Login</button>
      )}
    </nav>
  );
}
```

---

# 🌐 React (Non Next.js) Usage

```tsx
import {
  AuthProvider,
  LoginScreen,
  Protected,
} from "@kendevelops/auth-flow-kit";

export default function App() {
  return (
    <AuthProvider
      config={{
        baseURL: "http://localhost:4000",
        endpoints: {
          login: "/auth/login",
          signup: "/auth/signup",
          me: "/auth/me",
        },
      }}
    >
      <LoginScreen />
    </AuthProvider>
  );
}
```
