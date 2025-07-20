document.addEventListener("DOMContentLoaded", function () {
  // ✅ Global variables
  let rows = []; // untuk menyimpan data bills
  let loans = []; // untuk menyimpan data loans

  // ✅ Fetch and render table
  function fetchAndRenderTable() {
    fetchLoans().then(() => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/bills!A2:F?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          rows = data.values || []; // ✅ update global rows

          let html = "";

          rows.forEach((row) => {
            html += `
            <tr>
              <td></td>
              <td class="text-sm text-dark"
               data-order="${row[2] ? new Date(row[2]).getTime() : ""}">
               ${row[2] || "-"}
              </td>
              <td class="text-sm text-dark fw-bold">
                ${getLoanNote(row[1]) || "-"}
              </td>
              <td class="text-sm text-dark">${row[3] || "-"}</td>
              <td class="text-sm text-dark">
                Rp <span class="float-end">
                ${row[4].replace("Rp", "").trim()}</span>
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

          // reinitialize DataTable (sama seperti sebelumnya)
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
              { orderable: false, targets: [0, 6] },
              { width: "1%", targets: [0, 6] },
              { width: "14%", targets: [1, 4] },
              { width: "10%", targets: [5] },
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
                .column(0, { search: "applied", order: "applied" })
                .nodes()
                .each(function (cell, i) {
                  cell.innerHTML = i + 1 + ".";
                });
            })
            .draw();
        })
        .catch((err) => console.error("Fetch error:", err));
    });
  }

  function fetchLoans() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/loans!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY`;

    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        loans = data.values || [];
      })
      .catch((err) => console.error("Fetch loans error:", err));
  }

  function getLoanNote(loan_id) {
    const loan = loans.find((l) => l[0] === loan_id);
    return loan ? loan[3] : null;
  }

  // ✅ New Modal button
  document.querySelector(".new-modal-btn").addEventListener("click", () => {
    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "New Bill";
    modalEl.querySelector("#btn-submit-modal").innerText = "Add Bill";
    const form = document.getElementById("modalForm");
    form.reset();

    const idInput = form.querySelector('input[name="bill_id"]');
    if (idInput) idInput.remove();
  });

  // ✅ Edit Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".edit-modal-btn");
    if (!btn) return;

    const billId = btn.getAttribute("data-id");
    const bill = rows.find((row) => row[0] === billId);
    if (!bill) return;

    const modalEl = document.getElementById("componentModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    modalEl.querySelector(".modal-title").innerText = "Edit Bill";
    modalEl.querySelector("#btn-submit-modal").innerText = "Edit Bill";
    const form = document.getElementById("modalForm");

    form.querySelector("#name").value = bill[1] || "";

    let idInput = form.querySelector('input[name="bill_id"]');
    if (!idInput) {
      idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "bill_id";
      form.appendChild(idInput);
    }
    idInput.value = billId;
  });

  // ✅ Delete Modal button
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-modal-btn");
    if (!btn) return;

    const billId = btn.getAttribute("data-id");

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
            action: "bill_delete",
            bill_id: billId,
          }),
          headers: { "Content-Type": "text/plain" },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.result === "success") {
            localStorage.setItem("billSaved", "deleted");
            location.reload();
          } else {
            Swal.fire("Error", "Failed to delete bill.", "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          Swal.fire("Error", "Error deleting bill.", "error");
        });
    });
  });

  // ✅ Form submit (insert & update)
  document.getElementById("modalForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    let billIdInput = form.querySelector('input[name="bill_id"]');
    let billId;

    if (billIdInput) {
      billId = billIdInput.value;
    } else {
      let maxId = 0;
      rows.forEach((row) => {
        if (row[0] && row[0].startsWith("BILL-")) {
          const num = parseInt(row[0].split("-")[1], 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
      const nextIdNum = maxId + 1;
      billId = "BILL-" + String(nextIdNum).padStart(3, "0");
    }

    const now = new Date().toISOString();

    const data = {
      action: billIdInput ? "bill_update" : "bill_create",
      bill_id: billId,
      name: form.name.value,
      inserted_date: now,
      updated_date: billIdInput ? now : now,
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

          localStorage.setItem("billSaved", billIdInput ? "edited" : "saved");
          location.reload();
        } else {
          const msg =
            response.result === "not_found"
              ? "Bill not found."
              : "Failed to save bill.";
          Swal.fire("Error", msg, "error");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire("Error", "Failed to communicate with server.", "error");
      });
  });

  // ✅ Toast on page load
  const status = localStorage.getItem("billSaved");
  if (status) {
    const messages = {
      saved: "Bill saved successfully",
      edited: "Bill edited successfully",
      deleted: "Bill deleted successfully",
    };
    showToast("success", messages[status] || "Operation completed");
    localStorage.removeItem("billSaved");
  }

  // ✅ Initial fetch
  fetchAndRenderTable();
});
