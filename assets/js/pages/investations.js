document.addEventListener("DOMContentLoaded", function () {
  // ✅ Global variables
  let rows = []; // untuk menyimpan data transaksi

  // ✅ Fetch and render table
  function fetchAndRenderTable() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/investations!A2:G?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        rows = data.values || []; // ✅ update global rows

        let html = "";

        rows.forEach((row) => {
          html += `
            <tr>
              <td class="text-dark fw-bold text-center">
                <span class="${
                  row[2] === "Buy" ? "badge bg-success" : "badge bg-danger"
                }">
                  ${row[2] || "-"}
                </span> 
              </td>
              <td class="text-sm text-dark fw-bold" 
              data-order="${row[1] ? new Date(row[1]).getTime() : ""}">
                ${row[1] || "-"}
              </td>
              <td class="text-sm text-dark fw-bold">${row[3] || "-"}</td>
              <td class="text-sm text-dark fw-bold">${row[4] || "-"}</td>
              <td class="text-sm text-dark">${row[5] || "-"}</td>
              <td class="text-sm text-dark">${row[6] || "-"}</td>
            </tr>
          `;
        });

        $("#custom-datatable tbody").html(html);

        // ✅ Destroy existing DataTable if exists, then reinitialize
        if ($.fn.DataTable.isDataTable("#custom-datatable")) {
          $("#custom-datatable").DataTable().destroy();
        }

        const table = $("#custom-datatable").DataTable({
          responsive: true,
          orderCellsTop: true,
          fixedHeader: true,
          autoWidth: false,
          order: [[1, "desc"]],
          columnDefs: [
            { orderable: false, targets: [0] },
            { width: "8%", targets: [0] },
          ],
        });

        calculatePortofolios();
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  function calculatePortofolios() {
    const assetPortfolios = {};
    rows.forEach((row) => {
      const type = row[2];
      const platform = row[3];
      const portfolio = row[4];
      const nominal =
        parseInt((row[6] || "0").replace(/Rp\s?/g, "").replace(/,/g, ""), 10) ||
        0;

      if (!assetPortfolios[portfolio]) {
        assetPortfolios[portfolio] = {
          totalNominal: 0,
          platform: platform,
        };
      }

      if (type === "Buy") {
        assetPortfolios[portfolio].totalNominal += nominal;
      } else if (type === "Sell") {
        assetPortfolios[portfolio].totalNominal -= nominal;
      }
    });

    const portfolioCards = document.getElementById("portfolioCards");
    portfolioCards.innerHTML = "";

    Object.entries(assetPortfolios).forEach(([portfolio, data]) => {
      const logoURL = getPlatformLogo(data.platform);

      let target = 0;
      if (portfolio === "Married Saving") {
        target = 65000000;
      } else if (portfolio === "Retirement") {
        target = 1000000000;
      } else {
        target = 1; // prevent division by zero
      }

      const progressPercent = Math.min(
        (data.totalNominal / target) * 100,
        100
      ).toFixed(2);

      portfolioCards.innerHTML += `
        <div class="swiper-slide">
          <div class="card balance-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="text-xxs text-gray-500">Portfolio</span>
                  <h5 class="card-title">${portfolio}</h5>
                </div>
                <div>
                  <img src="${logoURL}" alt="${portfolio}" class="img-fluid" width="80" height="80"/>
                </div>
              </div>
              <div class="mt-5">
                <div class="d-flex justify-content-between align-items-end">
                  <div class="d-flex flex-column">
                    <span class="text-xxs text-gray-500">Balance</span>
                    <span class="card-text fw-bolder text-success">
                      Rp ${data.totalNominal.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div class="d-flex flex-column text-end">
                    <span class="text-xxs text-gray-500">Target</span>
                    <span class="card-text fw-bolder">
                      Rp ${target.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
                <div class="progress mt-2">
                  <div class="progress-bar bg-success" role="progressbar" 
                  aria-valuenow="${data.totalNominal}" 
                  aria-valuemin="0" aria-valuemax="${target}" 
                  style="width: ${progressPercent}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });

    // Destroy swiper jika sudah ada
    if (window.portfolioSwiper) window.portfolioSwiper.destroy(true, true);

    // Initialize ulang swiper
    window.portfolioSwiper = new Swiper(".mySwiper", {
      slidesPerView: 2,
      spaceBetween: 16,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // ✅ Initial fetch
  fetchAndRenderTable();
});
