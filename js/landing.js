document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll para enlaces con #
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Comportamiento para boton WhatsApp
  document.querySelectorAll(".btn-whatsapp").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");

      // abrir WhatsApp en nueva pestaña (o en la misma si el navegador lo bloquea)
      const opened = window.open(href, "_blank");

      // Mostrar toast indicando lo que pasó
      if (opened) {
        showToast("Se abrió WhatsApp ✅ Te redirigimos...");
      } else {
        // si el popup fue bloqueado, informar y cambiar la ubicación actual
        showToast("Redirigiendo a WhatsApp...");
        window.location.href = href;
      }

      // registro en consola (útil para analytics)
      console.log("WhatsApp click:", href);
    });
  });

  // pequeña función de toast (no requiere CSS externo)
  function showToast(message, duration = 3000) {
    // crear contenedor si no existe
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      Object.assign(container.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "flex-end",
      });
      document.body.appendChild(container);
    }

    // crear toast
    const t = document.createElement("div");
    t.className = "landing-toast";
    t.textContent = message;

    // estilo inline (se puede mover a CSS si prefieres)
    Object.assign(t.style, {
      background: "#111",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "10px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
      fontSize: "14px",
      opacity: "0",
      transform: "translateY(6px)",
      transition: "opacity 300ms ease, transform 300ms ease"
    });

    container.appendChild(t);

    // trigger anim
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateY(0)";
    });

    // hide after duration
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(6px)";
      setTimeout(() => t.remove(), 350);
    }, duration);
  }
});
