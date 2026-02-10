import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';
import { parseISO, format, compareAsc, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

// Todos array (Feature 1)
let todos = [];
let nextId = 1;

// Current filter (Feature 2)
let currentFilter = 'all';

// Current sort (Feature 3: Due dates)
let currentSort = 'default';

document.addEventListener('DOMContentLoaded', () => {
    init();
    initVibeKanban();
});

function init() {
    // Load persisted data
    loadTodos();
    const filterLoaded = loadFilter();
    const sortLoaded = loadSort();

    // Wire up add button
    const addBtn = document.getElementById('addBtn');
    const todoInput = document.getElementById('todoInput');

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // Wire up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Update filter button UI to match loaded filter
    if (filterLoaded) {
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    // Wire up sort buttons
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => setSort(btn.dataset.sort));
    });

    // Update sort button UI to match loaded sort
    if (sortLoaded) {
        sortButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sort === currentSort) {
                btn.classList.add('active');
            }
        });
    }

    renderTodos();
}

function initVibeKanban() {
    const companion = new VibeKanbanWebCompanion();
    companion.render(document.body);
}

// Feature 1: Add, toggle, delete todos
function addTodo() {
    const input = document.getElementById('todoInput');
    const dateInput = document.getElementById('dueDateInput');
    const text = input.value.trim();

    if (text === '') return;

    // Parse priority from text
    let priority = 'normal'; // 'low', 'normal', 'high'
    let cleanedText = text;

    if (text.endsWith('!!')) {
        priority = 'high';
        cleanedText = text.slice(0, -2).trim();
    } else if (text.endsWith('!')) {
        priority = 'low';
        cleanedText = text.slice(0, -1).trim();
    }

    todos.push({
        id: nextId++,
        text: cleanedText,
        completed: false,
        dueDate: dateInput.value || null,
        priority: priority
    });

    input.value = '';
    dateInput.value = '';
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Feature 1: Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const filteredTodos = getFilteredTodos();
    const sortedTodos = getSortedTodos(filteredTodos);

    todoList.innerHTML = '';

    sortedTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) li.classList.add('completed');
        if (todo.priority) li.classList.add(`priority-${todo.priority}`);

        const isOverdue = todo.dueDate && isPast(parseISO(todo.dueDate)) && !isToday(parseISO(todo.dueDate));
        const dueDateHtml = todo.dueDate
            ? `<span class="todo-date" ${isOverdue ? 'data-overdue="true"' : ''}>${formatDueDate(todo.dueDate)}</span>`
            : '';

        const priorityIndicator = getPriorityIndicator(todo.priority);

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <span class="todo-text">${priorityIndicator}${escapeHtml(todo.text)}</span>
                ${dueDateHtml}
            </div>
            <button class="todo-delete">Delete</button>
        `;

        li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
        li.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });
}

// Feature 2: Filter todos based on current filter
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        return todos.filter(t => t.completed);
    }
    return todos; // 'all'
}

// Feature 3: Sort todos by due date
function getSortedTodos(todosToSort) {
    if (currentSort === 'dueDate') {
        return [...todosToSort].sort((a, b) => {
            // Todos without due dates go to the end
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            // Compare dates using date-fns
            const dateA = parseISO(a.dueDate);
            const dateB = parseISO(b.dueDate);
            return compareAsc(dateA, dateB);
        });
    }

    return todosToSort; // Default: maintain original order
}

// Feature 3: Format due date for display
function formatDueDate(dueDateString) {
    if (!dueDateString) return '';

    const date = parseISO(dueDateString);
    const now = new Date();

    if (isPast(date) && !isToday(date)) {
        return `Overdue (${format(date, 'MMM d')})`;
    } else if (isToday(date)) {
        return 'Due Today';
    } else if (isTomorrow(date)) {
        return 'Due Tomorrow';
    } else {
        const daysUntil = differenceInDays(date, now);
        if (daysUntil <= 7) {
            return `Due in ${daysUntil} days (${format(date, 'MMM d')})`;
        } else {
            return `Due ${format(date, 'MMM d, yyyy')}`;
        }
    }
}

// Feature 2: Set filter and update UI
function setFilter(filter) {
    currentFilter = filter;
    saveFilter();

    // Update button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

// Feature 3: Set sort and update UI
function setSort(sortType) {
    currentSort = sortType;
    saveSort();

    // Update button styling
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.sort === sortType) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

// Utility function to get priority indicator
function getPriorityIndicator(priority) {
    if (priority === 'high') {
        return '<span class="priority-indicator priority-high">!!</span> ';
    } else if (priority === 'low') {
        return '<span class="priority-indicator priority-low">!</span> ';
    }
    return '';
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// LocalStorage persistence helpers
const STORAGE_KEYS = {
    TODOS: 'todos-app-todos',
    FILTER: 'todos-app-filter',
    SORT: 'todos-app-sort'
};

function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded. Todos not saved.');
        } else {
            console.warn('Failed to save todos:', e);
        }
    }
}

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.TODOS);
        if (stored) {
            const parsed = JSON.parse(stored);

            // Validate it's an array
            if (Array.isArray(parsed)) {
                // Normalize todos: ensure dueDate exists (undefined -> null) and priority exists
                todos = parsed.map(todo => ({
                    ...todo,
                    dueDate: todo.dueDate || null,
                    priority: todo.priority || 'normal'
                }));

                // Calculate nextId from loaded todos
                if (todos.length > 0) {
                    const maxId = Math.max(...todos.map(t => t.id));
                    nextId = maxId + 1;
                }

                return true;
            }
        }
    } catch (e) {
        console.warn('Failed to load todos, starting fresh:', e);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.TODOS);
    }

    return false;
}

function saveFilter() {
    try {
        localStorage.setItem(STORAGE_KEYS.FILTER, currentFilter);
    } catch (e) {
        console.warn('Failed to save filter:', e);
    }
}

function loadFilter() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FILTER);
        if (stored && ['all', 'active', 'completed'].includes(stored)) {
            currentFilter = stored;
            return true;
        }
    } catch (e) {
        console.warn('Failed to load filter:', e);
    }

    return false;
}

function saveSort() {
    try {
        localStorage.setItem(STORAGE_KEYS.SORT, currentSort);
    } catch (e) {
        console.warn('Failed to save sort:', e);
    }
}

function loadSort() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SORT);
        if (stored && ['default', 'dueDate'].includes(stored)) {
            currentSort = stored;
            return true;
        }
    } catch (e) {
        console.warn('Failed to load sort:', e);
    }
    return false;
}
