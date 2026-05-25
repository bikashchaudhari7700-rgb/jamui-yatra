const vehicles = {
  Auto: { rate: 18, base: 60 },
  Toto: { rate: 12, base: 40 },
  'Four Wheeler': { rate: 35, base: 250 }
};

async function loadPart(id, file){
  const el = document.getElementById(id);
  if(!el) return;
  try{
    const res = await fetch(file);
    el.innerHTML = await res.text();
  }catch(e){
    console.warn('Could not load', file);
  }
}

function setupMenu(){
  document.addEventListener('click', (e)=>{
    if(e.target && e.target.id === 'menuBtn'){
      document.getElementById('mainNav')?.classList.toggle('show');
    }
  });
}

function openBooking(vehicle){
  document.getElementById('bookingModal').classList.add('show');
  document.getElementById('vehicle').value = vehicle;
  calculateFare();
}

function closeBooking(){
  document.getElementById('bookingModal').classList.remove('show');
}

function calculateFare(){
  const vehicle = document.getElementById('vehicle')?.value || 'Auto';
  const km = Number(document.getElementById('distance')?.value || 0);
  const data = vehicles[vehicle];
  const fare = km > 0 ? data.base + (km * data.rate) : data.base;
  const preview = document.getElementById('farePreview');
  if(preview){
    preview.innerHTML = `Estimated Fare: ₹${fare} <small>(Base ₹${data.base} + ₹${data.rate}/km)</small>`;
  }
}

function setupForm(){
  const form = document.getElementById('bookingForm');
  ['vehicle','distance'].forEach(id => document.getElementById(id)?.addEventListener('input', calculateFare));
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const vehicle = data.get('vehicle');
    const km = Number(data.get('distance'));
    const fare = vehicles[vehicle].base + (km * vehicles[vehicle].rate);
    const message = `New Booking Request%0A%0AVehicle: ${vehicle}%0AName: ${data.get('name')}%0APickup: ${data.get('pickup')}%0ADrop: ${data.get('drop')}%0ADate: ${data.get('date')}%0ATime: ${data.get('time')}%0APhone: ${data.get('phone')}%0ADistance: ${km} km%0APayment: ${data.get('payment')}%0AEstimated Fare: ₹${fare}`;
    document.getElementById('successMsg').style.display = 'block';
    const whatsappNumber = '919876543210';
    setTimeout(()=>{ window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank'); }, 600);
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadPart('header-placeholder', 'header.html');
  await loadPart('footer-placeholder', 'footer.html');
  setupMenu();
  setupForm();
  calculateFare();
});
