export function signatureFields(){return `<fieldset class="ref-signature" style="margin-top: 24px;"><legend>Digital signature</legend><div class="ref-signature-tabs"><button type="button" data-signature-mode="draw" aria-pressed="true">Draw Mode</button><button type="button" data-signature-mode="upload" aria-pressed="false">Upload Mode</button></div><div data-signature-panel="draw"><canvas width="600" height="150" aria-label="Draw signature" tabindex="0"></canvas><button type="button" class="text-btn small" data-signature-clear>Clear signature</button><p class="small">Draw with your mouse or touch. A typed name below is also accepted in this frontend preview.</p></div><div data-signature-panel="upload" hidden><label for="signature-image">Upload PNG or JPG signature</label><input id="signature-image" name="signatureImage" type="file" accept="image/png,image/jpeg"></div></fieldset>`;}
export function bindSignature(form){
  const canvas=form.querySelector('canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');ctx.strokeStyle='#58111a';ctx.lineWidth=2.5;ctx.lineCap='round';let drawing=false;
  const point=ev=>{const rect=canvas.getBoundingClientRect();return [(ev.clientX-rect.left)*canvas.width/rect.width,(ev.clientY-rect.top)*canvas.height/rect.height];};
  canvas.addEventListener('pointerdown',ev=>{drawing=true;canvas.setPointerCapture(ev.pointerId);ctx.beginPath();ctx.moveTo(...point(ev));});
  canvas.addEventListener('pointermove',ev=>{if(!drawing)return;ctx.lineTo(...point(ev));ctx.stroke();canvas.dataset.signed='true';});
  canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
  form.querySelector('[data-signature-clear]').addEventListener('click',()=>{ctx.clearRect(0,0,canvas.width,canvas.height);delete canvas.dataset.signed;});
  form.querySelectorAll('[data-signature-mode]').forEach(button=>button.addEventListener('click',()=>{form.dataset.signatureMode=button.dataset.signatureMode;form.querySelectorAll('[data-signature-panel]').forEach(panel=>panel.hidden=panel.dataset.signaturePanel!==button.dataset.signatureMode);form.querySelectorAll('[data-signature-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
}
export async function signatureImage(form){
  if(form.dataset.signatureMode==='upload'){const file=form.elements.signatureImage.files[0];if(!file)throw new Error('Choose a signature image or switch to Draw Mode.');if(!['image/png','image/jpeg'].includes(file.type)||file.size>2*1024*1024)throw new Error('Signature must be PNG or JPG, up to 2 MB.');return file;}
  const canvas=form.querySelector('canvas');return canvas?.dataset.signed?await new Promise(resolve=>canvas.toBlob(resolve,'image/png')):null;
}

