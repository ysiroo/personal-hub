/* ===================================================
   keuangan.js — Keuangan Page Logic
   =================================================== */

function renderPage() {
    let totalPemasukan = 0, totalPengeluaran = 0;
    AppState.keuangan.forEach(k => {
        if (k.tipe === 'pemasukan') totalPemasukan += k.jumlah;
        else totalPengeluaran += k.jumlah;
    });
    const totalSaldo = totalPemasukan - totalPengeluaran;

    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setTxt('keu-saldo-total', formatRupiah(totalSaldo));
    setTxt('keu-saldo-pemasukan', formatRupiah(totalPemasukan));
    setTxt('keu-saldo-pengeluaran', formatRupiah(totalPengeluaran));

    // Transaction list
    const container = document.getElementById('keuangan-list');
    if (!container) return;
    container.innerHTML = '';

    if (AppState.keuangan.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-slate-400 py-6">Belum ada catatan transaksi keuangan.</div>`;
    } else {
        AppState.keuangan.forEach(k => {
            const isIncome = k.tipe === 'pemasukan';
            container.innerHTML += `
                <div class="flex justify-between items-center bg-white/70 p-3 rounded-xl border border-white/50 shadow-sm">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs ${isIncome ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}">
                            <i data-lucide="${isIncome ? 'arrow-up-right' : 'arrow-down-left'}" class="w-4 h-4"></i>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-700">${k.deskripsi}</span>
                            <span class="text-[9px] text-slate-400">${k.tanggal}</span>
                        </div>
                    </div>
                    <span class="text-xs font-bold ${isIncome ? 'text-emerald-600' : 'text-red-500'}">
                        ${isIncome ? '+' : '-'} ${formatRupiah(k.jumlah)}
                    </span>
                </div>`;
        });
    }

    lucide.createIcons();
}

function addTransactionEvent(e) {
    e.preventDefault();
    const deskripsi = document.getElementById('keu-deskripsi').value;
    const jumlah = parseInt(document.getElementById('keu-jumlah').value);
    const tipe = document.getElementById('keu-tipe').value;
    const dateStr = new Date().toISOString().slice(0, 10);

    const newTx = { id: Date.now(), deskripsi, jumlah, tipe, tanggal: dateStr };
    AppState.keuangan.push(newTx);
    saveLocalData();
    showToast('Catatan transaksi berhasil disimpan!');
    document.getElementById('keuangan-form').reset();
    renderPage();

    if (AppState.googleSheetUrl) backupToGoogleSheets('keuangan', newTx);
}

renderPage();
