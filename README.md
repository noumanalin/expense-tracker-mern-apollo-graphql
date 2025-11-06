# expense-tracker-mern-apollo-graphql
A production-ready MERN stack Expense Tracker using Apollo GraphQL, Passport.js authentication, and Apollo Client caching. Deployed on AWS/Vercel/Render✔/ with MongoDB Atlas.




## 🔒 Security Breakdown
| Feature | Description | ✅ Status |
|---------|-------------|-----------|
| Helmet | Adds HTTP headers to prevent XSS, clickjacking, and other attacks | ✅ Enabled correctly |
| Rate Limiter | Protects from brute force & DDoS (100 requests/15 min per IP) | ✅ Good basic config |
| Session Security | httpOnly, secure, sameSite=lax, maxAge → all good session settings | ✅ Well done |
| Passport | Good for authenticated sessions, works with express-session | ✅ Properly integrated |
| CORS | Restricted to specific origin + allows credentials | ✅ Correct for client–server setup |
| Compression | Reduces payload size (performance) | ✅ OK (safe) |
| Error Sanitization | Hides internal stack traces in production | ✅ Excellent security practice |
| Trust Proxy | Needed for reverse proxies (e.g., Render, Nginx, Vercel, AWS) | ✅ Correct use |
| Introspection Disabled in Prod | Prevents schema leaks to outsiders | ✅ Excellent |
| .env Configuration | Used for secrets and environment-dependent logic | ✅ Correct practice |