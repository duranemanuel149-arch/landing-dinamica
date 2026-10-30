document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // 1. EFECTO DE LUZ DEL CURSOR
  // =====================================================

  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow) {
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // =====================================================
  // 2. NOTIFICACIONES DEL SISTEMA
  // =====================================================

  const notification = document.getElementById("systemNotification");
  const notificationTitle = document.getElementById("notificationTitle");
  const notificationText = document.getElementById("notificationText");

  const characterCards = document.querySelectorAll(".character-feature");

  let notificationTimeout;

  const showNotification = (title, clan) => {
    if (!notification || !notificationTitle || !notificationText) return;

    notificationTitle.textContent = `REGISTRO // ${clan}`;
    notificationText.textContent = `Accediendo a los archivos de ${title}...`;

    notification.classList.add("show");

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
      notification.classList.remove("show");
    }, 3500);
  };

  // =====================================================
  // 3. MENÚ MÓVIL
  // =====================================================

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuButton && navLinks) {
    mobileMenuButton.addEventListener("click", () => {
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";

      mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));

      if (!isExpanded) {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "var(--nav-height)";
        navLinks.style.left = "0";
        navLinks.style.width = "100%";
        navLinks.style.background = "rgba(3, 4, 5, 0.97)";
        navLinks.style.padding = "1.5rem";
        navLinks.style.gap = "1.2rem";
        navLinks.style.borderBottom = "1px solid var(--line)";
        navLinks.style.backdropFilter = "blur(14px)";
        navLinks.style.webkitBackdropFilter = "blur(14px)";
      } else {
        navLinks.style.display = "none";
      }
    });

    // Cerrar menú al tocar un enlace
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = "none";
          mobileMenuButton.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Restaurar menú cuando volvemos a desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navLinks.removeAttribute("style");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =====================================================
  // 4. MENÚ ACTIVO SEGÚN SCROLL
  // =====================================================

  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-link");

  const updateActiveNav = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;

      if (window.scrollY >= sectionTop - 220) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");

      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNav);

  updateActiveNav();

  // =====================================================
  // 5. MODAL DE PERSONAJES
  // =====================================================

  const characterModal = document.getElementById("character-modal");
  const modalClose = document.querySelector(".modal-close");

  const modalTitle = document.getElementById("modal-title");
  const modalClan = document.getElementById("modal-clan");
  const modalDesc = document.getElementById("modal-desc");

  const statFills = document.querySelectorAll(".bar-fill");

  // =====================================================
  // 6. ABRIR PERSONAJE
  // =====================================================

  characterCards.forEach((card) => {
    card.addEventListener("click", () => {
      const nameElement = card.querySelector("h3");
      const clanElement = card.querySelector(".character-clan");
      const descElement = card.querySelector("p");

      if (!nameElement || !clanElement) return;

      const name = nameElement.textContent.trim();
      const clan = clanElement.textContent.trim();

      const desc = descElement
        ? descElement.textContent.trim()
        : "Información clasificada del shinobi.";

      // -----------------------------------------------
      // NOTIFICACIÓN
      // -----------------------------------------------

      showNotification(name, clan);

      // -----------------------------------------------
      // MODAL
      // -----------------------------------------------

      if (!characterModal) return;

      if (modalTitle) {
        modalTitle.textContent = name;
      }

      if (modalClan) {
        modalClan.textContent = clan;
      }

      if (modalDesc) {
        modalDesc.textContent = desc;
      }

      characterModal.classList.add("active");

      // Bloquear scroll del body
      document.body.style.overflow = "hidden";

      // -----------------------------------------------
      // BARRAS DE ESTADÍSTICAS
      // -----------------------------------------------

      statFills.forEach((bar) => {
        bar.style.width = "0%";
      });

      setTimeout(() => {
        statFills.forEach((bar) => {
          const randomValue = Math.floor(Math.random() * 30) + 70;

          bar.style.width = `${randomValue}%`;
        });
      }, 150);
    });
  });

  // =====================================================
  // 7. CERRAR MODAL
  // =====================================================

  const closeModal = () => {
    if (!characterModal) return;

    characterModal.classList.remove("active");

    document.body.style.overflow = "";

    statFills.forEach((bar) => {
      bar.style.width = "0%";
    });
  };

  // Botón X
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // =====================================================
  // 8. CERRAR MODAL AL TOCAR AFUERA
  // =====================================================

  if (characterModal) {
    characterModal.addEventListener("click", (e) => {
      if (e.target === characterModal) {
        closeModal();
      }
    });
  }

  // =====================================================
  // 9. CERRAR CON ESC
  // =====================================================

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // =====================================================
  // 10. EVITAR SCROLL DEL MODAL CON RUEDA
  // =====================================================

  if (characterModal) {
    characterModal.addEventListener("wheel", (e) => {
      if (characterModal.classList.contains("active")) {
        e.stopPropagation();
      }
    });
  }
});
