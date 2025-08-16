const planData = require("../planData.json");
const fs = require('fs');
const path = require('path');

class AdvancedPlanGenerator {
  constructor() {
    this.standardDimensions = {
      "1+1": { livingRoom: 20, bedroom: 12, kitchen: 8, bathroom: 4, total: 44 },
      "2+1": { livingRoom: 25, bedroom1: 14, bedroom2: 12, kitchen: 10, bathroom: 5, total: 66 },
      "3+1": { livingRoom: 30, bedroom1: 16, bedroom2: 14, bedroom3: 12, kitchen: 12, bathroom: 6, total: 90 },
      "4+1": { livingRoom: 35, bedroom1: 18, bedroom2: 16, bedroom3: 14, bedroom4: 12, kitchen: 15, bathroom: 7, total: 117 }
    };
    
    this.roomSymbols = {
      door: "🚪",
      window: "🪟",
      balcony: "🌿",
      entrance: "🏠",
      stairs: "🪜"
    };
  }

  generateRealisticPlan(planId) {
    const plan = planData.floorPlans.find(p => p.id === planId);
    if (!plan) return null;

    const dimensions = this.standardDimensions[plan.apartmentType];
    const width = 800;
    const height = 600;
    const margin = 40;
    const gridSize = 20;

    let svg = this.generateSVGHeader(width, height, plan);
    
    // Generate building structure
    svg += this.generateBuildingStructure(width, height, margin, plan);
    
    // Generate apartment layouts
    svg += this.generateApartmentLayouts(width, height, margin, plan, dimensions, gridSize);
    
    // Generate common areas
    svg += this.generateCommonAreas(width, height, margin, plan);
    
    // Generate measurements and annotations
    svg += this.generateMeasurements(width, height, margin, plan, dimensions);
    
    // Generate legend
    svg += this.generateLegend(width, height);
    
    svg += '</svg>';
    return svg;
  }

  generateSVGHeader(width, height, plan) {
    const colors = {
      "1+1": "#e3f2fd",
      "2+1": "#f3e5f5", 
      "3+1": "#e8f5e8",
      "4+1": "#fff3e0"
    };
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .plan-title { font: bold 24px 'Segoe UI', Arial; fill: #2c3e50; }
      .room-label { font: bold 14px 'Segoe UI', Arial; fill: #34495e; }
      .measurement { font: 12px 'Segoe UI', Arial; fill: #7f8c8d; }
      .legend-text { font: 12px 'Segoe UI', Arial; fill: #2c3e50; }
      .building-outline { fill: ${colors[plan.apartmentType]}; stroke: #2c3e50; stroke-width: 3; }
      .room-divider { stroke: #34495e; stroke-width: 2; fill: none; }
      .door-line { stroke: #e74c3c; stroke-width: 3; fill: none; stroke-dasharray: 5,5; }
      .window-line { stroke: #3498db; stroke-width: 2; fill: none; }
      .balcony { fill: #a8e6cf; stroke: #27ae60; stroke-width: 2; }
      .common-area { fill: #ffeaa7; stroke: #fdcb6e; stroke-width: 2; }
      .stairs { fill: #dda0dd; stroke: #9b59b6; stroke-width: 2; }
      .street-marker { fill: #e74c3c; font: bold 14px Arial; }
      .north-arrow { fill: #2c3e50; }
    </style>
    
    <!-- Door symbol -->
    <symbol id="door" viewBox="0 0 20 20">
      <rect x="2" y="2" width="16" height="16" fill="none" stroke="#e74c3c" stroke-width="2"/>
      <circle cx="15" cy="10" r="2" fill="#e74c3c"/>
    </symbol>
    
    <!-- Window symbol -->
    <symbol id="window" viewBox="0 0 20 20">
      <rect x="2" y="2" width="16" height="16" fill="none" stroke="#3498db" stroke-width="2"/>
      <line x1="2" y1="10" x2="18" y2="10" stroke="#3498db" stroke-width="1"/>
      <line x1="10" y1="2" x2="10" y2="18" stroke="#3498db" stroke-width="1"/>
    </symbol>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="#f8f9fa"/>
  
  <!-- Title -->
  <text x="${width/2}" y="30" text-anchor="middle" class="plan-title">${plan.name}</text>
  
  <!-- North Arrow -->
  <g transform="translate(${width-60}, 60)">
    <polygon points="0,0 10,20 20,0 10,5" class="north-arrow"/>
    <text x="10" y="35" text-anchor="middle" class="legend-text">K</text>
  </g>`;
  }

  generateBuildingStructure(width, height, margin, plan) {
    let svg = '';
    
    // Main building outline
    svg += `<rect x="${margin}" y="${margin + 60}" width="${width - 2*margin}" height="${height - 2*margin - 60}" class="building-outline"/>`;
    
    // Street markers
    if (plan.streetFacingSides >= 1) {
      svg += `<text x="${margin + 20}" y="${margin + 55}" class="street-marker">SOKAK 1</text>`;
    }
    if (plan.streetFacingSides >= 2) {
      svg += `<text x="${width - margin - 80}" y="${margin + 55}" class="street-marker">SOKAK 2</text>`;
    }
    if (plan.streetFacingSides >= 3) {
      svg += `<text x="${margin + 20}" y="${height - margin - 15}" class="street-marker">SOKAK 3</text>`;
    }
    if (plan.streetFacingSides >= 4) {
      svg += `<text x="${width - margin - 80}" y="${height - margin - 15}" class="street-marker">SOKAK 4</text>`;
    }
    
    return svg;
  }

  generateApartmentLayouts(width, height, margin, plan, dimensions, gridSize) {
    let svg = '';
    const buildingWidth = width - 2*margin;
    const buildingHeight = height - 2*margin - 60;
    const buildingLeft = margin;
    const buildingTop = margin + 60;
    
    if (plan.apartmentType === "1+1") {
      svg += this.generate1Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, dimensions);
    } else if (plan.apartmentType === "2+1") {
      svg += this.generate2Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, dimensions);
    } else if (plan.apartmentType === "3+1") {
      svg += this.generate3Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, dimensions);
    } else if (plan.apartmentType === "4+1") {
      svg += this.generate4Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, dimensions);
    }
    
    return svg;
  }

  generate1Plus1Layout(left, top, width, height, dimensions) {
    const livingRoomWidth = (dimensions.livingRoom / dimensions.total) * width;
    const bedroomWidth = (dimensions.bedroom / dimensions.total) * width;
    const kitchenHeight = (dimensions.kitchen / dimensions.total) * height;
    const bathroomHeight = (dimensions.bathroom / dimensions.total) * height;
    
    let svg = '';
    
    // Living Room
    svg += `<rect x="${left}" y="${top}" width="${livingRoomWidth}" height="${height}" fill="#e3f2fd" stroke="#34495e" stroke-width="2"/>
            <text x="${left + livingRoomWidth/2}" y="${top + height/2}" text-anchor="middle" class="room-label">Salon + Mutfak</text>
            <text x="${left + livingRoomWidth/2}" y="${top + height/2 + 20}" text-anchor="middle" class="measurement">${dimensions.livingRoom} m²</text>`;
    
    // Bedroom
    svg += `<rect x="${left + livingRoomWidth}" y="${top}" width="${bedroomWidth}" height="${height}" fill="#f3e5f5" stroke="#34495e" stroke-width="2"/>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + height/2}" text-anchor="middle" class="room-label">Yatak Odası</text>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + height/2 + 20}" text-anchor="middle" class="measurement">${dimensions.bedroom} m²</text>`;
    
    // Kitchen area (within living room)
    svg += `<rect x="${left + 10}" y="${top + height - kitchenHeight - 10}" width="${livingRoomWidth - 20}" height="${kitchenHeight}" fill="#fff3e0" stroke="#f39c12" stroke-width="1" stroke-dasharray="5,5"/>
            <text x="${left + livingRoomWidth/2}" y="${top + height - kitchenHeight/2 - 5}" text-anchor="middle" class="room-label">Mutfak</text>`;
    
    // Bathroom
    svg += `<rect x="${left + livingRoomWidth + 10}" y="${top + height - bathroomHeight - 10}" width="${bedroomWidth - 20}" height="${bathroomHeight}" fill="#e8f5e8" stroke="#27ae60" stroke-width="1"/>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + height - bathroomHeight/2 - 5}" text-anchor="middle" class="room-label">Banyo</text>`;
    
    // Doors and windows
    svg += this.addDoorsAndWindows(left, top, width, height, dimensions);
    
    return svg;
  }

  generate2Plus1Layout(left, top, width, height, dimensions) {
    const totalWidth = width;
    const totalHeight = height;
    
    // Calculate room dimensions based on area ratios
    const livingRoomWidth = (dimensions.livingRoom / dimensions.total) * totalWidth;
    const bedroom1Width = (dimensions.bedroom1 / dimensions.total) * totalWidth;
    const bedroom2Width = (dimensions.bedroom2 / dimensions.total) * totalWidth;
    const kitchenHeight = (dimensions.kitchen / dimensions.total) * totalHeight;
    const bathroomHeight = (dimensions.bathroom / dimensions.total) * totalHeight;
    
    let svg = '';
    
    // Living Room (left side)
    svg += `<rect x="${left}" y="${top}" width="${livingRoomWidth}" height="${totalHeight}" fill="#e3f2fd" stroke="#34495e" stroke-width="2"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">Salon</text>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2 + 20}" text-anchor="middle" class="measurement">${dimensions.livingRoom} m²</text>`;
    
    // Main Bedroom (middle)
    svg += `<rect x="${left + livingRoomWidth}" y="${top}" width="${bedroom1Width}" height="${totalHeight}" fill="#f3e5f5" stroke="#34495e" stroke-width="2"/>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">Ana Yatak</text>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight/2 + 20}" text-anchor="middle" class="measurement">${dimensions.bedroom1} m²</text>`;
    
    // Second Bedroom (right side)
    svg += `<rect x="${left + livingRoomWidth + bedroom1Width}" y="${top}" width="${bedroom2Width}" height="${totalHeight}" fill="#e8f5e8" stroke="#34495e" stroke-width="2"/>
            <text x="${left + livingRoomWidth + bedroom1Width + bedroom2Width/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">Çocuk Odası</text>
            <text x="${left + livingRoomWidth + bedroom1Width + bedroom2Width/2}" y="${top + totalHeight/2 + 20}" text-anchor="middle" class="measurement">${dimensions.bedroom2} m²</text>`;
    
    // Kitchen (bottom of living room)
    svg += `<rect x="${left + 10}" y="${top + totalHeight - kitchenHeight - 10}" width="${livingRoomWidth - 20}" height="${kitchenHeight}" fill="#fff3e0" stroke="#f39c12" stroke-width="1" stroke-dasharray="5,5"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight - kitchenHeight/2 - 5}" text-anchor="middle" class="room-label">Mutfak</text>`;
    
    // Bathroom (bottom of main bedroom)
    svg += `<rect x="${left + livingRoomWidth + 10}" y="${top + totalHeight - bathroomHeight - 10}" width="${bedroom1Width - 20}" height="${bathroomHeight}" fill="#e8f5e8" stroke="#27ae60" stroke-width="1"/>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight - bathroomHeight/2 - 5}" text-anchor="middle" class="room-label">Banyo</text>`;
    
    // Doors and windows
    svg += this.addDoorsAndWindows(left, top, width, height, dimensions);
    
    return svg;
  }

  generate3Plus1Layout(left, top, width, height, dimensions) {
    // Similar structure but with 3 bedrooms
    // Implementation would be similar to 2+1 but with additional bedroom
    return this.generate2Plus1Layout(left, top, width, height, dimensions) + 
           `<text x="${left + width/2}" y="${top + height + 20}" text-anchor="middle" class="measurement">3+1 Layout - ${dimensions.total} m²</text>`;
  }

  generate4Plus1Layout(left, top, width, height, dimensions) {
    // Luxury layout with 4 bedrooms
    // Implementation would be similar but with 4 bedrooms
    return this.generate2Plus1Layout(left, top, width, height, dimensions) + 
           `<text x="${left + width/2}" y="${top + height + 20}" text-anchor="middle" class="measurement">4+1 Layout - ${dimensions.total} m²</text>`;
  }

  addDoorsAndWindows(left, top, width, height, dimensions) {
    let svg = '';
    
    // Entrance door
    svg += `<use href="#door" x="${left + 20}" y="${top + height - 30}" width="20" height="20"/>
            <text x="${left + 30}" y="${top + height - 10}" class="measurement">Giriş</text>`;
    
    // Windows
    svg += `<use href="#window" x="${left + width/2 - 10}" y="${top + 10}" width="20" height="20"/>
            <use href="#window" x="${left + width/2 - 10}" y="${top + height - 30}" width="20" height="20"/>`;
    
    // Balcony
    svg += `<rect x="${left + width/2 - 30}" y="${top - 20}" width="60" height="20" class="balcony"/>
            <text x="${left + width/2}" y="${top - 5}" text-anchor="middle" class="room-label">Balkon</text>`;
    
    return svg;
  }

  generateCommonAreas(width, height, margin, plan) {
    let svg = '';
    
    // Stairs
    svg += `<rect x="${width - margin - 60}" y="${height - margin - 80}" width="60" height="80" class="stairs"/>
            <text x="${width - margin - 30}" y="${height - margin - 35}" text-anchor="middle" class="room-label">Merdiven</text>`;
    
    // Elevator
    svg += `<rect x="${width - margin - 60}" y="${height - margin - 120}" width="60" height="40" class="common-area"/>
            <text x="${width - margin - 30}" y="${height - margin - 100}" text-anchor="middle" class="room-label">Asansör</text>`;
    
    return svg;
  }

  generateMeasurements(width, height, margin, plan, dimensions) {
    let svg = '';
    
    // Grid measurements
    for (let i = 0; i <= 10; i++) {
      const x = margin + (i * (width - 2*margin) / 10);
      svg += `<line x1="${x}" y1="${height - margin - 20}" x2="${x}" y2="${height - margin}" stroke="#bdc3c7" stroke-width="1"/>
              <text x="${x}" y="${height - margin + 15}" text-anchor="middle" class="measurement">${Math.round((i * (width - 2*margin) / 10) / 10)}m</text>`;
    }
    
    // Vertical measurements
    for (let i = 0; i <= 8; i++) {
      const y = margin + 60 + (i * (height - 2*margin - 60) / 8);
      svg += `<line x1="${margin - 20}" y1="${y}" x2="${margin}" y2="${y}" stroke="#bdc3c7" stroke-width="1"/>
              <text x="${margin - 25}" y="${y + 4}" text-anchor="middle" class="measurement">${Math.round((i * (height - 2*margin - 60) / 8) / 10)}m</text>`;
    }
    
    return svg;
  }

  generateLegend(width, height) {
    return `
    <!-- Legend -->
    <rect x="20" y="${height - 120}" width="200" height="100" fill="white" stroke="#bdc3c7" stroke-width="1"/>
    <text x="30" y="${height - 105}" class="legend-text">Açıklama:</text>
    <use href="#door" x="30" y="${height - 85}" width="15" height="15"/>
    <text x="50" y="${height - 75}" class="legend-text">Kapı</text>
    <use href="#window" x="30" y="${height - 65}" width="15" height="15"/>
    <text x="50" y="${height - 55}" class="legend-text">Pencere</text>
    <rect x="30" y="${height - 45}" width="15" height="15" class="balcony"/>
    <text x="50" y="${height - 35}" class="legend-text">Balkon</text>
    <rect x="30" y="${height - 25}" width="15" height="15" class="stairs"/>
    <text x="50" y="${height - 15}" class="legend-text">Merdiven</text>`;
  }

  generateAllAdvancedPlans() {
    const plansDir = path.join(__dirname, '..', 'plans');
    
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    planData.floorPlans.forEach(plan => {
      const svg = this.generateRealisticPlan(plan.id);
      if (svg) {
        const filename = plan.image.split('/').pop().replace('.jpg', '_advanced.svg');
        const filepath = path.join(plansDir, filename);
        fs.writeFileSync(filepath, svg);
        console.log(`Generated advanced plan: ${filename}`);
      }
    });
  }
}

module.exports = AdvancedPlanGenerator;