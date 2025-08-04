const API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/categories!A2:E?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

let rawData = [];
let currentPage = 0;
const itemsPerPage = 10;

async function loadCategories() {
  const loadingText = document.getElementById("loading-text");
  const seeMoreBtn = document.getElementById("see-more-btn");
  const list = document.getElementById("content-list");

  try {
    loadingText.classList.remove("hidden");
    seeMoreBtn.classList.add("hidden");

    const res = await fetch(API_URL);
    const data = await res.json();
    const rows = data.values || [];

    if (rows.length === 0) {
      list.innerHTML = `<li class="py-3 text-center text-slate-400">Tidak ada data category.</li>`;
      return;
    }

    rawData = rows
      .map((row) => ({
        id: row[0],
        type: row[1],
        name: row[2],
        inserted_date: row[3],
        updated_date: row[4],
      }))
      .sort((a, b) => {
        const dateA = Date.parse(a.updated_date); // e.g. "02 July 2025 16:12:41"
        const dateB = Date.parse(b.updated_date);
        return dateB - dateA; // Descending: terbaru dulu
      });

    currentPage = 0;
    list.innerHTML = "";
    renderNextContents();
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    list.innerHTML = `<li class="py-3 text-center text-red-500">Gagal memuat data</li>`;
  } finally {
    loadingText.classList.add("hidden");
  }
}

function renderNextContents() {
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const sliced = rawData.slice(start, end);
  const list = document.getElementById("content-list");

  sliced.forEach((data, index) => {
    const container = document.createElement("div");
    container.className = "flex justify-between transition";

    // 🎨 Warna type
    let bgColor = "bg-red-100";
    let textColor = "text-red-700";
    if (data.type === "Income") {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    } else if (data.type === "Transfer") {
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
    }

    container.innerHTML = `
      <div class="relative group overflow-hidden w-full">
        <div class="h-auto p-4 gap-y-3 sm:gap-y-3 content flex flex-wrap bg-white transition-all duration-300">
          <div class="w-full sm:w-1/3">
            <p class="text-xs text-slate-400">#</p>
            <p class="text-sm font-medium">${start + index + 1}</p>
          </div>
          <div class="w-full sm:w-1/3">
            <p class="text-xs text-slate-400">Type</p>
            <span class="inline-block text-xs px-1.5 py-0.5 rounded ${bgColor} ${textColor} font-medium">
              ${data.type}
            </span>
          </div>
          <div class="w-full sm:w-1/3 hidden sm:flex"></div>
          <div class="w-full sm:w-1/3">
            <p class="text-xs text-slate-400">Category Name</p>
            <p class="text-sm font-medium">${data.name}</p>
          </div>
          <div class="w-full sm:w-1/3">
            <p class="text-xs text-slate-400">Insreted Date</p>
            <p class="text-sm font-medium">${data.inserted_date}</p>
          </div>
          <div class="w-full sm:w-1/3">
            <p class="text-xs text-slate-400">Updated Date</p>
            <p class="text-sm font-medium">${data.updated_date}</p>
          </div>
        </div>
        <div
          class="absolute right-0 top-0 h-full flex items-center bg-white translate-x-full transition-all duration-300 action-buttons">
          <button class="btn-edit flex items-center justify-center text-white w-16 h-full bg-yellow-500" data-id="${
            data.id
          }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button class="btn-delete flex items-center justify-center text-white w-16 h-full bg-red-500" data-id="${
            data.id
          }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    `;

    list.appendChild(container);

    const editBtn = container.querySelector(".btn-edit");
    editBtn.addEventListener("click", () => {
      openComponentModal({ mode: "edit", data });
    });

    const deleteBtn = container.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", () => {
      openDeleteModal(data.id);
    });

    const hammer = new Hammer(container.querySelector(".group"));
    const content = container.querySelector(".content");
    const buttons = container.querySelector(".action-buttons");

    let resetSwipeTimeout; // ⏱️ timer reset per item

    hammer.on("swipeleft", () => {
      content.classList.add("translate-x-[-8rem]");
      buttons.classList.remove("translate-x-full");

      clearTimeout(resetSwipeTimeout); // pastikan tidak dobel
      resetSwipeTimeout = setTimeout(() => {
        content.classList.remove("translate-x-[-8rem]");
        buttons.classList.add("translate-x-full");
      }, 1500); // ⏱️ 1,5 detik
    });

    hammer.on("swiperight", () => {
      content.classList.remove("translate-x-[-8rem]");
      buttons.classList.add("translate-x-full");

      clearTimeout(resetSwipeTimeout);
    });
  });

  currentPage++;
  const seeMoreBtn = document.getElementById("see-more-btn");

  if (currentPage * itemsPerPage >= rawData.length) {
    seeMoreBtn.classList.add("hidden");
  } else {
    seeMoreBtn.classList.remove("hidden");
  }
}

function openComponentModal({ mode = "create", data = {} }) {
  const isEdit = mode === "edit";
  const now = new Date().toISOString();
  const modalTitle = isEdit ? "Edit Category" : "Add New Category";

  openModal({
    title: modalTitle,
    content: `
      <form id="formContent" class="space-y-4">
       <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Type</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none"> 
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" /> 
              </svg>
              <select id="typeSelect" data-placeholder="Select Type" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                <option></option>
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Category Name</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <input type="text" id="name" class="w-full border rounded-lg p-2.5 pl-10 text-sm" placeholder="Input name..." />
            </div>
          </div>
        </div>
      </form>
    `,
    onSubmit: () => {
      const name = $("#name").val();
      const type = $("#typeSelect").val();

      if (!name) {
        alert("Content name is required.");
        return;
      }

      const payload = {
        name,
        type,
        updated_date: now,
      };

      if (isEdit) {
        payload.action = "category_update";
        payload.category_id = data.id;
      } else {
        payload.action = "category_create";
        payload.inserted_date = now;

        const lastId = rawData.length > 0 ? rawData[0].id : null;
        let newId = "CAT-001";

        if (lastId && /^CAT-\d+$/.test(lastId)) {
          const lastNumber = parseInt(lastId.split("-")[1], 10);
          const nextNumber = lastNumber + 1;
          newId = `CAT-${String(nextNumber).padStart(3, "0")}`;
        }
        payload.category_id = newId;
      }

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
          loadCategories();
          showToast(
            isEdit
              ? "Category updated successfully"
              : "Category added successfully"
          );
        })
        .catch((err) => {
          console.error("❌ Gagal mengirim:", err);
          alert("Terjadi kesalahan saat menyimpan data.");
        });
    },
  });

  setTimeout(() => {
    document.getElementById("name").value = data.name || "";

    // Load data typeSelect
    const $typeSelect = $("#typeSelect");

    $typeSelect.select2({
      width: "100%",
      dropdownParent: $typeSelect.closest(".relative"),
      placeholder: $typeSelect.attr("data-placeholder") || "Select Type",
    });

    // Setelah inisialisasi baru set value-nya
    if (isEdit && data.type) {
      $typeSelect.val(data.type).trigger("change");
    }
  }, 100);
}

function openDeleteModal(data) {
  openModal({
    title: "Confirm Delete",
    content: `
      <p class="text-sm text-slate-600">Are you sure you want to delete this category?</p>
    `,
    onSubmit: () => {
      const payload = {
        action: "category_delete",
        category_id: data,
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
          loadCategories();
          showToast("Category deleted successfully");
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
  await loadCategories();
}

document.addEventListener("DOMContentLoaded", initApp);
