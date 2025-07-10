document.addEventListener("DOMContentLoaded", function () {
  // ✅ Format nominal input realtime
  const nominalInput = document.getElementById("nominal");
  nominalInput.addEventListener("input", function () {
    let value = this.value.replace(/,/g, "").replace(/\D/g, "");
    this.value = value ? parseInt(value, 10).toLocaleString("en-US") : "";
  });

  const incomeExpensesSelect = new Choices("#incomeExpensesSelect", {
    searchEnabled: true,
    itemSelectText: "",
  });
  const paymentChoices = new Choices("#paymentSelect", {
    searchEnabled: true,
    itemSelectText: "",
  });
  const categoryChoices = new Choices("#categorySelect", {
    searchEnabled: true,
    itemSelectText: "",
  });
  const paymentFilterChoices = new Choices("#paymentFilter", {
    searchEnabled: true,
    itemSelectText: "",
  });

  // ✅ Get Data Transactions
  function getDataTransactions(selectedPayment = "") {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filteredRows = data.values || [];

        // 🔎 Filter jika payment dipilih (selain All Payments)
        if (selectedPayment) {
          filteredRows = filteredRows.filter(
            (row) => row[4] === selectedPayment
          );
        }

        // 🔎 Sort by date desc & ambil 5 terbaru
        const rows = filteredRows
          .sort((a, b) => {
            const aDate = parseCustomDate(a[2]); // index 2 = Date
            const bDate = parseCustomDate(b[2]);
            return bDate - aDate;
          })
          .slice(0, 6);

        // ✅ Render ke table
        const tableBody = document.getElementById("list-last-transaction");
        let html = "";

        rows.forEach((row) => {
          const category = row[5] || "Unknown";
          const logoSrc = getLogoUrl(category);

          html += `
          <li class="list-group-item bg-transparent border-bottom py-3 px-0">
            <div class="row align-items-center">
              <div class="col-auto">
                <img class="img-fluid me-2" alt="logo" src="${logoSrc}" height="35" width="35">
              </div>
              <div class="col-auto px-0">
                <h4 class="fs-6 text-dark mb-0">
                  <a href="#">
                    ${
                      row[6]
                        ? row[6].length > 22
                          ? row[6].substring(0, 22) + "..."
                          : row[6]
                        : ""
                    } <span class="small text-gray-500">(${row[4]})</span>
                  </a>
                </h4>
                <span class="small">${row[2] || ""}</span>
              </div>
              <div class="col text-end">
                <span class="fs-6 fw-bolder ${
                  row[3] === "Expenses" ? "text-danger" : "text-success"
                }">
                  ${row[3] === "Expenses" ? "-" : "+"} ${row[7] || ""}
                </span>
              </div>
            </div>
          </li>
        `;
        });

        tableBody.innerHTML = html;
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Get Data Categories
  function getDataCategories() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/categories!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values || [];
        categoryChoices.clearChoices();
        categoryChoices.setChoices(
          [
            {
              value: "",
              label: "-- Select Category --",
              selected: true,
              disabled: true,
            },
          ],
          "value",
          "label",
          false
        );
        rows.forEach((row) => {
          categoryChoices.setChoices(
            [{ value: row[1], label: row[1] }],
            "value",
            "label",
            false
          );
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Get Data Account Payments
  function getDataAccountPayments() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/accountPayments!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values || [];
        const allPayments = [];

        // ✅ Untuk dropdown di modal
        paymentChoices.clearChoices();
        paymentChoices.setChoices(
          [
            {
              value: "",
              label: "-- Select Payment Method --",
              selected: true,
              disabled: true,
            },
          ],
          "value",
          "label",
          false
        );

        rows.forEach((row) => {
          const payment = row[1];
          paymentChoices.setChoices(
            [{ value: payment, label: payment }],
            "value",
            "label",
            false
          );
          allPayments.push(payment);
        });

        // ✅ Untuk filter di dashboard (pakai Choices.js juga)
        paymentFilterChoices.clearChoices();
        paymentFilterChoices.setChoices(
          [{ value: "", label: "All Payments", selected: true }],
          "value",
          "label",
          true
        );

        allPayments.forEach((payment) => {
          paymentFilterChoices.setChoices(
            [{ value: payment, label: payment }],
            "value",
            "label",
            false
          );
        });

        return allPayments; // ✅ penting untuk renderDailyExpensesChart()
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        return []; // return empty jika error
      });
  }

  // ✅ New Transaction Modal button
  document
    .querySelector(".new-transaction-btn")
    .addEventListener("click", () => {
      const modalEl = document.getElementById("componentModal");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      modalEl.querySelector(".modal-title").innerText = "New Transaction";
      modalEl.querySelector("#btn-submit-modal").innerText = "Add Transaction";
      const form = document.getElementById("modalForm");
      form.reset();

      incomeExpensesSelect.setChoices(
        [
          { value: "Income", label: "Income" },
          { value: "Expenses", label: "Expenses" },
        ],
        "value",
        "label",
        true
      );
      incomeExpensesSelect.setChoiceByValue("");

      paymentChoices.clearStore();
      getDataAccountPayments();
      categoryChoices.clearStore();
      getDataCategories();

      const idInput = form.querySelector('input[name="transaction_id"]');
      if (idInput) idInput.remove();
    });

  // ✅ Calculate Income Expenses with animateCountUp
  function calculateIncomeExpenses() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
    const selectedPayment = document.getElementById("paymentFilter").value;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values;
        let sumIncome = 0,
          sumExpenses = 0;

        rows.forEach((row) => {
          const type = row[3];
          const payment = row[4];
          const category = row[5];
          const nominalStr = row[7];
          const nominal = parseInt(
            nominalStr.replace(/Rp\s?/g, "").replace(/,/g, ""),
            10
          );

          if (!isNaN(nominal)) {
            if (type === "Income") {
              if (selectedPayment === "") {
                // ✅ All Payments: income hanya Payroll dan Remaining
                if (payment === "Payroll" || category === "Remaining") {
                  sumIncome += nominal;
                }
              } else {
                // ✅ Selected payment: income sesuai payment
                if (payment === selectedPayment) {
                  sumIncome += nominal;
                }
              }
            } else if (type === "Expenses") {
              // ✅ Exclude transfer out from Payroll in all payments
              if (
                selectedPayment === "" &&
                payment === "Payroll" &&
                category === "Transfer"
              ) {
                // skip, karena ini transfer keluar dari payroll ke payment lain
              } else {
                if (selectedPayment === "") {
                  // ✅ All Payments: sum all expenses except transfer out payroll
                  sumExpenses += nominal;
                } else {
                  // ✅ Selected payment: expenses hanya payment sesuai filter
                  if (payment === selectedPayment) {
                    sumExpenses += nominal;
                  }
                }
              }
            }
          }
        });

        animateCountUp("totalIncome", sumIncome);
        animateCountUp("totalExpenses", sumExpenses);
        animateCountUp(
          "totalSaving",
          sumIncome - sumExpenses,
          1000,
          "Rp ",
          (val) => (val < 0 ? "text-danger" : "text-success")
        );
      })
      .catch((err) => console.error("Error:", err));
  }

  // ✅ Render daily expenses chart
  function renderDailyExpensesChart(filterPayment = "", allPayments = []) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values;
        const grouped = groupByDateAndPayment(rows);

        const datesSet = new Set();
        grouped.forEach((row) => datesSet.add(row.date));
        const dates = Array.from(datesSet).sort();

        let series = [];
        let colors = [];

        if (filterPayment) {
          // ✅ Jika filter diisi, hanya payment tersebut
          const dataSeries = dates.map((date) => {
            const found = grouped.find(
              (r) => r.date === date && r.payment_method === filterPayment
            );
            return found ? found.total : 0;
          });

          series.push({ name: filterPayment, data: dataSeries });
          colors.push(paymentColors[filterPayment] || "#9e9e9e");
        } else {
          // ✅ Jika All Payments, tampilkan semua payments dari master
          allPayments.forEach((payment) => {
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
          chart: {
            type: "line",
            height: 400,
            toolbar: {
              show: false,
            },
          },
          series: series,
          colors: colors,
          stroke: {
            curve: "smooth",
          },
          grid: {
            show: true,
            borderColor: "#F1F1F1",
            strokeDashArray: 1,
          },
          xaxis: {
            categories: dates,
            labels: {
              formatter: (value) => {
                const date = new Date(value);
                const day = ("0" + date.getDate()).slice(-2); // menambahkan leading zero
                const month = date.toLocaleString("en-US", { month: "long" }); // "July"
                return `${day} ${month}`;
              },
            },
          },
          yaxis: {
            labels: {
              formatter: (val) => val.toLocaleString("en-US"),
            },
          },
          legend: {
            position: "bottom",
            height: 60,
          },
          tooltip: {
            y: {
              formatter: (val) => "Rp " + val.toLocaleString("en-US"),
            },
          },
        };

        const chartContainer = document.querySelector("#daily-expenses-chart");
        chartContainer.innerHTML = "";
        const chart = new ApexCharts(chartContainer, options);
        chart.render();
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Render top expenses chart
  function renderTopExpensesChart(filterPayment = "", allPayments = []) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values;

        const expenses = {};

        rows.forEach((row) => {
          const type = row[3]; // Type
          const payment = row[4]; // Payment
          const remark = row[6]; // Remark
          const nominal = parseFloat(row[7].replace(/[^\d.-]/g, "")) || 0; // Nominal

          // ✅ Filter hanya Expenses
          if (type === "Expenses") {
            // ✅ Skip jika remark mengandung "Transfer to" (case-insensitive)
            if (remark && remark.includes("Transfer to")) {
              return;
            }

            // ✅ Jika filterPayment diisi, cek payment match
            if (filterPayment) {
              if (payment === filterPayment) {
                if (!expenses[remark]) expenses[remark] = 0;
                expenses[remark] += nominal;
              }
            } else {
              // ✅ Jika filterPayment kosong, masukkan semua payment
              if (!expenses[remark]) expenses[remark] = 0;
              expenses[remark] += nominal;
            }
          }
        });

        // ✅ Convert to array & sort desc
        const sortedExpenses = Object.entries(expenses)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10); // ambil top 10

        const categories = sortedExpenses.map((item) => item[0]);
        const dataSeries = sortedExpenses.map((item) => item[1]);

        const options = {
          chart: {
            type: "bar",
            height: 540,
            toolbar: { show: false },
          },
          series: [
            {
              name: "Expenses",
              data: dataSeries,
            },
          ],
          colors: ["#E11D484D"],
          fill: {
            opacity: 1,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 6,
              barHeight: "85%",
            },
          },
          dataLabels: {
            enabled: true,
            formatter: (val) => val.toLocaleString("en-US"),
            style: {
              colors: ["#E11D48"],
            },
          },
          grid: {
            show: true,
            borderColor: "#F1F1F1",
            strokeDashArray: 1,
          },
          xaxis: {
            categories: categories,
            labels: {
              formatter: (val) => {
                if (val >= 1000000000) {
                  return (
                    (val / 1000000000).toFixed(1).replace(/\.0$/, "") + "B"
                  );
                } else if (val >= 1000000) {
                  return (val / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
                } else if (val >= 1000) {
                  return (val / 1000).toFixed(0) + "k";
                } else {
                  return val;
                }
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            },
          },
          tooltip: {
            x: {
              formatter: (val) => val,
            },
            y: {
              formatter: (val) => "Rp " + val.toLocaleString("en-US"),
            },
          },
          legend: {
            show: false,
          },
        };

        const chartContainer = document.querySelector("#top-expenses-chart");
        chartContainer.innerHTML = "";

        const chart = new ApexCharts(chartContainer, options);
        chart.render();
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Render category expenses chart
  function renderCategoryExpensesChart(filterPayment = "", allPayments = []) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values;
        const expenses = {};

        rows.forEach((row) => {
          const type = row[3]; // Type
          const payment = row[4]; // Payment
          const category = row[5]; // Category
          const nominal = parseFloat(row[7].replace(/[^\d.-]/g, "")) || 0; // Clean nominal

          // ✅ Filter hanya Expenses dan sesuai filterPayment jika ada
          if (
            type === "Expenses" &&
            (!filterPayment || payment === filterPayment)
          ) {
            if (!expenses[category]) expenses[category] = 0;
            expenses[category] += nominal;
          }
        });

        // ✅ Convert to array & sort descending
        const combined = Object.entries(expenses)
          .map(([category, value]) => ({ category, value }))
          .sort((a, b) => b.value - a.value);

        const sortedCategories = combined.map((item) => item.category);
        const sortedDataSeries = combined.map((item) => item.value);

        // ✅ Mapping colors sesuai sortedCategories
        const colors = sortedCategories.map((category) => {
          return categoryColors[category] || categoryColors["Unknown"];
        });

        const options = {
          chart: {
            type: "donut",
            height: 414,
          },
          labels: sortedCategories,
          series: sortedDataSeries,
          colors: colors,
          dataLabels: {
            enabled: true,
            style: { colors: ["#FFFFFF"] }, // memastikan label terlihat di slice gelap
            formatter: (val, opts) => {
              const nominal = sortedDataSeries[opts.seriesIndex];
              return nominal.toLocaleString("en-US");
            },
          },
          legend: {
            position: "right",
          },
          tooltip: {
            y: {
              formatter: (val) => "Rp " + val.toLocaleString("en-US"),
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: "45%",
              },
            },
          },
        };

        const chartContainer = document.querySelector(
          "#category-expenses-chart"
        );
        chartContainer.innerHTML = "";

        const chart = new ApexCharts(chartContainer, options);
        chart.render();
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Initial fetch
  getDataTransactions();
  getDataCategories();

  getDataAccountPayments().then((allPayments) => {
    renderDailyExpensesChart("", allPayments);
    renderTopExpensesChart("", allPayments);
    renderCategoryExpensesChart("", allPayments);
    calculateIncomeExpenses();

    // ✅ Add event listener filter change
    document
      .getElementById("paymentFilter")
      .addEventListener("change", function () {
        const selectedPayment = this.value;
        renderDailyExpensesChart(selectedPayment, allPayments);
        renderTopExpensesChart(selectedPayment, allPayments);
        renderCategoryExpensesChart(selectedPayment, allPayments);
        calculateIncomeExpenses();
        getDataTransactions(selectedPayment); // 🔎 update Last Transactions sesuai filter
      });
  });
});
