/* ===================================================
   todo.js — To Do List Page Logic
   =================================================== */

function renderPage() {
    // Set default date
    const dateInput = document.getElementById('todo-date');
    if (dateInput && !dateInput.value) {
        const params = new URLSearchParams(window.location.search);
        const urlDate = params.get('date');
        dateInput.value = urlDate || new Date().toISOString().slice(0, 10);
    }

    renderTodoList();
    lucide.createIcons();
}

function renderTodoList() {
    const container = document.getElementById('todo-list-container');
    if (!container) return;
    container.innerHTML = '';

    let filteredTodos = AppState.todo;
    if (AppState.todoFilter === 'aktif') filteredTodos = AppState.todo.filter(t => !t.completed);
    else if (AppState.todoFilter === 'selesai') filteredTodos = AppState.todo.filter(t => t.completed);

    if (filteredTodos.length === 0) {
        container.innerHTML = `
            <div class="text-center text-xs text-slate-400 py-10">
                <i data-lucide="clipboard-list" class="w-12 h-12 mx-auto mb-2 text-lavender-200"></i>
                <span>Tidak ada tugas dalam kategori ini.</span>
            </div>`;
    } else {
        filteredTodos.forEach(t => {
            const priorityBadge = t.priority === 'Tinggi' ? 'bg-red-50 text-red-500 border-red-100' : (t.priority === 'Sedang' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100');
            container.innerHTML += `
                <div class="flex justify-between items-center bg-white/70 p-3 rounded-xl border border-white/50 shadow-sm transition-all hover:shadow-md ${t.completed ? 'opacity-65' : ''}">
                    <div class="flex items-center gap-3">
                        <button onclick="toggleTodoCompleted(${t.id})" class="w-6 h-6 rounded-lg border-2 ${t.completed ? 'border-emerald-500 bg-emerald-50 text-emerald-500' : 'border-lavender-300 text-transparent'} flex items-center justify-center transition-all hover:scale-105">
                            <i data-lucide="check" class="w-4 h-4 ${t.completed ? 'opacity-100' : 'opacity-0'}"></i>
                        </button>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}">${t.text}</span>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-[9px] px-2 py-0.5 bg-lavender-50 rounded-full font-bold text-lavender-500">${t.category}</span>
                                <span class="text-[9px] font-bold border rounded-full px-2 py-0.5 ${priorityBadge}">${t.priority}</span>
                                <span class="text-[9px] text-slate-400">Due: ${t.date}</span>
                            </div>
                        </div>
                    </div>
                    <button onclick="deleteTodo(${t.id})" class="p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>`;
        });
    }

    // Summary
    const totalCount = AppState.todo.length;
    const completedCount = AppState.todo.filter(t => t.completed).length;
    const summary = document.getElementById('todo-completion-summary');
    if (summary) summary.innerText = `Total: ${totalCount} tugas | Selesai: ${completedCount} | Tertunda: ${totalCount - completedCount}`;

    // Update filter buttons
    updateFilterButtons();
}

function updateFilterButtons() {
    document.querySelectorAll('.todo-filter-btn').forEach(btn => {
        btn.className = "todo-filter-btn text-[10px] font-bold px-3 py-1 bg-white hover:bg-slate-50 text-slate-500 rounded-full border border-slate-100";
    });
    const activeBtn = document.getElementById(`todo-filter-${AppState.todoFilter}`);
    if (activeBtn) activeBtn.className = "todo-filter-btn text-[10px] font-bold px-3 py-1 bg-lavender-100 text-lavender-600 rounded-full";
}

function addTodoEvent(e) {
    e.preventDefault();
    const text = document.getElementById('todo-text').value.trim();
    const category = document.getElementById('todo-category').value;
    const priority = document.getElementById('todo-priority').value;
    const date = document.getElementById('todo-date').value;

    const newTodo = { id: Date.now(), text, category, priority, date, completed: false };
    AppState.todo.unshift(newTodo);
    saveLocalData();
    showToast('Tugas baru berhasil disimpan!');
    document.getElementById('todo-form').reset();
    renderPage();
}

function toggleTodoCompleted(id) {
    const task = AppState.todo.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveLocalData();
        showToast(task.completed ? 'Tugas ditandai selesai! 🎉' : 'Tugas dikembalikan ke daftar aktif.');
        renderPage();
    }
}

function deleteTodo(id) {
    AppState.todo = AppState.todo.filter(t => t.id !== id);
    saveLocalData();
    showToast('Tugas berhasil dihapus.');
    renderPage();
}

function clearCompletedTodos() {
    const initialCount = AppState.todo.length;
    AppState.todo = AppState.todo.filter(t => !t.completed);
    const clearedCount = initialCount - AppState.todo.length;
    if (clearedCount > 0) {
        saveLocalData();
        showToast(`Berhasil membersihkan ${clearedCount} tugas selesai.`);
        renderPage();
    } else {
        showToast('Tidak ada tugas selesai yang perlu dibersihkan.');
    }
}

function filterTodo(filterValue) {
    AppState.todoFilter = filterValue;
    renderTodoList();
    lucide.createIcons();
}

renderPage();
