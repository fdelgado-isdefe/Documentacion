// Requiere la librería marked.js cargada (puedes incluirla con CDN si no la tienes)

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const content = document.getElementById("markdown-content");

  // Función para cargar archivo markdown y mostrarlo convertido a HTML
  function loadMarkdown(file) {
    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el archivo");
        return res.text();
      })
      .then((text) => {
        content.innerHTML = marked.parse(text);
        setActiveLink(file);
      })
      .catch(() => {
        content.innerHTML = "<p><em>Error al cargar el contenido.</em></p>";
      });
  }

  // Resalta el enlace activo en el menú
  function setActiveLink(file) {
    const links = menu.querySelectorAll("a");
    links.forEach((link) => {
      if (link.dataset.file === file) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Manejar click en enlaces del menú
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const file = e.target.dataset.file;
      if (file) {
        loadMarkdown(file);
      }
    }
  });

  // Cargar el archivo de inicio por defecto
  loadMarkdown("archivos/inicio.md");
});
