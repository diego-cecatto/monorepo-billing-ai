# Payments Project Specification

## Overview

The Payments Project is a project that validate the price of yours products accodlyt the composition and expenses, using AI:

- **Backend**: TypeScript + Node.js
- **Frontend**: TypeScript + React + React Query

In addition, the frontend and backend will communicate using tRPC.

## Project Structure

The project should have the following structure:

- /root
  - /web ← your React app (frontend)
  - /api ← your tRPC server (backend)
  - /packages
    - /trpc ← shared types + router logic
    - /ui ← shared React components
    - /utils ← shared utils or hooks

## Technical Requirements

- The project should be developed using TypeScript for both the backend and frontend.
- The backend should be implemented using Node.js.
- The frontend should be implemented using React.
- The communication between the frontend and backend should be done using tRPC.

## Dependencies

The project should have the following dependencies:

- **Backend**:
  - `express`
  - `typescript`
- **Frontend**:
  - `react`
  - `react-query`
  - `vite`
- **tRPC**:
  - `@trpc/client`
  - `@trpc/server`
- **husky**:
  - `lint`
  - `conventionalcommits`

## Development Workflow

The development workflow should include the following steps:

1. Set up the project structure.
2. Install the necessary dependencies.
3. Write the backend API endpoints.
4. Implement the backend services.
5. Write the frontend components.
6. Implement the frontend hooks.
7. Test the project.
8. Deploy the project.

## Additional Information

- The project should provide a way to generate invoices and orders for customers.
- The project should have a user interface to display all the invoices and their statuses for all customers.
- The project should be designed with scalability in mind, with a focus on separating the backend and frontend to allow for independent scaling.
- The project should be developed with performance and scalability in mind.
- The project should use MUI framework for building the UI in the frontend.
- The project should use Cypress as the testing framework, considering the use of tRPC.
