/* ===================================================
   ai.js — AI Assistant Page Logic
   =================================================== */

function renderPage() {
    lucide.createIcons();
}

async function askAI() {
    const inputField = document.getElementById('ai-chat-input');
    if (!inputField) return;
    const prompt = inputField.value.trim();
    if (!prompt) return;

    appendChatMessage('user', prompt);
    inputField.value = '';

    const apiKey = AppState.geminiApiKey;
    const loadingBubbleId = appendLoadingMessage();

    if (!apiKey) {
        setTimeout(() => {
            removeLoadingMessage(loadingBubbleId);
            appendChatMessage('ai', `⚠️ **API Key Gemini belum diset.** Silakan masukkan kunci API Anda menggunakan tombol setelan (ikon gear) di kanan atas.\n\n*Sebagai simulasi asisten, berikut tanggapan terkait:* **"${prompt}"**\n\nUntuk melacak keuangan atau membuat agenda secara cerdas, sambungkan API Key Gemini (gemini-2.5-flash-preview-09-2025) secara aman.`);
        }, 1000);
        return;
    }

    try {
        const response = await callGeminiAPI(apiKey, prompt);
        removeLoadingMessage(loadingBubbleId);
        appendChatMessage('ai', response);
    } catch (error) {
        removeLoadingMessage(loadingBubbleId);
        appendChatMessage('ai', `Maaf, terjadi kendala saat memproses permintaan: ${error.message}`);
    }
}

function sendPreset(text) {
    const input = document.getElementById('ai-chat-input');
    if (input) input.value = text;
    askAI();
}

function appendChatMessage(role, text) {
    const chatArea = document.getElementById('ai-chat-area');
    if (!chatArea) return;
    const isUser = role === 'user';

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex gap-2 items-start max-w-[85%] ${isUser ? 'ml-auto justify-end' : ''}`;

    const iconHTML = isUser ? '' : `
        <div class="w-8 h-8 shrink-0 rounded-full bg-lavender-sidebar flex items-center justify-center text-white shadow-md">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
        </div>`;

    messageDiv.innerHTML = `
        ${iconHTML}
        <div class="${isUser ? 'bg-lavender-sidebar text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-lavender-100'} p-3 rounded-2xl shadow-sm text-xs leading-relaxed">
            ${text}
        </div>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    lucide.createIcons();
}

function appendLoadingMessage() {
    const chatArea = document.getElementById('ai-chat-area');
    if (!chatArea) return 'loading-0';
    const id = 'loading-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.id = id;
    messageDiv.className = 'flex gap-2 items-start max-w-[85%]';
    messageDiv.innerHTML = `
        <div class="w-8 h-8 shrink-0 rounded-full bg-lavender-sidebar flex items-center justify-center text-white shadow-md">
            <i data-lucide="sparkles" class="w-4 h-4 animate-spin"></i>
        </div>
        <div class="bg-white/50 text-slate-400 p-3 rounded-2xl rounded-tl-none border border-dashed border-slate-200 text-xs italic">
            AI sedang menyusun jawaban terbaik...
        </div>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    lucide.createIcons();
    return id;
}

function removeLoadingMessage(id) {
    const elem = document.getElementById(id);
    if (elem) elem.remove();
}

// Welcome message on first load
(function() {
    const chatArea = document.getElementById('ai-chat-area');
    if (chatArea && chatArea.children.length === 0) {
        appendChatMessage('ai', 'Halo! Saya adalah AI Asisten Pribadi Anda. Anda bisa menanyakan analisis pengeluaran keuangan, meminta tips memperluas relasi, atau menyusun jadwal agenda harian secara praktis. Ada yang bisa saya bantu hari ini?');
    }
})();

renderPage();
