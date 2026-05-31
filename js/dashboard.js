/* ===================================================
   dashboard.js — Dashboard Page Rendering
   =================================================== */

function renderPage() {
    // Greeting
    const greetingEl = document.getElementById('welcome-greeting');
    if (greetingEl) greetingEl.innerText = getGreeting();

    // Stats
    let totalPemasukan = 0, totalPengeluaran = 0;
    AppState.keuangan.forEach(k => {
        if (k.tipe === 'pemasukan') totalPemasukan += k.jumlah;
        else totalPengeluaran += k.jumlah;
    });

    const dashPemasukan = document.getElementById('dash-pemasukan');
    const dashPengeluaran = document.getElementById('dash-pengeluaran');
    const dashRelasi = document.getElementById('dash-relasi');
    if (dashPemasukan) dashPemasukan.innerText = formatRupiah(totalPemasukan);
    if (dashPengeluaran) dashPengeluaran.innerText = formatRupiah(totalPengeluaran);
    if (dashRelasi) dashRelasi.innerText = `${AppState.relasi.length} Orang`;

    // Calendar
    renderCalendar();

    // Quick Todo
    renderDashboardTodo();

    // Agenda
    renderAgenda();

    lucide.createIcons();
}

function renderDashboardTodo() {
    const container = document.getElementById('dashboard-todo-list');
    if (!container) return;
    container.innerHTML = '';

    const activeTodos = AppState.todo.filter(t => !t.completed);

    if (activeTodos.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-6 text-slate-400">
                <i data-lucide="sparkles" class="w-8 h-8 mb-1.5 text-lavender-300"></i>
                <span class="text-xs">Hebat! Semua tugas telah selesai.</span>
            </div>`;
    } else {
        activeTodos.slice(0, 3).forEach(t => {
            const priorityColor = t.priority === 'Tinggi' ? 'bg-red-400' : (t.priority === 'Sedang' ? 'bg-amber-400' : 'bg-emerald-400');
            container.innerHTML += `
                <div class="flex items-center justify-between bg-white/70 p-3 rounded-xl border border-white/50 shadow-sm">
                    <div class="flex items-center gap-2.5">
                        <button onclick="toggleTodoDashboard(${t.id})" class="w-5 h-5 rounded-md border-2 border-lavender-300 flex items-center justify-center hover:bg-lavender-50 transition-colors"></button>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-700">${t.text}</span>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-[9px] px-1.5 py-0.5 bg-slate-100 rounded-full font-medium text-slate-500">${t.category}</span>
                                <span class="text-[9px] text-slate-400">Due: ${t.date}</span>
                            </div>
                        </div>
                    </div>
                    <span class="w-2.5 h-2.5 rounded-full ${priorityColor}"></span>
                </div>`;
        });
    }

    // Stats
    const totalCount = AppState.todo.length;
    const completedCount = AppState.todo.filter(t => t.completed).length;
    const statsEl = document.getElementById('dash-todo-completed-stats');
    const progressBar = document.getElementById('dash-todo-progress-bar');
    if (statsEl) statsEl.innerText = `${completedCount} dari ${totalCount} tugas selesai`;
    if (progressBar) {
        const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        progressBar.style.width = `${pct}%`;
    }
}

function toggleTodoDashboard(id) {
    const task = AppState.todo.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveLocalData();
        showToast(task.completed ? 'Tugas ditandai selesai! 🎉' : 'Tugas dikembalikan ke daftar aktif.');
        renderPage();
    }
}

function renderAgenda() {
    const container = document.getElementById('agenda-list');
    if (!container) return;
    container.innerHTML = '';

    const agendaTitles = [
        'Kopi santai & diskusi web design',
        'Kirim draft proposal kolaborasi'
    ];

    AppState.relasi.slice(0, 2).forEach((r, idx) => {
        container.innerHTML += `
            <div class="flex items-center gap-2.5 bg-white/60 p-2.5 rounded-2xl border border-white/50">
                <div class="w-8 h-8 rounded-xl bg-lavender-100/50 flex items-center justify-center text-lavender-500 shadow-inner shrink-0">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                </div>
                <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-700">${agendaTitles[idx] || 'Review Kolaborasi'}</span>
                    <span class="text-[9px] text-slate-400">Hubungi: ${r.nama} (${r.instansi})</span>
                </div>
            </div>`;
    });
}

// Init on load
renderPage();
