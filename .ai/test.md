# UI Test Guide — ECS Console Login Page

> All test data is sourced from `lib/mock.ts`.
> App runs at: http://localhost:3000

---

## ✅ Valid Login Credentials

| # | User ID | Password | Role | Expected Result |
|---|---|---|---|---|
| 1 | `admin` | `admin123` | Admin | Login succeeds — console log shows user object |
| 2 | `analyst01` | `analyst123` | Analyst | Login succeeds — console log shows user object |

---

## ❌ Failure Scenarios

| # | User ID | Password | Expected Result |
|---|---|---|---|
| 1 | `admin` | `wrongpass` | Red banner: *"Invalid credentials. Please try again."* |
| 2 | `unknown` | `admin123` | Red banner: *"Invalid credentials. Please try again."* |
| 3 | *(empty)* | *(empty)* | Inline errors: *"User ID is required."* and *"Password is required."* |
| 4 | `admin` | `abc` | Inline error: *"Password must be at least 6 characters."* |
| 5 | *(empty)* | `admin123` | Inline error: *"User ID is required."* |

---

## 🔁 UX Behaviour Checks

| # | Action | Expected Behaviour |
|---|---|---|
| 1 | Click **Sign in** with no input | Both field errors appear immediately |
| 2 | Type in a field after an error appears | The error for that field clears in real-time |
| 3 | Click the eye icon on the password field | Password text becomes visible; icon toggles |
| 4 | Submit valid credentials | Button shows spinner + text *"Signing in..."* for ~800ms |
| 5 | Resize window to mobile width (<1024px) | Left marketing panel hides; inline logo appears above form |

---

## 🧭 How to Check Login Result (Until Dashboard Exists)

Open browser DevTools → **Console** tab.  
After a successful login you will see:
```
Login successful
```
The `login()` function in `lib/api.ts` returns the user object.  
A redirect to `/dashboard` will be wired up in a future task.
