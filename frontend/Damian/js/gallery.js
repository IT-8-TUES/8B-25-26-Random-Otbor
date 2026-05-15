const userName = localStorage.getItem('userName');
const userID = localStorage.getItem('userID');
const API_URL = 'http://127.0.0.1:3000';

const thresholds = [
    { level: 1, xp: 0 },
    { level: 2, xp: 500 },
    { level: 3, xp: 1200 },
    { level: 4, xp: 2500 },
    { level: 5, xp: 4500 },
    { level: 6, xp: 7000 },
    { level: 7, xp: 10000 },
    { level: 8, xp: 14000 },
    { level: 9, xp: 19000 },
    { level: 10, xp: 25000 },
];

function xpTitleLookup(xp) {
    if (xp < 500) return "Beginner";
    if (xp < 1200) return "Newcomer";
    if (xp < 2500) return "Explorer";
    if (xp < 4500) return "Adventurer";
    if (xp < 7000) return "Regular";
    if (xp < 10000) return "Experienced";
    if (xp < 14000) return "Advanced";
    if (xp < 19000) return "Expert";
    if (xp < 25000) return "Veteran";
    return "Elite";
}

function xpToLevel(xp) {
    const last = thresholds[thresholds.length - 1];
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (xp >= thresholds[i].xp) {
            if (i === thresholds.length - 1) {
                return last.level + Math.floor((xp - last.xp) / 8000);
            }
            return thresholds[i].level;
        }
    }
    return 1;
}

function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

async function fetchJSON(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(await getErrorMessage(response, `Request failed with ${response.status}`));
    }
    return response.json();
}

async function getErrorMessage(response, fallback) {
    try {
        const data = await response.json();
        return data.message || fallback;
    } catch (err) {
        return fallback;
    }
}

function safeSet(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

async function fetchUserData() {
    if (!userID) return;
    try {
        const user = await fetchJSON(`${API_URL}/fetch-user-info?userID=${encodeURIComponent(userID)}`);
        const title = xpTitleLookup(user.xp || 0);
        const level = xpToLevel(user.xp || 0);
        safeSet('profile-emoji', user.emoji || '?');
        safeSet('profile-name-topbar', userName || user.name || 'Quests');
        safeSet('profile-name', userName || user.name || 'User');
        safeSet('profile-rank', title);
        safeSet('pill-xp', `${user.xp || 0} XP`);
        safeSet('pill-level', `LV. ${level}`);
        safeSet('active-quests-count', Array.isArray(user.activeQuests) ? user.activeQuests.length : 0);
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

function formatDate(value) {
    if (!value) return 'Unknown date';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

async function fetchGalleryPhotos() {
    const grid = document.getElementById('gallery-grid');
    if (!userID) {
        renderGallery([]);
        return;
    }
    if (grid) {
        grid.innerHTML = '<div class="gallery-empty">Loading gallery...</div>';
    }
    try {
        const data = await fetchJSON(`${API_URL}/fetch-gallery-photos?userID=${encodeURIComponent(userID)}`);
        renderGallery(Array.isArray(data.photos) ? data.photos : []);
    } catch (err) {
        console.error("Error fetching gallery photos:", err);
        safeSet('pictures-count', 0);
        if (grid) {
            grid.innerHTML = `<div class="gallery-empty">${escapeHTML(err.message || 'Could not load gallery.')}</div>`;
        }
    }
}
document.getElementById('gallery-refresh')?.addEventListener('click', fetchGalleryPhotos);

fetchUserData();
fetchGalleryPhotos();
