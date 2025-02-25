# Form Builder & Renderer

A dynamic form builder and renderer application built with React, TypeScript, and Vite. Create, validate, and publish custom forms with various question types and validation rules.

## Live Demo

[Try the app here](https://form-dev-eight.vercel.app/)

## Features

### Form Builder

- Create custom forms with a title and description
- Add multiple question types:
  - Text (with email, URL, contains, min/max length validation)
  - Number (with range, greater than, less than validation)
  - Dropdown (with option management)
- Real-time validation
- Auto-save progress
- Form publishing with validation
- Responsive design

### Form Renderer

- Clean, user-friendly interface
- Real-time input validation
- Response auto-save
- Mobile-responsive layout

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── form-builder/    # Form creation components
│   └── form-renderer/   # Form display components
├── hooks/               # Custom React hooks
├── pages/               # Main page components
├── services/           # Business logic and services
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hot Toast
- Heroicons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/sanskarjain7/form-dev.git
cd form-dev
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The app is deployed using Vercel. For deploying your own instance:

1. Fork this repository
2. Create a Vercel account if you don't have one
3. Connect your GitHub repository to Vercel
4. Deploy with default settings

## Development Notes

- Uses local storage for data persistence
- Simulated API calls with random delays for realistic behavior
- Form validation happens both client-side and before submission
