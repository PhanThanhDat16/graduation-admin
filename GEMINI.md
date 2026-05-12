# Gemini CLI Project Context - graduation-admin

This project is a React-based admin web application for a graduation freelance platform project. It is designed to manage users (freelancers, contractors, staff), projects, contracts, transactions, and disputes.

## Project Overview

- **Main Technologies:** React 19, TypeScript, Vite, Ant Design (antd v6), Tailwind CSS, Sass.
- **State Management:** Zustand.
- **Routing:** React Router DOM (v7).
- **API Client:** Axios with interceptors for authentication and token refresh.
- **Real-time:** Socket.io-client for notifications/chat.
- **Charts:** @ant-design/plots for dashboard visualizations.

## Architecture

- **Routing (`src/routers/`):** Centralized routing configuration with route guards (`PrivateRoute`, `AdminOnlyRoute`, `PrivateRouteLogin`).
- **Layouts (`src/layouts/`):** `MainLayout` provides the standard admin interface with `AppSidebar` and `AppHeader`.
- **API Layer (`src/apis/`):** Service-based API organization. Each domain (user, project, auth, etc.) has its own service file.
- **State Management (`src/store/`):** Uses Zustand for lightweight global state (e.g., `useAuthStore`, `useSocketStore`).
- **Styling:** Hybrid approach using Ant Design components, Tailwind CSS for utilities, and SCSS for custom component styles.
- **Utilities (`src/utils/`):** Contains the shared `axiosInstance` and formatting helpers.

## Key Files & Directories

- `src/main.tsx`: Application entry point.
- `src/App.tsx`: Root component with providers (Theme, Toast, Router).
- `src/routers/index.tsx`: Main routing table.
- `src/store/useAuthStore.ts`: Authentication and user state.
- `src/utils/axiosInstance.ts`: Axios configuration with auth interceptors.
- `src/apis/`: API service definitions.
- `src/pages/`: Page components organized by feature.
- `src/types/`: TypeScript interface and type definitions.

## Building and Running

### Development

```sh
# Start development server on http://localhost:3001
npm run dev
```

### Build

```sh
# Build for production
npm run build
```

### Linting & Formatting

```sh
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check formatting with Prettier
npm run prettier

# Fix formatting with Prettier
npm run prettier:fix
```

## Development Conventions

- **Type Safety:** Always define types/interfaces in `src/types/` and use them throughout the application.
- **API Calls:** Use the services in `src/apis/` rather than calling `axiosInstance` directly in components.
- **UI Components:** Prefer Ant Design components for consistency. Use Tailwind CSS for layout and spacing.
- **State:** Use Zustand stores for global state. Use local `useState` for component-specific UI state.
- **Authentication:** Token-based authentication using cookies (handled by `withCredentials: true` and interceptors).
- **Pre-commit:** Husky and lint-staged are configured to ensure code quality before commits.
