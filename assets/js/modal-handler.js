const modal = document.getElementById("modalComponent");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalSubmitBtn = document.getElementById("modalSubmitBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let modalAction = null;
let modalPayload = {};

function openModal({ title, content, onSubmit }) {
  modal.classList.remove("hidden");
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modalAction = onSubmit;
}

function closeModal() {
  modal.classList.add("hidden");
  modalTitle.textContent = "";
  modalBody.innerHTML = "";
  modalAction = null;
  modalPayload = {};
}

modalCancelBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
modalSubmitBtn.addEventListener("click", () => {
  if (typeof modalAction === "function") {
    modalAction();
  }
});
