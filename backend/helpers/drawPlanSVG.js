const planData = require('../planData.json');

function generatePlanSVG(planId) {
  const plan = planData.floorPlans.find(p => p.id === planId);
  if (!plan) return null;

  const { name, rooms, features, color, averageAreaPerApartment } = plan;
  const width = 600;
  const height = 400;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Arka plan
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#f5f5f5" stroke="#333" stroke-width="2"/>`;
  
  // Ana bina çerçevesi
  svg += `<rect x="20" y="20" width="${width-40}" height="${height-40}" fill="${color}" stroke="#333" stroke-width="1" opacity="0.8"/>`;
  
  // Başlık
  svg += `<text x="${width/2}" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">${name}</text>`;
  
  // Odalar
  const roomWidth = 120;
  const roomHeight = 80;
  const startX = 50;
  const startY = 60;
  
  rooms.forEach((room, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = startX + col * (roomWidth + 20);
    const y = startY + row * (roomHeight + 20);
    
    // Oda çerçevesi
    svg += `<rect x="${x}" y="${y}" width="${roomWidth}" height="${roomHeight}" fill="white" stroke="#666" stroke-width="1"/>`;
    
    // Oda adı
    svg += `<text x="${x + roomWidth/2}" y="${y + roomHeight/2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${room}</text>`;
  });
  
  // Özellikler listesi
  const featuresX = width - 150;
  const featuresY = 60;
  
  svg += `<text x="${featuresX}" y="${featuresY}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Özellikler:</text>`;
  
  features.forEach((feature, index) => {
    svg += `<text x="${featuresX}" y="${featuresY + 25 + index * 20}" font-family="Arial, sans-serif" font-size="12" fill="#666">• ${feature}</text>`;
  });
  
  // Alan bilgisi
  svg += `<text x="${width/2}" y="${height-10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Ortalama Alan: ${averageAreaPerApartment} m²</text>`;
  
  svg += `</svg>`;
  return svg;
}

function generateSimplePlanSVG(plan) {
  if (!plan) return null;

  const { name, rooms, features, color, averageAreaPerApartment } = plan;
  const width = 500;
  const height = 300;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Arka plan
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>`;
  
  // Ana bina
  svg += `<rect x="30" y="30" width="${width-60}" height="${height-60}" fill="${color}" stroke="#495057" stroke-width="2" opacity="0.9"/>`;
  
  // Başlık
  svg += `<text x="${width/2}" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#212529">${name}</text>`;
  
  // Odalar
  const roomWidth = 100;
  const roomHeight = 60;
  const startX = 60;
  const startY = 80;
  
  rooms.forEach((room, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = startX + col * (roomWidth + 15);
    const y = startY + row * (roomHeight + 15);
    
    // Oda
    svg += `<rect x="${x}" y="${y}" width="${roomWidth}" height="${roomHeight}" fill="white" stroke="#6c757d" stroke-width="1" rx="3"/>`;
    
    // Oda adı
    svg += `<text x="${x + roomWidth/2}" y="${y + roomHeight/2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="11" fill="#495057">${room}</text>`;
  });
  
  // Özellikler
  const featuresX = width - 140;
  const featuresY = 80;
  
  svg += `<text x="${featuresX}" y="${featuresY}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#495057">Özellikler:</text>`;
  
  features.forEach((feature, index) => {
    svg += `<text x="${featuresX}" y="${featuresY + 20 + index * 18}" font-family="Arial, sans-serif" font-size="11" fill="#6c757d">• ${feature}</text>`;
  });
  
  // Alan bilgisi
  svg += `<text x="${width/2}" y="${height-15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">Ortalama Alan: ${averageAreaPerApartment} m²</text>`;
  
  svg += `</svg>`;
  return svg;
}

module.exports = {
  generatePlanSVG,
  generateSimplePlanSVG
};
