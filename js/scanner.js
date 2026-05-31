/* ===================================================
   scanner.js — Scanner Page Logic
   =================================================== */

function renderPage() {
    // Nothing dynamic to render on load for scanner
    lucide.createIcons();
}

function simulateScan() {
    const dummyPayloads = [
        { nama: 'Dian Nugraha', instansi: 'Asosiasi AI Developer', hubungan: 'Pakar Deep Learning', foto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80' },
        { nama: 'Citra Permata', instansi: 'Vanguard Ventures', hubungan: 'Investor Modal Ventura', foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
        { nama: 'Eko Sulistyo', instansi: 'Bandung Tech Hub', hubungan: 'Penyelenggara Event', foto: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80' }
    ];

    const randomPick = dummyPayloads[Math.floor(Math.random() * dummyPayloads.length)];
    const container = document.getElementById('scan-result-container');
    if (!container) return;

    container.innerHTML = `
        <div class="flex items-center gap-3 bg-white p-3 rounded-2xl border border-lavender-200 shadow-sm">
            <img src="${randomPick.foto}" class="w-12 h-12 rounded-full object-cover">
            <div class="flex flex-col">
                <span class="text-xs font-bold text-slate-800">${randomPick.nama}</span>
                <span class="text-[9px] text-slate-400">${randomPick.instansi}</span>
                <span class="text-[9px] text-emerald-600 font-semibold mt-0.5">Berhasil Terdeteksi!</span>
            </div>
        </div>
        <button onclick="saveScannedRelasi('${randomPick.nama}', '${randomPick.instansi}', '${randomPick.hubungan}', '${randomPick.foto}')" class="w-full mt-2.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-fredoka shadow-sm transition-colors">
            + Hubungkan Sebagai Relasi
        </button>`;
    showToast('Scan Berhasil! Menemukan data profil baru.');
    lucide.createIcons();
}

function saveScannedRelasi(nama, instansi, hubungan, foto) {
    const isDuplicate = AppState.relasi.some(r => r.nama === nama);
    if (isDuplicate) { showToast(`Anda sudah terhubung dengan ${nama}.`); return; }

    const newRel = { id: Date.now(), nama, instansi, hubungan, foto };
    AppState.relasi.push(newRel);
    saveLocalData();
    showToast(`Berhasil menambahkan ${nama} ke Relasi Anda!`);
    resetScanner();
}

function resetScanner() {
    const container = document.getElementById('scan-result-container');
    if (!container) return;
    container.innerHTML = `
        <div class="flex items-center justify-center flex-col h-full text-slate-400 py-8">
            <i data-lucide="qr-code" class="w-10 h-10 mb-2"></i>
            <span class="text-xs">Belum ada QR Code yang dipindai</span>
        </div>`;
    lucide.createIcons();
}

renderPage();
