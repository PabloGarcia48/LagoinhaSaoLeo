const whatsappNumber = "5551995888855";
const copyPixButton = document.querySelector("[data-copy-pix]");
const pixKey = document.querySelector("#pix-key")?.textContent?.trim();
const prayerForm = document.querySelector("[data-prayer-form]");

copyPixButton?.addEventListener("click", async () => {
  if (!pixKey) return;

  try {
    await navigator.clipboard.writeText(pixKey);
    copyPixButton.textContent = "Chave copiada";
  } catch {
    copyPixButton.textContent = pixKey;
  }

  window.setTimeout(() => {
    copyPixButton.textContent = "Copiar chave Pix";
  }, 2200);
});

prayerForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(prayerForm);
  const name = formData.get("name")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!message) return;

  const text = [
    "Olá, vim pelo site da Lagoinha São Leopoldo.",
    name ? `Meu nome é ${name}.` : "",
    "Gostaria de deixar um pedido de oração:",
    message,
  ]
    .filter(Boolean)
    .join("\n\n");

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
});
