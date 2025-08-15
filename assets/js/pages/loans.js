const API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/loans!A2:H?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

let rawData = [];
let swiperInstance;
let currentPage = 0;
const itemsPerPage = 10;

async function loadLoans() {
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
      list.innerHTML = `<li class="py-3 text-center text-slate-400">Tidak ada data loan.</li>`;
      return;
    }

    rawData = rows
      .map((row) => ({
        id: row[0],
        source_payment: row[1],
        target_payment: row[2],
        note: row[3],
        nominal: row[4],
        status: row[5],
        inserted_date: row[6],
        updated_date: row[7],
      }))
      .sort((a, b) => {
        // Sort status DESC (misal status adalah string, bisa disesuaikan jika numerik)
        if (a.status > b.status) return -1;
        if (a.status < b.status) return 1;
        const dateA = Date.parse(a.updated_date); // e.g. "02 July 2025 16:12:41"
        const dateB = Date.parse(b.updated_date);
        return dateB - dateA; // Descending: terbaru dulu
      });

    currentPage = 0;
    list.innerHTML = "";
    renderNextContents();
    renderCardSlides(rawData);
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

    // 🎨 Warna status
    let bgColor = "bg-red-100";
    let textColor = "text-red-700";
    if (data.status === "Paid") {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    }

    container.innerHTML = `
      <div class="relative group overflow-hidden w-full">
        <div class="h-auto p-4 gap-y-3 sm:gap-y-3 content flex flex-wrap bg-white transition-all duration-300">
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">#</p>
            <p class="text-sm font-medium">${start + index + 1}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Status</p>
            <span class="inline-block text-xs px-1.5 py-0.5 rounded ${bgColor} ${textColor} font-medium">
              ${data.status}
            </span>
          </div>
          <div class="w-full sm:w-1/3 hidden sm:flex"></div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Source Payment</p>
            <p class="text-sm font-medium">${data.source_payment}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Target Payment</p>
            <p class="text-sm font-medium">${data.target_payment}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Nominal</p>
            <p class="text-sm font-medium">${data.nominal}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Note</p>
            <p class="text-sm font-medium">${data.note}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Inserted Date</p>
            <p class="text-sm font-medium">${data.inserted_date}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Updated Date</p>
            <p class="text-sm font-medium">${data.updated_date}</p>
          </div>
        </div>
        <div class="absolute right-0 top-0 h-full flex items-center bg-white translate-x-full transition-all duration-300 action-buttons">
          <button class="btn-detail flex items-center justify-center text-white w-16 h-full bg-cyan-500" 
            data-id="${data.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
          <button class="btn-edit flex items-center justify-center text-white w-16 h-full bg-yellow-500" 
            data-id="${data.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
          <button class="btn-delete flex items-center justify-center text-white w-16 h-full bg-red-500" 
            data-id="${data.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    `;

    list.appendChild(container);

    const detailBtn = container.querySelector(".btn-detail");
    detailBtn.addEventListener("click", () => {
      openDetailModal(data);
    });

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

function renderCardSlides(cards) {
  const wrapper = document.getElementById("slide-wrapper");
  wrapper.innerHTML = "";

  // 🚫 Filter: Buang data dengan status = "Paid"
  const filteredCards = cards.filter((item) => item.status !== "Paid");

  // Total Balance dengan nominal dari seluruh kartu
  const totalBalance = filteredCards.reduce((sum, item) => {
    return sum + parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);
  }, 0);

  // Slide total balance
  const totalSlide = document.createElement("div");
  totalSlide.className =
    "swiper-slide rounded-xl bg-slate-800 p-4 shadow space-y-10 text-white";
  totalSlide.innerHTML = `
    <div class="flex justify-between">
      <div>
        <span class="text-sm text-slate-200">Total All Loans</span>
        <h1 class="text-lg font-bold text-white">
          Rp ${totalBalance.toLocaleString("en-US")}
        </h1>
      </div>
      <div class="w-7 h-7">
        <img src="assets/img/icons/Money.png" alt="All Loans" class="w-full h-full object-contain">
      </div>
    </div>
  `;
  wrapper.appendChild(totalSlide);

  // Group cards by loan_id
  const grouped = filteredCards.reduce((acc, item) => {
    const key = `${item.id}`;
    if (!acc[key]) {
      acc[key] = {
        id: item.id,
        note: item.note,
        target_payment: item.target_payment,
        totalNominal: 0,
      };
    }
    acc[key].totalNominal += parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);
    return acc;
  }, {});

  // Slide per investasi
  Object.values(grouped).forEach((item) => {
    const slide = document.createElement("div");
    slide.className =
      "swiper-slide rounded-xl bg-white p-4 shadow space-y-10 text-slate-800";

    slide.innerHTML = `
      <div class="flex justify-between">
        <div>
          <span class="text-sm text-slate-400">${item.note}</span>
          <h1 class="text-lg font-bold text-slate-800">
            ${"Rp " + item.totalNominal.toLocaleString("en-US")}
          </h1>
        </div>
        <div class="w-14 h-7">
          <img src="${getPaymentURL(item.target_payment)}" 
            alt="${item.target_payment}" class="w-full h-full object-contain">
        </div>
      </div>
      <div class="w-full">
        <div class="relative w-full h-3 overflow-hidden text-xs font-medium rounded-full bg-slate-100">
          <div class="h-full bg-red-100 rounded-full transition-all duration-300" style="width: 20%"></div>
          <div class="absolute inset-0 flex items-center justify-center text-red-700 text-[10px] font-bold">
            20%
          </div>
        </div>
      </div>
    `;

    wrapper.appendChild(slide);
  });

  // Destroy dan re-inisialisasi swiper agar slide baru dikenali
  if (swiperInstance) swiperInstance.destroy(true, true);

  swiperInstance = new Swiper(".mySwiper", {
    slidesPerGroup: 2,
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    },
  });
}

async function loadPayments() {
  const sourceSelect = document.getElementById("paymentSourceSelect");
  const targetSelect = document.getElementById("paymentTargetSelect");
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
    resetSelect(sourceSelect);
    resetSelect(targetSelect);

    rows.forEach((row) => {
      const value = row[1]; // Misal ambil dari kolom B (index 1)
      if (value) {
        const option1 = document.createElement("option");
        option1.value = value;
        option1.textContent = value;
        sourceSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = value;
        option2.textContent = value;
        targetSelect.appendChild(option2);
      }
    });

    // Apply Select2 ulang
    [sourceSelect, targetSelect].forEach((select) => {
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

async function loadBills() {
  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/bills!A2:F?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    return rows.map((row) => ({
      id: row[0],
      loan_id: row[1],
      payment_date: row[2],
      note: row[3],
      nominal: row[4],
      status: row[5],
    }));
  } catch (err) {
    console.error("Gagal memuat bills:", err);
    return [];
  }
}

function openComponentModal({ mode = "create", data = {} }) {
  const isEdit = mode === "edit";
  const now = new Date().toISOString();
  const modalTitle = isEdit ? "Edit Loan" : "Add New Loan";

  openModal({
    title: modalTitle,
    content: `
      <form id="formContent" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Source Payment</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <select id="paymentSourceSelect" data-placeholder="Select Payment" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                <option></option>
              </select>
            </div>
          </div>  
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Target Payment</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <select id="paymentTargetSelect" data-placeholder="Select Payment" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
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
              <input type="text" id="note" 
                class="w-full border rounded-lg p-2.5 pl-10 text-sm" placeholder="Input note..." />
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
      ${
        isEdit
          ? `
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Status</label>
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>
                <select id="statusSelect" data-placeholder="Select Status" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                  <option></option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>`
          : ""
      }
      </form>
    `,
    onSubmit: () => {
      const note = $("#note").val();
      const source_payment = $("#paymentSourceSelect").val();
      const target_payment = $("#paymentTargetSelect").val();
      const status = $("#statusSelect").val();
      const nominal = $("#nominal").val();

      if (!note) {
        alert("Content note is required.");
        return;
      }

      const payload = {
        source_payment,
        target_payment,
        note,
        nominal: parseFloat(nominal.replace(/[^0-9.-]+/g, "")) || 0,
        updated_date: now,
      };

      if (isEdit) {
        payload.action = "loan_update";
        payload.loan_id = data.id;
        payload.status = status;
      } else {
        payload.action = "loan_create";
        payload.status = "Unpaid";
        payload.inserted_date = now;

        const lastId = rawData.length > 0 ? rawData[0].id : null;
        let newId = "LOAN-001";

        if (lastId && /^LOAN-\d+$/.test(lastId)) {
          const lastNumber = parseInt(lastId.split("-")[1], 10);
          const nextNumber = lastNumber + 1;
          newId = `LOAN-${String(nextNumber).padStart(3, "0")}`;
        }
        payload.loan_id = newId;
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
          loadLoans();
          showToast(
            isEdit ? "Loan updated successfully" : "Loan added successfully"
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
        $("#paymentSourceSelect").val(data.source_payment).trigger("change");
        $("#paymentTargetSelect").val(data.target_payment).trigger("change");
      }
    });

    // Load data categories by statusSelect
    const $statusSelect = $("#statusSelect");

    $statusSelect.select2({
      width: "100%",
      dropdownParent: $statusSelect.closest(".relative"),
      placeholder: $statusSelect.attr("data-placeholder") || "Select Type",
    });

    // Setelah inisialisasi baru set value-nya
    if (isEdit && data.status) {
      $statusSelect.val(data.status).trigger("change");
    }
  }, 100);
}

async function openDetailModal(data) {
  const bills = await loadBills();

  // cari bill berdasarkan id
  const bill = bills.filter((value) => value.loan_id === data.id);

  if (bill.length > 0) {
    const contentHTML = `
      <div class="divide-y">
        ${bill
          .map(
            (bill, index) => `
              <div class="h-auto py-4 first:pt-0 gap-y-3 sm:gap-y-3 content flex flex-wrap bg-white transition-all duration-300">
                <div class="w-1/2 sm:w-1/3">
                  <p class="text-xs text-slate-400">#</p>
                  <p class="text-sm font-medium">${index + 1}</p>
                </div>
                <div class="w-1/2 sm:w-1/3">
                  <p class="text-xs text-slate-400">Status</p>
                  <span class="inline-block text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-500 font-medium">
                    ${bill.status}
                  </span>
                </div>
                <div class="w-full sm:w-1/3 hidden sm:flex"></div>
                <div class="w-1/2 sm:w-1/3">
                  <p class="text-xs text-slate-400">Payment Date</p>
                  <p class="text-sm font-medium">${bill.payment_date}</p>
                </div>
                <div class="w-1/2 sm:w-1/3">
                  <p class="text-xs text-slate-400">Nominal</p>
                  <p class="text-sm font-medium">${bill.nominal}</p>
                </div>
                <div class="w-1/2 sm:w-1/3">
                  <p class="text-xs text-slate-400">Note</p>
                  <p class="text-sm font-medium">${bill.note}</p>
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;

    openModal({
      title: `Detail ${data.id}`,
      content: contentHTML,
    });
  } else {
    openModal({
      title: `Detail Loan`,
      content: `
      <div class="flex flex-col items-center">
        <img src="assets/img/animation/empty.svg" width="200" height="200">
        <span class="text-slate-400 mt-2">Data tidak ditemukan</span>
      </div>
      `,
    });
  }
}

function openDeleteModal(data) {
  openModal({
    title: "Confirm Delete",
    content: `
      <p class="text-sm text-slate-600">Are you sure you want to delete this loan?</p>
    `,
    onSubmit: () => {
      const payload = {
        action: "loan_delete",
        loan_id: data,
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
          loadLoans();
          showToast("Loan deleted successfully");
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
  await loadLoans();
}

document.addEventListener("DOMContentLoaded", initApp);
