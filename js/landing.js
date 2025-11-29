document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll para enlaces con #
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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
  document.querySelectorAll(".btn-whatsapp").forEach((btn) => {
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
      transition: "opacity 300ms ease, transform 300ms ease",
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

// === Control de reproducción automática en el carrusel lateral ===
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".left-carousel video");

  if (videos.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.55 } // se reproduce cuando está >50% visible
  );

  videos.forEach((vid) => observer.observe(vid));
});

// Reubicar y ajustar el video responsivo en móvil (consolidado)
(function () {
  const VIDEO_SELECTOR = ".video-carousel-container";
  const HEADER_SELECTOR = ".hero";
  const MOBILE_BREAKPOINT = 800; // sincronizado con CSS

  const container = document.querySelector(VIDEO_SELECTOR);
  const header = document.querySelector(HEADER_SELECTOR);
  if (!container || !header) return;

  const video = container.querySelector("video");
  const originalParent = container.parentNode;
  const originalNext = container.nextSibling;

  function setContainerHeightByAspect(aspectRatio) {
    const width =
      container.clientWidth || container.offsetWidth || window.innerWidth;
    const height = Math.round(width / aspectRatio);
    container.style.height = height + "px";
  }

  function enterMobileMode() {
    container.classList.add("video-mobile-mode");
    if (header.nextElementSibling !== container)
      header.parentNode.insertBefore(container, header.nextSibling);
    if (video) video.style.objectFit = "contain";

    const calcAspect = () => {
      const aspect =
        video && video.videoWidth && video.videoHeight
          ? video.videoWidth / video.videoHeight
          : 16 / 9;
      setContainerHeightByAspect(aspect);
    };

    if (video) {
      if (video.readyState >= 1) calcAspect();
      else video.addEventListener("loadedmetadata", calcAspect, { once: true });
    } else {
      // fallback: set approximate 16:9 based on container width
      setContainerHeightByAspect(16 / 9);
    }
  }

  function leaveMobileMode() {
    container.classList.remove("video-mobile-mode");
    // restaurar posición original si posible
    if (originalNext && originalNext.parentNode) {
      originalNext.parentNode.insertBefore(container, originalNext);
    } else if (originalParent) {
      originalParent.insertBefore(container, originalParent.firstChild);
    } else {
      document.body.insertBefore(container, document.body.firstChild);
    }
    // limpiar estilos inline
    container.style.height = "";
    if (video) video.style.objectFit = ""; // volver a CSS (cover)
  }

  const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  function update() {
    if (mq.matches) enterMobileMode();
    else leaveMobileMode();
  }

  update();
  if (mq.addEventListener) mq.addEventListener("change", update);
  else if (mq.addListener) mq.addListener(update);

  window.addEventListener("resize", () => {
    if (container.classList.contains("video-mobile-mode")) {
      const aspect =
        video && video.videoWidth && video.videoHeight
          ? video.videoWidth / video.videoHeight
          : 16 / 9;
      setContainerHeightByAspect(aspect);
    }
  });
})();
