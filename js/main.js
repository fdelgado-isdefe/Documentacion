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
        addCopyButtons();     // Añadir botones "Copiar" a bloques <pre>
        setActiveLink(file);
      })
      .catch(() => {
        content.innerHTML = "<p><em>Error al cargar el contenido.</em></p>";
      });
  }

  // Añade botones "Copiar" a cada bloque <pre> renderizado
  function addCopyButtons() {
    document.querySelectorAll('#markdown-content pre').forEach(pre => {
      // Evitar añadir botón varias veces
      if (pre.parentElement.classList.contains('code-block')) return;

      // Crear wrapper para el bloque de código y botón
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      // Insertar wrapper antes del <pre> y mover <pre> dentro
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Crear botón copiar
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copiar';
      btn.setAttribute('aria-label', 'Copiar código');
      wrapper.insertBefore(btn, pre);

      // Evento para copiar texto al portapapeles
      btn.addEventListener('click', () => {
        const code = pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = '¡Copiado!';
          setTimeout(() => {
            btn.textContent = 'Copiar';
          }, 2000);
        }).catch(() => {
          btn.textContent = 'Error';
        });
      });
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
