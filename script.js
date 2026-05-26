const WHATSAPP_NUMBER = "919798477481";

const pricing = {
  "Auto Booking": {local:[80,30], station:[120,40], hospital:[150,50], khaira:[450,100], sikandra:[650,150], lachhuar:[700,150], simultala:[1200,250], custom:[0,100]},
  "Toto Booking": {local:[60,20], station:[100,30], hospital:[130,40], khaira:[400,100], sikandra:[600,150], lachhuar:[650,150], simultala:[1000,250], custom:[0,100]},
  "Four Wheeler": {local:[800,200], station:[700,200], hospital:[900,200], khaira:[1800,400], sikandra:[2500,500], lachhuar:[2800,500], simultala:[4500,1000], custom:[0,500]},
  "Hotel Booking": {budget:[800,200], standard:[1200,300], family:[1800,500], ac:[2000,500]},
  "Tiffin Service": {breakfast:[40,20], lunch:[80,40], dinner:[90,40], full:[200,100]},
  "Other Service": {water:[80,30], food:[120,50], drink:[100,40], medicine:[150,50], custom:[0,50]}
};

let currentService = "";

const vegMenus = {
  breakfast: ["Aloo Paratha + Curd", "Puri Sabji", "Poha + Tea", "Idli Sambhar", "Veg Sandwich"],
  lunch: ["Rice + Dal + Sabji + Salad", "Roti + Sabji + Dal", "Veg Thali", "Paneer Thali", "Khichdi + Chokha"],
  dinner: ["Roti + Sabji + Dal", "Rice + Dal Fry", "Veg Thali", "Paneer Roti Combo", "Light Dinner Box"],
  full: ["Full Day Veg Basic", "Full Day Veg Standard", "Full Day Paneer Special"]
};

const nonVegMenus = {
  breakfast: ["Egg Paratha", "Bread Omelette", "Egg Roll", "Boiled Egg + Paratha"],
  lunch: ["Chicken Rice Plate", "Chicken Roti Combo", "Egg Curry Rice", "Fish Curry Rice", "Chicken Thali"],
  dinner: ["Chicken Roti Combo", "Egg Curry Roti", "Chicken Rice Box", "Fish Curry Rice", "Non Veg Thali"],
  full: ["Full Day Egg Meal", "Full Day Chicken Meal", "Full Day Non Veg Special"]
};


const slides = document.querySelectorAll(".hero-slider .slide");
let slideIndex = 0;
setInterval(() => {
  slides[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}, 3500);

function toggleMenu(){
  document.getElementById("nav").classList.toggle("show");
}

function hideGroups(){
  ["rideFields","hotelFields","tiffinFields","otherFields","carFields"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
}

function openBooking(service){
  currentService = service;
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modalTitle").innerText = service;
  document.getElementById("serviceType").value = service;
  hideGroups();

  if(service === "Auto Booking" || service === "Toto Booking"){
    document.getElementById("rideFields").style.display = "block";
  }
  if(service === "Four Wheeler"){
    document.getElementById("rideFields").style.display = "block";
    document.getElementById("carFields").style.display = "block";
  }
  if(service === "Hotel Booking"){
    document.getElementById("hotelFields").style.display = "block";
  }
  if(service === "Tiffin Service"){
    document.getElementById("tiffinFields").style.display = "block";
    updateFoodMenu();
  }
  if(service === "Other Service"){
    document.getElementById("otherFields").style.display = "block";
  }
  updateEstimate();
}

function closeBooking(){
  document.getElementById("modal").style.display = "none";
}

window.onclick = function(e){
  if(e.target === document.getElementById("modal")) closeBooking();
}


function updateFoodMenu(){
  const foodType = document.getElementById("foodType").value;
  const mealType = document.getElementById("tiffinType").value;
  const menuSelect = document.getElementById("foodMenu");
  const source = foodType === "veg" ? vegMenus : nonVegMenus;
  const items = source[mealType] || [];
  menuSelect.innerHTML = "";
  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    menuSelect.appendChild(opt);
  });
}

function updateEstimate(){
  let total = 0;
  let advance = 0;
  let text = "";

  if(currentService === "Auto Booking" || currentService === "Toto Booking" || currentService === "Four Wheeler"){
    const route = document.getElementById("rideRoute").value || "local";
    let base = pricing[currentService][route] || [0,100];
    total = base[0];
    advance = base[1];

    if(currentService === "Four Wheeler"){
      const car = document.getElementById("carType").value;
      const ac = document.getElementById("acType").value;
      const trip = document.getElementById("tripType").value;
      if(car === "sedan") total -= 200;
      if(car === "luxury") total += 1500;
      if(ac === "nonac") total -= 200;
      if(trip === "round") total += Math.round(total * 0.65);
      if(trip === "event") total += 2000;
      if(trip === "outstation") total += 1000;
      advance = Math.max(advance, Math.round(total * 0.2));
    }
    text = route === "custom" ? "Custom route: final fare will be confirmed on WhatsApp. Minimum advance shown." : "Destination based estimated ride fare.";
  }

  if(currentService === "Hotel Booking"){
    const type = document.getElementById("hotelType").value;
    [total, advance] = pricing[currentService][type];
    text = "Room category based estimated booking amount.";
  }

  if(currentService === "Tiffin Service"){
    updateFoodMenu();
    const type = document.getElementById("tiffinType").value;
    const qty = Math.max(1, parseInt(document.getElementById("quantity").value || "1"));
    let base = pricing[currentService][type];
    total = base[0] * qty;
    if(document.getElementById("foodType").value === "nonveg") total += 40 * qty;
    advance = Math.max(base[1], Math.round(total * 0.3));
    text = "Tiffin package, veg/non-veg menu and quantity based estimated amount.";
  }

  if(currentService === "Other Service"){
    const type = document.getElementById("otherType").value;
    [total, advance] = pricing[currentService][type];
    text = type === "custom" ? "Custom service: final amount will be confirmed on WhatsApp. Minimum advance shown." : "Service type based estimated amount.";
  }

  document.getElementById("estimateText").innerText = text || "Select service details to see estimate.";
  document.getElementById("totalAmount").innerText = total ? `₹${total}` : "Confirm on WhatsApp";
  document.getElementById("advanceAmount").innerText = `₹${advance}`;
}

document.getElementById("bookingForm").addEventListener("submit", function(e){
  e.preventDefault();
  updateEstimate();

  const service = currentService;
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const total = document.getElementById("totalAmount").innerText;
  const advance = document.getElementById("advanceAmount").innerText;
  const payment = document.getElementById("payment").value;
  const utr = document.getElementById("utr").value || "Not provided";
  const note = document.getElementById("note").value || "No extra note";

  let details = "";

  if(service === "Auto Booking" || service === "Toto Booking" || service === "Four Wheeler"){
    details += `Pickup: ${document.getElementById("pickup").value}\n`;
    details += `Route: ${document.getElementById("rideRoute").selectedOptions[0].text}\n`;
    details += `Custom Destination: ${document.getElementById("customDestination").value || "Not provided"}\n`;
  }

  if(service === "Four Wheeler"){
    details += `Car Category: ${document.getElementById("carType").selectedOptions[0].text}\n`;
    details += `AC Preference: ${document.getElementById("acType").selectedOptions[0].text}\n`;
    details += `Trip Type: ${document.getElementById("tripType").selectedOptions[0].text}\n`;
  }

  if(service === "Hotel Booking"){
    details += `Hotel Type: ${document.getElementById("hotelType").selectedOptions[0].text}\n`;
    details += `Check-out Date: ${document.getElementById("checkout").value || "Not provided"}\n`;
    details += `Guests: ${document.getElementById("guests").value || "Not provided"}\n`;
  }

  if(service === "Tiffin Service"){
    details += `Meal Type: ${document.getElementById("tiffinType").selectedOptions[0].text}\n`;
    details += `Food Preference: ${document.getElementById("foodType").selectedOptions[0].text}\n`;
    details += `Selected Menu: ${document.getElementById("foodMenu").value}\n`;
    details += `Delivery Address: ${document.getElementById("tiffinAddress").value || "Not provided"}\n`;
    details += `Quantity: ${document.getElementById("quantity").value || "1"}\n`;
  }

  if(service === "Other Service"){
    details += `Service Type: ${document.getElementById("otherType").selectedOptions[0].text}\n`;
    details += `Requirement: ${document.getElementById("requirement").value || "Not provided"}\n`;
  }

  const msg = `New Jamui Yatra Booking Request

Service: ${service}
Name: ${name}
Mobile: ${mobile}
Date: ${date}
Time: ${time}

${details}
Estimated Total: ${total}
Advance Required: ${advance}
Payment Option: ${payment}
UTR / Transaction ID: ${utr}
Extra Note: ${note}

Website & Management: Raja Kumar
Founder: Bikash Raja`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});
