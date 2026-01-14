# To-Do App

A modern, elegant task management application built with Next.js, TypeScript, and Framer Motion. Features a beautiful UI with smooth animations, drag-and-drop reordering, and undo/redo functionality.

## Features

- **Task Management**: Create, edit, and delete tasks with ease
- **Status Tracking**: Three status levels - Pending, In Progress, and Done
- **Drag & Drop**: Reorder tasks by dragging them
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Filtering**: Filter tasks by status or view all at once
- **Authentication**: Simple login screen to access your dashboard
- **Persistent Storage**: All tasks are saved to localStorage
- **Responsive Design**: Works beautifully on all screen sizes
- **Smooth Animations**: Powered by Framer Motion for delightful interactions

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Framer Motion** - Animations and gestures
- **Tailwind CSS** - Styling
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd todo-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Login**: Enter any username and password to access the app
2. **Add Task**: Click the "New Task" button to create a task
3. **Edit Task**: Click on a task title to edit it (only for pending/in-progress tasks)
4. **Change Status**: Click the status badge to cycle through Pending → In Progress → Done
5. **Reorder**: Drag tasks by the grip handle to reorder them
6. **Delete**: Click the trash icon to remove a task
7. **Filter**: Use the filter chips to view tasks by status
8. **Undo/Redo**: Use Ctrl+Z to undo and Ctrl+Y (or Ctrl+Shift+Z) to redo

## Keyboard Shortcuts

- `Ctrl + Z` - Undo last action
- `Ctrl + Y` or `Ctrl + Shift + Z` - Redo action

## Project Structure

```
todo-app/
├── app/
│   ├── add/
│   │   └── page.tsx        # Add task page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── AddTodoPage.tsx     # Add task component
│   ├── Layout.tsx          # Layout component
│   ├── LoginPage.tsx       # Login component
│   ├── TodoApp.tsx         # Main app logic
│   └── TodoListPage.tsx    # Task list component
├── types.ts                # TypeScript types
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## License

MIT

## Author

Built with ❤️ using Next.js and TypeScript
