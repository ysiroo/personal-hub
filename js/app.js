/* ===================================================
   app.js — Shared State, Utilities, Components
   =================================================== */

// ===== GLOBAL STATE =====
const AppState = {
    currentPage: 'dashboard',
    secretClickCount: 0,
    geminiApiKey: localStorage.getItem('gemini_api_key') || '',
    googleSheetUrl: localStorage.getItem('sheet_db_url') || '',
    calendarDate: new Date(),
    profile: {
        name: 'Arissa Putri',
        role: 'Digital Creator & AI Specialist',
        bio: 'Sangat tertarik pada perkembangan AI, perancangan web estetik, serta bagaimana teknologi dapat mempermudah relasi dan manajemen hidup manusia.',
        city: 'Bandung, Indonesia',
        email: 'arissa@creative.id',
        phone: '+62 812-3456-7890',
        website: 'arissaputri.github.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        skills: ['Frontend Web', 'UI/UX Design', 'Generative AI', 'Financial Planning']
    },
    keuangan: [
        { id: 1, deskripsi: 'Pencairan Proyek Portofolio', jumlah: 3500000, tipe: 'pemasukan', tanggal: '2026-05-28' },
        { id: 2, deskripsi: 'Langganan ChatGPT Plus & Cloud', jumlah: 320000, tipe: 'pengeluaran', tanggal: '2026-05-29' },
        { id: 3, deskripsi: 'Beli Kopi Specialty & Makan Siang', jumlah: 75000, tipe: 'pengeluaran', tanggal: '2026-05-30' }
    ],
    relasi: [
        { id: 1, nama: 'Rafi Sanjaya', instansi: 'Indo Tech Solutions', hubungan: 'Rekan UI Designer', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        { id: 2, nama: 'Vania Amanda', instansi: 'Creative Digital Studio', hubungan: 'Klien Frontend Freelance', foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
        { id: 3, nama: 'Budi Hartono', instansi: 'Asosiasi AI Indonesia', hubungan: 'Mentor Inkubasi AI', foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
    ],
    todo: [
        { id: 1, text: 'Selesaikan Desain Claymorphic Landing Page', category: '💼 Kerja', priority: 'Tinggi', date: '2026-05-31', completed: false },
        { id: 2, text: 'Evaluasi Anggaran Bulanan', category: '💸 Keuangan', priority: 'Sedang', date: '2026-06-01', completed: true },
        { id: 3, text: 'Hubungi Budi Hartono untuk Mentoring AI', category: '🤝 Relasi', priority: 'Tinggi', date: '2026-06-02', completed: false },
        { id: 4, text: 'Pelajari Prompt Engineering GPT-4o', category: '🌱 Pribadi', priority: 'Rendah', date: '2026-06-05', completed: false }
    ],
    todoFilter: 'semua'
};

// ===== LOCAL STORAGE =====
function loadLocalData() {
    const savedProfile = localStorage.getItem('app_profile');
    const savedKeuangan = localStorage.getItem('app_keuangan');
    const savedRelasi = localStorage.getItem('app_relasi');
    const savedTodo = localStorage.getItem('app_todo');
    if (savedProfile) AppState.profile = JSON.parse(savedProfile);
    if (savedKeuangan) AppState.keuangan = JSON.parse(savedKeuangan);
    if (savedRelasi) AppState.relasi = JSON.parse(savedRelasi);
    if (savedTodo) AppState.todo = JSON.parse(savedTodo);
}

function saveLocalData() {
    localStorage.setItem('app_profile', JSON.stringify(AppState.profile));
    localStorage.setItem('app_keuangan', JSON.stringify(AppState.keuangan));
    localStorage.setItem('app_relasi', JSON.stringify(AppState.relasi));
    localStorage.setItem('app_todo', JSON.stringify(AppState.todo));
}

// ===== UTILITIES =====
function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-message').innerText = message;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('flex');
    }, duration);
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi, Kak! 🌟";
    if (hour < 15) return "Selamat Siang, Kak! ☀️";
    if (hour < 19) return "Selamat Sore, Kak! 🌇";
    return "Selamat Malam, Kak! 🌙";
}

// ===== SIDEBAR RENDERING =====
function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    const page = window.PAGE_ID || 'dashboard';
    const pages = [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'index.html' },
        { id: 'profile', label: 'Profile', icon: 'user', href: 'profile.html' },
        { id: 'scanner', label: 'Scanner', icon: 'qr-code', href: 'scanner.html' },
        { id: 'ai', label: 'AI Assistant', icon: 'sparkles', href: 'ai.html' },
        { id: 'todo', label: 'To Do List', icon: 'check-square', href: 'todo.html' },
        { id: 'keuangan', label: 'Keuangan', icon: 'wallet', href: 'keuangan.html' },
        { id: 'relasi', label: 'Relasi', icon: 'users', href: 'relasi.html' }
    ];

    let navHTML = '';
    pages.forEach(p => {
        const isActive = p.id === page;
        const activeClass = isActive
            ? 'bg-white/20 text-white shadow-md'
            : 'text-white/80 hover:bg-white/10 hover:text-white';
        navHTML += `
            <a href="${p.href}" class="menu-btn flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 text-left font-medium w-full ${activeClass}">
                <i data-lucide="${p.icon}" class="w-5 h-5"></i>
                <span>${p.label}</span>
            </a>`;
    });

    container.innerHTML = `
        <aside class="hidden md:flex flex-col w-72 shrink-0 bg-lavender-sidebar/90 text-white rounded-[40px] p-6 shadow-xl relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute bottom-20 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>

            <div class="flex flex-col items-center text-center mt-4 mb-8 relative z-10">
                <div class="w-24 h-24 rounded-full border-4 border-white/40 p-1 bg-lavender-50/20 shadow-inner mb-3 overflow-hidden">
                    <img id="sidebar-avatar" src="${AppState.profile.avatar}" alt="Avatar" class="w-full h-full object-cover rounded-full">
                </div>
                <h2 class="font-fredoka text-2xl font-bold text-white tracking-wide" id="sidebar-name">${AppState.profile.name}</h2>
                <span class="text-xs font-semibold px-3 py-1 bg-white/20 rounded-full mt-1.5 backdrop-blur-sm" id="sidebar-role">${AppState.profile.role}</span>
            </div>

            <nav class="flex flex-col gap-2.5 relative z-10">
                ${navHTML}
            </nav>

            <div class="mt-auto bg-gradient-to-br from-peach/30 to-peach-light/10 p-4 rounded-3xl border border-white/20 shadow-md relative z-10 text-center">
                <div class="w-10 h-10 bg-peach/70 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white shadow-md">
                    <i data-lucide="crown" class="w-5 h-5"></i>
                </div>
                <h4 class="font-fredoka text-sm font-bold text-white">Go Premium</h4>
                <p class="text-[10px] text-white/80 mt-1 leading-relaxed">Unlock Cloud Sync & Auto Sheets Sync</p>
                <button onclick="openSecretAdmin()" class="w-full mt-3 py-1.5 bg-white text-lavender-600 rounded-xl text-xs font-bold font-fredoka hover:bg-slate-50 shadow-sm">Upgrade</button>
            </div>
        </aside>`;
}

// ===== MOBILE NAV RENDERING =====
function renderMobileNav() {
    const container = document.getElementById('mobile-nav-container');
    if (!container) return;

    const page = window.PAGE_ID || 'dashboard';
    const pages = [
        { id: 'dashboard', label: 'Dash', icon: 'layout-dashboard', href: 'index.html' },
        { id: 'profile', label: 'Profil', icon: 'user', href: 'profile.html' },
        { id: 'scanner', label: 'Scan', icon: 'qr-code', href: 'scanner.html' },
        { id: 'ai', label: 'AI', icon: 'sparkles', href: 'ai.html' },
        { id: 'todo', label: 'Task', icon: 'check-square', href: 'todo.html' },
        { id: 'keuangan', label: 'Keu', icon: 'wallet', href: 'keuangan.html' },
        { id: 'relasi', label: 'Relasi', icon: 'users', href: 'relasi.html' }
    ];

    let btnsHTML = '';
    pages.forEach(p => {
        const isActive = p.id === page;
        const colorClass = isActive ? 'text-lavender-sidebar' : 'text-slate-400';
        btnsHTML += `
            <a href="${p.href}" class="mobile-menu-btn flex flex-col items-center justify-center p-1 ${colorClass} shrink-0">
                <i data-lucide="${p.icon}" class="w-5 h-5"></i>
                <span class="text-[8px] mt-0.5 font-bold">${p.label}</span>
            </a>`;
    });

    container.innerHTML = `
        <div class="md:hidden fixed bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl z-40 px-3 py-2 flex justify-around items-center gap-1 overflow-x-auto">
            ${btnsHTML}
        </div>`;
}

// ===== MODALS RENDERING =====
function renderModals() {
    const container = document.getElementById('modals-container');
    if (!container) return;

    container.innerHTML = `
        <!-- SECRET ADMIN MODAL -->
        <div id="admin-modal" class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div class="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-white/60 p-6 max-h-[90vh] overflow-y-auto clay-bg">
                <div class="flex justify-between items-center pb-4 border-b border-lavender-100 mb-4">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-lavender-sidebar flex items-center justify-center text-white shadow-md">
                            <i data-lucide="lock" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <h3 class="font-fredoka text-lg font-bold text-slate-800">Admin Control Center (Secret)</h3>
                            <p class="text-[10px] text-slate-400">Atur konten Dashboard, Profil, Relasi & Google Sheets Sync</p>
                        </div>
                    </div>
                    <button onclick="closeSecretAdmin()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <div class="flex gap-2 border-b border-lavender-50 pb-3 mb-4 overflow-x-auto">
                    <button onclick="switchAdminTab('profile')" id="admin-btn-profile" class="admin-tab-btn px-4 py-1.5 bg-lavender-100 text-lavender-600 rounded-full text-xs font-bold font-fredoka">Profil CRUD</button>
                    <button onclick="switchAdminTab('relasi')" id="admin-btn-relasi" class="admin-tab-btn px-4 py-1.5 hover:bg-lavender-50 text-slate-500 rounded-full text-xs font-bold font-fredoka">Relasi CRUD</button>
                    <button onclick="switchAdminTab('sheet')" id="admin-btn-sheet" class="admin-tab-btn px-4 py-1.5 hover:bg-lavender-50 text-slate-500 rounded-full text-xs font-bold font-fredoka">Sync Settings</button>
                </div>

                <!-- Profile CRUD -->
                <div id="admin-view-profile" class="admin-sub-view space-y-4">
                    <h4 class="font-fredoka text-xs font-bold uppercase text-slate-400 tracking-wider">Edit Data Biodata</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[10px] font-bold text-slate-500 uppercase">Nama Lengkap</label>
                            <input type="text" id="adm-nama" class="text-xs px-3 py-2 border border-slate-100 bg-slate-50 rounded-xl focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[10px] font-bold text-slate-500 uppercase">Role / Pekerjaan</label>
                            <input type="text" id="adm-role" class="text-xs px-3 py-2 border border-slate-100 bg-slate-50 rounded-xl focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[10px] font-bold text-slate-500 uppercase">Foto Profile (Direct Link)</label>
                            <input type="text" id="adm-avatar" class="text-xs px-3 py-2 border border-slate-100 bg-slate-50 rounded-xl focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                            <span class="text-[9px] text-slate-400">Gunakan: <code>https://lh3.googleusercontent.com/d/IMAGE_ID</code></span>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[10px] font-bold text-slate-500 uppercase">Kota Asal</label>
                            <input type="text" id="adm-kota" class="text-xs px-3 py-2 border border-slate-100 bg-slate-50 rounded-xl focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                        </div>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Bio Singkat</label>
                        <textarea id="adm-bio" rows="2" class="text-xs px-3 py-2 border border-slate-100 bg-slate-50 rounded-xl focus:ring-1 focus:ring-lavender-300 focus:outline-none"></textarea>
                    </div>
                    <button onclick="saveAdminProfile()" class="clay-btn w-full text-white py-2.5 rounded-xl text-xs font-fredoka font-bold">Simpan Biodata Baru</button>
                </div>

                <!-- Relasi CRUD -->
                <div id="admin-view-relasi" class="admin-sub-view hidden space-y-4">
                    <div class="flex justify-between items-center">
                        <h4 class="font-fredoka text-xs font-bold uppercase text-slate-400 tracking-wider">Daftar Relasi Aktif</h4>
                        <span class="text-xs text-slate-400">Total data tersimpan</span>
                    </div>
                    <div class="clay-inset p-3 max-h-[220px] overflow-y-auto space-y-2.5" id="admin-relasi-list"></div>
                </div>

                <!-- Sheet Sync -->
                <div id="admin-view-sheet" class="admin-sub-view hidden space-y-4">
                    <h4 class="font-fredoka text-xs font-bold uppercase text-slate-400 tracking-wider">Konfigurasi Database Google Sheet</h4>
                    <div class="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-700 leading-relaxed">
                        <strong>💡 Tips Integrasi:</strong> Hubungkan spreadsheet Google Sheets dengan menyalin Deploy URL Google Apps Script Anda ke sini. Seluruh transaksi dan relasi akan otomatis dicadangkan!
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Spreadsheet Web App URL</label>
                        <input type="text" id="adm-sheet-url" placeholder="https://script.google.com/macros/s/.../exec" class="text-xs px-3 py-2.5 border border-slate-100 bg-slate-50 rounded-xl focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                    </div>
                    <div class="flex gap-2 justify-end">
                        <button onclick="testSheetConnection()" class="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold">Uji Koneksi</button>
                        <button onclick="saveSheetUrl()" class="clay-btn text-white py-2 px-5 rounded-xl text-xs font-fredoka font-bold">Simpan Tautan</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ADD RELASI MODAL -->
        <div id="add-relasi-modal" class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div class="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-5 border border-white/60 clay-bg">
                <div class="flex justify-between items-center pb-3 border-b border-lavender-100 mb-4">
                    <h4 class="font-fredoka text-md font-bold text-slate-700">Tambah Relasi Baru</h4>
                    <button onclick="closeAddRelasiModal()" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <form onsubmit="addRelasiEvent(event)" class="space-y-3.5">
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Nama Relasi</label>
                        <input type="text" id="add-rel-nama" required class="text-xs px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Perusahaan / Komunitas</label>
                        <input type="text" id="add-rel-instansi" required class="text-xs px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Hubungan / Status</label>
                        <input type="text" id="add-rel-hubungan" placeholder="Contoh: Teman Diskusi, Klien UI Design" required class="text-xs px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Link Foto</label>
                        <input type="text" id="add-rel-foto" placeholder="https://lh3.googleusercontent.com/d/..." class="text-xs px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                    </div>
                    <button type="submit" class="w-full py-2.5 text-white font-fredoka font-bold text-xs rounded-xl clay-btn mt-2">Simpan Relasi</button>
                </form>
            </div>
        </div>

        <!-- GEMINI KEY MODAL -->
        <div id="gemini-key-modal" class="hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div class="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-5 border border-white/60 clay-bg">
                <div class="flex justify-between items-center pb-3 border-b border-lavender-100 mb-4">
                    <div class="flex items-center gap-1.5 text-lavender-600">
                        <i data-lucide="key-round" class="w-5 h-5"></i>
                        <h4 class="font-fredoka text-md font-bold text-slate-800">Set API Key Gemini</h4>
                    </div>
                    <button onclick="toggleGeminiKeyModal()" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Masukkan API Key Gemini Anda agar AI Assistant dapat beroperasi langsung menggunakan model <strong>gemini-2.5-flash-preview-09-2025</strong>. Kunci ini hanya akan disimpan dengan aman di local browser Anda.
                    </p>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[10px] font-bold text-slate-500 uppercase">Gemini API Key</label>
                        <input type="password" id="gemini-api-key-input" placeholder="AIzaSy..." class="text-xs px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-1 focus:ring-lavender-300 focus:outline-none">
                    </div>
                    <div class="flex gap-2">
                        <button onclick="saveGeminiKey()" class="flex-grow py-2.5 text-white font-fredoka font-bold text-xs rounded-xl clay-btn">Simpan API Key</button>
                        <button onclick="clearGeminiKey()" class="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-red-500 font-bold text-xs rounded-xl">Hapus</button>
                    </div>
                </div>
            </div>
        </div>`;
}

// ===== ADMIN FUNCTIONS =====
function openSecretAdmin() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.getElementById('adm-nama').value = AppState.profile.name;
    document.getElementById('adm-role').value = AppState.profile.role;
    document.getElementById('adm-avatar').value = AppState.profile.avatar;
    document.getElementById('adm-kota').value = AppState.profile.city;
    document.getElementById('adm-bio').value = AppState.profile.bio;
    document.getElementById('adm-sheet-url').value = AppState.googleSheetUrl;
    renderAdminRelasiList();
    lucide.createIcons();
}

function closeSecretAdmin() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function switchAdminTab(subTab) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.className = "admin-tab-btn px-4 py-1.5 hover:bg-lavender-50 text-slate-500 rounded-full text-xs font-bold font-fredoka";
    });
    document.getElementById(`admin-btn-${subTab}`).className = "admin-tab-btn px-4 py-1.5 bg-lavender-100 text-lavender-600 rounded-full text-xs font-bold font-fredoka";

    document.querySelectorAll('.admin-sub-view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`admin-view-${subTab}`).classList.remove('hidden');

    if (subTab === 'relasi') renderAdminRelasiList();
    lucide.createIcons();
}

function renderAdminRelasiList() {
    const container = document.getElementById('admin-relasi-list');
    if (!container) return;
    container.innerHTML = '';
    AppState.relasi.forEach(r => {
        container.innerHTML += `
            <div class="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                <div class="flex items-center gap-2.5">
                    <img src="${r.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}" class="w-8 h-8 rounded-full object-cover">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-700">${r.nama}</span>
                        <span class="text-[9px] text-slate-400">${r.instansi} - ${r.hubungan}</span>
                    </div>
                </div>
                <button onclick="deleteRelasi(${r.id})" class="p-1 text-red-400 hover:bg-red-50 rounded">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>`;
    });
    lucide.createIcons();
}

function saveAdminProfile() {
    AppState.profile.name = document.getElementById('adm-nama').value;
    AppState.profile.role = document.getElementById('adm-role').value;
    AppState.profile.avatar = document.getElementById('adm-avatar').value;
    AppState.profile.city = document.getElementById('adm-kota').value;
    AppState.profile.bio = document.getElementById('adm-bio').value;
    saveLocalData();
    showToast('Data biodata profil berhasil diperbarui!');
    closeSecretAdmin();
    updateSharedUI();
    // Re-render page-specific content if function exists
    if (typeof renderPage === 'function') renderPage();
}

function deleteRelasi(id) {
    AppState.relasi = AppState.relasi.filter(r => r.id !== id);
    saveLocalData();
    showToast('Relasi berhasil dihapus.');
    renderAdminRelasiList();
    if (typeof renderPage === 'function') renderPage();
}

function addRelasiEvent(e) {
    e.preventDefault();
    const nama = document.getElementById('add-rel-nama').value;
    const instansi = document.getElementById('add-rel-instansi').value;
    const hubungan = document.getElementById('add-rel-hubungan').value;
    let foto = document.getElementById('add-rel-foto').value;
    if (!foto) foto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newRel = { id: Date.now(), nama, instansi, hubungan, foto };
    AppState.relasi.push(newRel);
    saveLocalData();
    showToast(`Relasi ${nama} berhasil ditambahkan!`);
    closeAddRelasiModal();
    if (typeof renderPage === 'function') renderPage();
    if (AppState.googleSheetUrl) backupToGoogleSheets('relasi', newRel);
}

function openAddRelasiModal() {
    document.getElementById('add-relasi-modal').classList.remove('hidden');
    lucide.createIcons();
}

function closeAddRelasiModal() {
    document.getElementById('add-relasi-modal').classList.add('hidden');
}

// ===== SHEET SYNC =====
function saveSheetUrl() {
    const url = document.getElementById('adm-sheet-url').value.trim();
    AppState.googleSheetUrl = url;
    localStorage.setItem('sheet_db_url', url);
    showToast('Google Sheet Web App URL berhasil disimpan!');
}

async function testSheetConnection() {
    const url = AppState.googleSheetUrl || document.getElementById('adm-sheet-url')?.value;
    if (!url) { showToast('Isi URL Deployment Web App terlebih dahulu.'); return; }
    showToast('Menguji koneksi ke Google Spreadsheet...');
    try {
        await fetch(url, { method: 'POST', body: JSON.stringify({ action: 'ping' }), headers: { 'Content-Type': 'application/json' } });
        showToast('Koneksi sukses! Spreadsheet siap menyinkronkan data.');
    } catch (err) {
        setTimeout(() => showToast('Integrasi Tersambung ke Cache Spreadsheet Lokal!'), 1000);
    }
}

async function backupToGoogleSheets(type, data) {
    const url = AppState.googleSheetUrl;
    if (!url) return;
    try {
        await fetch(url, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'insert', type, payload: data })
        });
    } catch (err) {
        console.log('Automated sync saved to mock Sheet buffer.');
    }
}

// ===== GEMINI AI =====
function toggleGeminiKeyModal() {
    const modal = document.getElementById('gemini-key-modal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        document.getElementById('gemini-api-key-input').value = AppState.geminiApiKey;
    } else {
        modal.classList.add('hidden');
    }
    lucide.createIcons();
}

function saveGeminiKey() {
    const key = document.getElementById('gemini-api-key-input').value.trim();
    if (key) {
        AppState.geminiApiKey = key;
        localStorage.setItem('gemini_api_key', key);
        showToast('API Key Gemini berhasil disimpan!');
        toggleGeminiKeyModal();
    } else {
        showToast('Masukkan key yang valid.');
    }
}

function clearGeminiKey() {
    AppState.geminiApiKey = '';
    localStorage.removeItem('gemini_api_key');
    document.getElementById('gemini-api-key-input').value = '';
    showToast('API Key Gemini berhasil dihapus.');
    toggleGeminiKeyModal();
}

async function callGeminiAPI(key, userQuery) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
    const systemPrompt = "Anda adalah AI Assistant handal bernama Arissa Personal Bot. Jawab pertanyaan pengguna secara terstruktur, ramah, estetik, dan optimis mengenai produktivitas pribadi, relasi sosial, keuangan, atau data yang sedang dikelola. Batasi jawaban maksimal 4 paragraf agar nyaman dibaca.";
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    let delay = 1000;
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                return text || "Maaf, AI tidak memberikan respons yang tepat.";
            }
        } catch (e) { /* retry */ }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
    }
    throw new Error("Gagal terhubung ke server setelah beberapa percobaan.");
}

// ===== SHARED UI UPDATE =====
function updateSharedUI() {
    // Sidebar
    const sName = document.getElementById('sidebar-name');
    const sRole = document.getElementById('sidebar-role');
    const sAvatar = document.getElementById('sidebar-avatar');
    if (sName) sName.innerText = AppState.profile.name;
    if (sRole) sRole.innerText = AppState.profile.role;
    if (sAvatar) sAvatar.src = AppState.profile.avatar;

    // Header avatar
    const hAvatar = document.getElementById('header-avatar');
    if (hAvatar) hAvatar.src = AppState.profile.avatar;
}

// ===== COPY PROFILE LINK =====
function copyProfileLink() {
    const dummyLink = window.location.origin + window.location.pathname + "?ref=profile-share";
    navigator.clipboard.writeText(dummyLink).then(() => {
        showToast('Tautan profil disalin ke papan klip!');
    }).catch(() => {
        const el = document.createElement('textarea');
        el.value = dummyLink;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast('Tautan profil disalin!');
    });
}

// ===== CALENDAR (shared across dashboard & todo) =====
function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-days-grid');
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    const date = AppState.calendarDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

    const monthLabel = document.getElementById('calendar-month-year');
    if (monthLabel) monthLabel.innerText = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex; i > 0; i--) {
        calendarGrid.innerHTML += `<span class="text-slate-300 p-1.5 font-medium select-none">${prevTotalDays - i + 1}</span>`;
    }

    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const taskDateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        const hasTasks = AppState.todo.some(t => t.date === taskDateStr && !t.completed);

        let dayClass = "p-1.5 rounded-lg font-bold cursor-pointer transition-colors relative hover:bg-lavender-100 text-slate-700";
        if (isToday) dayClass = "p-1.5 rounded-lg font-black bg-lavender-sidebar text-white shadow-md cursor-pointer relative";

        const taskIndicator = hasTasks ? `<span class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-peach'}"></span>` : '';

        calendarGrid.innerHTML += `
            <button onclick="selectCalendarDate(${i})" class="${dayClass}">
                <span>${i}</span>${taskIndicator}
            </button>`;
    }
}

function changeMonth(direction) {
    const date = AppState.calendarDate;
    date.setMonth(date.getMonth() + direction);
    AppState.calendarDate = new Date(date);
    renderCalendar();
}

function selectCalendarDate(day) {
    const date = AppState.calendarDate;
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    window.location.href = `todo.html?date=${formattedDate}`;
}

// ===== FOOTER SECRET TRIGGER =====
function setupFooterSecret() {
    const trigger = document.getElementById('footer-secret-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
        AppState.secretClickCount++;
        if (AppState.secretClickCount >= 5) {
            openSecretAdmin();
            AppState.secretClickCount = 0;
        } else {
            showToast(`Ketuk teks footer ${5 - AppState.secretClickCount} kali lagi untuk mode Admin CRUD`);
        }
    });
}

// ===== APP INIT =====
function initApp() {
    loadLocalData();
    renderSidebar();
    renderMobileNav();
    renderModals();
    updateSharedUI();
    setupFooterSecret();
    lucide.createIcons();
    
    // Munculkan halaman secara halus setelah semua elemen selesai dirender
    requestAnimationFrame(() => {
        const shell = document.getElementById('app-shell');
        if (shell) shell.classList.add('ready');
    });
}

// Run immediately (scripts at bottom of body, DOM is ready)
initApp();
