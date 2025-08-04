const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
  sidebar.classList.add("translate-x-0");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("translate-x-0");
  sidebar.classList.add("-translate-x-full");
});

// ✅ Utility get logo URL by category
function getCategoryURL(category) {
  return "assets/img/icons/" + category + ".png";
}

// ✅ Utility get logo URL by brands (payment or platform)
function getPaymentURL(payment) {
  const payments = {
    BCA: "assets/img/brands/" + payment + ".png",
    Mandiri: "assets/img/brands/" + payment + ".png",
    Seabank: "assets/img/brands/" + payment + ".svg",
    Gopay: "assets/img/brands/" + payment + ".webp",
    Jago: "assets/img/brands/" + payment + ".svg",
    "Top Up": "assets/img/brands/Jago.svg",
    Gasoline: "assets/img/brands/Jago.svg",
    "Laundry and Gallon": "assets/img/brands/Jago.svg",
    Loan: "assets/img/brands/Jago.svg",
    Investment: "assets/img/brands/Jago.svg",
    Emergency: "assets/img/brands/Jago.svg",
    Saving: "assets/img/brands/Jago.svg",
    "e-Money Mandiri": "assets/img/brands/" + payment + ".png",
    "TapCash BNI": "assets/img/brands/" + payment + ".png",
  };
  return payments[payment] || "../assets/img/team-2.jpg";
}

// ✅ Utility get logo URL by brands (payment or platform)
function getPlatformURL(platform) {
  return "assets/img/brands/" + platform + ".svg";
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-slate-600";

  toast.className = `text-white ${bgColor} px-6 py-4 rounded shadow transition transform animate-slide-in-right`;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

function cleanNumber(nominal) {
  return parseInt(String(nominal).replace(/[^0-9]/g, ""), 10) || 0;
}
