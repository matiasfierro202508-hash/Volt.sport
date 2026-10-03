/* ========== DATOS DE PRODUCTOS ========== */
// Iconos de cada prenda (trazos SVG) y color de fondo de cada tarjeta
const ICONS = {
  camiseta:'<path d="M8 4l-5 4 3 4 2-1v9h10v-9l2 1 3-4-5-4c-1 2-3 3-5 3S9 6 8 4z"/>',
  leggings:'<path d="M7 3h10l1 7-3 11h-3l-1-8-1 8H7L6 10z"/>',
  sudadera:'<path d="M9 3l-6 4v6l3 1v7h12v-7l3-1V7l-6-4c-1 2-2 3-3 3S10 5 9 3z"/><path d="M12 8v5"/>',
  shorts:'<path d="M5 5h14l1 14h-6l-2-7-2 7H4z"/><path d="M5 9h14"/>',
  tenis:'<path d="M3 16c0-3 1-5 3-6l3 2 3-3 3 3c3 0 6 1 6 4v2H3z"/><path d="M3 18h18"/>'
};
const PRODUCTS = [
  {id:1,type:'camiseta',name:'Camiseta AirFlow',price:79000,old:99000,desc:'Tejido ligero que evacúa el sudor en segundos.',bg:'linear-gradient(135deg,#1f3a8a,#2f6bff)',tag:'Nuevo'},
  {id:2,type:'leggings',name:'Leggings Sculpt',price:119000,desc:'Cintura alta, compresión media y bolsillo oculto.',bg:'linear-gradient(135deg,#0d3b1e,#1fa84a)',tag:'Top ventas'},
  {id:3,type:'sudadera',name:'Sudadera Core',price:149000,old:189000,desc:'Felpa suave por dentro y capucha ajustable.',bg:'linear-gradient(135deg,#222,#555)'},
  {id:4,type:'shorts',name:'Shorts Sprint',price:69000,desc:'Ultralivianos, con forro interior y secado rápido.',bg:'linear-gradient(135deg,#0a2a6e,#3d7bff)'},
  {id:5,type:'tenis',name:'Tenis Velocity',price:269000,old:329000,desc:'Suela con amortiguación reactiva para largas distancias.',bg:'linear-gradient(135deg,#141414,#2c7a47)',tag:'-18%'}
];
const money = n => '$' + n.toLocaleString('es-CO');

/* ========== RENDER DE TARJETAS ========== */
const grid = document.getElementById('grid');
grid.innerHTML = PRODUCTS.map(p => `
  <article class="card rev">
    <div class="thumb" style="background:${p.bg}">
      ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
      <svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[p.type]}</svg>
    </div>
    <div class="info">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
      <button class="btn small" data-add="${p.id}">Agregar al carrito</button>
    </div>
  </article>`).join('');

/* ========== CARRITO Y AVISOS ========== */
let count = 0;
const toast = document.getElementById('toast');
function showToast(text){
  toast.textContent = text; toast.classList.add('show');
  clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('show'), 2200);
}
grid.addEventListener('click', e => {
  const b = e.target.closest('[data-add]'); if(!b) return;
  const p = PRODUCTS.find(x => x.id == b.dataset.add);
  count++; document.getElementById('cartCount').textContent = count;
  showToast(p.name + ' agregado al carrito');
});
document.getElementById('cartBtn').addEventListener('click', () =>
  showToast(count ? `Tienes ${count} producto(s) en el carrito` : 'Tu carrito está vacío'));

/* ========== MENÚ MÓVIL ========== */
const menu = document.getElementById('menu'), burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => { if(e.target.tagName === 'A') menu.classList.remove('open'); });

/* ========== COPIAR CÓDIGO PROMOCIONAL ========== */
document.querySelector('.code').addEventListener('click', e => {
  const c = e.currentTarget.dataset.code;
  (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(
    () => showToast('Código ' + c + ' copiado'), () => showToast('Tu código es ' + c));
});

/* ========== CUENTA REGRESIVA (7 días desde hoy) ========== */
const end = Date.now() + 7*24*3600*1000;
(function tick(){
  const s = Math.max(0, Math.floor((end - Date.now())/1000));
  const d = Math.floor(s/86400), h = Math.floor(s%86400/3600), m = Math.floor(s%3600/60);
  document.getElementById('countdown').textContent = `${d} d ${h} h ${m} min`;
  setTimeout(tick, 30000);
})();

/* ========== FORMULARIOS (validación en el navegador) ========== */
function handleForm(id, okText){
  const f = document.getElementById(id), msg = f.querySelector('.msg');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...f.elements].find(el => el.required && (!el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value))));
    msg.classList.toggle('err', !!bad);
    if(bad){ msg.textContent = 'Revisa el campo "' + (bad.closest('label').firstChild.textContent) + '".'; bad.focus(); return; }
    msg.textContent = okText; f.reset();
  });
}
handleForm('contactForm', '¡Gracias! Te responderemos en menos de 24 horas.');
handleForm('newsForm', '¡Listo! Revisa tu correo para recibir tu 10 % de descuento.');

/* ========== ANIMACIÓN AL HACER SCROLL ========== */
const io = new IntersectionObserver(es => es.forEach(en => {
  if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
}), {threshold:.12});
document.querySelectorAll('.rev').forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
