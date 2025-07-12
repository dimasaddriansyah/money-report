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
    calculateIncomeExpenses();
    renderDailyExpensesChart(selectedPayment);
    renderTopExpensesChart(selectedPayment);
    renderCategoryExpensesChart(selectedPayment);
    listSummaryPayment();
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
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
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
      .slice(0, 13);

    const tableBody = document.getElementById("list-last-transaction");
    let html = "";

    rows.forEach((row) => {
      const category = row[5] || "Unknown";
      const logoSrc = getCategoryIcon(category);
      html += `
        <li class="list-group-item bg-transparent border-bottom py-3 px-0">
          <div class="row align-items-center">
            <div class="col-auto">
              <img class="img-fluid me-2" alt="logo" src="${logoSrc}" height="35" width="35">
            </div>
            <div class="col px-0">
              <div class="d-flex flex-column">
                <h4 class="fs-6 text-dark mb-0">${row[6]}</h4>
                <span class="small text-gray-500">${row[4]}</span>
              </div>
            </div>
            <div class="col text-end">
              <div class="d-flex flex-column">
                <span class="fs-6 fw-bolder ${
                  row[3] === "Expenses" ? "text-danger" : "text-success"
                }">
                  ${row[3] === "Expenses" ? "-" : "+"} ${row[7] || ""}
                </span>
                <span class="small">${row[2] || ""}</span>
              </div>
            </div>
          </div>
        </li>`;
    });

    tableBody.innerHTML = html;
  }

  function calculateIncomeExpenses() {
    const selectedPayment = document.getElementById("paymentFilter").value;
    let sumIncome = 0,
      sumExpenses = 0;

    allTransactionsData.forEach((row) => {
      const type = row[3],
        payment = row[4],
        category = row[5];
      const nominal =
        parseInt((row[7] || "0").replace(/Rp\s?/g, "").replace(/,/g, ""), 10) ||
        0;

      const rowDate = moment(row[2], "DD MMMM YYYY HH:mm:ss");
      if (!rowDate.isBetween(selectedStartDate, selectedEndDate, "day", "[]"))
        return;

      if (type === "Income") {
        if (
          selectedPayment === "" &&
          (payment === "Payroll" || category === "Remaining")
        )
          sumIncome += nominal;
        else if (payment === selectedPayment) sumIncome += nominal;
      } else if (type === "Expenses") {
        if (
          !(
            selectedPayment === "" &&
            payment === "Payroll" &&
            category === "Transfer"
          )
        ) {
          if (selectedPayment === "" || payment === selectedPayment)
            sumExpenses += nominal;
        }
      }
    });

    animateCountUp({
      elementId: "totalIncome",
      targetValue: sumIncome,
    });
    animateCountUp({
      elementId: "totalExpenses",
      targetValue: sumExpenses,
    });
    animateCountUp({
      elementId: "totalSaving",
      targetValue: sumIncome - sumExpenses,
      classCondition: (val) => (val < 0 ? "text-danger" : "text-success"),
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

  function listSummaryPayment() {
    const paymentExpenses = {};
    const paymentIncomes = {};

    allTransactionsData.forEach((row) => {
      const type = row[3];
      const payment = row[4];
      const nominalStr = row[7] || "0";
      const nominal =
        parseInt(nominalStr.replace(/Rp\s?/g, "").replace(/,/g, ""), 10) || 0;

      if (type === "Expenses") {
        if (!paymentExpenses[payment]) paymentExpenses[payment] = 0;
        paymentExpenses[payment] += nominal;
      } else if (type === "Income") {
        if (!paymentIncomes[payment]) paymentIncomes[payment] = 0;
        paymentIncomes[payment] += nominal;
      }
    });

    let html = "";

    allAccountPayments.forEach((payment) => {
      const logoSrc = getPaymentLogo(payment);
      const totalExpense = paymentExpenses[payment] || 0;
      const totalIncome = paymentIncomes[payment] || 0;
      const saving = totalIncome - totalExpense;
      const percentUsed =
        totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;

      let progressClass = "bg-success";
      let textClass = "text-success";

      if (percentUsed === 0) textClass = "text-gray-500";
      else if (percentUsed > 90) {
        progressClass = "bg-danger";
        textClass = "text-danger";
      } else if (percentUsed > 80) {
        progressClass = "bg-warning";
        textClass = "text-warning";
      }

      html += `
        <div class="row mb-4">
          <div class="col-auto">
            <img src="${logoSrc}" alt="${payment}" class="img-fluid" width="50" height="50">
          </div>
          <div class="col">
            <div class="progress-wrapper">
              <div class="progress-info">
                <div class="d-flex flex-column">
                  <h6 class="mb-0">${payment}</h6>
                  <span class="small fw-bold ${textClass}">Rp ${saving.toLocaleString(
        "en-US"
      )}</span>
                </div>
                <div class="d-flex flex-column small text-end">
                  <span class="fw-bolder ${textClass}">${percentUsed.toFixed(
        2
      )}%</span>
                  <div class="text-gray-500">
                    <span>(${totalExpense.toLocaleString(
                      "en-US"
                    )}/${totalIncome.toLocaleString("en-US")})</span>
                  </div>
                </div>
              </div>
              <div class="progress mb-0">
                <div class="progress-bar ${progressClass}" role="progressbar" aria-valuenow="${percentUsed.toFixed(
        2
      )}" aria-valuemin="0" aria-valuemax="100" style="width: ${percentUsed.toFixed(
        2
      )}%;"></div>
              </div>
            </div>
          </div>
        </div>`;
    });

    document.getElementById("list-summary-payment").innerHTML = html;
  }

  async function initData() {
    await getDataAccountPayments();
    await fetchAllTransactions();
    getDataTransactions();
    calculateIncomeExpenses();
    renderDailyExpensesChart();
    renderTopExpensesChart();
    renderCategoryExpensesChart();
    listSummaryPayment();

    // Trigger resize after all charts rendered
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }

  initData();

  document.getElementById("paymentFilter").addEventListener("change", () => {
    const selectedPayment = document.getElementById("paymentFilter").value;
    getDataTransactions(selectedPayment);
    calculateIncomeExpenses();
    renderDailyExpensesChart(selectedPayment);
    renderTopExpensesChart(selectedPayment);
    renderCategoryExpensesChart(selectedPayment);
    listSummaryPayment();
  });
});
