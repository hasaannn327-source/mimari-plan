const planData = require("../planData.json");
const fs = require('fs');
const path = require('path');

function generatePlanSVG(planId) {
  const plan = planData.floorPlans.find(p => p.id === planId);
  if (!plan) return null;

  const width = 600;
  const height = 400;
  const margin = 20;
  
  // Define colors for different apartment types
  const colors = {
    "1+1": "#e3f2fd",
    "2+1": "#f3e5f5", 
    "3+1": "#e8f5e8",
    "4+1": "#fff3e0"
  };
  
  const fillColor = colors[plan.apartmentType] || "#f5f5f5";
  const strokeColor = "#2c3e50";
  const textColor = "#34495e";

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .plan-title { font: bold 18px Arial; fill: ${textColor}; }
      .room-label { font: 12px Arial; fill: ${textColor}; }
      .spec-text { font: 10px Arial; fill: #7f8c8d; }
      .building-outline { fill: ${fillColor}; stroke: ${strokeColor}; stroke-width: 2; }
      .room-divider { stroke: ${strokeColor}; stroke-width: 1; fill: none; }
      .street-marker { fill: #e74c3c; font: bold 10px Arial; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="#ecf0f1"/>
  
  <!-- Title -->
  <text x="${width/2}" y="25" text-anchor="middle" class="plan-title">${plan.name}</text>
  
  <!-- Main building outline -->
  <rect x="${margin}" y="50" width="${width - 2*margin}" height="${height - 100}" class="building-outline"/>`;

  // Add street facing indicators
  if (plan.streetFacingSides >= 1) {
    svg += `<text x="${margin + 10}" y="45" class="street-marker">SOKAK</text>`;
  }
  if (plan.streetFacingSides >= 2) {
    svg += `<text x="${width - margin - 40}" y="45" class="street-marker">SOKAK</text>`;
  }
  if (plan.streetFacingSides >= 3) {
    svg += `<text x="${margin + 10}" y="${height - 35}" class="street-marker">SOKAK</text>`;
  }
  if (plan.streetFacingSides >= 4) {
    svg += `<text x="${width - margin - 40}" y="${height - 35}" class="street-marker">SOKAK</text>`;
  }

  // Calculate room layout based on apartment type
  const buildingWidth = width - 2*margin;
  const buildingHeight = height - 150;
  const buildingLeft = margin;
  const buildingTop = 50;

  // Generate room layout
  if (plan.apartmentType === "1+1") {
    // Simple 1+1 layout
    svg += `
      <line x1="${buildingLeft + buildingWidth/2}" y1="${buildingTop}" x2="${buildingLeft + buildingWidth/2}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <text x="${buildingLeft + buildingWidth/4}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Salon + Mutfak</text>
      <text x="${buildingLeft + 3*buildingWidth/4}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Yatak Odası</text>
      <text x="${buildingLeft + buildingWidth/2}" y="${buildingTop + buildingHeight - 10}" text-anchor="middle" class="room-label">Banyo</text>
    `;
  } else if (plan.apartmentType === "2+1") {
    // 2+1 layout with living room, kitchen, 2 bedrooms, bathroom
    svg += `
      <line x1="${buildingLeft + buildingWidth/3}" y1="${buildingTop}" x2="${buildingLeft + buildingWidth/3}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft + 2*buildingWidth/3}" y1="${buildingTop}" x2="${buildingLeft + 2*buildingWidth/3}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft}" y1="${buildingTop + buildingHeight/2}" x2="${buildingLeft + buildingWidth}" y2="${buildingTop + buildingHeight/2}" class="room-divider"/>
      
      <text x="${buildingLeft + buildingWidth/6}" y="${buildingTop + buildingHeight/4}" text-anchor="middle" class="room-label">Salon</text>
      <text x="${buildingLeft + buildingWidth/6}" y="${buildingTop + 3*buildingHeight/4}" text-anchor="middle" class="room-label">Mutfak</text>
      <text x="${buildingLeft + buildingWidth/2}" y="${buildingTop + buildingHeight/4}" text-anchor="middle" class="room-label">Ana Yatak</text>
      <text x="${buildingLeft + buildingWidth/2}" y="${buildingTop + 3*buildingHeight/4}" text-anchor="middle" class="room-label">Banyo</text>
      <text x="${buildingLeft + 5*buildingWidth/6}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Çocuk Odası</text>
    `;
  } else if (plan.apartmentType === "3+1") {
    // 3+1 layout
    svg += `
      <line x1="${buildingLeft + buildingWidth/4}" y1="${buildingTop}" x2="${buildingLeft + buildingWidth/4}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft + buildingWidth/2}" y1="${buildingTop}" x2="${buildingLeft + buildingWidth/2}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft + 3*buildingWidth/4}" y1="${buildingTop}" x2="${buildingLeft + 3*buildingWidth/4}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft}" y1="${buildingTop + buildingHeight/2}" x2="${buildingLeft + buildingWidth}" y2="${buildingTop + buildingHeight/2}" class="room-divider"/>
      
      <text x="${buildingLeft + buildingWidth/8}" y="${buildingTop + buildingHeight/4}" text-anchor="middle" class="room-label">Salon</text>
      <text x="${buildingLeft + buildingWidth/8}" y="${buildingTop + 3*buildingHeight/4}" text-anchor="middle" class="room-label">Mutfak</text>
      <text x="${buildingLeft + 3*buildingWidth/8}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Ana Yatak</text>
      <text x="${buildingLeft + 5*buildingWidth/8}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Çocuk Odası 1</text>
      <text x="${buildingLeft + 7*buildingWidth/8}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Çocuk Odası 2</text>
    `;
  } else if (plan.apartmentType === "4+1") {
    // 4+1 luxury layout
    svg += `
      <line x1="${buildingLeft + buildingWidth/5}" y1="${buildingTop}" x2="${buildingLeft + buildingWidth/5}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft + 2*buildingWidth/5}" y1="${buildingTop}" x2="${buildingLeft + 2*buildingWidth/5}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft + 3*buildingWidth/5}" y1="${buildingTop}" x2="${buildingLeft + 3*buildingWidth/5}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft + 4*buildingWidth/5}" y1="${buildingTop}" x2="${buildingLeft + 4*buildingWidth/5}" y2="${buildingTop + buildingHeight}" class="room-divider"/>
      <line x1="${buildingLeft}" y1="${buildingTop + buildingHeight/3}" x2="${buildingLeft + buildingWidth}" y2="${buildingTop + buildingHeight/3}" class="room-divider"/>
      <line x1="${buildingLeft}" y1="${buildingTop + 2*buildingHeight/3}" x2="${buildingLeft + buildingWidth}" y2="${buildingTop + 2*buildingHeight/3}" class="room-divider"/>
      
      <text x="${buildingLeft + buildingWidth/10}" y="${buildingTop + buildingHeight/6}" text-anchor="middle" class="room-label">Giriş</text>
      <text x="${buildingLeft + 3*buildingWidth/10}" y="${buildingTop + buildingHeight/6}" text-anchor="middle" class="room-label">Salon</text>
      <text x="${buildingLeft + buildingWidth/10}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Mutfak</text>
      <text x="${buildingLeft + 3*buildingWidth/10}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Ana Yatak</text>
      <text x="${buildingLeft + buildingWidth/2}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Yatak Odası 2</text>
      <text x="${buildingLeft + 7*buildingWidth/10}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Yatak Odası 3</text>
      <text x="${buildingLeft + 9*buildingWidth/10}" y="${buildingTop + buildingHeight/2}" text-anchor="middle" class="room-label">Yatak Odası 4</text>
    `;
  }

  // Add specifications at the bottom
  svg += `
    <text x="${margin}" y="${height - 20}" class="spec-text">Alan: ${plan.minUsableArea}-${plan.maxUsableArea} m² | Cephe: ${plan.streetFacingSides} | Tahmini: ${plan.estimatedApartments} daire</text>
  `;

  svg += `</svg>`;
  
  return svg;
}

function generateAllPlanImages() {
  const plansDir = path.join(__dirname, '..', 'plans');
  
  // Ensure plans directory exists
  if (!fs.existsSync(plansDir)) {
    fs.mkdirSync(plansDir, { recursive: true });
  }

  planData.floorPlans.forEach(plan => {
    const svg = generatePlanSVG(plan.id);
    if (svg) {
      const filename = plan.image.split('/').pop().replace('.jpg', '.svg');
      const filepath = path.join(plansDir, filename);
      fs.writeFileSync(filepath, svg);
      console.log(`Generated: ${filename}`);
    }
  });
}

module.exports = { generatePlanSVG, generateAllPlanImages };
