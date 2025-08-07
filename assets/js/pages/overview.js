const API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/newReport!A2:K?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

let allGroupedData = [];
let currentPage = 0;
let lastRenderedDate = "";
let swiperInstance;

async function loadTransactions() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const rows = data.values || [];

    if (rows.length === 0) {
      document.getElementById("transaction-list").innerHTML =
        '<li class="py-3 text-center text-slate-400">Tidak ada transaksi.</li>';
      return;
    }

    rawData = rows
      .map((row) => ({
        id: row[0],
        day: row[1],
        date: row[2],
        type: row[3],
        payment: row[4],
        category: row[5],
        remark: row[6],
        nominal: row[7] || "0",
        isTransfer: row[8],
        transferFrom: row[9] || null,
        transferTo: row[10] || null,
      }))
      .sort((a, b) => {
        const dateA = Date.parse(a.date); // e.g. "02 July 2025 16:12:41"
        const dateB = Date.parse(b.date);
        return dateB - dateA; // Descending: terbaru dulu
      });

    allGroupedData = rawData;
    currentPage = 0;
    document.getElementById("transaction-list").innerHTML = "";
    renderNextContents();

    const paymentSummary = calculatePaymentSummary(allGroupedData);
    renderPaymentSlides(paymentSummary);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    document.getElementById("transaction-list").innerHTML =
      '<li class="py-3 text-center text-red-500">Gagal memuat data</li>';
  }
}

function renderNextContents() {
  const slicedData = allGroupedData.slice(0, 10);

  if (slicedData.length === 0) return;

  const list = document.getElementById("transaction-list");
  const grouped = {};

  slicedData.forEach((data) => {
    const date = new Date(data.date);
    // Mendapatkan nama hari, misal "Sunday"
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    // Mendapatkan tanggal dalam format "02 August 2025"
    const enDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const [month, dayWithComma, year] = enDate.split(" ");
    const day = dayWithComma.replace(",", "");

    // Gabungkan jadi format lengkap: "Sunday, 02 August 2025"
    const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;

    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(data);
  });

  Object.keys(grouped)
    .sort((a, b) => {
      const dateA = Date.parse(a.date); // e.g. "02 July 2025 16:12:41"
      const dateB = Date.parse(b.date);
      return dateB - dateA; // Descending: terbaru dulu
    })
    .forEach((formattedDate, index) => {
      const isSameAsLast = formattedDate === lastRenderedDate;

      if (!isSameAsLast) {
        const header = document.createElement("div");
        header.className = `text-sm text-slate-500 p-3 bg-slate-100`;

        header.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-500">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1
                2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18
                0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21
                18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25
                9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12
                15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75
                15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5
                15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0
                2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0
                2.25h.008v.008H16.5V15Z" />
            </svg>
            <span class="font-medium">${formattedDate}</span>
          </div>
        `;
        list.appendChild(header);
        lastRenderedDate = formattedDate;
      }

      grouped[formattedDate].forEach((data) => {
        const container = document.createElement("div");
        container.className = "flex justify-between transition";

        container.innerHTML = `
          <div class="relative group overflow-hidden w-full ">
            <div
              class="h-28 px-4 transaction-content flex justify-between items-center transition-all duration-300 bg-white">
              <div class="flex flex-col">
                <div class="w-12 h-8 flex-shrink-0">
                  <img src="${getPaymentURL(data.payment)}" 
                  alt="${data.payment}" class="w-full h-full object-contain">
                </div>
                <div>
                  <p class="font-medium">${data.category}</p>
                  <p class="text-sm text-slate-400">${data.remark}</p>
                </div>
              </div>
              <span class="font-semibold 
                ${data.type === "Income" ? "text-green-500" : "text-red-500"}">
                ${data.type === "Income" ? "+" : "-"} ${data.nominal}
              </span>
            </div>
            <!-- Tombol Edit/Delete -->
            <div
              class="absolute right-0 top-0 h-full flex items-center bg-white translate-x-full transition-all duration-300 action-buttons">
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

        const editBtn = container.querySelector(".btn-edit");
        editBtn.addEventListener("click", () => {
          openComponentModal({ mode: "edit", data });
        });

        const deleteBtn = container.querySelector(".btn-delete");
        deleteBtn.addEventListener("click", () => {
          openDeleteModal(data.id);
        });

        const hammer = new Hammer(container.querySelector(".group"));
        const content = container.querySelector(".transaction-content");
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
    });
}

function calculatePaymentSummary(transactions) {
  const summary = {};

  transactions.forEach((data) => {
    const nominal = parseInt(data.nominal.replace(/[^0-9]/g, ""), 10) || 0;
    const payment = data.payment;

    if (!summary[data.payment]) {
      summary[data.payment] = {
        income: 0,
        expenses: 0,
        transferIn: 0,
        transferOut: 0,
      };
    }

    if (data.type === "Income" && data.isTransfer !== "Y") {
      summary[payment].income += nominal;
    } else if (data.type === "Expenses") {
      summary[payment].expenses += nominal;
    } else if (data.type === "Transfer" && data.isTransfer === "Y") {
      // Transfer Out
      summary[payment].transferOut += nominal;

      // Transfer In (penerima)
      const to = data.transferTo;
      if (to && !summary[to]) {
        summary[to] = { income: 0, expenses: 0, transferIn: 0, transferOut: 0 };
      }
      if (to) summary[to].transferIn += nominal;
    }
  });

  // Ubah ke array dan hitung balance numerik
  const result = Object.keys(summary).map((payment) => {
    const { income, expenses, transferIn, transferOut } = summary[payment];
    const balance = income - expenses + transferIn - transferOut;

    return {
      payment,
      image: getPaymentURL(payment),
      balance,
      expenses,
      income,
      transferIn,
    };
  });

  // Urutkan dari balance terbesar ke terkecil
  result.sort((a, b) => b.balance - a.balance);

  // Format angka setelah diurutkan
  return result.map((item) => ({
    ...item,
    balance: item.balance.toLocaleString("en-US"),
    expenses: item.expenses.toLocaleString("en-US"),
    income: item.income.toLocaleString("en-US"),
  }));
}

function renderPaymentSlides(paymentSummary) {
  const wrapper = document.getElementById("slide-wrapper");
  wrapper.innerHTML = "";

  // 🚫 Filter: Buang data dengan payment = "Investment"
  const filteredSummary = paymentSummary.filter(
    (item) => item.payment !== "Investment"
  );

  // 🔢 Hitung total balance dari payment yang tersisa
  const totalBalance = filteredSummary.reduce((sum, item) => {
    return sum + parseInt(item.balance.replace(/[^0-9]/g, ""), 10);
  }, 0);

  // 💳 Tambahkan slide total balance paling depan
  const totalSlide = document.createElement("div");
  totalSlide.className =
    "swiper-slide rounded-xl bg-slate-800 p-4 shadow space-y-10 text-white transition hover:bg-slate-700 hover:cursor-default";

  totalSlide.innerHTML = `
    <div class="flex justify-between">
      <div>
        <span class="text-sm text-slate-200">Balance All Payments</span>
        <h1 class="text-lg font-bold text-white">Rp ${totalBalance.toLocaleString(
          "en-US"
        )}</h1>
      </div>
      <div class="w-7 h-7">
        <img src="assets/img/icons/Money.png" alt="All Payments" class="w-full h-full object-contain">
      </div>
    </div>
    <div class="w-full">
      <div class="w-full h-3 rounded-full bg-slate-600">
        <div class="w-full h-full bg-green-500 rounded-full"></div>
      </div>
    </div>
  `;
  wrapper.appendChild(totalSlide);

  // 🎞️ Tambahkan slide per payment yang bukan Investment
  filteredSummary.forEach((item) => {
    const slide = document.createElement("div");
    slide.className =
      "swiper-slide rounded-xl bg-white p-4 shadow space-y-10 transition hover:bg-slate-50 hover:cursor-pointer";

    const income =
      (parseInt(item.income.replace(/[^0-9]/g, ""), 10) || 0) + item.transferIn;
    const balance = parseInt(item.balance.replace(/[^0-9]/g, ""), 10) || 0;

    const percent =
      income > 0 ? Math.max(Math.round((balance / income) * 100), 0) : 0;

    // 🎨 Warna progress bar berdasarkan persentase
    let barColor = "bg-red-200";
    let textColor = "text-red-700";
    if (percent > 50) {
      barColor = "bg-green-200";
      textColor = "text-green-700";
    } else if (percent > 30) {
      barColor = "bg-yellow-200";
      textColor = "text-yellow-700";
    }

    slide.innerHTML = `
      <div class="flex justify-between">
        <div>
          <span class="text-sm text-slate-400">${item.payment}</span>
          <h1 class="text-lg font-bold text-slate-800">Rp ${item.balance}</h1>
        </div>
        <div class="w-14 h-7">
          <img src="${item.image}" alt="${item.payment}" class="w-full h-full object-contain">
        </div>
      </div>
      <div class="w-full">
        <div class="relative w-full h-3 overflow-hidden text-xs font-medium rounded-full bg-slate-100">
          <div class="h-full ${barColor} rounded-full transition-all duration-300" style="width: ${percent}%"></div>
          <div class="absolute inset-0 flex items-center justify-center ${textColor} text-[10px] font-bold">
            ${percent}%
          </div>
        </div>
      </div>
    `;

    wrapper.appendChild(slide);
  });

  // 🔄 Destroy & reinit swiper
  if (swiperInstance) swiperInstance.destroy(true, true);

  swiperInstance = new Swiper(".mySwiper", {
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
    },
  });
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

async function loadCategories(selectType = "") {
  const categorySelect = document.getElementById("categorySelect");
  const url =
    "https://sheets.googleapis.com/v4/spreadsheets/1VW5nKe4tt0kmqKRqM7mWEa7Ggbix20eip2pMQIt2CG4/values/categories!A2:E?key=AIzaSyBJk1OZ5Iyoc3udp6N72R5F70gg6wiossY";

  const resetSelect = (select) => {
    select.innerHTML = "<option></option>";
  };

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    // Reset isi select
    resetSelect(categorySelect);

    rows.forEach((row) => {
      const type = row[1];
      const value = row[2];
      if (value && (!selectType || type === selectType)) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        categorySelect.appendChild(option);
      }
    });

    // Apply Select2 ulang
    [categorySelect].forEach((select) => {
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
    console.error("Gagal memuat category options:", err);
  }
}

function openComponentModal({ mode = "create", data = {} }) {
  const isEdit = mode === "edit";
  const now = new Date().toISOString();
  const modalTitle = isEdit ? "Edit Transaction" : "Add New Transaction";

  openModal({
    title: modalTitle,
    content: `
      <form id="formContent" class="space-y-4">
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Category</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              <select id="categorySelect" data-placeholder="Select Category" class="select2-custom w-full border rounded-lg text-sm pl-10 py-2 bg-white text-slate-700">
                <option></option>
              </select>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Remark</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <input type="text" id="remark" class="w-full border rounded-lg p-2.5 pl-10 text-sm" placeholder="Input remark..." />
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
      const type = $("#typeSelect").val();
      const payment = $("#paymentSelect").val();
      const category = $("#categorySelect").val();
      const remark = $("#remark").val();
      const nominal = $("#nominal").val();

      if (!remark) {
        alert("Content product is required.");
        return;
      }

      const payload = {
        type,
        remark,
        payment_method: payment,
        category,
        nominal: parseFloat(nominal.replace(/[^0-9.-]+/g, "")) || 0,
      };

      if (isEdit) {
        payload.action = "transaction_update";
        payload.transaction_id = data.id;
      } else {
        payload.action = "transaction_create";
        payload.date = now;

        const lastId = rawData.length > 0 ? rawData[0].id : null;
        if (lastId && /^TRX-\d+$/.test(lastId)) {
          newId = "TRX-" + new Date().toISOString().replace(/[-:.TZ]/g, "");
        }
        payload.transaction_id = newId;
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
          loadTransactions();
          showToast(
            isEdit
              ? "Transaction updated successfully"
              : "Transaction added successfully"
          );
        })
        .catch((err) => {
          console.error("❌ Gagal mengirim:", err);
          alert("Terjadi kesalahan saat menyimpan data.");
        });
    },
  });

  setTimeout(() => {
    document.getElementById("remark").value = data.remark || "";
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

    // Inisialisasi select2 payments
    $("#paymentSelect").select2({
      placeholder: "Select Payment",
      width: "100%",
    });

    // Inisialisasi select2 categories
    $("#categorySelect").select2({
      placeholder: "Select Category",
      width: "100%",
    });

    // Load data typeSelect
    const $typeSelect = $("#typeSelect");

    $typeSelect.select2({
      width: "100%",
      dropdownParent: $typeSelect.closest(".relative"),
      placeholder: $typeSelect.attr("data-placeholder") || "Select Type",
    });

    $typeSelect.on("change", function () {
      const selected = $(this).val();
      loadCategories(selected);
    });

    // Setelah inisialisasi baru set value-nya
    if (isEdit && data.type) {
      $typeSelect.val(data.type).trigger("change");
    }

    // Load data payments
    loadPayments().then(() => {
      if (isEdit) {
        $("#paymentSelect").val(data.payment).trigger("change");
      }
    });

    // Load data categories
    loadCategories().then(() => {
      if (isEdit) {
        $("#categorySelect").val(data.category).trigger("change");
      }
    });
  }, 100);
}

function openDeleteModal(data) {
  openModal({
    title: "Confirm Delete",
    content: `
      <p class="text-sm text-slate-600">Are you sure you want to delete this transaction?</p>
    `,
    onSubmit: () => {
      const payload = {
        action: "transaction_delete",
        transaction_id: data,
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
          loadTransactions();
          showToast("Transaction deleted successfully");
        })
        .catch((err) => {
          console.error("❌ Gagal menghapus:", err);
          alert("Gagal menghapus data.");
        });
    },
  });
}

function dailyChart() {
  const dailyData = allGroupedData.filter((item) => item.type === "Expenses");

  const groupByDate = {};

  // fungsi bantu buat format tanggal "04 August"
  function formatDateLabel(dateStr) {
    const parts = dateStr.split(" "); // misal: ["04", "August", "2025", "14:20:31"]
    return parts[0] + " " + parts[1]; // "04 August"
  }

  // proses grouping
  dailyData.forEach((item) => {
    const dateLabel = formatDateLabel(item.date);
    const nominal = parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);

    if (!groupByDate[dateLabel]) {
      groupByDate[dateLabel] = 0;
    }
    groupByDate[dateLabel] += nominal;
  });

  // 3. Ubahkan object grouping ke array untuk chart
  const groupedArray = Object.keys(groupByDate).map((key) => ({
    dateLabel: key,
    totalNominal: groupByDate[key],
  }));

  // 4. Urutkan berdasarkan tanggal jika perlu (optional, karena string tanggal dan bulan)
  groupedArray.sort((a, b) => {
    // parsing ulang untuk sort by date sebenarnya
    const dateA = new Date(a.dateLabel + " 2025"); // asumsikan tahun 2025
    const dateB = new Date(b.dateLabel + " 2025");
    return dateA - dateB;
  });

  const chart = document.getElementById("dailyChart").getContext("2d");

  new Chart(chart, {
    type: "line",
    data: {
      labels: groupedArray.map((item) => item.dateLabel),
      datasets: [
        {
          label: "Expenses",
          data: groupedArray.map((item) => item.totalNominal),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3, // untuk lengkungan garis (smooth)
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Nominal (IDR)",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              // Format nominal dengan pemisah ribuan
              return (
                context.dataset.label +
                ": Rp " +
                context.parsed.y.toLocaleString("id-ID")
              );
            },
          },
        },
      },
    },
  });
}

function topChart() {
  const rawData = allGroupedData.filter((item) => item.type === "Expenses");

  // Group by remark dan hitung total nominal
  const groupedByRemark = rawData.reduce((remarks, item) => {
    const remark = item.remark;
    const nominal = parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);

    if (!remarks[remark]) {
      remarks[remark] = {
        remark: remark,
        totalNominal: 0,
      };
    }

    remarks[remark].totalNominal += nominal;
    return remarks;
  }, {});

  // Jika ingin hasil sebagai array, bukan objek
  const remarkGroup = Object.values(groupedByRemark).sort((a, b) => {
    return b.totalNominal - a.totalNominal;
  });

  const topData = remarkGroup.slice(0, 10);

  const chart = document.getElementById("topChart").getContext("2d");

  new Chart(chart, {
    type: "bar",
    data: {
      labels: topData.map((item) => item.remark),
      datasets: [
        {
          axis: "y",
          label: "Nominal",
          data: topData.map((item) => item.totalNominal),
          fill: false,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      indexAxis: "y",
    },
  });
}

function categoriesChart() {
  const categoriesData = allGroupedData.filter(
    (item) => item.type === "Expenses"
  );

  // Group by category dan hitung total nominal per kategori
  const groupedByCategory = categoriesData.reduce((categories, item) => {
    const category = item.category;
    const nominal = parseInt(item.nominal.replace(/[^0-9]/g, ""), 10);

    if (!categories[category]) {
      categories[category] = {
        category: category,
        totalNominal: 0,
      };
    }

    categories[category].totalNominal += nominal;
    return categories;
  }, {});

  // Jika ingin hasil sebagai array, bukan objek
  const categoriesGroup = Object.values(groupedByCategory);

  const chart = document.getElementById("categoriesChart").getContext("2d");
  new Chart(chart, {
    type: "doughnut",
    data: {
      labels: categoriesGroup.map((item) => item.category),
      datasets: [
        {
          axis: "y",
          label: "Nominal",
          data: categoriesGroup.map((item) => item.totalNominal),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom", // legend di bawah
        },
      },
    },
  });
}

async function initApp() {
  document.getElementById("addModalBtn").addEventListener("click", () => {
    openComponentModal({ mode: "create" });
  });
  await loadTransactions();
  dailyChart();
  topChart();
  categoriesChart();
}

document.addEventListener("DOMContentLoaded", initApp);
