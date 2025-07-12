document.addEventListener("DOMContentLoaded", function () {
  // ✅ Global variables
  let rows = []; // untuk menyimpan data

  const dateNow = getCurrentDateInfo();
  document.getElementById("currentDate").textContent =
    dateNow.month + " " + dateNow.year;

  const paymentChoices = new Choices("#paymentSelect", {
    searchEnabled: true,
    itemSelectText: "",
  });

  // ✅ Separator Nominal input
  const nominalInput = document.getElementById("nominal");
  nominalInput.addEventListener("input", function () {
    let value = this.value.replace(/,/g, "").replace(/\D/g, "");
    this.value = value ? parseInt(value, 10).toLocaleString("en-US") : "";
  });

  // ✅ Get Data Budgets
  function fetchAndRenderData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/budgets!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        rows = data.values || [];

        // 🔵 Group data by Payment
        const grouped = {};
        rows.forEach((row) => {
          const payment = row[1];
          const note = row[2];
          const nominal = parseInt(row[3].replace(/\D/g, ""), 10) || 0;

          if (!grouped[payment]) {
            grouped[payment] = {
              total: 0,
              details: [],
            };
          }

          grouped[payment].total += nominal;
          grouped[payment].details.push({
            budget_id: row[0],
            note,
            nominal: row[3],
          });
        });

        // 🖊️ Render each payment card
        const cardsHTML = Object.keys(grouped)
          .map((payment, idx) => {
            const { total, details } = grouped[payment];
            const cardId = `cardBody-${idx}`;
            const iconId = `icon-${idx}`;
            const logoSrc = getPaymentLogo(payment);

            return `
              <div class="card border-0 shadow">
                <div class="card-header d-flex justify-content-between" style="cursor: pointer;" onclick="toggleCard('${cardId}', '${iconId}')">
                  <div class="d-flex align-items-center gap-3">
                    <img src="${logoSrc}" alt="${payment}" class="img-fluid" width="50" height="50">
                    <h6 class="fw-bolder mb-0">${payment}</h6>
                  </div>
                  <div>
                    <span class="fw-bold text-sm">${formatRupiah(total)}</span>
                    <i id="${iconId}" class="fa-solid fa-chevron-down ms-4"></i>
                  </div>
                </div>
                <div id="${cardId}" class="card-body p-0 card-collapse">
                  <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                      <thead class="thead-light">
                        <tr>
                          <th class="border-bottom" scope="col">Allocation</th>
                          <th class="border-bottom text-end" scope="col">Nominal</th>
                          <th class="border-bottom text-end" scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        ${details
                          .map(
                            (item) => `
                            <tr>
                              <th class="text-gray-900" scope="row">${item.note}</th>
                              <td class="fw-bolder text-gray-500 text-end">${item.nominal}</td>
                              <td class="p-0" style="width:1%">
                                <a href="javascript:;" class="edit-modal-btn" data-id="${item.budget_id}" data-bs-toggle="tooltip" data-bs-original-title="Edit product">
                                  <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                              </td>
                            </tr>
                          `
                          )
                          .join("")}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");

        // 🔢 Hitung total spend (jumlah semua nominal)
        const totalSpend = rows.reduce((sum, row) => {
          const nominal = parseInt(row[3].replace(/\D/g, ""), 10) || 0;
          return sum + nominal;
        }, 0);

        // Masukkan ke HTML
        animateCountUp({
          elementId: "totalBudget",
          targetValue: 6400000,
        });
        animateCountUp({
          elementId: "totalSpend",
          targetValue: totalSpend,
        });
        animateCountUp({
          elementId: "totalSaving",
          targetValue: 6400000 - totalSpend,
          classCondition: (val) => (val < 0 ? "text-danger" : "text-success"),
        });
        document.getElementById("budgetsCard").innerHTML = cardsHTML;
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
          paymentChoices.setChoices(
            [{ value: row[1], label: row[1] }],
            "value",
            "label",
            false
          );
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ New Modal button
  document.querySelector(".new-modal-btn").addEventListener("click", () => {
    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "New Budget";
    modalEl.querySelector("#btn-submit-modal").innerText = "Add Budget";
    const form = document.getElementById("modalForm");
    form.reset();

    paymentChoices.clearStore();
    getDataAccountPayments();

    const idInput = form.querySelector('input[name="budget_id"]');
    if (idInput) idInput.remove();
  });

  // ✅ Edit Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".edit-modal-btn");
    if (!btn) return;

    const budgetId = btn.getAttribute("data-id");
    const budget = rows.find((row) => row[0] === budgetId);

    if (!budget) return;

    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "Edit Budget";
    modalEl.querySelector("#btn-submit-modal").innerText = "Edit Budget";

    const form = document.getElementById("modalForm");

    getDataAccountPayments().then(() => {
      paymentChoices.setChoiceByValue(budget[1] || "");
    });

    form.querySelector("#note").value = budget[2] || "";

    // 🔥 Hilangkan Rp dan spasi di nominal
    let nominalValue = budget[3] || "";
    nominalValue = nominalValue.replace(/Rp\s?/i, "").replace(/\s/g, "");
    form.querySelector("#nominal").value = nominalValue
      ? parseInt(nominalValue.replace(/,/g, ""), 10).toLocaleString("en-US")
      : "";

    let idInput = form.querySelector('input[name="budget_id"]');
    if (!idInput) {
      idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "budget_id";
      form.appendChild(idInput);
    }
    idInput.value = budgetId;

    // ✅ Tambahkan Delete Button jika belum ada
    const modalFooter = modalEl.querySelector(".modal-footer");
    let deleteBtn = modalFooter.querySelector("#btn-delete-budget");

    if (!deleteBtn) {
      deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.id = "btn-delete-budget";
      deleteBtn.className = "btn btn-outline-danger";
      deleteBtn.innerText = "Delete Budget";

      // 🔥 Event listener delete budget
      deleteBtn.addEventListener("click", function () {
        Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#E11D48",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (!result.isConfirmed) return;
          fetch(
            "https://script.google.com/macros/s/AKfycbzEvDfgqxBzvJIk1-_i4JfihTbq_u-_cEayKu5nVSlPxG_p_bIi5WLL2ESo879Ybe7unw/exec",
            {
              method: "POST",
              body: JSON.stringify({
                action: "budget_delete",
                budget_id: budgetId,
              }),
              headers: { "Content-Type": "text/plain" },
            }
          )
            .then((res) => res.json())
            .then((response) => {
              if (response.result === "success") {
                localStorage.setItem("budgetSaved", "deleted");
                location.reload();
              } else {
                Swal.fire("Error", "Failed to delete budget.", "error");
              }
            })
            .catch((err) => {
              console.error("Error:", err);
              Swal.fire("Error", "Error deleting budget.", "error");
            });
        });
      });
      const modalFooter = modalEl.querySelector(".modal-footer");
      const closeBtn = modalFooter.querySelector('[data-bs-dismiss="modal"]');
      modalFooter.insertBefore(deleteBtn, closeBtn.nextSibling);
    }

    modal.show();
  });

  // ✅ Form submit (insert & update)
  document.getElementById("modalForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    let budIdInput = form.querySelector('input[name="budget_id"]');
    let budId;

    if (budIdInput) {
      budId = budIdInput.value;
    } else {
      let maxId = 0;
      rows.forEach((row) => {
        if (row[0] && row[0].startsWith("BUD-")) {
          const num = parseInt(row[0].split("-")[1], 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
      const nextIdNum = maxId + 1;
      budId = "BUD-" + String(nextIdNum).padStart(3, "0");
    }

    const data = {
      action: budIdInput ? "budget_update" : "budget_create",
      budget_id: budId,
      payment_method: paymentChoices.getValue(true),
      nominal: form.nominal.value.replace(/,/g, ""),
      note: form.note.value,
    };

    fetch(
      "https://script.google.com/macros/s/AKfycbzEvDfgqxBzvJIk1-_i4JfihTbq_u-_cEayKu5nVSlPxG_p_bIi5WLL2ESo879Ybe7unw/exec",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "text/plain" },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.result === "success") {
          form.reset();
          const modalEl = document.getElementById("componentModal");
          bootstrap.Modal.getInstance(modalEl).hide();

          localStorage.setItem("budgetSaved", budIdInput ? "edited" : "saved");
          location.reload();
        } else {
          const msg =
            response.result === "not_found"
              ? "budget not found."
              : "Failed to save budget.";
          Swal.fire("Error", msg, "error");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire("Error", "Failed to communicate with server.", "error");
      });
  });

  // ✅ Toast on page load
  const status = localStorage.getItem("budgetSaved");
  if (status) {
    const messages = {
      saved: "Budget saved successfully",
      edited: "Budget edited successfully",
      deleted: "Budget deleted successfully",
    };
    showToast("success", messages[status] || "Operation completed");
    localStorage.removeItem("budgetSaved");
  }

  fetchAndRenderData();
});

// 🔧 Toggle function
function toggleCard(cardId, iconId) {
  const cardBody = document.getElementById(cardId);
  const icon = document.getElementById(iconId);

  if (cardBody.classList.contains("show")) {
    cardBody.classList.remove("show");
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  } else {
    cardBody.classList.add("show");
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }
}
