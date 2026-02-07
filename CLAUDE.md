# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite frontend application for OAuth2 authentication and user management. It includes support for multiple authentication methods (username/password, Google, Naver) and implements JWT token management with automatic refresh on expiration.

## Development Commands

- **Start dev server**: `npm run dev` - Launches Vite with hot module reloading on http://localhost:5173
- **Build for production**: `npm run build` - Creates optimized build in `dist/`
- **Lint code**: `npm lint` - Run ESLint to check for code quality issues
- **Preview production build**: `npm run preview` - Serve the production build locally

## Architecture

### Routing Structure
The app uses React Router for client-side routing. Routes are defined in [src/App.jsx](src/App.jsx):
- `/join` - User registration page
- `/login` - Login page (username/password and OAuth2 providers)
- `/cookie` - Cookie/token management page
- `/user` - User profile/data page

### Authentication Flow
The app implements JWT-based authentication with token refresh:
1. **Login**: `POST /login` with credentials stores `accessToken` and `refreshToken` in localStorage
2. **OAuth2**: Social login redirects to `GET /oauth2/authorization/{provider}` (Google, Naver)
3. **Token Refresh**: When access token expires (401 response), automatically fetch new tokens using the refresh token
4. **Logout**: Clear tokens from localStorage and call `/logout` endpoint

### Utility Functions
[src/util/fetchUtil.js](src/util/fetchUtil.js) provides token management helpers:
- `fetchWithAccess(url, options)` - Wrapper around fetch that adds Authorization header and handles token refresh
- `refreshAccessToken()` - Exchanges expired access token using refresh token
- `logout()` - Clears tokens and calls backend logout endpoint

### Environment Configuration
Uses Vite's `import.meta.env.VITE_*` for configuration:
- `VITE_BACKEND_API_BASE_URL` - Backend API endpoint (used in all API calls)

## Code Patterns

### Page Components
Pages are functional components using React hooks. They use:
- `useState` for local form/UI state
- `useNavigate` from react-router-dom for navigation
- `fetchWithAccess()` or direct `fetch()` for API calls
- localStorage for token storage

### Error Handling
- API errors are caught with try/catch and displayed to users
- Token refresh failures redirect user to login page
- Validation errors (empty fields) show error messages in the UI

## ESLint Configuration

The project uses ESLint with:
- `@eslint/js` - Recommended JS rules
- `eslint-plugin-react-hooks` - React hooks best practices
- `eslint-plugin-react-refresh` - Vite React Fast Refresh compatibility

Custom rule: Unused variables starting with uppercase or underscore are allowed (useful for React components).

## Build Configuration

Vite configuration in [vite.config.js](vite.config.js) is minimal and uses:
- React plugin for JSX support and Fast Refresh
- Standard Vite defaults for bundling and optimization
