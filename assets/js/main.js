// ===== MATRIX RAIN =====
(function(){
  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');
  let cols, drops;
  const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/\\|{}[]';

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 25);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  setInterval(()=>{
    ctx.fillStyle = 'rgba(4,7,15,0.05)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#ff0044';
    ctx.font = '13px JetBrains Mono, monospace';
    for(let i=0;i<drops.length;i++){
      const c = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(c, i*18, drops[i]*18);
      if(drops[i]*18 > canvas.height && Math.random()>0.975) drops[i]=0;
      drops[i]++;
    }
  }, 55);
})();

// ===== CURSOR =====
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e=>{
  cur.style.left = e.clientX+'px';
  cur.style.top = e.clientY+'px';
  setTimeout(()=>{
    ring.style.left = e.clientX+'px';
    ring.style.top = e.clientY+'px';
  }, 100);
});
document.querySelectorAll('a,button,.proj-card,.skill-card,.cert-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cur.style.transform='translate(-50%,-50%) scale(2)';
    ring.style.transform='translate(-50%,-50%) scale(1.5)';
    ring.style.borderColor='var(--g)';
  });
  el.addEventListener('mouseleave',()=>{
    cur.style.transform='translate(-110%,-50%) scale(1)';
    ring.style.transform='translate(-110%,-50%) scale(1)';
    ring.style.borderColor='rgba(166, 0, 255, 0.4)';
  });
});

// ===== TYPING (hero role text) =====
const phrases = ['Ethical Hacking_','Red Team Enthusiast_','Security Researcher_','CTF Player_','Lab Builder_'];
let pi=0,ci=0,del=false;
function type(){
  const el = document.getElementById('type-el');
  const p = phrases[pi];
  if(!del){ el.textContent=p.slice(0,++ci); if(ci===p.length){del=true;setTimeout(type,2200);return;} }
  else{ el.textContent=p.slice(0,--ci); if(ci===0){del=false;pi=(pi+1)%phrases.length;} }
  setTimeout(type,del?45:90);
}
type();

// ===== NAV =====
function toggleMenu(){ document.getElementById('mob-menu').classList.toggle('open'); }
function closeMenu(){ document.getElementById('mob-menu').classList.remove('open'); }

// ===== SCROLL REVEAL =====
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ===== SKILL BARS =====
const barObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.sb-fill').forEach(bar=>{
        bar.style.width = bar.dataset.w + '%';
      });
      barObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
document.querySelectorAll('.skill-bar-section').forEach(s=>barObs.observe(s));

// ===== TABS (contact form) =====
function switchTab(name, btn){
  document.querySelectorAll('.ctab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+name).classList.add('active');
}

// ===== CHAR COUNT =====
function updateCount(el, countId){
  document.getElementById(countId).textContent = el.value.length;
}

// ===== CONTACT FORM LOGIC =====
async function sendForm(type) {

  const configs = {
    message: {
      name: 'msg-name',
      email: 'msg-email',
      subject: 'msg-subject',
      body: 'msg-body',
      btn: 'msg-btn-text',
      feedback: 'msg-feedback'
    },

    collab: {
      name: 'col-name',
      email: 'col-email',
      subject: 'col-type',
      body: 'col-body',
      btn: 'col-btn-text',
      feedback: 'col-feedback'
    },

    ctf: {
      name: 'ctf-name',
      email: 'ctf-email',
      subject: 'ctf-event',
      body: 'ctf-body',
      btn: 'ctf-btn-text',
      feedback: 'ctf-feedback'
    }
  };

  const c = configs[type];

  const name = document.getElementById(c.name).value.trim();
  const email = document.getElementById(c.email).value.trim();
  const subject = document.getElementById(c.subject).value.trim();
  const message = document.getElementById(c.body).value.trim();

  const fbEl = document.getElementById(c.feedback);
  const btnEl = document.getElementById(c.btn);

  // Hide previous feedback
  fbEl.style.display = 'none';

  // ===== VALIDATION =====
  if (!name || !email || !message) {
    fbEl.className = 'form-msg error';
    fbEl.textContent = '// error: name, email, and message are required.';
    fbEl.style.display = 'block';
    return;
  }

  // Check email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    fbEl.className = 'form-msg error';
    fbEl.textContent = '// error: please enter a valid email address.';
    fbEl.style.display = 'block';
    return;
  }

  // ===== SENDING =====
  btnEl.textContent = 'SENDING...';

  try {

    const response = await fetch('https://formspree.io/f/myeypaak', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject || `[${type.toUpperCase()}] Portfolio Contact`,
        message: message
      })
    });

    // ===== SUCCESS =====
    if (response.ok) {

      fbEl.className = 'form-msg success';
      fbEl.textContent = '// message sent successfully!';
      fbEl.style.display = 'block';

      // Clear form
      document.getElementById(c.name).value = '';
      document.getElementById(c.email).value = '';
      document.getElementById(c.body).value = '';

      // Reset button
      btnEl.textContent = 'SEND MESSAGE';

      // Hide success message after 5 seconds
      setTimeout(() => {
        fbEl.style.display = 'none';
      }, 5000);

    } 
    
    // ===== FORM ERROR =====
    else {

      let data = {};

      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      fbEl.className = 'form-msg error';
      fbEl.textContent =
        '// error: ' + (data.error || 'message could not be sent.');

      fbEl.style.display = 'block';

      btnEl.textContent = 'SEND MESSAGE';
    }

  } 
  
  // ===== NETWORK ERROR =====
  catch (error) {

    fbEl.className = 'form-msg error';
    fbEl.textContent =
      '// error: unable to send message. Please try again.';

    fbEl.style.display = 'block';

    btnEl.textContent = 'SEND MESSAGE';
  }
}


// ===== FOOTER TIME =====
function updateTime() {
  const now = new Date();

  document.getElementById('footer-time').textContent =
    now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
}

updateTime();
setInterval(updateTime, 1000);


// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {

  let cur = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) {
      cur = s.id;
    }
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color =
      a.getAttribute('href') === '#' + cur
        ? 'var(--g)'
        : '';
  });

});