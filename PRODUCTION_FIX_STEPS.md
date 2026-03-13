# Production Authentication Fix - Step by Step

## The Problem
Session cookies are not being set/persisted in production, causing users to be redirected back to login after successful authentication.

## Root Cause
Cross-origin cookie issues between frontend (Vercel) and backend (Vercel/other hosting).

## Solution Applied

### 1. Code Changes Made

#### Frontend Changes:
1. **auth-client.ts** - Added `credentials: 'include'` to ensure cookies are sent
2. **Login.tsx** - Changed to use `window.location.href` instead of `router.push` for more reliable redirect
3. **use-admin-auth.ts** - Improved session checking and error handling

#### Backend Changes:
1. **server.js** - Enhanced CORS configuration with explicit headers
2. **auth.js** - Already has proper cookie settings

### 2. Critical Environment Variables

#### Backend (Vercel Environment Variables)
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
BETTER_AUTH_URL=https://your-backend.vercel.app/api/auth
BETTER_AUTH_SECRET=<generate-strong-secret>
DATABASE_URI=<your-mongodb-uri>
```

#### Frontend (Vercel Environment Variables)
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_AUTH_URL=https://your-backend.vercel.app/api/auth
```

### 3. Deployment Checklist

- [ ] Update backend environment variables on Vercel
- [ ] Update frontend environment variables on Vercel
- [ ] Redeploy backend
- [ ] Redeploy frontend
- [ ] Clear browser cache and cookies
- [ ] Test in incognito mode

### 4. Testing Steps

1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to login page
4. Enter credentials and login
5. Watch console for these logs:
   - "Attempting login..."
   - "Login response: ..."
   - "User logged in: ..."
   - "User role from login: true"

6. Check Network tab:
   - Look for `/api/auth/sign-in/email` request
   - Check Response Headers for `Set-Cookie`
   - Verify cookies in Application → Cookies

### 5. If Still Not Working

#### Option A: Same Domain Deployment
Deploy both frontend and backend on the same domain using Vercel rewrites:

**vercel.json** (in frontend):
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.vercel.app/api/:path*"
    }
  ]
}
```

Then update frontend env:
```
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_AUTH_URL=/api/auth
```

#### Option B: Use Proxy
Set up a proxy in Next.js to forward API requests.

#### Option C: Check Cookie Settings
In browser DevTools → Application → Cookies, verify:
- Cookie is being set
- Domain matches
- SameSite is set correctly
- Secure flag is present

### 6. Common Issues

#### Issue: "Session not established"
**Cause**: Cookies not being set
**Fix**: 
1. Verify CORS settings
2. Check `credentials: 'include'` is set
3. Ensure `sameSite: 'none'` and `secure: true` in production

#### Issue: CORS error
**Cause**: Frontend URL not in trustedOrigins
**Fix**: Update `FRONTEND_URL` in backend to match exact frontend domain

#### Issue: Cookies not visible in DevTools
**Cause**: HttpOnly cookies (this is normal and secure)
**Fix**: Check Network tab → Response Headers instead

### 7. Alternative: JWT Tokens (If cookies still don't work)

If cookie-based auth continues to fail, consider switching to JWT tokens stored in localStorage:

1. Modify auth to return JWT token
2. Store token in localStorage
3. Send token in Authorization header
4. Validate token on backend

This is less secure but more reliable across domains.

### 8. Vercel-Specific Notes

1. **Serverless Functions**: Backend on Vercel runs as serverless functions
2. **Cold Starts**: First request might be slow
3. **Regions**: Ensure frontend and backend are in same region
4. **Custom Domains**: Using custom domains can help with cookie issues

### 9. Debug Commands

Run these in browser console to debug:

```javascript
// Check if cookies are being sent
document.cookie

// Test session endpoint directly
fetch('https://your-backend.vercel.app/api/auth/get-session', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error)

// Test login directly
fetch('https://your-backend.vercel.app/api/auth/sign-in/email', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your@email.com',
    password: 'yourpassword'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### 10. Support Resources

- Better Auth Docs: https://www.better-auth.com/docs
- Vercel CORS Guide: https://vercel.com/guides/how-to-enable-cors
- MDN Cookies: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

## Final Notes

The key changes are:
1. Using `window.location.href` for redirect (forces full page reload)
2. Adding `credentials: 'include'` to auth client
3. Enhanced CORS configuration
4. Better error logging

If issues persist after these changes, the problem is likely with cookie domain/path settings, and you may need to deploy both services on the same domain or use a different auth strategy.
