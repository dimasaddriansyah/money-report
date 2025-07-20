document.addEventListener("DOMContentLoaded", function () {
  // ✅ Global variables
  let rows = []; // untuk menyimpan data loan
  let bills = []; // untuk menyimpan data bill
  let statusChoices; // Global instance statusChoices

  const sourcePaymentChoices = new Choices("#sourcePaymentSelect", {
    searchEnabled: true,
    itemSelectText: "",
  });

  const targetPaymentChoices = new Choices("#targetPaymentSelect", {
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
    const loanURL = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/loans!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;
    const billURL = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/bills!A2:F?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    Promise.all([fetch(loanURL), fetch(billURL)])
      .then(([loanRes, billRes]) =>
        Promise.all([loanRes.json(), billRes.json()])
      )
      .then(([loanData, billData]) => {
        rows = loanData.values || [];
        bills = billData.values || [];

        renderLoanTable(); // ✅ separate render logic
      })
      .catch((err) => console.error("Fetch error:", err));
  }

  // ✅ Fetch and render Loan table
  function renderLoanTable() {
    let html = "";

    rows.forEach((row) => {
      html += `
      <tr data-loan-id="${row[0]}">
        <td class="text-center">
          <i class="fa fa-plus-circle text-primary toggle-bills" style="cursor:pointer"></i>
        </td>
        <td></td>
        <td class="text-sm text-dark">${row[1] || "-"}</td>
        <td class="text-sm text-dark">${row[2] || "-"}</td>
        <td class="text-sm text-dark">${row[3] || "-"}</td>
        <td class="text-sm text-dark">
          Rp <span class="float-end">${row[4].replace("Rp", "").trim()}</span>
        </td>
        <td class="text-sm text-dark">${row[6] || "-"}</td>
        <td class="text-sm text-dark" 
        data-order="${row[7] ? new Date(row[7]).getTime() : ""}">
          ${row[7] || "-"}
        </td>
        <td class="text-center">
          <span class="text-sm ${
            row[5] === "Unpaid"
              ? "badge rounded-pill bg-danger"
              : "badge rounded-pill bg-success"
          }">${row[5] || "-"}</span>
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

    // ✅ DataTable initialization
    if ($.fn.DataTable.isDataTable("#custom-datatable")) {
      $("#custom-datatable").DataTable().destroy();
    }

    const table = $("#custom-datatable").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      autoWidth: false,
      order: [[7, "desc"]],
      columnDefs: [
        { orderable: false, targets: [0, 1, 6, 7, 8, 9] },
        { width: "1%", targets: [0, 1, 6, 7, 8, 9] },
        { width: "13%", targets: [5] },
      ],
      initComplete: function () {
        const api = this.api();
        api.columns().every(function () {
          const that = this;
          $("input", this.footer()).on("keyup change clear", function () {
            if (that.search() !== this.value) {
              that.search(this.value).draw();
            }
          });
        });
      },
    });

    table
      .on("order.dt search.dt", function () {
        table
          .column(1, { order: "applied" })
          .nodes()
          .each(function (cell, i) {
            cell.innerHTML = i + 1 + ".";
          });
      })
      .draw();
  }

  $(document).on("click", ".toggle-bills", function () {
    const icon = $(this);
    const tr = icon.closest("tr");
    const table = $("#custom-datatable").DataTable();
    const row = table.row(tr);
    const loanId = tr.data("loan-id");

    if (row.child.isShown()) {
      // collapse
      row.child.hide();
      icon
        .removeClass("fa-minus-circle text-danger")
        .addClass("fa-plus-circle text-primary");
    } else {
      // expand
      const billsByLoan = bills.filter((b) => b[1] === loanId); // asumsi b[1] = loan_id di bills table

      const childHtml = formatBillsTable(billsByLoan);
      row.child(childHtml).show();
      icon
        .removeClass("fa-plus-circle text-primary")
        .addClass("fa-minus-circle text-danger");
    }
  });

  function formatBillsTable(bills) {
    if (bills.length === 0) {
      return '<div class="p-3">No bills found for this loan.</div>';
    }

    let html = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Bill ID</th>
          <th>Payment Date</th>
          <th>Note</th>
          <th>Nominal</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;

    bills.forEach((bill) => {
      html += `
      <tr>
        <td>${bill[0]}</td>
        <td>${bill[2]}</td>
        <td>${bill[3]}</td>
        <td>${bill[4]}</td>
        <td>${bill[5]}</td>
      </tr>
    `;
    });

    html += "</tbody></table>";
    return html;
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
      text: `You are about to delete ${selectedIds.length} loans.`,
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

  // ✅ Get Data Account Payments
  function getDataAccountPayments() {
    return new Promise((resolve, reject) => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/accountPayments!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const rows = data.values || [];
          sourcePaymentChoices.clearChoices();
          sourcePaymentChoices.setChoices(
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
          targetPaymentChoices.clearChoices();
          targetPaymentChoices.setChoices(
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
            sourcePaymentChoices.setChoices(
              [{ value: row[1], label: row[1] }],
              "value",
              "label",
              false
            );
            targetPaymentChoices.setChoices(
              [{ value: row[1], label: row[1] }],
              "value",
              "label",
              false
            );
          });
          resolve(); // ✅ resolve promise setelah selesai
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          reject(err);
        });
    });
  }

  // ✅ New Modal button
  document.querySelector(".new-modal-btn").addEventListener("click", () => {
    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "New Loan";
    modalEl.querySelector("#btn-submit-modal").innerText = "Add Loan";
    const form = document.getElementById("modalForm");
    form.reset();

    sourcePaymentChoices.clearStore();
    targetPaymentChoices.clearStore();
    getDataAccountPayments();

    const idInput = form.querySelector('input[name="loan_id"]');
    if (idInput) idInput.remove();
  });

  // ✅ Edit Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".edit-modal-btn");
    if (!btn) return;

    const loanId = btn.getAttribute("data-id");
    const loan = rows.find((row) => row[0] === loanId);
    if (!loan) return;

    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "Edit Loan";
    modalEl.querySelector("#btn-submit-modal").innerText = "Edit Loan";
    const form = document.getElementById("modalForm");

    const statusSelectHTML = `
    <div class="col-12"> 
      <div class="form-group icon-status mb-3"> 
        <label for="statusSelect">Status</label> 
        <select id="statusSelect" class="form-select" required>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
      </div>
    </div>
  `;

    const nominalInputContainer = form
      .querySelector("#nominal")
      .closest(".col-12, .col-md-6");
    if (nominalInputContainer && !document.getElementById("statusSelect")) {
      nominalInputContainer.insertAdjacentHTML("afterend", statusSelectHTML);

      const statusSelectEl = document.getElementById("statusSelect");
      if (statusSelectEl) {
        statusChoices = new Choices(statusSelectEl, {
          searchEnabled: true,
          itemSelectText: "",
        });
      }
    }

    // ✅ Jika instance sudah ada, set value dari data
    if (statusChoices) {
      statusChoices.setChoiceByValue(loan[5] || "");
    }

    getDataAccountPayments().then(() => {
      sourcePaymentChoices.setChoiceByValue(loan[1] || "");
      targetPaymentChoices.setChoiceByValue(loan[2] || "");
    });

    form.querySelector("#note").value = loan[3] || "";

    let nominalValue = loan[4] || "";
    nominalValue = nominalValue.replace(/Rp\s?/i, "").replace(/\s/g, "");
    form.querySelector("#nominal").value = nominalValue
      ? parseInt(nominalValue.replace(/,/g, ""), 10).toLocaleString("en-US")
      : "";

    let idInput = form.querySelector('input[name="loan_id"]');
    if (!idInput) {
      idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "loan_id";
      form.appendChild(idInput);
    }
    idInput.value = loanId;
  });

  // ✅ Delete Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-modal-btn");
    if (!btn) return;

    const loanId = btn.getAttribute("data-id");

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
            action: "loan_delete",
            loan_id: loanId,
          }),
          headers: { "Content-Type": "text/plain" },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.result === "success") {
            localStorage.setItem("loanSaved", "deleted");
            location.reload();
          } else {
            Swal.fire("Error", "Failed to delete loan.", "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          Swal.fire("Error", "Error deleting loan.", "error");
        });
    });
  });

  // ✅ Form submit (insert & update)
  document.getElementById("modalForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    let loanIdInput = form.querySelector('input[name="loan_id"]');
    let loanId;

    if (loanIdInput) {
      loanId = loanIdInput.value;
    } else {
      let maxId = 0;
      rows.forEach((row) => {
        if (row[0] && row[0].startsWith("LOAN-")) {
          const num = parseInt(row[0].split("-")[1], 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
      const nextIdNum = maxId + 1;
      loanId = "LOAN-" + String(nextIdNum).padStart(3, "0");
    }

    const now = new Date().toISOString();

    const data = {
      action: loanIdInput ? "loan_update" : "loan_create",
      loan_id: loanId,
      source_payment: sourcePaymentChoices.getValue(true),
      target_payment: targetPaymentChoices.getValue(true),
      note: form.note.value,
      nominal: form.nominal.value.replace(/,/g, ""),
      status: statusChoices ? statusChoices.getValue(true) : "Unpaid",
      inserted_date: now,
      updated_date: now,
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

          localStorage.setItem("loanSaved", loanIdInput ? "edited" : "saved");
          location.reload();
        } else {
          const msg =
            response.result === "not_found"
              ? "Loan not found."
              : "Failed to save loan.";
          Swal.fire("Error", msg, "error");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire("Error", "Failed to communicate with server.", "error");
      });
  });

  // ✅ Toast on page load
  const status = localStorage.getItem("loanSaved");
  if (status) {
    const messages = {
      saved: "Loan saved successfully",
      edited: "Loan edited successfully",
      deleted: "Loan deleted successfully",
    };
    showToast("success", messages[status] || "Operation completed");
    localStorage.removeItem("loanSaved");
  }

  // ✅ Initial fetch
  fetchAndRenderTable();
});
