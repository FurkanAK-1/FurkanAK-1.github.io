// Oyun alanı ve skor elemanlarını seçiyoruz
const gameArea = document.getElementById("game-area"); // Oyun alanı div'i
const player = document.getElementById("player"); // Oyuncu topu
const scoreDisplay = document.getElementById("score"); // Skor göstergesi
const livesDisplay = document.getElementById("lives"); // Can göstergesi

// Başlangıç değerleri
let score = 0; // Başlangıç skoru
let lives = 5; // Başlangıç canı
let balloons = []; // Balonları tutacak dizi
let bullets = []; // Mermileri tutacak dizi
let speedMultiplier = 0.3; // Balon hız çarpanı (başlangıçta düşük hız)
const baseSpeed = 2; // Balonların temel hareket hızı

// Hız göstergesini başlangıçta güncelle
document.getElementById("speed").textContent = (baseSpeed * speedMultiplier).toFixed(2);

// Oyuncunun ekranın ortasında sabit konumu
const playerX = gameArea.offsetWidth / 2; // Oyuncunun X eksenindeki merkezi konumu
const playerY = gameArea.offsetHeight / 2; // Oyuncunun Y eksenindeki merkezi konumu

// Oyuncunun başlangıç konumunu ekranda ayarlama
player.style.left = `${playerX - player.offsetWidth / 2}px`; // X eksenindeki pozisyonu ayarla
player.style.top = `${playerY - player.offsetHeight / 2}px`; // Y eksenindeki pozisyonu ayarla

// Oyuncunun silah ucunu oluşturuyoruz
const weaponTip = document.createElement("div"); // Silah ucu için yeni bir div oluştur
weaponTip.style.position = "absolute"; // Serbest konumlandırma
weaponTip.style.width = "10px"; // Silah ucunun genişliği
weaponTip.style.height = "10px"; // Silah ucunun yüksekliği
weaponTip.style.backgroundColor = "white"; // Silah ucunun rengi
weaponTip.style.borderRadius = "50%"; // Silah ucunu daire yapmak
gameArea.appendChild(weaponTip); // Silah ucunu oyun alanına ekle

// Mouse hareketini dinleyerek oyuncunun silahını yönlendiriyoruz
let mouseAngle = 0; // Mouse'un açısı
gameArea.addEventListener("mousemove", (e) => {
  const rect = gameArea.getBoundingClientRect(); // Oyun alanının pozisyonunu al
  const dx = e.clientX - (rect.left + playerX); // Mouse'un X farkı
  const dy = e.clientY - (rect.top + playerY); // Mouse'un Y farkı
  mouseAngle = Math.atan2(dy, dx); // Mouse açısını hesapla (radyan cinsinden)

  // Silah ucunun yeni konumunu güncelle
  const tipX = playerX + Math.cos(mouseAngle) * 40; // Yeni X konumu
  const tipY = playerY + Math.sin(mouseAngle) * 40; // Yeni Y konumu
  weaponTip.style.left = `${tipX - weaponTip.offsetWidth / 2}px`;
  weaponTip.style.top = `${tipY - weaponTip.offsetHeight / 2}px`;
});

// Oyuncu tıkladığında mermi oluşturuyoruz
gameArea.addEventListener("click", () => {
  const bullet = {
    x: playerX + Math.cos(mouseAngle) * 40, // Merminin başlangıç X konumu
    y: playerY + Math.sin(mouseAngle) * 40, // Merminin başlangıç Y konumu
    speed: 5, // Merminin sabit hızı
    angle: mouseAngle, // Merminin açısı
    element: document.createElement("div"), // Yeni mermi elemanı oluştur
  };
  bullet.element.className = "bullet"; // CSS sınıfı ekle
  bullet.element.style.left = `${bullet.x}px`; // Merminin başlangıç X konumunu ayarla
  bullet.element.style.top = `${bullet.y}px`; // Merminin başlangıç Y konumunu ayarla

  gameArea.appendChild(bullet.element); // Mermiyi oyun alanına ekle
  bullets.push(bullet); // Mermiyi dizimize ekle
});

// Rastgele balonlar oluşturuyoruz
function spawnBalloon() {
  let balloonCount = 1; // Başlangıçta 1 balon

  if (score >= 25) {
    balloonCount = 2; // 25 puandan sonra 2 balon
  }
  if (score >= 50) {
    balloonCount = 3; // 50 puandan sonra 3 balon
  }

  for (let i = 0; i < balloonCount; i++) {
    const direction = ["top", "bottom", "left", "right"][
      Math.floor(Math.random() * 4)
    ]; // Rastgele bir yön seç
    const balloon = {
      element: document.createElement("div"), // Yeni balon elemanı
      x: 0, // Balonun başlangıç X konumu
      y: 0, // Balonun başlangıç Y konumu
      speedX: 0, // Balonun X eksenindeki hızı
      speedY: 0, // Balonun Y eksenindeki hızı
    };

    balloon.element.className = "balloon"; // CSS sınıfı ekle

    // Balonun rengini belirle
    if (balloonCount === 2) {
      balloon.element.style.backgroundColor = i === 0 ? "red" : "blue"; // 2 balon: biri kırmızı, biri mavi
    } else if (balloonCount === 3) {
      balloon.element.style.backgroundColor =
        i === 0 ? "red" : i === 1 ? "blue" : "green"; // 3 balon: kırmızı, mavi, yeşil
    } else {
      balloon.element.style.backgroundColor = "red"; // Tek balon: kırmızı
    }

    // Balon başlangıç pozisyonunu belirle
    if (direction === "top") {
      balloon.x = Math.random() * gameArea.offsetWidth;
      balloon.y = 0; // Üst kenar
    } else if (direction === "bottom") {
      balloon.x = Math.random() * gameArea.offsetWidth;
      balloon.y = gameArea.offsetHeight; // Alt kenar
    } else if (direction === "left") {
      balloon.x = 0; // Sol kenar
      balloon.y = Math.random() * gameArea.offsetHeight;
    } else if (direction === "right") {
      balloon.x = gameArea.offsetWidth; // Sağ kenar
      balloon.y = Math.random() * gameArea.offsetHeight;
    }

    // Hız bileşenlerini hesapla
    const dx = playerX - balloon.x; // X eksenindeki fark
    const dy = playerY - balloon.y; // Y eksenindeki fark
    const distance = Math.sqrt(dx * dx + dy * dy); // Oyuncuya olan uzaklık
    balloon.speedX = (dx / distance) * baseSpeed * speedMultiplier; // X yönü hızı
    balloon.speedY = (dy / distance) * baseSpeed * speedMultiplier; // Y yönü hızı

    balloon.element.style.left = `${balloon.x}px`; // Balonun X pozisyonunu ayarla
    balloon.element.style.top = `${balloon.y}px`; // Balonun Y pozisyonunu ayarla

    gameArea.appendChild(balloon.element); // Balonu oyun alanına ekle
    balloons.push(balloon); // Balonu dizimize ekle
  }
}

// Mermileri ve balonları hareket ettiriyoruz
function moveObjects() {
  // Mermileri hareket ettir
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    bullet.x += bullet.speed * Math.cos(bullet.angle); // Mermiyi X ekseninde hareket ettir
    bullet.y += bullet.speed * Math.sin(bullet.angle); // Mermiyi Y ekseninde hareket ettir
    bullet.element.style.left = `${bullet.x}px`; // DOM'daki X pozisyonunu güncelle
    bullet.element.style.top = `${bullet.y}px`; // DOM'daki Y pozisyonunu güncelle

    // Mermi ekranın dışına çıktıysa
    if (
      bullet.x < 0 ||
      bullet.x > gameArea.offsetWidth ||
      bullet.y < 0 ||
      bullet.y > gameArea.offsetHeight
    ) {
      gameArea.removeChild(bullet.element); // DOM'dan kaldır
      bullets.splice(i, 1); // Diziden kaldır
      i--; // İndeksi azalt
    }
  }

  // Balonları hareket ettir
  for (let i = 0; i < balloons.length; i++) {
    const balloon = balloons[i];
    balloon.x += balloon.speedX; // X eksenindeki hareket
    balloon.y += balloon.speedY; // Y eksenindeki hareket
    balloon.element.style.left = `${balloon.x}px`; // DOM'daki X pozisyonunu güncelle
    balloon.element.style.top = `${balloon.y}px`; // DOM'daki Y pozisyonunu güncelle

    // Çarpışma kontrolü (oyuncu ile balon)
    if (checkCollision(balloon.x, balloon.y, playerX, playerY, 25)) {
      gameArea.removeChild(balloon.element); // Balonu DOM'dan kaldır
      balloons.splice(i, 1); // Diziden kaldır
      lives--; // Canı azalt
      livesDisplay.textContent = lives; // Can göstergesini güncelle
      if (lives <= 0) {
        alert("Oyun Bitti!"); // Oyunun bittiğini bildir
        location.reload(); // Sayfayı yenile
      }
      i--; // İndeksi azalt
    }

    // Çarpışma kontrolü (mermi ile balon)
    for (let j = 0; j < bullets.length; j++) {
      const bullet = bullets[j];
      if (checkCollision(balloon.x, balloon.y, bullet.x, bullet.y, 15)) {
        gameArea.removeChild(balloon.element); // Balonu DOM'dan kaldır
        gameArea.removeChild(bullet.element); // Mermiyi DOM'dan kaldır
        balloons.splice(i, 1); // Balonu diziden kaldır
        bullets.splice(j, 1); // Mermiyi diziden kaldır
        score++; // Skoru artır
        scoreDisplay.textContent = score; // Skor göstergesini güncelle

        if (score % 10 === 0) {
          speedMultiplier += 0.1; // Hız çarpanını artır
          // Hız göstergesini güncelle
          document.getElementById("speed").textContent = (
            baseSpeed * speedMultiplier
          ).toFixed(2);
        }

        i--; // Balon silindiği için indeksi azalt
        break; // Döngüden çık
      }
    }
  }
}

// Çarpışma kontrolü fonksiyonu
function checkCollision(x1, y1, x2, y2, radius) {
  const dx = x1 - x2; // X eksenindeki mesafe
  const dy = y1 - y2; // Y eksenindeki mesafe
  return Math.sqrt(dx * dx + dy * dy) < radius; // Çarpışma kontrolü
}

// Oyun döngüsünü başlat
function gameLoop() {
  moveObjects(); // Nesneleri hareket ettir
  requestAnimationFrame(gameLoop); // Döngüyü tekrar başlat
}

setInterval(spawnBalloon, 2000); // Balonları düzenli olarak oluştur
gameLoop(); // Oyun döngüsünü başlat
