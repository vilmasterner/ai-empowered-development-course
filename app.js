let todos = [];
let nextId = 1;

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function addTodo(text) {
    if (!text.trim()) return;

    todos.push({
        id: nextId++,
        text: text.trim(),
        completed: false
    });

    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const span = document.createElement('span');
        span.textContent = todo.text;
        if (todo.completed) {
            span.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

function init() {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');

    const addTodoHandler = () => {
        addTodo(todoInput.value);
        todoInput.value = '';
    };

    addBtn.addEventListener('click', addTodoHandler);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodoHandler();
        }
    });

    renderTodos();
}
