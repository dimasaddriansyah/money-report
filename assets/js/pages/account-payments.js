document.addEventListener("DOMContentLoaded", function () {
  // ✅ Global variables
  let rows = []; // untuk menyimpan data transaksi

  // ✅ Fetch and render table
  function fetchAndRenderTable() {
    const url = `https://script.google.com/macros/s/AKfycbzEvDfgqxBzvJIk1-_i4JfihTbq_u-_cEayKu5nVSlPxG_p_bIi5WLL2ESo879Ybe7unw/exec`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "accountPayment_get" }),
    })
      .then((res) => res.json())
      .then((data) => {
        rows = data.data || [];

        let html = "";

        rows.forEach((row) => {
          html += `
            <tr>
              <td class="text-center">
                <input type="checkbox" class="row-checkbox" data-id="${row[0]}">
              </td>
              <td class="text-sm text-dark fw-bold">${row[1] || "-"}</td>
              <td class="text-sm text-dark">${row[2] || "-"}</td>
              <td class="text-sm text-dark" data-order="${
                row[3] ? new Date(row[3]).getTime() : ""
              }">${row[3] || "-"}</td>
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

        // ✅ Destroy existing DataTable if exists, then reinitialize
        if ($.fn.DataTable.isDataTable("#custom-datatable")) {
          $("#custom-datatable").DataTable().destroy();
        }

        const table = $("#custom-datatable").DataTable({
          responsive: true,
          orderCellsTop: true,
          fixedHeader: true,
          autoWidth: false,
          order: [[3, "desc"]],
          columnDefs: [
            { orderable: false, targets: [0, 4] },
            { width: "1%", targets: [0, 4] },
          ],
          initComplete: function () {
            // per-column search
            const api = this.api();
            api.columns().every(function () {
              const that = this;
              $("input", this.footer()).on("keyup change clear", function () {
                if (that.search() !== this.value) {
                  that.search(this.value).draw();
                }
              });
            });

            // append bulk delete button
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

  // ✅ New Modal button
  document.querySelector(".new-modal-btn").addEventListener("click", () => {
    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "New Account Payment";
    modalEl.querySelector("#btn-submit-modal").innerText =
      "Add Account Payment";
    const form = document.getElementById("modalForm");
    form.reset();

    const idInput = form.querySelector('input[name="accountPayment_id"]');
    if (idInput) idInput.remove();
  });

  // ✅ Edit Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".edit-modal-btn");
    if (!btn) return;

    const accountPaymentId = btn.getAttribute("data-id");
    const accountPayment = rows.find((row) => row[0] === accountPaymentId);
    if (!accountPayment) return;

    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "Edit Account Payment";
    modalEl.querySelector("#btn-submit-modal").innerText =
      "Edit Account Payment";
    const form = document.getElementById("modalForm");

    form.querySelector("#name").value = accountPayment[1] || "";

    let idInput = form.querySelector('input[name="accountPayment_id"]');
    if (!idInput) {
      idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "accountPayment_id";
      form.appendChild(idInput);
    }
    idInput.value = accountPaymentId;
  });

  // ✅ Delete Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-modal-btn");
    if (!btn) return;

    const accountPaymentId = btn.getAttribute("data-id");

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
            action: "accountPayment_delete",
            accountPayment_id: accountPaymentId,
          }),
          headers: { "Content-Type": "text/plain" },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.result === "success") {
            localStorage.setItem("accountPaymentSaved", "deleted");
            location.reload();
          } else {
            Swal.fire("Error", "Failed to delete accountPayment.", "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          Swal.fire("Error", "Error deleting accountPayment.", "error");
        });
    });
  });

  // ✅ Form submit (insert & update)
  document.getElementById("modalForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    let AccPayIdInput = form.querySelector('input[name="accountPayment_id"]');
    let AccPayId;

    if (AccPayIdInput) {
      AccPayId = AccPayIdInput.value;
    } else {
      let maxId = 0;
      rows.forEach((row) => {
        if (row[0] && row[0].startsWith("ACC-")) {
          const num = parseInt(row[0].split("-")[1], 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
      const nextIdNum = maxId + 1;
      AccPayId = "ACC-" + String(nextIdNum).padStart(3, "0");
    }

    const now = new Date().toISOString();

    const data = {
      action: AccPayIdInput ? "accountPayment_update" : "accountPayment_create",
      accountPayment_id: AccPayId,
      name: form.name.value,
      inserted_date: now,
      updated_date: AccPayIdInput ? now : now,
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

          localStorage.setItem(
            "accountPaymentSaved",
            AccPayIdInput ? "edited" : "saved"
          );
          location.reload();
        } else {
          const msg =
            response.result === "not_found"
              ? "Account Payment not found."
              : "Failed to save accountPayment.";
          Swal.fire("Error", msg, "error");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire("Error", "Failed to communicate with server.", "error");
      });
  });

  // ✅ Toast on page load
  const status = localStorage.getItem("accountPaymentSaved");
  if (status) {
    const messages = {
      saved: "Account Payment saved successfully",
      edited: "Account Payment edited successfully",
      deleted: "Account Payment deleted successfully",
    };
    showToast("success", messages[status] || "Operation completed");
    localStorage.removeItem("accountPaymentSaved");
  }

  // ✅ Initial fetch
  fetchAndRenderTable();
});
