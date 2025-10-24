# AI Rules for JourneyApp Development

This document outlines the core technologies used in the JourneyApp project and provides clear guidelines on which libraries to use for specific functionalities. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen tech stack.

## Tech Stack Overview

*   **Vite**: A fast build tool that provides an instant development server and optimized builds for production.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, improving code quality and developer experience.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **React Router**: The standard library for routing in React applications, enabling declarative navigation.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, real-time subscriptions, and more.
*   **Tanstack Query (React Query)**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **Sonner**: A modern, accessible, and customizable toast notification library.
*   **Lucide React**: A collection of beautiful and consistent open-source icons.
*   **date-fns**: A comprehensive and lightweight JavaScript date utility library.
*   **Zod**: A TypeScript-first schema declaration and validation library.
*   **React Hook Form**: A performant, flexible, and extensible forms library for React.

## Library Usage Rules

To maintain a consistent and efficient codebase, please follow these guidelines when implementing features:

*   **UI Components**: Always prioritize `shadcn/ui` components for building the user interface. If a specific component is not available in `shadcn/ui` or requires significant customization, create a new component in `src/components/` and style it using Tailwind CSS. **Do not modify files within `src/components/ui/` directly.**
*   **Styling**: All styling must be done using **Tailwind CSS** utility classes. Avoid inline styles or custom CSS files (beyond `src/index.css` for global styles) unless absolutely necessary.
*   **Routing**: Use `react-router-dom` for all client-side navigation and route management. Define routes in `src/App.tsx`.
*   **State Management & Data Fetching**:
    *   For server state management (fetching, caching, updating data from the backend), use **`@tanstack/react-query`**.
    *   For local component state, use React's built-in `useState` and `useReducer` hooks.
*   **Authentication & Database**: All interactions with the backend (user authentication, database queries, real-time data subscriptions) must be handled using the **`@supabase/supabase-js`** client, imported from `src/integrations/supabase/client.ts`.
*   **Notifications**: Use **`sonner`** for displaying all toast notifications to the user.
*   **Icons**: Use icons from the **`lucide-react`** library.
*   **Forms**: For form creation and management, use **`react-hook-form`**. For schema validation of form inputs, use **`zod`**.
*   **Date & Time Handling**: Use **`date-fns`** for all date and time formatting, parsing, and manipulation.
*   **Utility Functions**: For common utility functions, especially those related to class name manipulation (like `cn`), use `src/lib/utils.ts`.