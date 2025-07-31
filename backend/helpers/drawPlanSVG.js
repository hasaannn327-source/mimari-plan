const planData = require("../planData.json");

function generatePlanSVG(plan) {
  if (!plan) return null;

  const { width, height, svgColor, rooms, name, totalApartments, apartmentType } = plan;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Ana bina çerçevesi
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="${svgColor}" stroke="#333" stroke-width="2"/>`;
  
  // Başlık
  svg += `<text x="${width/2}" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#333">${name}</text>`;
  
  // Plan tipi ve daire sayısı
  svg += `<text x="${width/2}" y="45" text-anchor="middle" font-size="12" fill="#666">${apartmentType} - ${totalApartments} Daire</text>`;
  
  // Odalar listesi
  rooms.forEach((room, i) => {
    const y = 70 + i * 20;
    svg += `<text x="10" y="${y}" font-size="11" fill="#333">• ${room}</text>`;
  });
  
  // Cephe göstergeleri
  if (plan.streetFacingSides >= 1) {
    svg += `<rect x="0" y="0" width="3" height="${height}" fill="#ff6b6b"/>`; // Sol cephe
  }
  if (plan.streetFacingSides >= 2) {
    svg += `<rect x="${width-3}" y="0" width="3" height="${height}" fill="#ff6b6b"/>`; // Sağ cephe
  }
  if (plan.streetFacingSides >= 3) {
    svg += `<rect x="0" y="0" width="${width}" height="3" fill="#ff6b6b"/>`; // Üst cephe
  }
  if (plan.streetFacingSides >= 4) {
    svg += `<rect x="0" y="${height-3}" width="${width}" height="3" fill="#ff6b6b"/>`; // Alt cephe
  }
  
  // Alan bilgisi
  svg += `<text x="${width-10}" y="${height-10}" text-anchor="end" font-size="10" fill="#666">${plan.minArea}-${plan.maxArea}m²</text>`;
  
  svg += `</svg>`;
  return svg;
}

function findSuitablePlan(apartmentType, streetFacingSides, usableArea) {
  const plans = planData.floorPlans;
  
  return plans.find(plan => 
    plan.apartmentType === apartmentType &&
    plan.streetFacingSides === streetFacingSides &&
    usableArea >= plan.minArea &&
    usableArea <= plan.maxArea
  );
}

function calculateNetArea(totalArea, commonAreaPercentage) {
  return totalArea * (1 - commonAreaPercentage / 100);
}

function estimateApartmentCount(netArea, apartmentType) {
  const avgArea = planData.apartmentTypes[apartmentType]?.averageArea;
  if (!avgArea) return 0;
  
  return Math.floor(netArea / avgArea);
}

module.exports = {
  generatePlanSVG,
  findSuitablePlan,
  calculateNetArea,
  estimateApartmentCount,
  planData
};
