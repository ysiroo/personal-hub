/* ===================================================
   profile.js — Profile Page Rendering
   =================================================== */

function renderPage() {
    const p = AppState.profile;
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    const setSrc = (id, val) => { const el = document.getElementById(id); if (el) el.src = val; };

    setTxt('profile-name', p.name);
    setTxt('profile-role', p.role);
    setTxt('profile-bio', `"${p.bio}"`);
    setSrc('profile-avatar', p.avatar);
    setTxt('profile-city', p.city);
    setTxt('profile-email', p.email);
    setTxt('profile-phone', p.phone);
    setTxt('profile-website', p.website);

    // Skills
    const skillsContainer = document.getElementById('profile-skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
        p.skills.forEach(skill => {
            skillsContainer.innerHTML += `<span class="text-xs px-3 py-1.5 bg-lavender-50 border border-lavender-100 rounded-full font-medium text-slate-600 shadow-sm">${skill}</span>`;
        });
    }

    lucide.createIcons();
}

renderPage();
