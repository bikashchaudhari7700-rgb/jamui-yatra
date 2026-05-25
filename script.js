const rates = { Auto: 15, Toto: 12, "Four Wheeler": 25 };
const whatsappNumber = "919123456789";

async function loadPartial(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}
loadPartial("header", "header.html");
loadPartial("footer", "footer.html");

function toggleMenu(){ document.getElementById('menu').classList.toggle('show'); }
function openBookingForm(vehicle){
  document.getElementById('bookingModal').classList.add('show');
  document.getElementById('vehicleType').value = vehicle;
  calculateFare();
}
function closeBookingForm(){ document.getElementById('bookingModal').classList.remove('show'); }
function calculateFare(){
  const vehicle = document.getElementById('vehicleType').value;
  const km = Number(document.getElementById('distance').value || 0);
  const fare = km * (rates[vehicle] || 0);
  document.getElementById('fare').textContent = '₹' + fare;
}

document.addEventListener('submit', function(e){
  if(e.target.id !== 'bookingForm') return;
  e.preventDefault();
  const vehicle = document.getElementById('vehicleType').value;
  const pickup = document.getElementById('pickup').value;
  const destination = document.getElementById('destination').value;
  const distance = document.getElementById('distance').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const phone = document.getElementById('phone').value;
  const payment = document.getElementById('payment').value;
  const fare = document.getElementById('fare').textContent;
  const message = `New Booking Request%0A%0AVehicle: ${vehicle}%0APickup Address: ${pickup}%0ADestination Address: ${destination}%0ADistance: ${distance} KM%0ADate: ${date}%0ATime: ${time}%0AContact Number: ${phone}%0APayment Option: ${payment}%0AEstimated Fare: ${fare}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
});
