document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".add-cart");
  const contador = document.getElementById("contador");
  const listaCarrito = document.getElementById("lista-carrito");
  const subtotalEl = document.getElementById("subtotal");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function formatearPesos(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(valor);
  }

  function actualizarContador() {
    if (contador) contador.textContent = carrito.length;
  }

  function renderCarrito() {
    if (!listaCarrito || !subtotalEl) return;

    listaCarrito.innerHTML = "";
    let subtotal = 0;

    carrito.forEach((producto, index) => {
      subtotal += producto.precio * producto.cantidad;

      const item = document.createElement("div");
      item.classList.add("producto-carrito");
      item.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="producto-info">
            <h4>${producto.nombre}</h4>
            <p>TAMAÑO: ${producto.tamano ? producto.tamano.toUpperCase() : "DEFAULT"}</p>
        </div>
        <div class="producto-precio">${formatearPesos(producto.precio)}</div>
        <div class="cantidad-box">
            <button data-action="restar">-</button>
            <input type="text" value="${producto.cantidad}" readonly>
            <button data-action="sumar">+</button>
        </div>
        <button class="eliminar" data-index="${index}">🗑</button>
      `;

      listaCarrito.appendChild(item);

      item.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.dataset.action === "sumar") {
            producto.cantidad++;
          } else if (btn.dataset.action === "restar" && producto.cantidad > 1) {
            producto.cantidad--;
          }
          localStorage.setItem("carrito", JSON.stringify(carrito));
          renderCarrito();
        });
      });
    });

    subtotalEl.textContent = formatearPesos(subtotal);

    document.querySelectorAll(".eliminar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        renderCarrito();
      });
    });
  }

  actualizarContador();
  renderCarrito();

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = document.querySelector(".product-info h2")?.textContent || "Producto sin nombre";

      // ✅ CORREGIDO: ahora detecta .price o .old-price
      const priceElement = document.querySelector(".price") || document.querySelector(".old-price");
      const precio = parseFloat(priceElement?.textContent.replace("$", "")) || 0;

      const imagen = document.querySelector(".main-image")?.src || "";
      const cantidad = parseInt(document.querySelector(".quantity input")?.value) || 1;
      const tamano = document.querySelector(".sizes .active")?.textContent || "DEFAULT";

      const producto = { nombre, precio, imagen, cantidad, tamano };

      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarContador();
    });
  });
});
