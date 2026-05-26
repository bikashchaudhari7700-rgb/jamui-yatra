const WHATSAPP_NUMBER = "919123456789";
function toggleMenu(){document.getElementById("navMenu").classList.toggle("show");}
function openBooking(vehicle){
  document.getElementById("bookingModal").style.display = "flex";
  document.getElementById("formTitle").innerText = vehicle;
  document.getElementById("vehicleType").value = vehicle;
  document.getElementById("carOptions").style.display = vehicle === "Four Wheeler" ? "block" : "none";
}
function closeBooking(){document.getElementById("bookingModal").style.display = "none";}
window.onclick=function(event){const modal=document.getElementById("bookingModal");if(event.target===modal){closeBooking();}}
document.getElementById("bookingForm").addEventListener("submit", function(e){
  e.preventDefault();
  const vehicle=document.getElementById("vehicleType").value;
  const name=document.getElementById("name").value;
  const mobile=document.getElementById("mobile").value;
  const pickup=document.getElementById("pickup").value;
  const destination=document.getElementById("destination").value;
  const date=document.getElementById("date").value;
  const time=document.getElementById("time").value;
  const payment=document.getElementById("payment").value;
  const note=document.getElementById("note").value;
  let extra="";
  if(vehicle==="Four Wheeler"){
    extra=`\nCar Type: ${document.getElementById("carType").value}\nAC Preference: ${document.getElementById("acType").value}\nTrip Type: ${document.getElementById("tripType").value}`;
  }
  const message=`New Jamui Yatra Booking Request\n\nVehicle: ${vehicle}\nName: ${name}\nMobile: ${mobile}\n\nPickup Address: ${pickup}\nDestination Address: ${destination}\n\nDate: ${date}\nTime: ${time}${extra}\n\nPayment Option: ${payment}\nExtra Note: ${note || "No extra note"}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
});