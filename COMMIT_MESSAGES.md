# Commit Messages for Your Pull Request

## Option 1: Two Commits (Recommended)

### Commit 1: Fix signup data handling and error types
```
fix: use trimmed values and improve error handling in SignupScreen

- Use trimmed name, email, and password when calling signup API
- Replace 'any' type with proper TypeScript error handling using 'unknown'
- Ensures consistent data validation and better type safety
```

### Commit 2: Add navigation link to SignupScreen
```
feat: add "Back to login" link to SignupScreen

- Add "Already have an account? Sign in" link for better UX
- Emits custom event for parent components to handle navigation
- Matches the navigation pattern used in LoginScreen
```

---

## Option 2: Single Commit (Alternative)

### Single Commit:
```
fix: improve SignupScreen validation, error handling, and navigation

- Use trimmed values (name, email, password) when calling signup API
- Replace 'any' type with proper TypeScript error handling
- Add "Back to login" navigation link for better UX
- Ensures consistent data validation and type safety
```

---

## Pull Request Title:
```
fix: improve SignupScreen validation, error handling, and navigation
```

## Pull Request Description:

```markdown
## 🐛 Bug Fixes

This PR fixes several issues in the SignupScreen component:

### 1. Data Validation Fix
- **Problem:** Signup was validating trimmed values but sending untrimmed values to the API
- **Fix:** Now uses `trimmedName`, `trimmedEmail`, and `trimmedPassword` when calling the signup API
- **Impact:** Prevents issues with leading/trailing spaces in user input

### 2. TypeScript Error Handling
- **Problem:** Using `err: any` disables type checking
- **Fix:** Replaced with proper TypeScript error handling using `unknown` type
- **Impact:** Better type safety and follows TypeScript best practices

### 3. Missing Navigation
- **Problem:** SignupScreen had no way to navigate back to login (unlike LoginScreen which has "Forgot password?" link)
- **Fix:** Added "Already have an account? Sign in" link
- **Impact:** Improves UX by allowing users to easily navigate between login and signup screens

## 📝 Changes Made

- `src/screens/SignupScreen.tsx`:
  - Use trimmed values in signup API call
  - Improved error handling with proper TypeScript types
  - Added navigation link to login screen

## ✅ Testing

- [x] Verified trimmed values are sent to API
- [x] Tested error handling with various error types
- [x] Confirmed navigation link appears and is clickable
- [x] No linting errors

## 🔗 Related

Fixes issues identified in the bug hunting process:
- Untrimmed data being sent to API
- Type safety issues with error handling
- Missing navigation between auth screens
```

