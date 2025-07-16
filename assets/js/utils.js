// ✅ Current Date Now
function getCurrentDateInfo() {
  const today = new Date();

  return {
    day: today.toLocaleString("en-US", { weekday: "long" }),
    date: today.getDate(),
    month: today.toLocaleString("en-US", { month: "long" }),
    year: today.getFullYear(),
  };
}

// ✅ Payment colors (untuk chart)
const paymentColors = {
  BCA: "#1976d2",
  Mandiri: "#f9a825",
  Seabank: "#512da8",
  Gopay: "#00bcd4",
  Jago: "#fb8c00",
  "Top Up": "#ff7043",
  Gasoline: "#E11D48",
  "Laundry and Gallon": "#039be5",
  Loan: "#f57c00",
  Investment: "#43a047",
  Emergency: "#e53935",
  Saving: "#8e24aa",
  "e-Money Mandiri": "#6d4c41",
  Unknown: "#9e9e9e",
};

// ✅ Category colors (untuk chart)
const categoryColors = {
  Transfer: "#1E88E5",
  "Electricity Token": "#f9a825",
  "Foods and Beverages": "#FDD835",
  Gallon: "#00bcd4",
  Grocery: "#fb8c00",
  "Top Up": "#ff7043",
  Gasoline: "#E11D48",
  Laundry: "#039be5",
  Parking: "#31316A",
  Investation: "#43A047",
  "Self Rewards": "#EF4682",
  Kost: "#3949AB",
  Others: "#6d4c41",
  Unknown: "#9e9e9e",
};

// ✅ parseCustomDate
function parseCustomDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split(" ");
  if (parts.length < 4) return null;
  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);
  const timeParts = parts[3].split(":");
  const hour = parseInt(timeParts[0], 10) || 0;
  const minute = parseInt(timeParts[1], 10) || 0;
  const second = parseInt(timeParts[2], 10) || 0;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames.indexOf(monthName);
  return month < 0 ? null : new Date(year, month, day, hour, minute, second);
}

// ✅ showToast
function showToast(icon, message) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
}

// ✅ animateCountUp manual
function animateCountUp({
  elementId,
  targetValue,
  duration = 1000,
  prefix = "Rp ",
  classCondition = null,
}) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startValue = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(
      progress * (targetValue - startValue) + startValue
    );
    const formattedValue = prefix + value.toLocaleString("en-US");

    if (classCondition) {
      const className = classCondition(value);
      el.innerHTML = `<h3 class="fw-extrabold ${className}">${formattedValue}</h3>`;
    } else {
      el.innerText = formattedValue;
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ✅ groupByDateAndPayment
function groupByDateAndPayment(rows) {
  const groupedTotals = {};
  rows.forEach((row) => {
    const dateTime = row[2] || "";
    const dateParts = dateTime.split(" ");
    const date = dateParts.slice(0, 3).join(" ");
    const paymentMethod = row[4] || "Unknown";
    const amountRaw = row[7] || "0";
    const amountClean = amountRaw.replace(/[^\d]/g, "");
    const amount = parseInt(amountClean, 10) || 0;
    const type = row[3];
    if (type === "Expenses") {
      if (!groupedTotals[date]) groupedTotals[date] = {};
      if (!groupedTotals[date][paymentMethod])
        groupedTotals[date][paymentMethod] = 0;
      groupedTotals[date][paymentMethod] += amount;
    }
  });
  const result = [];
  for (const date in groupedTotals) {
    for (const paymentMethod in groupedTotals[date]) {
      result.push({
        date: date,
        payment_method: paymentMethod,
        total: groupedTotals[date][paymentMethod],
      });
    }
  }
  return result;
}

// ✅ Utility get logo URL by category
function getCategoryIcon(category) {
  return "assets/img/icons/" + category + ".png";
}

// ✅ Utility get logo URL by payment
function getPaymentLogo(payment) {
  const logos = {
    BCA: "assets/img/logos/" + payment + ".png",
    Mandiri: "assets/img/logos/" + payment + ".png",
    Seabank: "assets/img/logos/" + payment + ".svg",
    Gopay: "assets/img/logos/" + payment + ".webp",
    Jago: "assets/img/logos/" + payment + ".svg",
    "Top Up": "assets/img/logos/Jago.svg",
    Gasoline: "assets/img/logos/Jago.svg",
    "Laundry and Gallon": "assets/img/logos/Jago.svg",
    Loan: "assets/img/logos/Jago.svg",
    Investment: "assets/img/logos/Jago.svg",
    Emergency: "assets/img/logos/Jago.svg",
    Saving: "assets/img/logos/Jago.svg",
    "e-Money Mandiri": "assets/img/logos/" + payment + ".png",
  };
  return logos[payment] || "../assets/img/team-2.jpg";
}

// ✅ Utility get logo URL by Platform
function getPlatformLogo(platform) {
  return "assets/img/logos/" + platform + ".svg";
}

// 🔧 Helper format Rupiah
function formatRupiah(angka) {
  const numberString = angka.toString();
  return "Rp " + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
