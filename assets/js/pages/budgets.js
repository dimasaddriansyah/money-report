const API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/budgets!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

let rawData = [];
let swiperInstance;
const budgetItemsMap = {};

async function loadBudgets() {
  const list = document.getElementById("content-list");

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const rows = data.values || [];

    if (rows.length === 0) {
      list.innerHTML = `<li class="py-3 text-center text-slate-400">Tidak ada data budget.</li>`;
      return;
    }

    rawData = rows.map((row) => ({
      id: row[0],
      payment: row[1],
      note: row[2],
      nominal: row[3],
    }));

    list.innerHTML = "";
    renderNextContents();
    // renderCardSlides(rawData);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    list.innerHTML = `<li class="py-3 text-center text-red-500">Gagal memuat data</li>`;
  }
}

function renderNextContents() {
  const grouped = rawData.reduce((budget, item) => {
    const nominalValue = Number(item.nominal.replace(/[Rp,\s]/g, "")) || 0;
    if (!budget[item.payment]) {
      budget[item.payment] = {
        items: [],
        totalNominal: 0,
      };
    }
    const budgetItem = {
      id: item.id,
      payment: item.payment,
      note: item.note,
      nominal: nominalValue,
    };

    // Simpan ke map global
    budgetItemsMap[item.id] = budgetItem;

    budget[item.payment].items.push(budgetItem);
    budget[item.payment].totalNominal += nominalValue;
    return budget;
  }, {});

  const container = document.getElementById("content-list");
  container.innerHTML = ""; // Bersihkan kontainer sebelum render

  let index = 1;
  for (const payment in grouped) {
    const group = grouped[payment];

    const summaryDiv = document.createElement("div");
    summaryDiv.className = "cursor-pointer p-4 flex items-center";

    summaryDiv.innerHTML = `
      <div class="h-auto gap-y-3 sm:gap-y-3 flex flex-wrap w-full bg-white transition-all duration-300">
        <div class="w-full sm:w-16">
            <p class="text-xs text-slate-400">#</p>
            <p class="text-sm font-medium">${index}</p>
        </div>
        <div class="w-1/2 sm:flex-1">
            <p class="text-xs text-slate-400">Payment</p>
            <p class="text-sm font-medium">${payment}</p>
        </div>
        <div class="w-1/2 sm:flex-1 pr-4 sm:pr-4">
            <p class="text-xs text-right text-slate-400">Total Nominal</p>
            <p class="text-sm text-right font-medium">
              Rp ${group.totalNominal.toLocaleString("id-ID")}
            </p>
        </div>
      </div>
      <div class="text-2xl font-bold select-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    `;

    const detailDiv = document.createElement("div");
    detailDiv.className = "bg-white hidden";

    let detailContent = "";
    group.items.forEach((item, idx) => {
      detailContent += `
        <div class="relative group overflow-hidden w-full">
          <div class="h-auto p-4 space-y-3 content flex flex-col justify-between transition-all duration-300 bg-slate-50 border-b border-slate-200">
            <div class="w-full sm:w-16">
              <p class="text-xs text-slate-400">#</p>
              <p class="text-sm font-medium">${idx + 1}</p>
            </div>
            <div class="flex w-full">
              <div class="w-1/2 sm:flex-1">
                <p class="text-xs text-slate-400">Note</p>
                <p class="text-sm font-medium">${item.note}</p>
              </div>
              <div class="w-1/2 sm:flex-1 pr-8 sm:pr-8">
                <p class="text-xs text-right text-slate-400">Nominal</p>
                <p class="text-sm text-right font-medium">
                  Rp ${item.nominal.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div class="absolute right-0 top-0 h-full flex items-center bg-white translate-x-full transition-all duration-300 action-buttons">
            <button class="btn-edit flex items-center justify-center text-white w-16 h-full bg-yellow-500" 
              data-id="${item.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
            <button class="btn-delete flex items-center justify-center text-white w-16 h-full bg-red-500" 
              data-id="${item.id}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      `;
    });

    detailDiv.innerHTML = detailContent;
    container.appendChild(summaryDiv);
    container.appendChild(detailDiv);

    // Toggle accordion
    summaryDiv.addEventListener("click", () => {
      const isHidden = detailDiv.classList.contains("hidden");
      detailDiv.classList.toggle("hidden");
      summaryDiv.querySelector("div.text-2xl").innerHTML = isHidden
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
           </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
           </svg>`;
    });

    // Swipe & Button Logic
    const groups = detailDiv.querySelectorAll(".group");
    groups.forEach((g) => {
      const hammer = new Hammer(g);
      const content = g.querySelector(".content");
      const buttons = g.querySelector(".action-buttons");

      let resetSwipeTimeout;
      hammer.on("swipeleft", () => {
        content.classList.add("translate-x-[-8rem]");
        buttons.classList.remove("translate-x-full");
        clearTimeout(resetSwipeTimeout);
        resetSwipeTimeout = setTimeout(() => {
          content.classList.remove("translate-x-[-8rem]");
          buttons.classList.add("translate-x-full");
        }, 1500);
      });

      hammer.on("swiperight", () => {
        content.classList.remove("translate-x-[-8rem]");
        buttons.classList.add("translate-x-full");
        clearTimeout(resetSwipeTimeout);
      });

      g.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const item = budgetItemsMap[id];
          if (!item) {
            return alert("Data tidak ditemukan!");
          }
          openComponentModal({
            mode: "edit",
            data: item,
          });
        });
      });

      g.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          openDeleteModal(btn.dataset.id);
        });
      });
    });

    index++;
  }
}

function renderOverviewBudgets() {
  const budget = 6400000;
  const totalSpend = rawData.reduce((sum, item) => {
    return sum + (Number(item.nominal.replace(/[Rp,\s]/g, "")) || 0);
  }, 0);
  const saving = budget - totalSpend;

  let colorText = "text-slate-700";
  if (saving < 0) {
    colorText = "text-red-700";
  } else if (saving > 0) {
    colorText = "text-green-700";
  }

  const container = document.getElementById("overview-list");
  container.innerHTML = `
    <div class="max-w-4xl mx-auto grid gap-4 sm:grid-cols-1 sm:grid-rows-3 md:grid-cols-2 md:grid-rows-2">
      <div class="bg-blue-100 p-4 rounded-lg shadow md:col-span-2">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-sm text-slate-400">Budget</span>
            <h1 class="text-lg font-bold text-blue-700">${
              "Rp " + budget.toLocaleString("en-US")
            }</h1>
          </div>
          <div class="w-10 h-10">
            <img src="${getCategoryURL(
              "Budget"
            )}" alt="Icon Budget" class="w-full h-full object-contain">
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-sm text-slate-400">Spend</span>
            <h1 class="text-lg font-bold text-red-700">${
              "Rp " + totalSpend.toLocaleString("en-US")
            }</h1>
          </div>
          <div class="w-10 h-10">
            <img src="${getCategoryURL(
              "Spend"
            )}" alt="Icon Spend" class="w-full h-full object-contain">
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-sm text-slate-400">Saving</span>
            <h1 class="text-lg font-bold ${colorText}">${
    "Rp " + saving.toLocaleString("en-US")
  }</h1>
          </div>
          <div class="w-10 h-10">
            <img src="${getCategoryURL(
              "SavingBudget"
            )}" alt="Icon Saving" class="w-full h-full object-contain">
          </div>
        </div>
      </div>
    </div>
    `;
}

async function loadPayments() {
  const paymentSelect = document.getElementById("paymentSelect");
  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/accountPayments!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

  const resetSelect = (select) => {
    select.innerHTML = "<option></option>";
  };

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    // Reset isi select
    resetSelect(paymentSelect);

    rows.forEach((row) => {
      const value = row[1];
      if (value) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        paymentSelect.appendChild(option);
      }
    });

    // Apply Select2 ulang
    [paymentSelect].forEach((select) => {
      $(select).select2({
        placeholder: select.dataset.placeholder,
        width: "100%",
        dropdownParent: $(select).closest(".relative"),
      });
    });

    $(document).on("select2:open", () => {
      setTimeout(() => {
        document
          .querySelector(".select2-container--open .select2-search__field")
          ?.focus();
      }, 100);
    });
  } catch (err) {
    console.error("Gagal memuat payment options:", err);
  }
}

function openComponentModal({ mode = "create", data = {} }) {
  const isEdit = mode === "edit";
  const modalTitle = isEdit ? "Edit Budget" : "Add New Budget";

  openModal({
    title: modalTitle,
    content: `
      <form id="formContent" class="space-y-4">
       <div class="grid grid-cols-1">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Payment</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <select id="paymentSelect" data-placeholder="Select Payment" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                <option></option>
              </select>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Note</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <input type="text" id="note" class="w-full border rounded-lg p-2.5 pl-10 text-sm" placeholder="Input note..." />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Nominal</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <input type="text" id="nominal" class="w-full border rounded-lg p-2.5 pl-10 text-sm" placeholder="Input nominal..." />
            </div>
          </div>
        </div>
      </form>
    `,
    onSubmit: () => {
      const payment = $("#paymentSelect").val();
      const note = $("#note").val();
      const nominal = $("#nominal").val();

      if (!nominal) {
        alert("Content nominal is required.");
        return;
      }

      const payload = {
        payment_method: payment,
        note,
        nominal: parseFloat(nominal.replace(/[^0-9.-]+/g, "")) || 0,
      };

      if (isEdit) {
        payload.action = "budget_update";
        payload.budget_id = data.id;
      } else {
        payload.action = "budget_create";

        const lastId =
          rawData.length > 0 ? rawData[rawData.length - 1].id : null;

        let newId = "BUD-001";

        if (lastId && /^BUD-\d+$/.test(lastId)) {
          const lastNumber = parseInt(lastId.split("-")[1], 10);
          const nextNumber = lastNumber + 1;
          newId = `BUD-${String(nextNumber).padStart(3, "0")}`;
        }
        payload.budget_id = newId;
      }

      console.log(payload);

      fetch(
        "https://script.google.com/macros/s/AKfycbzEvDfgqxBzvJIk1-_i4JfihTbq_u-_cEayKu5nVSlPxG_p_bIi5WLL2ESo879Ybe7unw/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "text/plain",
          },
        }
      )
        .then((res) => res.json())
        .then(() => {
          closeModal();
          loadBudgets().then(() => {
            renderOverviewBudgets();
          });
          showToast(
            isEdit ? "Budget updated successfully" : "Budget added successfully"
          );
        })
        .catch((err) => {
          console.error("❌ Gagal mengirim:", err);
          alert("Terjadi kesalahan saat menyimpan data.");
        });
    },
  });

  setTimeout(() => {
    document.getElementById("note").value = data.note || "";
    document.getElementById("nominal").value = data.nominal || "";
    const nominalInput = document.getElementById("nominal");

    // Ambil nilai dan format saat buka modal
    nominalInput.value = data.nominal
      ? parseInt(
          String(data.nominal).replace(/[^0-9]/g, ""),
          10
        ).toLocaleString("en-US")
      : "";

    // Tambahkan formatter saat diketik
    nominalInput.addEventListener("input", function (e) {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = raw ? parseInt(raw, 10).toLocaleString("en-US") : "";
    });

    // Load data payments
    loadPayments().then(() => {
      if (isEdit) {
        $("#paymentSelect").val(data.payment).trigger("change");
      }
    });
  }, 100);
}

function openDeleteModal(data) {
  openModal({
    title: "Confirm Delete",
    content: `
      <p class="text-sm text-slate-600">Are you sure you want to delete this budget?</p>
    `,
    onSubmit: () => {
      const payload = {
        action: "budget_delete",
        budget_id: data,
      };

      fetch(
        "https://script.google.com/macros/s/AKfycbzEvDfgqxBzvJIk1-_i4JfihTbq_u-_cEayKu5nVSlPxG_p_bIi5WLL2ESo879Ybe7unw/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "text/plain",
          },
        }
      )
        .then((res) => res.json())
        .then(() => {
          closeModal();
          loadBudgets().then(() => {
            renderOverviewBudgets();
          });
          showToast("Budget deleted successfully");
        })
        .catch((err) => {
          console.error("❌ Gagal menghapus:", err);
          alert("Gagal menghapus data.");
        });
    },
  });
}

async function initApp() {
  document.getElementById("addModalBtn").addEventListener("click", () => {
    openComponentModal({ mode: "create" });
  });
  await loadBudgets();
  renderOverviewBudgets();
}

document.addEventListener("DOMContentLoaded", initApp);
