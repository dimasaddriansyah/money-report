const API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/investations!A2:G?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

let rawData = [];
let swiperInstance;
let currentPage = 0;
const itemsPerPage = 10;

async function loadInvestations() {
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
      list.innerHTML = `<li class="py-3 text-center text-slate-400">Tidak ada data investation.</li>`;
      return;
    }

    rawData = rows
      .map((row) => ({
        id: row[0],
        payment_date: row[1],
        type: row[2],
        platform: row[3],
        portfolio: row[4],
        product: row[5],
        nominal: row[6],
      }))
      .sort((a, b) => {
        const dateA = Date.parse(a.payment_date); // e.g. "02 July 2025 16:12:41"
        const dateB = Date.parse(b.payment_date);
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

function renderNextContents(filterPortfolio = null) {
  let dataToRender = rawData;

  // 🔍 Filter kalau ada portfolio yang dipilih
  if (filterPortfolio) {
    dataToRender = rawData.filter((d) => d.portfolio === filterPortfolio);
  }

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const sliced = dataToRender.slice(start, end);
  const list = document.getElementById("content-list");

  sliced.forEach((data, index) => {
    const container = document.createElement("div");
    container.className = "flex justify-between transition";

    let bgColor = "bg-red-100";
    let textColor = "text-red-700";

    if (data.type === "Buy") {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
    }

    container.innerHTML = `
      <div class="relative group overflow-hidden w-full">
        <div class="h-auto p-4 gap-y-3 sm:gap-y-3 content flex flex-wrap bg-white transition-all duration-300">
          <div class="w-full sm:w-1/3">
            <p class="text-xs text-slate-400">#</p>
            <p class="text-sm font-medium">${start + index + 1}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Type</p>
            <span class="inline-block text-xs px-1.5 py-0.5 rounded ${bgColor} ${textColor} font-medium">
              ${data.type}
            </span>
          </div>
          <div class="w-1/2 sm:w-1/3 hidden sm:flex"></div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Payment Date</p>
            <p class="text-sm font-medium">${data.payment_date}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Platform</p>
            <p class="text-sm font-medium">${data.platform}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Portfolio</p>
            <p class="text-sm font-medium">${data.portfolio}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Product</p>
            <p class="text-sm font-medium">${data.product}</p>
          </div>
          <div class="w-1/2 sm:w-1/3">
            <p class="text-xs text-slate-400">Nominal</p>
            <p class="text-sm font-medium">${data.nominal}</p>
          </div>
        </div>
        <div class="absolute right-0 top-0 h-full flex items-center bg-white translate-x-full transition-all duration-300 action-buttons">
          <button class="btn-edit flex items-center justify-center text-white w-16 h-full bg-yellow-500" data-id="${
            data.id
          }">
            ✏️
          </button>
          <button class="btn-delete flex items-center justify-center text-white w-16 h-full bg-red-500" data-id="${
            data.id
          }">
            🗑
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
  });

  currentPage++;
  const seeMoreBtn = document.getElementById("see-more-btn");
  if (currentPage * itemsPerPage >= dataToRender.length) {
    seeMoreBtn.classList.add("hidden");
  } else {
    seeMoreBtn.classList.remove("hidden");
  }
}

function renderCardSlides(cards) {
  const wrapper = document.getElementById("slide-wrapper");
  const contentTitle = document.querySelector("#content-section h2");

  wrapper.innerHTML = "";

  // Total Balance dengan nominal dari seluruh kartu
  const totalBalance = cards.reduce((sum, item) => {
    return sum + parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);
  }, 0);

  // Hitung total max value berdasarkan portfolio
  const maxValues = {
    "Married Saving": 85000000,
    Retirement: 800000000,
  };

  const totalMaxValues = Object.values(maxValues).reduce(
    (sum, value) => sum + value,
    0
  );

  // Hitung persen total
  let totalPercent = (totalBalance / totalMaxValues) * 100;
  if (totalPercent > 100) totalPercent = 100;

  // Slide total balance
  const totalSlide = document.createElement("div");
  totalSlide.className =
    "swiper-slide rounded-xl bg-slate-800 p-4 shadow space-y-10 text-white transition hover:bg-slate-700 hover:cursor-pointer";

  totalSlide.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:justify-between">
      <div class="order-2 sm:order-1 pt-2 sm:pt-0">
        <span class="text-sm text-slate-400">All Balance</span>
        <h1 class="text-lg font-bold text-white">
          Rp ${totalBalance.toLocaleString("en-US")}
        </h1>
      </div>
      <div class="w-7 h-7">
        <img src="assets/img/icons/Money.png" alt="All Investments" class="w-full h-full object-contain">
      </div>
    </div>
    <div class="w-full">
      <div class="flex justify-between text-xs font-semibold text-slate-400 mb-1">
        <span>Rp 0</span>
        <span>Rp ${totalMaxValues.toLocaleString("en-US")}</span>
      </div>
      <div class="relative w-full h-3 overflow-hidden text-xs font-medium rounded-full bg-slate-100">
        <div class="h-full bg-green-200 rounded-full transition-all duration-300" style="width: ${totalPercent}%"></div>
        <div class="absolute inset-0 flex items-center justify-center text-green-700 text-[10px] font-bold">
          ${totalPercent.toFixed(2)}%
        </div>
      </div>
    </div>
  `;

  totalSlide.addEventListener("click", () => {
    // Hapus highlight semua card
    document.querySelectorAll(".swiper-slide").forEach((s) => {
      s.classList.remove("bg-slate-200", "border", "border-slate-400");
      s.classList.add(s === totalSlide ? "bg-slate-800" : "bg-white");
    });

    // Reset title & filter
    contentTitle.innerHTML = `List of Investations`;
    currentFilter = null;

    // Reset halaman & tampilkan semua data
    currentPage = 0;
    document.getElementById("content-list").innerHTML = "";
    renderNextContents(null);
  });

  wrapper.appendChild(totalSlide);

  // Group cards by platform-portfolio
  const grouped = cards.reduce((investation, item) => {
    const key = `${item.platform}-${item.portfolio}`;
    if (!investation[key]) {
      investation[key] = {
        platform: item.platform,
        portfolio: item.portfolio,
        totalNominal: 0,
      };
    }

    const nominalValue = parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);

    if (item.type === "Buy") {
      investation[key].totalNominal += nominalValue;
    } else if (item.type === "Sell") {
      investation[key].totalNominal -= nominalValue;
    }
    return investation;
  }, {});

  // Slide per investasi
  Object.values(grouped).forEach((item) => {
    const maxValue = maxValues[item.portfolio] || 1;

    // Hitung persen
    let percent = (item.totalNominal / maxValue) * 100;
    if (percent > 100) percent = 100; // biar gak lebih dari 100%

    const slide = document.createElement("div");
    slide.className =
      "swiper-slide rounded-xl bg-white p-4 shadow space-y-10 text-slate-800 transition hover:bg-slate-50 hover:cursor-pointer";

    slide.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:justify-between">
        <div class="order-2 sm:order-1 pt-2 sm:pt-0">
          <span class="text-sm text-slate-400">${item.portfolio}</span>
          <h1 class="text-lg font-bold text-slate-800">
            ${"Rp " + item.totalNominal.toLocaleString("en-US")}
          </h1>
        </div>
        <div class="w-14 h-7">
          <img src="${getPlatformURL(item.platform)}" 
            alt="${item.platform}" class="w-full h-full object-contain">
        </div>
      </div>
      <div class="w-full">
        <div class="flex justify-between text-xs font-semibold text-slate-500 mb-1">
          <span>Rp 0</span>
          <span>${"Rp " + maxValue.toLocaleString("en-US")}</span>
        </div>
        <div class="relative w-full h-3 overflow-hidden text-xs font-medium rounded-full bg-slate-100">
          <div class="h-full bg-green-200 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
          <div class="absolute inset-0 flex items-center justify-center text-green-700 text-[10px] font-bold">
            ${percent.toFixed(2)}%
          </div>
        </div>
      </div>
    `;

    slide.addEventListener("click", () => {
      // Hapus highlight dari semua card kecuali totalSlide
      document.querySelectorAll(".swiper-slide").forEach((s) => {
        if (s !== totalSlide) {
          s.classList.remove("bg-slate-200", "border", "border-slate-400");
          s.classList.add("bg-white");
        }
      });

      // Highlight card terpilih
      slide.classList.remove("bg-white");
      slide.classList.add("bg-slate-200", "border", "border-slate-400");

      // Update title
      contentTitle.innerHTML = `List of Investations <span class="text-blue-500">${item.portfolio}</span>`;

      // Update list transaksi sesuai portfolio
      renderNextContents(item.portfolio);
    });

    wrapper.appendChild(slide);
  });

  // Destroy dan re-inisialisasi swiper agar slide baru dikenali
  if (swiperInstance) swiperInstance.destroy(true, true);

  swiperInstance = new Swiper(".mySwiper", {
    spaceBetween: 16,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
    },
  });
}

async function loadPlatforms() {
  const platformSelect = document.getElementById("platformSelect");
  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/platforms!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

  const resetSelect = (select) => {
    select.innerHTML = "<option></option>";
  };

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    // Reset isi select
    resetSelect(platformSelect);

    rows.forEach((row) => {
      const value = row[1];
      if (value) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        platformSelect.appendChild(option);
      }
    });

    // Apply Select2 ulang
    [platformSelect].forEach((select) => {
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
    console.error("Gagal memuat platform options:", err);
  }
}

async function loadPortfolios() {
  const portfolioSelect = document.getElementById("portfolioSelect");
  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/portfolios!A2:D?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

  const resetSelect = (select) => {
    select.innerHTML = "<option></option>";
  };

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    // Reset isi select
    resetSelect(portfolioSelect);

    rows.forEach((row) => {
      const value = row[1];
      if (value) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        portfolioSelect.appendChild(option);
      }
    });

    // Apply Select2 ulang
    [portfolioSelect].forEach((select) => {
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
    console.error("Gagal memuat portfolio options:", err);
  }
}

function openComponentModal({ mode = "create", data = {} }) {
  const isEdit = mode === "edit";
  const now = new Date().toISOString();
  const modalTitle = isEdit ? "Edit Investation" : "Add New Investation";

  openModal({
    title: modalTitle,
    content: `
      <form id="formContent" class="space-y-4">
      ${
        isEdit
          ? `
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Status</label>
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>
                <select id="typeSelect" data-placeholder="Select Status" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                  <option></option>
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
              </div>
            </div>`
          : ""
      }
       <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Platform</label>
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                <select id="platformSelect" data-placeholder="Select Platform" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                  <option></option>
                </select>
              </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Portfolio</label>
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                </svg>
                <select id="portfolioSelect" data-placeholder="Select Portfolio" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                  <option></option>
                </select>
              </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Product</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <input type="text" id="product" class="w-full border rounded-lg p-2.5 pl-10 text-sm" placeholder="Input product..." />
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
      const loanSelect = $("#loanSelect").val();
      const product = $("#product").val();
      const type = $("#typeSelect").val();
      const nominal = $("#nominal").val();

      if (!product) {
        alert("Content product is required.");
        return;
      }

      const payload = {
        loanSelect,
        product,
        nominal: parseFloat(nominal.replace(/[^0-9.-]+/g, "")) || 0,
        updated_date: now,
      };

      if (isEdit) {
        payload.action = "investation_update";
        payload.investation_id = data.id;
        payload.type = type;
      } else {
        payload.action = "investation_create";
        payload.type = "Unpaid";
        payload.inserted_date = now;

        const lastId = rawData.length > 0 ? rawData[0].id : null;
        let newId = "BILL-001";

        if (lastId && /^BILL-\d+$/.test(lastId)) {
          const lastNumber = parseInt(lastId.split("-")[1], 10);
          const nextNumber = lastNumber + 1;
          newId = `BILL-${String(nextNumber).padStart(3, "0")}`;
        }
        payload.investation_id = newId;
      }

      console.log(payload);

      // fetch(
      //   "https://script.google.com/macros/s/AKfycbzEvDfgqxBzvJIk1-_i4JfihTbq_u-_cEayKu5nVSlPxG_p_bIi5WLL2ESo879Ybe7unw/exec",
      //   {
      //     method: "POST",
      //     body: JSON.stringify(payload),
      //     headers: {
      //       "Content-Type": "text/plain",
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then(() => {
      //     closeModal();
      //     loadInvestations();
      //     showToast(
      //       isEdit ? "Investation updated successfully" : "Investation added successfully"
      //     );
      //   })
      //   .catch((err) => {
      //     console.error("❌ Gagal mengirim:", err);
      //     alert("Terjadi kesalahan saat menyimpan data.");
      //   });
    },
  });

  setTimeout(() => {
    document.getElementById("product").value = data.product || "";
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

    // Load data platforms
    loadPlatforms().then(() => {
      if (isEdit) {
        $("#platformSelect").val(data.platform).trigger("change");
      }
    });

    // Load data portfolios
    loadPortfolios().then(() => {
      if (isEdit) {
        $("#portfolioSelect").val(data.portfolio).trigger("change");
      }
    });

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
      <p class="text-sm text-slate-600">Are you sure you want to delete this investation?</p>
    `,
    onSubmit: () => {
      const payload = {
        action: "investation_delete",
        investation_id: data,
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
          loadInvestations();
          showToast("Investation deleted successfully");
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
  await loadInvestations();
}

document.addEventListener("DOMContentLoaded", initApp);
