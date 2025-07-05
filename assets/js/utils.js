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
function animateCountUp(
  elementId,
  targetValue,
  duration = 1000,
  prefix = "Rp ",
  classCondition = null
) {
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
