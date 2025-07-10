document.addEventListener("DOMContentLoaded", function () {
  // Get current Date
  const dateNow = getCurrentDateInfo();
  document.getElementById("currentDate").textContent =
    dateNow.month + " " + dateNow.year;

  // ✅ Fetch and render
  function fetchAndRenderData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/budgets!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values || [];

        // Group by kolom ke-2 (index 1)
        const grouped = rows.reduce((acc, curr) => {
          const key = curr[1];
          if (!acc[key]) acc[key] = [];
          acc[key].push(curr);
          return acc;
        }, {});

        // ✅ Convert grouped object to array with total
        const groupedArray = Object.entries(grouped).map(
          ([paymentType, items]) => {
            const total = items.reduce((sum, item) => {
              const cleanNominal = item[3]
                .replace(/Rp|\s|,/g, "")
                .replace(/\./g, "");
              const nominalNumber = parseInt(cleanNominal) || 0;
              return sum + nominalNumber;
            }, 0);

            return { paymentType, items, total };
          }
        );

        // ✅ Sort descending by total
        groupedArray.sort((a, b) => b.total - a.total);

        // ✅ Loop sorted data to generate accordion
        const accordionContainer = document.getElementById("accordionBudgets");
        groupedArray.forEach((group, index) => {
          const collapseId = `collapse${index}`;
          const headingId = `heading${index}`;

          const formattedTotal = "Rp " + group.total.toLocaleString("en-US");

          // Generate table rows
          const tableRows = group.items
            .map(
              (item) => `
        <tr>
          <td>${item[2]}</td>
          <td>${item[3]}</td>
        </tr>
      `
            )
            .join("");

          // Generate accordion item HTML
          const accordionItem = `
        <div class="accordion-item">
          <h2 class="accordion-header" id="${headingId}">
            <button class="accordion-button position-relative ${
              index !== 0 ? "collapsed" : ""
            }" type="button" data-bs-toggle="collapse"
              data-bs-target="#${collapseId}" aria-expanded="${
            index === 0 ? "true" : "false"
          }" aria-controls="${collapseId}">
              <span class="fw-extrabold">${group.paymentType}</span>
              <span class="fw-extrabold text-success position-absolute end-0 top-50 translate-middle-y" style="margin-right:4rem">${formattedTotal}</span>
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse ${
            index === 0 ? "show" : ""
          }" aria-labelledby="${headingId}"
            data-bs-parent="#accordionBudgets">
            <div class="accordion-body p-0">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>Allocation</th>
                      <th>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows}
                  </tbody>
                  <tfoot class="table-dark">
                    <tr>
                      <th>Allocation</th>
                      <th>Nominal</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

          accordionContainer.insertAdjacentHTML("beforeend", accordionItem);
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  fetchAndRenderData();
});
