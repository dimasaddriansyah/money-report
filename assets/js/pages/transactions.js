document.addEventListener("DOMContentLoaded", function () {
  let rows = []; // untuk menyimpan data transaksi

  // ✅ Init Choices.js
  const typeSelect = new Choices("#typeSelect", {
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
  const platformChoices = new Choices("#platformSelect", {
    searchEnabled: true,
    itemSelectText: "",
  });
  const portfolioChoices = new Choices("#portfolioSelect", {
    searchEnabled: true,
    itemSelectText: "",
  });

  // ✅ Separator Nominal input
  const nominalInput = document.getElementById("nominal");
  nominalInput.addEventListener("input", function () {
    let value = this.value.replace(/,/g, "").replace(/\D/g, "");
    this.value = value ? parseInt(value, 10).toLocaleString("en-US") : "";
  });

  // ✅ Fetch and render table
  function fetchAndRenderTable() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        rows = data.values || [];
        console.log(rows);
        

        let html = "";

        rows.forEach((row) => {
          // ✅ Mapping logo berdasarkan kategori
          const paymentSrc = getPaymentLogo(row[4]);
          const categorySrc = getCategoryIcon(row[5]);

          html += `
          <tr>
            <td class="align-middle">
              <input type="checkbox" class="row-checkbox" data-id="${row[0]}">
            </td>
            <td class="text-sm fw-normal" 
            data-order="${row[2] ? new Date(row[2]).getTime() : ""}">
              <div class="d-flex flex-column">
                <h6 class="mb-1 text-dark text-sm">${row[1] || ""}</h6>
                <span class="text-xs">${row[2] || ""}</span>
              </div>
            </td>
            <td>
              <div class="d-flex align-items-center">
                <div class="d-none d-lg-block">
                  <img src="${paymentSrc}" class="img-fluid me-4" height="40" width="40" alt="logo">
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-1 text-dark text-sm">${row[4] || ""}</h6>
                  <span class="text-xs">Payment</span>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex align-items-center">
                <div class="d-none d-lg-block">
                  <img src="${categorySrc}" class="img-fluid me-4" height="30" width="30" alt="logo">
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-1 text-dark text-sm">${row[5] || ""}</h6>
                  <span class="text-xs">Category</span>
                </div>
              </div>
            </td>
            <td class="text-sm text-dark fw-bold align-middle">
              ${row[6] || ""}
            </td>
            <td class="text-sm fw-bold align-middle 
            ${
              row[3] === "Expenses" || row[3] === "Transfer"
                ? "text-danger"
                : "text-success"
            }">
              ${row[3] === "Expenses" || row[3] === "Transfer" ? "-" : "+"} Rp 
              <span class="float-end">
                ${row[7].replace("Rp", "").trim()}
              </span>
            </td>
            <td class="align-middle">
              <a href="javascript:;" class="me-3 edit-modal-btn" data-id="${
                row[0]
              }" data-bs-toggle="tooltip" data-bs-original-title="Edit product">
                <i class="fa-regular fa-pen-to-square"></i>
              </a>
              <a href="javascript:;" class="delete-modal-btn" data-id="${
                row[0]
              }" data-bs-toggle="tooltip" data-bs-original-title="Delete product">
                <i class="fa-regular fa-trash-can text-danger"></i>
              </a>
            </td>
          </tr>
        `;
        });

        $("#custom-datatable tbody").html(html);

        // ✅ Destroy existing DataTable if exists
        if ($.fn.DataTable.isDataTable("#custom-datatable")) {
          $("#custom-datatable").DataTable().destroy();
        }

        // ✅ Initialize DataTable
        const table = $("#custom-datatable").DataTable({
          responsive: true,
          orderCellsTop: true,
          fixedHeader: true,
          autoWidth: false,
          order: [[1, "desc"]], // ✅ Kolom ke-3 (date) DESC
          columnDefs: [
            { orderable: false, targets: [0, 6] },
            { width: "1%", targets: [0, 6] },
            { width: "15%", targets: [1, 5] },
          ],
          initComplete: function () {
            // Per-column search
            const api = this.api();
            api.columns().every(function () {
              const that = this;
              $("input", this.footer()).on("keyup change clear", function () {
                if (that.search() !== this.value) {
                  that.search(this.value).draw();
                }
              });
            });

            // Append bulk delete button
            $("#custom-datatable_length").append(
              '<button id="bulkDelete" class="btn btn-danger btn-sm ms-3 d-none">Delete Selected (<span id="selectedCount">0</span>)</button>'
            );
          },
        });

        updateSelectAllCheckbox();
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Update select-all checkbox status
  function updateSelectAllCheckbox() {
    const total = $(".row-checkbox").length;
    const checked = $(".row-checkbox:checked").length;
    $("#select-all").prop("checked", total === checked);
  }

  // ✅ Update selected count and toggle bulk delete button
  function updateSelectedCount() {
    const count = $(".row-checkbox:checked").length;
    $("#selectedCount").text(count);
    if (count > 0) {
      $("#bulkDelete").removeClass("d-none");
    } else {
      $("#bulkDelete").addClass("d-none");
    }
  }

  // ✅ Event delegation for select-all checkbox
  $(document).on("click", "#select-all", function () {
    const checked = this.checked;
    $(".row-checkbox").prop("checked", checked);
    updateSelectedCount();
  });

  // ✅ Event delegation for each row checkbox
  $(document).on("change", ".row-checkbox", function () {
    updateSelectedCount();
    updateSelectAllCheckbox();
  });

  // ✅ Event: bulk delete with SweetAlert
  $(document).on("click", "#bulkDelete", function () {
    const selectedIds = $(".row-checkbox:checked")
      .map(function () {
        return $(this).data("id");
      })
      .get();

    if (selectedIds.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedIds.length} categories.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (!result.isConfirmed) return;

      // ✅ Call your Apps Script delete endpoint here
      console.log("Deleting IDs:", selectedIds);

      // Example fetch POST to delete API
      /*
      fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
        method: "POST",
        body: JSON.stringify({ action: "bulkDelete", ids: selectedIds }),
        headers: { "Content-Type": "text/plain" },
      })
      .then((res) => res.json())
      .then((response) => {
        if (response.result === "success") {
          Swal.fire("Deleted!", "Categories deleted successfully.", "success");
          fetchAndRenderTable();
        } else {
          Swal.fire("Error", "Failed to delete categories.", "error");
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        Swal.fire("Error", "Delete request failed.", "error");
      });
      */

      // For demo only
      Swal.fire("Deleted!", "Categories deleted successfully.", "success");
      fetchAndRenderTable();
    });
  });

  // ✅ Get Data Categories
  async function getDataCategories(type) {
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

    if (!type) {
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/categories!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const rows = data.values || [];
      const filtered = rows.filter((row) => row[1] === type);

      filtered.forEach((row) => {
        categoryChoices.setChoices(
          [{ value: row[2], label: row[2] }],
          "value",
          "label",
          false
        );
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // ✅ Get Data Account Payments
  function getDataAccountPayments() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/accountPayments!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
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

  // ✅ Fetch data Platform
  async function getInvestationData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/investations!A2:G?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      return json.values || [];
    } catch (err) {
      console.error("Fetch investation error:", err);
      return [];
    }
  }

  // ✅ Generate Investation ID
  async function generateInvestationId() {
    const rows = await getInvestationData();
    let maxId = 0;

    rows.forEach((row) => {
      if (row[0] && row[0].startsWith("INVEST-")) {
        const num = parseInt(row[0].split("-")[1], 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    });

    const nextIdNum = maxId + 1;
    return "INVEST-" + String(nextIdNum).padStart(3, "0");
  }

  // ✅ Fetch data Platform
  function getDataPlatforms() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/platforms!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values || [];
        platformChoices.clearChoices();
        platformChoices.setChoices(
          [
            {
              value: "",
              label: "-- Select Platform --",
              selected: true,
              disabled: true,
            },
          ],
          "value",
          "label",
          false
        );
        rows.forEach((row) => {
          platformChoices.setChoices(
            [{ value: row[1], label: row[1] }],
            "value",
            "label",
            false
          );
        });
      })
      .catch((err) => console.error("Fetch platform error:", err));
  }

  // ✅ Fetch data Portfolios
  function getDataPortfolios() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/portfolios!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values || [];
        portfolioChoices.clearChoices();
        portfolioChoices.setChoices(
          [
            {
              value: "",
              label: "-- Select Portfolio --",
              selected: true,
              disabled: true,
            },
          ],
          "value",
          "label",
          false
        );
        rows.forEach((row) => {
          portfolioChoices.setChoices(
            [{ value: row[1], label: row[1] }],
            "value",
            "label",
            false
          );
        });
      })
      .catch((err) => console.error("Fetch portfolio error:", err));
  }

  categoryChoices.passedElement.element.addEventListener("change", function () {
    const selectedCategory = this.value;
    const investmentFields = document.getElementById("investmentFields");

    const remarkInput = document.getElementById("remark");
    const remarkLabel = document.querySelector('label[for="remark"]');

    if (selectedCategory === "Investation") {
      investmentFields.style.display = "flex"; // tampilkan
      remarkLabel.textContent = "Product Name";
      remarkInput.placeholder = "Enter product name";
      getDataPlatforms();
      getDataPortfolios();
    } else {
      investmentFields.style.display = "none"; // sembunyikan
      platformChoices.clearStore();
      portfolioChoices.clearStore();
    }
  });

  // ✅ New Modal button
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

      typeSelect.setChoices(
        [
          {
            value: "",
            label: "-- Select Type --",
            selected: true,
            disabled: true,
          },
          {
            value: "Income",
            label: "Income",
            selected: false,
            disabled: false,
          },
          {
            value: "Expenses",
            label: "Expenses",
            selected: false,
            disabled: false,
          },
          {
            value: "Transfer",
            label: "Transfer",
            selected: false,
            disabled: false,
          },
        ],
        "value",
        "label",
        true
      );
      typeSelect.setChoiceByValue("");

      paymentChoices.clearStore();
      getDataAccountPayments();

      categoryChoices.clearStore();
      getDataCategories(typeSelect);

      document.getElementById("investmentFields").style.display = "none";
      platformChoices.clearStore();
      portfolioChoices.clearStore();

      const idInput = form.querySelector('input[name="transaction_id"]');
      if (idInput) idInput.remove();
    });

  // ✅ Edit Modal button
  document.addEventListener("click", async function (e) {
    const btn = e.target.closest(".edit-modal-btn");
    if (!btn) return;

    const transactionId = btn.getAttribute("data-id");
    const transaction = rows.find((row) => row[0] === transactionId);
    if (!transaction) return;

    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "Edit Transaction";
    modalEl.querySelector("#btn-submit-modal").innerText = "Edit Transaction";

    const form = document.getElementById("modalForm");

    typeSelect.setChoices(
      [
        {
          value: "Income",
          label: "Income",
          selected: transaction[3] === "Income",
          disabled: false,
        },
        {
          value: "Expenses",
          label: "Expenses",
          selected: transaction[3] === "Expenses",
          disabled: false,
        },
        {
          value: "Transfer",
          label: "Transfer",
          selected: transaction[3] === "Transfer",
          disabled: false,
        },
      ],
      "value",
      "label",
      true
    );

    paymentChoices.setChoiceByValue(transaction[4] || "");
    await getDataCategories(transaction[3] || "");
    categoryChoices.setChoiceByValue(transaction[5] || "");
    form.querySelector("#remark").value = transaction[6] || "";

    // 🔥 Hilangkan Rp dan spasi di nominal
    let nominalValue = transaction[7] || "";
    nominalValue = nominalValue.replace(/Rp\s?/i, "").replace(/\s/g, "");
    form.querySelector("#nominal").value = nominalValue
      ? parseInt(nominalValue.replace(/,/g, ""), 10).toLocaleString("en-US")
      : "";

    let idInput = form.querySelector('input[name="transaction_id"]');
    if (!idInput) {
      idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "transaction_id";
      form.appendChild(idInput);
    }
    idInput.value = transactionId;
  });

  // ✅ Delete Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-modal-btn");
    if (!btn) return;

    const transactionId = btn.getAttribute("data-id");

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
            action: "transaction_delete",
            transaction_id: transactionId,
          }),
          headers: { "Content-Type": "text/plain" },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.result === "success") {
            localStorage.setItem("transactionSaved", "deleted");
            location.reload();
          } else {
            Swal.fire("Error", "Failed to delete transaction.", "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          Swal.fire("Error", "Error deleting transaction.", "error");
        });
    });
  });

  // ✅ Form submit (insert & update)
  document
    .getElementById("modalForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;

      let trxIdInput = form.querySelector('input[name="transaction_id"]');
      let trxId = trxIdInput
        ? trxIdInput.value
        : "TRX-" + new Date().toISOString().replace(/[-:.TZ]/g, "");

      let invId = null;
      const selectedCategory = categoryChoices.getValue(true);

      // ✅ Jika Investation, generate investation_id
      if (selectedCategory === "Investation") {
        invId = await generateInvestationId();
      }

      const data = {
        action: trxIdInput ? "transaction_update" : "transaction_create",
        transaction_id: trxId,
        type: form.typeSelect.value,
        payment_method: paymentChoices.getValue(true),
        category: categoryChoices.getValue(true),
        remark: form.remark.value,
        nominal: form.nominal.value.replace(/,/g, ""),
        investation_id: invId,
        platform: platformChoices.getValue(true) || null,
        portfolio: portfolioChoices.getValue(true) || null,
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
            console.log(response); // ✅ lihat hasil response sebenarnya
            form.reset();
            const modalEl = document.getElementById("componentModal");
            bootstrap.Modal.getInstance(modalEl).hide();

            localStorage.setItem(
              "transactionSaved",
              trxIdInput ? "edited" : "saved"
            );
            location.reload();
          } else {
            const msg =
              response.result === "not_found"
                ? "Transaction not found."
                : "Failed to save transaction.";
            Swal.fire("Error", msg, "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          Swal.fire("Error", "Failed to communicate with server.", "error");
        });
    });

  // ✅ Event: Event select
  document.getElementById("typeSelect").addEventListener("change", function () {
    const selectedType = this.value;
    categoryChoices.clearStore();
    if (selectedType) {
      getDataCategories(selectedType);
    }
  });

  // ✅ Toast on page load
  const status = localStorage.getItem("transactionSaved");
  if (status) {
    const messages = {
      saved: "Transaction saved successfully",
      edited: "Transaction edited successfully",
      deleted: "Transaction deleted successfully",
    };
    showToast("success", messages[status] || "Operation completed");
    localStorage.removeItem("transactionSaved");
  }

  // ✅ Initial fetch
  fetchAndRenderTable();
  getDataCategories();
  getDataAccountPayments();
});
