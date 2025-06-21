// Leer coins de localStorage
let coins = parseInt(localStorage.getItem("coins")) || 0;
const coinsDisplay = document.getElementById("coins");
coinsDisplay.textContent = coins;

// Diccionario de nombres bonitos para mostrar
const nombresLindos = {
  merienda: "🧁 Merienda Romántica",
  helado: "🍨 Helado Compartido",
  desayuno: "🍳 Desayuno Juntos",
  estrellas: "🌌 Cita Bajo las Estrellas"
};

// Función para comprar
function comprar(item, precio) {
  if (coins >= precio) {
    coins -= precio;
    localStorage.setItem("coins", coins);
    coinsDisplay.textContent = coins;

    // Guardar lo comprado
    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    compras.push(item);
    localStorage.setItem("compras", JSON.stringify(compras));

    // Generar código de compra
    const codigo = generarCodigo(item);

    mostrarMensaje(`
      ✅ ¡Compra realizada con éxito!<br>
      Compraste: <strong>${nombresLindos[item]}</strong><br>
      Enviá este comprobante para canjear tu cita 💕<br>
      <strong>Código:</strong> <code>${codigo}</code>
    `);
  } else {
    mostrarMensaje("❌ No tienes suficientes coins 😢");
  }
}

function generarCodigo(item) {
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `${item}-${random}`;
}

// Mostrar mensaje
function mostrarMensaje(html) {
  const mensaje = document.getElementById("mensaje");
  mensaje.innerHTML = html;
  mensaje.classList.remove("oculto");

  setTimeout(() => {
    mensaje.classList.add("oculto");
  }, 60000); // lo dejamos 5 segundos visible
}

function toggleMusica() {
  const a = document.getElementById("musicaFondo");
  if (a.paused) a.play();
  else a.pause();
}
