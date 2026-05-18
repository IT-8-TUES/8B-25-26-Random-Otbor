// Static player data (fallback)
const players = [
    { name: 'Ariana', emoji: '🔥', xp: 15240 },
    { name: 'Mihail', emoji: '⚡', xp: 13980 },
    { name: 'Nikol', emoji: '🌟', xp: 12300 },
    { name: 'Gergana', emoji: '🛡️', xp: 11450 },
    { name: 'Petar', emoji: '🧠', xp: 10930 },
    { name: 'Stella', emoji: '✨', xp: 9800 },
    { name: 'Veselin', emoji: '🏹', xp: 8750 },
    { name: 'Lidia', emoji: '🌙', xp: 7640 },
    { name: 'Teodor', emoji: '⚔️', xp: 6510 },
    { name: 'Yana', emoji: '🌿', xp: 5400 }
];

const topCountInput = document.getElementById('top-count');
const updateBtn = document.getElementById('update-btn');
const container = document.getElementById('leaderboardContainer');


function renderLeaderboard(count) {

    container.innerHTML = '';

    if (count < 1 || players.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'no-results';
        msg.innerText = 'No players to display.';
        container.appendChild(msg);
        return;
    }

    const shownPlayers = players.slice(0, count);

    shownPlayers.forEach(function(player, index) {
        const card = document.createElement('article');
        card.classList.add('player-card');

        const rankDiv = document.createElement('div');
        rankDiv.classList.add('player-rank');
        rankDiv.innerText = (index + 1).toString();

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('player-name');
        nameDiv.innerText = (player.emoji || '⭐') + ' ' + (player.name || 'Unknown');

        const xpDiv = document.createElement('div');
        xpDiv.classList.add('player-xp');
        xpDiv.innerText = player.xp.toLocaleString() + ' XP';

        card.appendChild(rankDiv);
        card.appendChild(nameDiv);
        card.appendChild(xpDiv);

        container.appendChild(card);
    });
}

updateBtn.addEventListener('click', function() {
    const rawValue = topCountInput.value.trim();
    if (rawValue === '') {
        container.innerHTML = '';
        const msg = document.createElement('div');
        msg.className = 'no-results';
        msg.innerText = 'Enter a number between 1 and 100.';
        container.appendChild(msg);
        return;
    }

    let count = Number(rawValue);
    if (isNaN(count)) {
        count = 1;
    }
    count = Math.max(1, Math.min(100, count));
    topCountInput.value = count;

    renderLeaderboard(count);
});

renderLeaderboard(Number(topCountInput.value) || 5);