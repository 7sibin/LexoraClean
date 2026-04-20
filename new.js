
/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Trigger hero animations after loader hides
    setTimeout(() => {
      ['heroEyebrow','heroTitle','heroSubtitle','heroButtons','heroBadge','heroScroll']
        .forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('visible');
        });
    }, 200);
  }, 2200);
});

/* ---- NAV SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- MOBILE NAV ---- */
function openMobileNav() {
  document.getElementById('mobileNav').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- HERO CANVAS ---- */
(function() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, ripples;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(W * H / 6000), 160);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.6 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        isGold: Math.random() > 0.35
      });
    }
  }

  function createRipples() {
    ripples = [];
  }

  function spawnRipple() {
    ripples.push({
      x: W * 0.35 + Math.random() * W * 0.30,
      y: H * 0.40 + Math.random() * H * 0.30,
      r: 0,
      maxR: 120 + Math.random() * 140,
      alpha: 0.45,
      speed: 0.7 + Math.random() * 0.5
    });
  }

  let t = 0;
  let lastRipple = 0;

  function drawBackground() {
    // Deep dark gradient — matches logo background #0d0c08
    const grad = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, Math.max(W,H)*0.7);
    grad.addColorStop(0, '#151208');
    grad.addColorStop(0.5, '#0d0c08');
    grad.addColorStop(1, '#080704');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Ambient glow — warm gold center (matches logo ring #c8a030)
    const glow = ctx.createRadialGradient(W*0.50, H*0.62, 0, W*0.50, H*0.62, W*0.38);
    glow.addColorStop(0, 'rgba(200,160,48,0.16)');
    glow.addColorStop(0.5, 'rgba(200,160,48,0.05)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Secondary glow top-right
    const glow2 = ctx.createRadialGradient(W*0.75, H*0.25, 0, W*0.75, H*0.25, W*0.22);
    glow2.addColorStop(0, 'rgba(200,160,48,0.08)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);
  }

  function drawParticles() {
    particles.forEach(p => {
      p.twinklePhase += p.twinkleSpeed;
      const alpha = p.alpha * (0.5 + 0.5 * Math.sin(p.twinklePhase));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.isGold
        ? `rgba(200,160,48,${alpha})`
        : `rgba(255,248,230,${alpha * 0.6})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
  }

  function drawConnections() {
    const maxDist = 90;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < maxDist) {
          const alpha = (1 - dist/maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,160,48,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawRipples() {
    ripples.forEach((rp, i) => {
      rp.r += rp.speed;
      rp.alpha *= 0.975;

      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,160,48,${rp.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
    ripples = ripples.filter(rp => rp.alpha > 0.005 && rp.r < rp.maxR);
  }

  function animate() {
    t++;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawConnections();
    drawParticles();
    drawRipples();

    if (t - lastRipple > 90) {
      spawnRipple();
      if (Math.random() < 0.4) spawnRipple();
      lastRipple = t;
    }

    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    createParticles();
    createRipples();
    animate();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  init();
})();


/* ---- FORM SUBMIT ---- */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.style.display = 'none';
  success.style.display = 'block';
}
/* ---- BEFORE / AFTER SLIDERS ---- */
(function() {
  const SLIDE_COUNT = 3;
  const track   = document.getElementById('baTrack');
  const dotsWrap= document.getElementById('baDots');
  const btnPrev = document.getElementById('baArrowPrev');
  const btnNext = document.getElementById('baArrowNext');
  if (!track) return;

  let current = 0;

  /* --- Build dots --- */
  const dots = [];
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const d = document.createElement('button');
    d.className = 'ba-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slajd ' + (i+1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  }

  /* --- Add placeholder overlays for each side --- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    ['ba-img-before','ba-img-after'].forEach(cls => {
      const div = slider.querySelector('.' + cls);
      const ph = document.createElement('div');
      ph.className = 'ba-placeholder';
      const label = cls === 'ba-img-before' ? 'Pre' : 'Posle';
      ph.innerHTML = `
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <span>${label}</span>`;
      div.appendChild(ph);
    });
  });

  /* --- Carousel navigation --- */
  function goTo(idx) {
    current = Math.max(0, Math.min(idx, SLIDE_COUNT - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === SLIDE_COUNT - 1;
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));
  goTo(0);

  /* --- Swipe carousel (touch & mouse drag on track) --- */
  let trackStartX = 0, trackDragging = false;

  track.addEventListener('mousedown', e => {
    trackStartX = e.clientX;
    trackDragging = true;
    track.classList.add('dragging');
  });
  window.addEventListener('mouseup', e => {
    if (!trackDragging) return;
    trackDragging = false;
    track.classList.remove('dragging');
    const diff = e.clientX - trackStartX;
    if (Math.abs(diff) > 50) goTo(diff < 0 ? current + 1 : current - 1);
  });
  track.addEventListener('touchstart', e => { trackStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - trackStartX;
    if (Math.abs(diff) > 40) goTo(diff < 0 ? current + 1 : current - 1);
  });

  /* --- Per-slider drag handle --- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const before  = slider.querySelector('.ba-img-before');
    const handle  = slider.querySelector('.ba-handle');
    let active = false;
    let pct = 50;

    function setPos(p) {
      pct = Math.max(2, Math.min(98, p));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left     = pct + '%';
    }

    setPos(50);

    function getX(e) {
      const r = slider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return ((clientX - r.left) / r.width) * 100;
    }

    /* Mouse */
    slider.addEventListener('mousedown', e => {
      // only activate if clicking near the handle (within 40px)
      const r = slider.getBoundingClientRect();
      const hx = (pct / 100) * r.width;
      if (Math.abs(e.clientX - r.left - hx) < 40) {
        active = true;
        e.preventDefault();
      }
    });
    window.addEventListener('mousemove', e => {
      if (!active) return;
      setPos(getX(e));
    });
    window.addEventListener('mouseup', () => { active = false; });

    /* Touch — only if touch starts on the handle strip */
    slider.addEventListener('touchstart', e => {
      const r = slider.getBoundingClientRect();
      const hx = (pct / 100) * r.width;
      if (Math.abs(e.touches[0].clientX - r.left - hx) < 44) {
        active = true;
        e.stopPropagation(); // don't let carousel swipe take over
      }
    }, { passive: true });
    slider.addEventListener('touchmove', e => {
      if (!active) return;
      setPos(getX(e));
      e.preventDefault();
    }, { passive: false });
    slider.addEventListener('touchend', () => { active = false; });
  });
})();

/* ---- FORM: Photo preview handlers ---- */
let selectedPhotoFile = null;

function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    alert('Fotografija je prevelika. Maksimalno 15MB.');
    e.target.value = '';
    return;
  }

  selectedPhotoFile = file;

  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('photoPreview').src = ev.target.result;
    document.getElementById('photoUploadIcon').style.display = 'none';
    document.getElementById('photoPreviewWrap').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removePhoto(e) {
  e.stopPropagation();
  selectedPhotoFile = null;
  document.getElementById('photoInput').value = '';
  document.getElementById('photoPreview').src = '';
  document.getElementById('photoPreviewWrap').style.display = 'none';
  document.getElementById('photoUploadIcon').style.display = '';
}

/* ---- FORM SUBMIT (Cloudinary upload → Web3Forms) ---- */
const CLOUDINARY_CLOUD  = 'dfjyeye7a';
const CLOUDINARY_PRESET = 'git8gpjs';
const WEB3FORMS_KEY     = '5542fd06-a83b-4fd9-a552-196121918d65';

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: fd
  });

  if (!res.ok) throw new Error('Cloudinary HTTP ' + res.status);

  const json = await res.json();
  if (!json.secure_url) throw new Error('Cloudinary: nema URL-a u odgovoru');

  return json.secure_url; // https://res.cloudinary.com/... — uvek radi
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form     = document.getElementById('contactForm');
  const success  = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');
  const btn      = document.getElementById('formSubmitBtn');

  if (errorBox) errorBox.style.display = 'none';

  const originalBtnText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Slanje...';

  try {
    const ime      = document.getElementById('formIme').value.trim();
    const prezime  = document.getElementById('formPrezime').value.trim();
    const telefon  = document.getElementById('formTelefon').value.trim();
    const adresa   = document.getElementById('formAdresa').value.trim();
    const napomena = document.getElementById('formNapomena').value.trim();

    let fotoTekst = 'Nije priložena';
    if (selectedPhotoFile) {
      btn.textContent = 'Slanje fotografije...';
      const url = await uploadToCloudinary(selectedPhotoFile);
      fotoTekst = url;
    }

    btn.textContent = 'Slanje upita...';

    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `Novi upit — ${ime} ${prezime}`,
      from_name: 'Lexora Clean — Sajt',
      Ime: ime,
      Prezime: prezime,
      Telefon: telefon || '—',
      'Grad / Adresa': adresa || '—',
      Napomene: napomena || '—',
      Fotografija: fotoTekst,
      botcheck: ''
    };

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Web3Forms greška');

    form.style.display = 'none';
    success.style.display = 'block';

  } catch (err) {
    console.error('Form submit error:', err);
    if (errorBox) errorBox.style.display = 'block';
    btn.disabled = false;
    btn.textContent = originalBtnText;
  }
}
