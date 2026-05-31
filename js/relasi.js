/* ===================================================
   relasi.js — Relasi Page Logic
   =================================================== */

function renderPage() {
    const container = document.getElementById('relasi-grid');
    if (!container) return;
    container.innerHTML = '';

    if (AppState.relasi.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-xs text-slate-400 py-10">Belum ada daftar relasi yang tersimpan.</div>`;
    } else {
        AppState.relasi.forEach(r => {
            const avatarUrl = r.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
            container.innerHTML += `
                <div class="clay-card-inner p-4 flex flex-col justify-between h-48 hover:shadow-lg transition-shadow">
                    <div class="flex items-start gap-3">
                        <div class="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-lavender-200 shadow-sm">
                            <img src="${avatarUrl}" alt="${r.nama}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex flex-col">
                            <h5 class="font-fredoka text-sm font-bold text-slate-700">${r.nama}</h5>
                            <span class="text-[10px] text-slate-400 mt-0.5 font-semibold">${r.instansi}</span>
                            <span class="text-[10px] px-2 py-0.5 bg-lavender-50 border border-lavender-100 text-lavender-600 rounded-full font-medium w-fit mt-1.5">${r.hubungan}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <a href="mailto:info@domain.com" class="flex-grow py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold text-center">Surel</a>
                        <button onclick="contactRelasi('${r.nama}')" class="flex-grow py-1.5 bg-lavender-100 hover:bg-lavender-200 text-lavender-600 rounded-lg text-[10px] font-bold">Sapa</button>
                    </div>
                </div>`;
        });
    }

    lucide.createIcons();
}

function contactRelasi(name) {
    showToast(`Membuka obrolan kontak dengan ${name}...`);
}

renderPage();
