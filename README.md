# Todo App - Multi-Agent Development Demo

This repository demonstrates parallel feature development using multiple AI agents through Claude Code.

## Project Overview

A simple todo application built with vanilla HTML, CSS, and JavaScript. The project is structured to showcase how two agents can work on independent features simultaneously using the vibekanban task management system.

## Current State

### Webapp Skeleton
- `index.html` - Basic HTML5 structure with header, main, footer
- `styles.css` - CSS reset and base layout with CSS variables
- `app.js` - JavaScript initialization structure

### Planned Features (In Vibekanban)
1. **Feature 1**: Core Todo Management (CRUD operations)
2. **Feature 2**: Todo Filtering by status

## How to Reproduce

### Step 1: Create Webapp Skeleton

Copy and paste into Claude:
```
Create a basic webapp skeleton using vanilla HTML, CSS, and JavaScript with the following structure:
- index.html: HTML5 document with <header>, <main>, and <footer> sections
- styles.css: Single CSS file with CSS reset, base layout using flexbox, and CSS custom properties (variables) for theming
- app.js: JavaScript file with DOMContentLoaded event listener and basic init() function

Create these files in the current directory (/Users/renebirkeland/Programming/vibe-code-demo) and keep the structure minimal and clean. We'll add feature-specific code later.
```

This creates:
- `index.html` with semantic HTML structure
- `styles.css` with CSS reset and base layout with CSS variables
- `app.js` with DOMContentLoaded listener and init function

### Step 2: Plan Todo App Features

Copy and paste into Claude:
```
Enter plan mode and create a detailed implementation plan for a todo app with two independent, parallel-development features:

Feature 1: Core Todo Management (CRUD operations)
- Add new todos via input field and button
- Display todos in a list
- Mark todos as complete/incomplete via checkbox (with strikethrough styling)
- Delete individual todos

Feature 2: Todo Filtering by Status
- Add three filter buttons: "All", "Active", "Completed"
- Filter todos based on completion status
- Only one filter active at a time
- Update active filter button styling

The plan should include:
1. Exact files to modify (index.html, styles.css, app.js)
2. Specific code structure and function names for each feature
3. Integration points where features share code
4. Clear testing procedures for each feature
5. How the two features can be developed in parallel

This is for a demo showcasing multi-agent parallel development.
```

Claude will create a detailed plan with:
- Feature 1: Core Todo Management (add, display, toggle, delete)
- Feature 2: Todo Filtering (All/Active/Completed)
- Shared state and rendering functions
- Clear integration points for parallel development
- Comprehensive testing procedures

### Step 3: Create Vibekanban Tickets

Prerequisites:
- Vibekanban running and accessible (check the port)
- Claude Code configured with correct vibekanban port
- `vibe-code-demo` project already created in vibekanban

Copy and paste into Claude:
```
Use the vibekanban plugin to create two separate, explicit tickets in the vibe-code-demo project for parallel feature development:

Ticket 1: Feature 1 - Core Todo Management (CRUD Operations)
- Clear title and description for what needs to be built
- List all files to modify: index.html, styles.css, app.js
- Include specific code examples or structure
- Define the data structure for todos (id, text, completed)
- List required functions: addTodo(), toggleTodo(), deleteTodo(), renderTodos()
- Include detailed testing steps

Ticket 2: Feature 2 - Todo Filtering by Status
- Clear title and description for filter functionality
- List all files to modify: index.html, styles.css, app.js
- Include HTML structure for filter buttons
- Define required variables and functions: currentFilter, setFilter()
- Explain how this extends renderTodos() from Feature 1
- Include detailed testing steps that work with Feature 1

Each ticket must be:
- Explicit and detailed enough for independent implementation
- Clear about coordination points with the other feature
- Include all necessary code structure and styling requirements
- Include testing procedures to verify the implementation

These are for demonstration of parallel multi-agent development.
```

This creates two explicit, detailed tickets in the `vibe-code-demo` project that agents can work on independently and in parallel.

## Running the App Locally

Start a local HTTP server:
```bash
python3 -m http.server 8080
```

Open in browser:
```
http://localhost:8080
```

## Next Steps for Multi-Agent Development

Once both features are complete, agents can work on:

### Agent 1: Feature 1 (Core Todo Management)
- Implement add todo functionality
- Display todos in list
- Toggle completion status
- Delete todos

### Agent 2: Feature 2 (Todo Filtering)
- Add filter buttons (All/Active/Completed)
- Extend renderTodos() with filtering logic
- Update UI based on active filter

## Architecture

### Shared State
- `todos` array: `[{ id, text, completed }, ...]`

### Rendering
- `renderTodos()` function handles display
- Feature 1 creates base implementation
- Feature 2 extends with filtering logic

### Integration
- Both features modify the same files
- Coordination needed on `renderTodos()` function
- Clear separation of concerns enables parallel work

## Testing Checklist

### Feature 1
- [ ] Add new todos
- [ ] Toggle completion (strikethrough)
- [ ] Delete todos
- [ ] List renders correctly

### Feature 2
- [ ] Filter buttons display
- [ ] "All" shows all todos
- [ ] "Active" shows only incomplete todos
- [ ] "Completed" shows only completed todos
- [ ] Filters work while adding/toggling/deleting

## Files Structure

```
vibe-code-demo/
├── README.md
├── index.html
├── styles.css
└── app.js
```

## Vibekanban Integration

Project: `vibe-code-demo`

Tickets created for parallel development:
- Feature 1: Core Todo Management (CRUD)
- Feature 2: Todo Filtering by Status

Each ticket includes explicit file modifications, requirements, and testing procedures.
