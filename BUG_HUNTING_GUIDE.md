# 🐛 How to Find Bugs in Open Source Projects

This guide shows you practical methods to identify bugs you can fix, using examples from this codebase.

---

## Method 1: Compare Similar Components

**What to do:** Look at similar components and find inconsistencies.

### Example: Comparing `LoginScreen` vs `SignupScreen`

I compared these two files and found these bugs:

#### 🐛 Bug #1: Inconsistent Data Handling
**Location:** `src/screens/SignupScreen.tsx` line 29

**The Problem:**
```tsx
// Lines 18-20: Values are trimmed for validation
const trimmedEmail = email.trim();
const trimmedPassword = password.trim();
const trimmedName = name.trim();

// Line 29: But UNTRIMMED values are sent to API!
await signup({ name, email, password }); // ❌ Should use trimmed values
```

**Compare with LoginScreen (line 51):**
```tsx
await login(trimmedEmail, trimmedPassword); // ✅ Uses trimmed values
```

**Why it's a bug:** If a user enters `"  john@example.com  "` (with spaces), the validation passes but the backend receives untrimmed data, which could cause issues.

---

#### 🐛 Bug #2: Incorrect Error Message
**Location:** `src/screens/SignupScreen.tsx` line 23

**The Problem:**
```tsx
if (!trimmedEmail || !trimmedPassword || !trimmedName) {
  setError("Email and password cannot be empty."); // ❌ Doesn't mention "name"
}
```

**Why it's a bug:** The validation checks for `trimmedName` but the error message doesn't mention it. Users won't know why signup failed if they leave the name field empty.

---

#### 🐛 Bug #3: Missing Navigation Link
**Location:** `src/screens/SignupScreen.tsx`

**The Problem:** 
- `LoginScreen` has a "Forgot password?" link (line 175-186)
- `SignupScreen` has NO link to go back to login

**Why it's a bug:** Poor UX - users can't easily navigate back to login from signup.

---

## Method 2: Test Edge Cases

**What to do:** Try unusual inputs and see what breaks.

### Test Cases to Try:

1. **Empty strings with spaces:**
   - Name: `"   "` (only spaces)
   - Email: `"   "`
   - Password: `"   "`

2. **Very long inputs:**
   - Name: 1000+ characters
   - Email: 500+ characters

3. **Special characters:**
   - Name: `"<script>alert('xss')</script>"`
   - Email: `"test@test@test.com"` (invalid format)

4. **Unicode characters:**
   - Name: `"José 用户 🎉"`

5. **Network failures:**
   - What happens if the backend is down?
   - What if the response is malformed?

---

## Method 3: Look for Code Patterns

**What to do:** Find patterns that indicate potential bugs.

### Pattern: Inconsistent Error Handling

**Example:** Check how errors are handled in different places:

```tsx
// SignupScreen.tsx line 31
catch (err: any) {
  setError(err?.message || "Signup failed");
}

// LoginScreen.tsx line 53
catch (err: any) {
  setError(err?.message || "Login failed");
}
```

**Question to ask:** Are these consistent? Should they handle network errors differently?

---

## Method 4: Check GitHub Issues

**What to do:**
1. Go to the repository on GitHub: `https://github.com/kennethnnabuife/auth-flow-kit`
2. Click on the "Issues" tab
3. Look for:
   - Issues labeled `bug`
   - Issues labeled `good first issue`
   - Issues with no comments (unclaimed)
   - Issues that mention "signup" or "registration"

**How to check from command line:**
```bash
# If you have GitHub CLI installed
gh issue list --label "bug"
gh issue list --label "good first issue"
```

---

## Method 5: Read Code Comments

**What to do:** Look for comments that indicate known issues.

**Example from `src/http.ts` line 71:**
```tsx
} catch {
  // ignore JSON parse errors, cos not important to me now
}
```

**Question:** Is this really okay to ignore? Could this cause silent failures?

---

## Method 6: Check TypeScript/ESLint Errors

**What to do:**
1. Run the linter: `npm run lint` (if available)
2. Check for TypeScript errors: `npx tsc --noEmit`
3. Look for `any` types (they often hide bugs)

**Example:** In `SignupScreen.tsx` line 30:
```tsx
catch (err: any) { // ❌ Using 'any' hides type errors
```

**Better approach:**
```tsx
catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Signup failed";
  setError(message);
}
```

---

## Method 7: Manual Testing

**What to do:**
1. Run the demo: `npm run dev`
2. Try to break things:
   - Submit forms with empty fields
   - Submit forms multiple times quickly
   - Use browser dev tools to simulate slow network
   - Test on different screen sizes
   - Test keyboard navigation (Tab key)

---

## Method 8: Look for Accessibility Issues

**What to do:** Check for missing ARIA labels, keyboard navigation, etc.

**Example from `SignupScreen.tsx`:**
- Inputs don't have `aria-label` or `aria-describedby`
- Labels aren't properly associated with inputs (using `htmlFor`)
- No focus indicators for keyboard users

---

## Method 9: Check for Security Issues

**What to do:** Look for common security problems.

**Potential issues:**
- XSS vulnerabilities (user input not sanitized)
- CSRF protection missing
- Sensitive data in localStorage (tokens)
- No rate limiting on forms

---

## Method 10: Review Recent Changes

**What to do:**
```bash
# See recent commits
git log --oneline -10

# See what changed recently
git diff HEAD~5
```

**Why:** Recent changes might have introduced bugs.

---

## 🎯 Quick Checklist for Bug Hunting

When reviewing code, ask yourself:

- [ ] Are similar components consistent?
- [ ] Are error messages helpful and accurate?
- [ ] Are edge cases handled (empty, null, undefined, very long)?
- [ ] Is user input validated and sanitized?
- [ ] Are there any `TODO` or `FIXME` comments?
- [ ] Are there any `any` types that should be more specific?
- [ ] Is error handling consistent across the codebase?
- [ ] Are accessibility features present (ARIA, keyboard nav)?
- [ ] Can I break it with unusual input?
- [ ] Are there any console warnings/errors?

---

## 📝 Found a Bug? Here's What to Do:

1. **Verify it's actually a bug:**
   - Can you reproduce it consistently?
   - Is it documented behavior or unintended?

2. **Check if it's already reported:**
   - Search GitHub issues
   - Check if there's a fix in progress

3. **Document it:**
   - Write clear steps to reproduce
   - Include expected vs actual behavior
   - Add screenshots if UI-related

4. **Fix it (or report it):**
   - If it's a small fix, go ahead and fix it
   - If unsure, open an issue first
   - Follow the CONTRIBUTING.md guidelines

---

## 🚀 Start Here: The Bugs I Found

Based on my analysis, here are **3 confirmed bugs** you can fix right now:

### Bug #1: Untrimmed Data Sent to API
**File:** `src/screens/SignupScreen.tsx` line 29
**Fix:** Change `{ name, email, password }` to `{ name: trimmedName, email: trimmedEmail, password: trimmedPassword }`

### Bug #2: Incomplete Error Message
**File:** `src/screens/SignupScreen.tsx` line 23
**Fix:** Change error message to include "name": `"Name, email, and password cannot be empty."`

### Bug #3: Missing Navigation
**File:** `src/screens/SignupScreen.tsx`
**Fix:** Add a "Back to login" link similar to LoginScreen

---

## 💡 Pro Tips

1. **Start small:** Fix one bug at a time
2. **Test your fixes:** Make sure you didn't break anything
3. **Write clear commit messages:** "fix: use trimmed values in signup" not "fix stuff"
4. **Ask questions:** If unsure, open an issue or ask in discussions
5. **Be patient:** Code review takes time, don't take feedback personally

---

Happy bug hunting! 🎉

