
// perplexity
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
  if (!c) return;

  const nameEl = document.getElementById(c.name);
  const emailEl = document.getElementById(c.email);
  const subjectEl = document.getElementById(c.subject);
  const bodyEl = document.getElementById(c.body);
  const fbEl = document.getElementById(c.feedback);
  const btnEl = document.getElementById(c.btn);

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const subject = subjectEl ? subjectEl.value.trim() : 'No subject';
  const message = bodyEl.value.trim();

  fbEl.style.display = 'none';
  fbEl.className = 'form-msg';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    fbEl.className = 'form-msg error';
    fbEl.textContent = '// error: name, email, and message are required.';
    fbEl.style.display = 'block';
    return;
  }

  if (!emailRegex.test(email)) {
    fbEl.className = 'form-msg error';
    fbEl.textContent = '// error: please enter a valid email address.';
    fbEl.style.display = 'block';
    return;
  }

  btnEl.disabled = true;
  const oldBtnHTML = btnEl.innerHTML;
  btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject || 'No subject',
        message
      })
    });

    const text = await res.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Server returned invalid JSON.');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Failed to send message.');
    }

    fbEl.className = 'form-msg success';
    fbEl.textContent = data.message || '// message sent successfully.';
    fbEl.style.display = 'block';

    nameEl.value = '';
    emailEl.value = '';
    bodyEl.value = '';
    if (subjectEl && subjectEl.tagName !== 'SELECT') subjectEl.value = '';

    btnEl.innerHTML = '<i class="fas fa-check"></i> Sent';
  } catch (err) {
    fbEl.className = 'form-msg error';
    fbEl.textContent = '// error: ' + err.message;
    fbEl.style.display = 'block';
    btnEl.innerHTML = oldBtnHTML;
  } finally {
    btnEl.disabled = false;
  }
}