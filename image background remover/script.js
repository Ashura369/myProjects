const imageInput = document.getElementById('image-input');
const colorInput = document.getElementById('color-input');
const removeBtn = document.getElementById('remove-btn');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('download-link');
let img = null;

// Load image to canvas
imageInput.onchange = function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      downloadLink.style.display = "none";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

// Remove background (simple color-based)
removeBtn.onclick = function () {
  if (!img) return;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  // Get selected color and its RGB
  const hexColor = colorInput.value;
  const rgb = hexToRgb(hexColor);

  // Tolerance for color match
  const tolerance = 40;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (colorMatch(r, g, b, rgb.r, rgb.g, rgb.b, tolerance)) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // Show download link
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.style.display = "block";
};

// Helpers
function hexToRgb(hex) {
  // Remove hash if present
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Color matching with tolerance
function colorMatch(r1,g1,b1, r2,g2,b2, tolerance) {
  return (
    Math.abs(r1 - r2) < tolerance &&
    Math.abs(g1 - g2) < tolerance &&
    Math.abs(b1 - b2) < tolerance
  );
}