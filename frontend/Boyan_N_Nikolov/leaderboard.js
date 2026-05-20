
const players = [
    { name: 'Ariana',  emoji: '🔥', xp: 15240, userId: 'u1' },
    { name: 'Mihail',  emoji: '⚡', xp: 13980, userId: 'u2' },
    { name: 'Nikol',   emoji: '🌟', xp: 12300, userId: 'u3' },
    { name: 'Gergana', emoji: '🛡️', xp: 11450, userId: 'u4' },
    { name: 'Petar',   emoji: '🧠', xp: 10930, userId: 'u5' },
    { name: 'Stella',  emoji: '✨', xp: 9800,  userId: 'u6' },
    { name: 'Veselin', emoji: '🏹', xp: 8750,  userId: 'u7' },
    { name: 'Lidia',   emoji: '🌙', xp: 7640,  userId: 'u8' },
    { name: 'Teodor',  emoji: '⚔️', xp: 6510,  userId: 'u9' },
    { name: 'Yana',    emoji: '🌿', xp: 5400,  userId: 'u10' }
];

const friendUserIds = ['u1', 'u2', 'u5', 'u7', 'u10'];

const topCountInput = document.getElementById('top-count');
const updateBtn = document.getElementById('update-btn');
const friendsOnlyCheckbox = document.getElementById('friends-only');
const container = document.getElementById('leaderboardContainer');

function renderLeaderboard(count, filterFriends) {
    container.innerHTML = '';

    if (count < 1 || players.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'no-results';
        msg.innerText = 'No players to display.';
        container.appendChild(msg);
        return;
    }

    let filteredPlayers = players.slice();

    if (filterFriends) {
        filteredPlayers = players.filter(function(player) {
            return friendUserIds.indexOf(player.userId) !== -1;
        });
    }

    filteredPlayers.sort(function(a, b) {
        return b.xp - a.xp;
    });

    const shownPlayers = filteredPlayers.slice(0, count);

    shownPlayers.forEach(function(player, index) {
        const card = document.createElement('article');
        card.classList.add('player-card');

        const rankDiv = document.createElement('div');
        rankDiv.classList.add('player-rank');

        if (index === 0) {
            rankDiv.classList.add('gold');
        } else if (index === 1) {
            rankDiv.classList.add('silver');
        } else if (index === 2) {
            rankDiv.classList.add('bronze');
        }

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

        if (index === 2 && shownPlayers.length > 3) {
            const separator = document.createElement('div');
            separator.classList.add('separator');
            container.appendChild(separator);
        }
    });
}

function render() {
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

    const filterFriends = friendsOnlyCheckbox.checked;
    renderLeaderboard(count, filterFriends);
}

updateBtn.addEventListener('click', render);
friendsOnlyCheckbox.addEventListener('change', render);

render();