import '../css/styles.css';
import '../css/reference.css';
import '../css/portal-reference.css';
import '../css/portal-layout.css';
import '../css/animations.css';
import { supabase } from '../supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {

  // ── Element refs ──────────────────────────────────────────────
  const step1Form   = document.getElementById('step1-form');
  const step2Form   = document.getElementById('step2-form');
  const step3Form   = document.getElementById('step3-form');
  const successDiv  = document.getElementById('activate-success');

  const sendBtn     = document.getElementById('send-otp-btn');
  const verifyBtn   = document.getElementById('verify-otp-btn');
  const setPassBtn  = document.getElementById('set-password-btn');
  const backBtn     = document.getElementById('back-to-step1');

  const step1Error  = document.getElementById('step1-error');
  const step2Error  = document.getElementById('step2-error');
  const step3Error  = document.getElementById('step3-error');
  const emailDisplay = document.getElementById('otp-email-display');

  let resolvedEmail = '';

  // ── Toggle password visibility ─────────────────────────────────
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="toggle-password"]');
    if (!btn) return;
    const input = btn.previousElementSibling;
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });

  // ── STEP 1: Send OTP ──────────────────────────────────────────
  step1Form.addEventListener('submit', async e => {
    e.preventDefault();
    step1Error.textContent = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    const role       = window.selectedRole || 'Student';
    const identifier = document.getElementById('activate-identifier').value.trim();
    const emailField = document.getElementById('activate-email');
    const email      = role === 'Supervisor' ? identifier : emailField.value.trim();

    try {
      // 1. Verify eligibility via RPC or local roster
      let isEligible = false;
      try {
        const { data, error: rpcErr } = await supabase
          .rpc('verify_activation_eligibility', { p_identifier: identifier, p_email: email });
        if (!rpcErr && data) isEligible = true;
      } catch {}

      if (!isEligible) {
        try {
          const raw = localStorage.getItem('menteelog.demo.v1');
          if (raw) {
            const localDb = JSON.parse(raw);
            if ((localDb.users || []).some(u => 
              (u.identifier || '').toLowerCase() === identifier.toLowerCase() &&
              (u.email || '').toLowerCase() === email.toLowerCase() &&
              (u.status === 'Pending_Activation' || u.badge === 'Pre_Seeded')
            )) {
              isEligible = true;
            }
          }
        } catch {}
      }

      if (!isEligible) throw new Error('Account not found or already activated. Please check your details.');

      // 2. Send 6-digit OTP to email
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true }
      });

      if (otpErr) throw new Error(otpErr.message);

      resolvedEmail = email;
      emailDisplay.textContent = email;

      step1Form.style.display = 'none';
      step2Form.style.display = 'flex';

    } catch (err) {
      step1Error.textContent = err.message || 'Something went wrong. Please try again.';
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Activation Code';
    }
  });

  // ── STEP 2: Verify OTP Code ───────────────────────────────────
  step2Form.addEventListener('submit', async e => {
    e.preventDefault();
    step2Error.textContent = '';
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';

    const token = document.getElementById('otp-code').value.trim();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: resolvedEmail,
        token,
        type: 'email'
      });

      if (error) throw new Error('Invalid or expired code. Please check and try again.');

      step2Form.style.display = 'none';
      step3Form.style.display = 'flex';

    } catch (err) {
      step2Error.textContent = err.message;
    } finally {
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify Code →';
    }
  });

  // ── STEP 3: Set Password ──────────────────────────────────────
  step3Form.addEventListener('submit', async e => {
    e.preventDefault();
    step3Error.textContent = '';
    setPassBtn.disabled = true;
    setPassBtn.textContent = 'Activating...';

    const password = document.getElementById('new-password').value;
    const confirm  = document.getElementById('confirm-password').value;

    try {
      if (password !== confirm) throw new Error('Passwords do not match.');
      if (password.length < 8)  throw new Error('Password must be at least 8 characters.');

      // Set password on the now-authenticated user
      const { error: passErr } = await supabase.auth.updateUser({ password });
      if (passErr) throw new Error(passErr.message);

      // Mark as activated in school_registry (ignore error if RPC doesn't exist yet)
      await supabase.rpc('complete_activation', { p_email: resolvedEmail });

      // Sign out so they log in fresh with their new password
      await supabase.auth.signOut();

      step3Form.style.display = 'none';
      successDiv.style.display = 'block';

    } catch (err) {
      step3Error.textContent = err.message;
    } finally {
      setPassBtn.disabled = false;
      setPassBtn.textContent = 'Complete Activation';
    }
  });

  // ── Back to Step 1 ────────────────────────────────────────────
  backBtn?.addEventListener('click', () => {
    step2Form.style.display = 'none';
    step1Form.style.display = 'flex';
    document.getElementById('otp-code').value = '';
    step2Error.textContent = '';
  });
});
