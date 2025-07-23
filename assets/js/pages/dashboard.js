document.addEventListener("DOMContentLoaded", function () {
  let allTransactionsData = [];
  let allAccountPayments = [];

  const paymentFilterChoices = new Choices("#paymentFilter", {
    searchEnabled: true,
    itemSelectText: "",
  });

  var selectedStartDate = moment().startOf("month");
  var selectedEndDate = moment().endOf("month");

  function cb(start, end) {
    selectedStartDate = start;
    selectedEndDate = end;
    $("#dateRange").html(
      start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
    );

    const selectedPayment = document.getElementById("paymentFilter").value;
    getDataTransactions(selectedPayment);
    calculateAllBalances();
    renderDailyExpensesChart(selectedPayment);
    renderTopExpensesChart(selectedPayment);
    renderCategoryExpensesChart(selectedPayment);
  }

  $("#dateRange").daterangepicker(
    {
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );

  cb(selectedStartDate, selectedEndDate);

  async function getDataAccountPayments() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/accountPayments!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];
    allAccountPayments = rows.map((row) => row[1]);

    paymentFilterChoices.clearChoices();
    paymentFilterChoices.setChoices(
      [{ value: "", label: "All Payments", selected: true }],
      "value",
      "label",
      true
    );
    allAccountPayments.forEach((payment) => {
      paymentFilterChoices.setChoices(
        [{ value: payment, label: payment }],
        "value",
        "label",
        false
      );
    });
  }

  async function fetchAllTransactions() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:K?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
    const res = await fetch(url);
    const data = await res.json();
    allTransactionsData = data.values || [];
  }

  function getDataTransactions(selectedPayment = "") {
    let filteredRows = allTransactionsData;

    if (selectedPayment) {
      filteredRows = filteredRows.filter((row) => row[4] === selectedPayment);
    }

    filteredRows = filteredRows.filter((row) => {
      const rowDate = moment(row[2], "DD MMMM YYYY HH:mm:ss");
      return rowDate.isBetween(selectedStartDate, selectedEndDate, "day", "[]");
    });

    const rows = filteredRows
      .sort((a, b) => parseCustomDate(b[2]) - parseCustomDate(a[2]))
      .slice(0, 10);

    const tableBody = document.getElementById("list-last-transaction");
    let html = "";

    rows.forEach((row) => {
      const categorySrc = getCategoryIcon(row[5]);
      const paymentSrc = getPaymentLogo(row[4]);
    html += `
<li class="list-group-item bg-transparent border-bottom py-3 px-0">
  <div class="row g-2 align-items-center">
    
    <!-- Tanggal -->
    <div class="col-12 col-md">
      <div class="d-flex flex-column">
        <span class="fw-bold">${row[1] || ""}</span>
        <span class="small text-muted">${row[2] || ""}</span>
      </div>
    </div>

    <!-- Payment (dengan image) -->
    <div class="col-12 col-md">
      <div class="d-flex align-items-center">
        <img src="${paymentSrc}" alt="payment" class="img-fluid me-2" width="35" height="35">
        <div class="d-flex flex-column">
          <span class="fw-bold">${row[4] || ""}</span>
          <span class="small text-muted">Payment</span>
        </div>
      </div>
    </div>

    <!-- Category (dengan image) -->
    <div class="col-12 col-md">
      <div class="d-flex align-items-center">
        <img src="${categorySrc}" alt="category" class="img-fluid me-2" width="35" height="35">
        <div class="d-flex flex-column">
          <span class="fw-bold">${row[5] || ""}</span>
          <span class="small text-muted">Category</span>
        </div>
      </div>
    </div>

    <!-- Remark -->
    <div class="col-12 col-md d-flex align-items-center">
      <span>${row[6] || ""}</span>
    </div>

    <!-- Nominal -->
    <div class="col-12 col-md text-end d-flex align-items-center justify-content-end">
      <span class="fw-bold ${row[3] === "Expenses" ? "text-danger" : "text-success"}">
        ${row[7] || ""}
      </span>
    </div>

  </div>
</li>
`;

    });

    tableBody.innerHTML = html;
  }

  function calculateAllBalances() {
    const paymentBalances = {};
    const paymentIncomes = {};

    // Loop transaksi
    allTransactionsData.forEach((row) => {
      const type = row[3];
      const payment = row[4];
      const nominal =
        parseInt((row[7] || "0").replace(/Rp\s?/g, "").replace(/,/g, ""), 10) ||
        0;

      const isTransfer = row[8] === "Y";
      const transferFrom = row[9];
      const transferTo = row[10];

      if (!paymentBalances[payment]) paymentBalances[payment] = 0;
      if (isTransfer) {
        if (!paymentBalances[transferFrom]) paymentBalances[transferFrom] = 0;
        if (!paymentBalances[transferTo]) paymentBalances[transferTo] = 0;
      }

      if (type === "Income") {
        paymentBalances[payment] += nominal;
        if (!paymentIncomes[payment]) paymentIncomes[payment] = 0;
        paymentIncomes[payment] += nominal;
      } else if (type === "Expenses") {
        paymentBalances[payment] -= nominal;
      } else if (type === "Transfer" && isTransfer) {
        paymentBalances[transferFrom] -= nominal;
        paymentBalances[transferTo] += nominal;
      }
    });

    const balanceCards = document.getElementById("balanceCards");
    balanceCards.innerHTML = "";

    // ✅ Hitung total semua payment balance dan total income
    const totalAllPaymentBalances = Object.values(paymentBalances).reduce(
      (sum, balance) => sum + balance,
      0
    );

    const totalAllIncome = Object.values(paymentIncomes).reduce(
      (sum, income) => sum + income,
      0
    );

    let totalProgressValue =
      totalAllIncome === 0
        ? 100
        : (totalAllPaymentBalances / totalAllIncome) * 100;

    totalProgressValue = Math.max(0, Math.min(totalProgressValue, 100)); // clamp
    totalProgressValue = Math.floor(totalProgressValue);

    // ✅ Buat card Total All Balance di awal
    let totalCardHTML = `
    <div class="swiper-slide">
      <div class="card balance-card bg-primary text-white">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-xxs text-gray-400">Account</span>
              <h5 class="card-title">Total All Balance</h5>
            </div>
            <div>
              <img src="assets/img/icons/Money.png" alt="totalAllBalances" class="img-fluid" width="40" height="40"/>
            </div>
          </div>
          <div class="mt-4">
            <div class="d-flex justify-content-between align-items-end">
              <div class="d-flex flex-column">
                <span class="text-xxs text-gray-400">Balance</span>
                <span class="card-text fw-bolder text-secondary">
                  Rp ${totalAllPaymentBalances.toLocaleString("en-US")}
                </span>
              </div>
              <span class="text-xxs">
                ${totalProgressValue + "%"}
              </span>
            </div>
            <div class="progress mt-2">
              <div class="progress-bar bg-danger" role="progressbar" 
              aria-valuenow="${totalAllPaymentBalances}" 
              aria-valuemin="0" aria-valuemax="${totalAllIncome}" 
              style="width: ${totalProgressValue}%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    balanceCards.innerHTML = totalCardHTML;

    // ✅ Loop semua payment cards
    Object.entries(paymentBalances).forEach(([account, balance]) => {
      const logoSrc = getPaymentLogo(account);
      const incomePayment = paymentIncomes[account] || 1;

      let progressValue = ((incomePayment - balance) / incomePayment) * 100;
      progressValue = Math.max(0, Math.min(progressValue, 100)); // clamp antara 0-100
      progressValue = Math.floor(progressValue);

      balanceCards.innerHTML += `
      <div class="swiper-slide">
        <div class="card balance-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-xxs text-gray-500">Account</span>
                <h5 class="card-title">${account}</h5>
              </div>
              <div>
                <img src="${logoSrc}" alt="${account}" class="img-fluid" width="80" height="80"/>
              </div>
            </div>
            <div class="mt-4">
              <div class="d-flex justify-content-between align-items-end">
                <div class="d-flex flex-column">
                  <span class="text-xxs text-gray-500">Balance</span>
                  <span class="card-text fw-bolder">
                    Rp ${balance.toLocaleString("en-US")}
                  </span>
                </div>
                <span class="text-xxs text-gray-500">
                  ${progressValue + "%"}
                </span>
              </div>
              <div class="progress mt-2">
                <div class="progress-bar bg-danger" role="progressbar" 
                aria-valuenow="${balance}" 
                aria-valuemin="0" aria-valuemax="${incomePayment}" 
                style="width: ${progressValue}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    });

    // Destroy swiper jika sudah ada
    if (window.balanceSwiper) window.balanceSwiper.destroy(true, true);

    // Initialize ulang
    window.balanceSwiper = new Swiper(".mySwiper", {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 16,
          grid: { rows: 2, fill: "row" },
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 16,
          grid: { rows: 2, fill: "row" },
        },
      },
    });
  }

  function renderDailyExpensesChart(filterPayment = "") {
    const filtered = allTransactionsData.filter((row) => {
      const rowDate = moment(row[2], "DD MMMM YYYY HH:mm:ss");
      return rowDate.isBetween(selectedStartDate, selectedEndDate, "day", "[]");
    });

    const grouped = groupByDateAndPayment(filtered);
    const datesSet = new Set(grouped.map((row) => row.date));
    const dates = Array.from(datesSet).sort();

    let series = [];
    let colors = [];

    if (filterPayment) {
      const dataSeries = dates.map((date) => {
        const found = grouped.find(
          (r) => r.date === date && r.payment_method === filterPayment
        );
        return found ? found.total : 0;
      });
      series.push({ name: filterPayment, data: dataSeries });
      colors.push(paymentColors[filterPayment] || "#9e9e9e");
    } else {
      allAccountPayments.forEach((payment) => {
        const dataSeries = dates.map((date) => {
          const found = grouped.find(
            (r) => r.date === date && r.payment_method === payment
          );
          return found ? found.total : 0;
        });
        series.push({ name: payment, data: dataSeries });
        colors.push(paymentColors[payment] || "#9e9e9e");
      });
    }

    const options = {
      chart: { type: "line", height: 400, toolbar: { show: false } },
      series: series,
      colors: colors,
      stroke: { curve: "smooth" },
      xaxis: { categories: dates },
      yaxis: { labels: { formatter: (val) => val.toLocaleString("en-US") } },
      legend: { position: "bottom" },
      grid: {
        show: true,
        borderColor: "#F9F9F9",
        strokeDashArray: 0,
        xaxis: {
          lines: { show: true },
        },
        yaxis: {
          lines: { show: true },
        },
      },
      tooltip: {
        y: { formatter: (val) => "Rp " + val.toLocaleString("en-US") },
      },
    };

    const chartContainer = document.querySelector("#daily-expenses-chart");
    chartContainer.innerHTML = "";
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
  }

  function renderTopExpensesChart(filterPayment = "") {
    const expenses = {};
    const filtered = allTransactionsData.filter((row) => {
      const rowDate = moment(row[2], "DD MMMM YYYY HH:mm:ss");
      return rowDate.isBetween(selectedStartDate, selectedEndDate, "day", "[]");
    });

    filtered.forEach((row) => {
      const type = row[3],
        payment = row[4],
        remark = row[6];
      const nominal = parseFloat(row[7].replace(/[^\d.-]/g, "")) || 0;

      if (type === "Expenses") {
        if (remark && remark.includes("Transfer to")) return;
        if (!filterPayment || payment === filterPayment) {
          if (!expenses[remark]) expenses[remark] = 0;
          expenses[remark] += nominal;
        }
      }
    });

    const sortedExpenses = Object.entries(expenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const categories = sortedExpenses.map((item) => item[0]);
    const dataSeries = sortedExpenses.map((item) => item[1]);

    const options = {
      chart: { type: "bar", height: 540, toolbar: { show: false } },
      series: [{ name: "Expenses", data: dataSeries }],
      colors: ["#E11D484D"],
      plotOptions: {
        bar: { horizontal: true, borderRadius: 6, barHeight: "85%" },
      },
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (val) {
            val = Number(val);
            if (val >= 1000000) {
              return (val / 1000000).toFixed(1).replace(/\.0$/, "") + " M";
            } else if (val >= 1000) {
              return (val / 1000).toFixed(0) + " k";
            } else {
              return val;
            }
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#F9F9F9",
        strokeDashArray: 0,
        xaxis: {
          lines: { show: true },
        },
        yaxis: {
          lines: { show: true },
        },
      },
      dataLabels: {
        enabled: true,
        style: { colors: ["#E11D48"] },
        formatter: (val) => val.toLocaleString("en-US"),
      },
      tooltip: {
        y: { formatter: (val) => "Rp " + val.toLocaleString("en-US") },
      },
    };

    const chartContainer = document.querySelector("#top-expenses-chart");
    chartContainer.innerHTML = "";
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
  }

  function renderCategoryExpensesChart(filterPayment = "") {
    const expenses = {};
    const filtered = allTransactionsData.filter((row) => {
      const rowDate = moment(row[2], "DD MMMM YYYY HH:mm:ss");
      return rowDate.isBetween(selectedStartDate, selectedEndDate, "day", "[]");
    });

    filtered.forEach((row) => {
      const type = row[3],
        payment = row[4],
        category = row[5];
      const nominal = parseFloat(row[7].replace(/[^\d.-]/g, "")) || 0;

      if (
        type === "Expenses" &&
        (!filterPayment || payment === filterPayment)
      ) {
        if (!expenses[category]) expenses[category] = 0;
        expenses[category] += nominal;
      }
    });

    const combined = Object.entries(expenses)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);

    const sortedCategories = combined.map((item) => item.category);
    const sortedDataSeries = combined.map((item) => item.value);
    const colors = sortedCategories.map(
      (category) => categoryColors[category] || categoryColors["Unknown"]
    );

    const options = {
      chart: {
        type: "donut",
        height: 555,
      },
      labels: sortedCategories, // array kategori dari datamu
      series: sortedDataSeries, // array value dari datamu
      colors: colors, // array warna dari datamu
      dataLabels: {
        enabled: true,
        formatter: (val, opts) =>
          sortedDataSeries[opts.seriesIndex].toLocaleString("en-US"),
      },
      legend: {
        position: "bottom",
      },
      tooltip: {
        y: {
          formatter: (val) => "Rp " + val.toLocaleString("en-US"),
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "50%",
          },
        },
      },
    };

    const chartContainer = document.querySelector("#category-expenses-chart");
    chartContainer.innerHTML = "";
    const chart = new ApexCharts(chartContainer, options);
    chart.render();
  }

  async function initData() {
    await getDataAccountPayments();
    await fetchAllTransactions();
    getDataTransactions();
    calculateAllBalances();
    renderDailyExpensesChart();
    renderTopExpensesChart();
    renderCategoryExpensesChart();

    // Trigger resize after all charts rendered
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }

  initData();

  document.getElementById("paymentFilter").addEventListener("change", () => {
    const selectedPayment = document.getElementById("paymentFilter").value;
    getDataTransactions(selectedPayment);
    calculateAllBalances();
    renderDailyExpensesChart(selectedPayment);
    renderTopExpensesChart(selectedPayment);
    renderCategoryExpensesChart(selectedPayment);
  });
});
