const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const modal = document.getElementById("selection-modal");
const mouseButton = document.getElementById("mouse-control");
const touchButton = document.getElementById("touch-control");

let score = 0;
let lives = 5;
let balloons = [];
let bullets = [];
let speedMultiplier = 1;
const baseSpeed = 2;

const playerX = gameArea.offsetWidth / 2;
const playerY = gameArea.offsetHeight / 2;

player.style.left = `${playerX - player.offsetWidth / 2}px`;
player.style.top = `${playerY - player.offsetHeight / 2}px`;

const weaponTip = document.createElement("div");
weaponTip.style.position = "absolute";
weaponTip.style.width = "10px";
weaponTip.style.height = "10px";
weaponTip.style.backgroundColor = "white";
weaponTip.style.borderRadius = "50%";
gameArea.appendChild(weaponTip);

let mouseAngle = 0;

// Kullanıcı dokunmatik kontrolü seçerse
touchButton.addEventListener("click", () => {
    modal.style.display = "none"; // Modalı gizle
    enableTouchControls(); // Dokunmatik kontrolleri etkinleştir
});

// Kullanıcı mouse kontrolünü seçerse
mouseButton.addEventListener("click", () => {
    modal.style.display = "none"; // Modalı gizle
    enableMouseControls(); // Mouse kontrolleri varsayılan olarak çalışıyor
});

// Mouse kontrolü etkinleştirme
function enableMouseControls() {
    gameArea.addEventListener("mousemove", handleMove);
    gameArea.addEventListener("click", handleFire);
}

// Dokunmatik kontrolleri etkinleştirme
function enableTouchControls() {
    gameArea.addEventListener("touchmove", handleMove);
    gameArea.addEventListener("touchstart", handleFire);
}

function handleMove(e) {
    let clientX, clientY;

    if (e.touches) {
        clientX = e.touches[0].clientX; // Dokunma için
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX; // Mouse için
        clientY = e.clientY;
    }

    const rect = gameArea.getBoundingClientRect();
    const dx = clientX - (rect.left + playerX);
    const dy = clientY - (rect.top + playerY);
    mouseAngle = Math.atan2(dy, dx);

    const tipX = playerX + Math.cos(mouseAngle) * 40;
    const tipY = playerY + Math.sin(mouseAngle) * 40;
    weaponTip.style.left = `${tipX - weaponTip.offsetWidth / 2}px`;
    weaponTip.style.top = `${tipY - weaponTip.offsetHeight / 2}px`;
}

function handleFire(e) {
    const bullet = {
        x: playerX + Math.cos(mouseAngle) * 40,
        y: playerY + Math.sin(mouseAngle) * 40,
        speed: 5,
        angle: mouseAngle,
        element: document.createElement("div"),
    };
    bullet.element.className = "bullet";
    bullet.element.style.left = `${bullet.x}px`;
    bullet.element.style.top = `${bullet.y}px`;

    gameArea.appendChild(bullet.element);
    bullets.push(bullet);
}

function spawnBalloon() {
    const direction = ["top", "bottom", "left", "right"][Math.floor(Math.random() * 4)];
    const balloon = {
        element: document.createElement("div"),
        x: 0,
        y: 0,
        speedX: 0,
        speedY: 0,
    };

    balloon.element.className = "balloon";

    if (direction === "top") {
        balloon.x = Math.random() * gameArea.offsetWidth;
        balloon.y = 0;
    } else if (direction === "bottom") {
        balloon.x = Math.random() * gameArea.offsetWidth;
        balloon.y = gameArea.offsetHeight;
    } else if (direction === "left") {
        balloon.x = 0;
        balloon.y = Math.random() * gameArea.offsetHeight;
    } else if (direction === "right") {
        balloon.x = gameArea.offsetWidth;
        balloon.y = Math.random() * gameArea.offsetHeight;
    }

    const dx = playerX - balloon.x;
    const dy = playerY - balloon.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    balloon.speedX = (dx / distance) * baseSpeed * speedMultiplier;
    balloon.speedY = (dy / distance) * baseSpeed * speedMultiplier;

    balloon.element.style.left = `${balloon.x}px`;
    balloon.element.style.top = `${balloon.y}px`;

    gameArea.appendChild(balloon.element);
    balloons.push(balloon);
}

function moveObjects() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.x += bullet.speed * Math.cos(bullet.angle);
        bullet.y += bullet.speed * Math.sin(bullet.angle);
        bullet.element.style.left = `${bullet.x}px`;
        bullet.element.style.top = `${bullet.y}px`;

        if (
            bullet.x < 0 || 
            bullet.x > gameArea.offsetWidth || 
            bullet.y < 0 || 
            bullet.y > gameArea.offsetHeight
        ) {
            gameArea.removeChild(bullet.element);
            bullets.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < balloons.length; i++) {
        const balloon = balloons[i];
        balloon.x += balloon.speedX;
        balloon.y += balloon.speedY;
        balloon.element.style.left = `${balloon.x}px`;
        balloon.element.style.top = `${balloon.y}px`;

        if (checkCollision(balloon.x, balloon.y, playerX, playerY, 25)) {
            gameArea.removeChild(balloon.element);
            balloons.splice(i, 1);
            lives--;
            livesDisplay.textContent = lives;
            if (lives <= 0) {
                alert("Oyun Bitti!");
                location.reload();
            }
            i--;
        }

        for (let j = 0; j < bullets.length; j++) {
            const bullet = bullets[j];
            if (checkCollision(balloon.x, balloon.y, bullet.x, bullet.y, 15)) {
                gameArea.removeChild(balloon.element);
                gameArea.removeChild(bullet.element);
                balloons.splice(i, 1);
                bullets.splice(j, 1);
                score++;
                scoreDisplay.textContent = score;

                if (score % 10 === 0) {
                    speedMultiplier += 0.2;
                }

                i--;
                break;
            }
        }
    }
}

function checkCollision(x1, y1, x2, y2, radius) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) < radius;
}

function gameLoop() {
    moveObjects();
    requestAnimationFrame(gameLoop);
}

setInterval(spawnBalloon, 1000);

gameLoop();
