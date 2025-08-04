const API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/portfolios!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

let allData = [];
let currentPage = 0;
const itemsPerPage = 10;

async function loadPortfolios() {
  const loadingText = document.getElementById("loading-text");
  const seeMoreBtn = document.getElementById("see-more-btn");
  const list = document.getElementById("content-list");

  try {
    loadingText.classList.remove("hidden");
    seeMoreBtn.classList.add("hidden");

    const res = await fetch(API_URL);
    const data = await res.json();
    const rows = data.values || [];
    console.log(rows);

    if (rows.length === 0) {
      list.innerHTML = `<li class="py-3 text-center text-slate-400">Tidak ada data portfolio.</li>`;
      return;
    }

    allData = rows
      .map((row) => ({
        id: row[0],
        name: row[1],
        inserted_date: row[2],
        updated_date: row[3],
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
  const sliced = allData.slice(start, end);
  const list = document.getElementById("content-list");

  sliced.forEach((data, index) => {
    const container = document.createElement("div");
    container.className = "flex justify-between transition";

    container.innerHTML = `
      <div class="relative group overflow-hidden w-full">
        <div class="sm:h-auto p-4 content grid grid-cols-1 gap-y-2 sm:grid-cols-[3rem_1fr_1fr_1fr] sm:items-center sm:gap-2 transition-all duration-300 bg-white">
          <div class="flex flex-col items-start">
            <p class="text-xs text-slate-400">#</p>
            <p class="text-sm font-medium">${start + index + 1}</p>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-xs text-slate-400">Portfolio Name</p>
            <p class="text-sm font-medium">${data.name}</p>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-xs text-slate-400">Inserted Date</p>
            <p class="text-sm font-medium">${data.inserted_date}</p>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-xs text-slate-400">Updated Date</p>
            <p class="text-sm font-medium">${data.updated_date}</p>
          </div>
        </div>
        <div class="absolute right-0 top-0 h-full flex items-center bg-white translate-x-full transition-all duration-300 action-buttons">
          <button class="flex items-center justify-center text-white w-16 h-full bg-yellow-500" 
            onclick='openComponentModal({ 
              mode: "edit", 
              data: { 
                id: "${data.id}", 
                name: "${data.name}" 
              }})'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button class="flex items-center justify-center text-white w-16 h-full bg-red-500"
            onclick='openDeleteModal("${data.id}")'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    `;

    list.appendChild(container);

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

  if (currentPage * itemsPerPage >= allData.length) {
    seeMoreBtn.classList.add("hidden");
  } else {
    seeMoreBtn.classList.remove("hidden");
  }
}

function openComponentModal({ mode = "create", data = {} }) {
  const isEdit = mode === "edit";
  const now = new Date().toISOString();
  const modalTitle = isEdit ? "Edit Portfolio" : "Add New Portfolio";
  const defaultName = data.name || "";

  openModal({
    title: modalTitle,
    content: `
      <form id="portfolioForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Portfolio Name</label>
          <input type="text" id="name" name="name" value="${defaultName}"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" />
        </div>
      </form>
    `,
    onSubmit: () => {
      const name = document.getElementById("name").value.trim();

      if (!name) {
        alert("Portfolio name is required.");
        return;
      }

      const payload = {
        name,
        updated_date: now,
      };

      if (isEdit) {
        payload.action = "portfolio_update";
        payload.portfolio_id = data.id;
      } else {
        payload.action = "portfolio_create";
        payload.inserted_date = now;

        const lastId = allData.length > 0 ? allData[0].id : null;
        let newId = "PORTFOLIO-001";

        if (lastId && /^PORTFOLIO-\d+$/.test(lastId)) {
          const lastNumber = parseInt(lastId.split("-")[1], 10);
          const nextNumber = lastNumber + 1;
          newId = `PORTFOLIO-${String(nextNumber).padStart(3, "0")}`;
        }

        payload.portfolio_id = newId;
      }

      console.log("📦 Sending:", payload);

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
          loadPortfolios();
          showToast(
            isEdit
              ? "Portfolio updated successfully"
              : "Portfolio added successfully"
          );
        })
        .catch((err) => {
          console.error("❌ Gagal mengirim:", err);
          alert("Terjadi kesalahan saat menyimpan data.");
        });
    },
  });
}

function openDeleteModal(portfolio_id) {
  openModal({
    title: "Confirm Delete",
    content: `
      <p class="text-sm text-slate-600">Are you sure you want to delete this portfolio?</p>
    `,
    onSubmit: () => {
      const payload = {
        action: "portfolio_delete",
        portfolio_id: portfolio_id,
      };

      console.log("🗑️ Deleting:", payload);

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
          loadPortfolios();
          showToast("Portfolio deleted successfully");
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
  await loadPortfolios();
}

document.addEventListener("DOMContentLoaded", initApp);
