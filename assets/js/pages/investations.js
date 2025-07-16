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
              <td class="text-center">
                <input type="checkbox" class="row-checkbox" data-id="${row[0]}">
              </td>
              <td class="text-sm text-dark fw-bold">${row[1] || "-"}</td>
              <td class="text-sm text-dark fw-bold">${row[2] || "-"}</td>
              <td class="text-sm text-dark fw-bold">${row[3] || "-"}</td>
              <td class="text-sm text-dark fw-bold">${row[4] || "-"}</td>
              <td class="text-sm text-dark">${row[5] || "-"}</td>
              <td class="text-sm text-dark" data-order="${
                row[6] ? new Date(row[6]).getTime() : ""
              }">${row[6] || "-"}</td>
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
          order: [[5, "desc"]],
          columnDefs: [
            { orderable: false, targets: [0] },
            { width: "1%", targets: [0] },
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

  // ✅ Initial fetch
  fetchAndRenderTable();
});
