const planData = require("./planData.json");

function generatePlan(daireTipi, cepheSayisi, metrekare) {
  const plan = planData[daireTipi]?.[cepheSayisi];
  if (!plan) throw new Error("Uygun plan verisi bulunamadı");

  const { genislik, yukseklik, svgRenk, odalar } = plan;

  let svg = `<svg width="${genislik}" height="${yukseklik}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect x="0" y="0" width="${genislik}" height="${yukseklik}" fill="${svgRenk}" stroke="black" />`;

  odalar.forEach((oda, i) => {
    svg += `<text x="10" y="${20 + i * 20}" font-size="14">${oda}</text>`;
  });

  svg += `</svg>`;
  return svg;
}
