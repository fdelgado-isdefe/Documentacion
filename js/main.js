document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[data-file]");
  const content = document.getElementById("markdown-content");

  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const file = link.getAttribute("data-file");
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("No se pudo cargar el archivo");
        const text = await res.text();
        content.innerHTML = marked.parse(text);
      } catch (err) {
        content.innerHTML = "<p style='color:red;'>⚠️ Error al cargar el archivo.</p>";
      }
    });
  });
});
