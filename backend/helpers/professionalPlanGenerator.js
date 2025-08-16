const planData = require("../planData.json");
const fs = require('fs');
const path = require('path');

class ProfessionalPlanGenerator {
  constructor() {
    // Mimari standartları
    this.architecturalStandards = {
      "1+1": {
        livingRoom: { min: 18, optimal: 22, max: 26 },
        bedroom: { min: 10, optimal: 12, max: 14 },
        kitchen: { min: 6, optimal: 8, max: 10 },
        bathroom: { min: 3, optimal: 4, max: 5 },
        hallway: { min: 2, optimal: 3, max: 4 },
        total: { min: 39, optimal: 49, max: 59 }
      },
      "2+1": {
        livingRoom: { min: 22, optimal: 26, max: 30 },
        bedroom1: { min: 12, optimal: 14, max: 16 },
        bedroom2: { min: 10, optimal: 12, max: 14 },
        kitchen: { min: 8, optimal: 10, max: 12 },
        bathroom: { min: 4, optimal: 5, max: 6 },
        hallway: { min: 3, optimal: 4, max: 5 },
        total: { min: 59, optimal: 71, max: 83 }
      },
      "3+1": {
        livingRoom: { min: 26, optimal: 30, max: 34 },
        bedroom1: { min: 14, optimal: 16, max: 18 },
        bedroom2: { min: 12, optimal: 14, max: 16 },
        bedroom3: { min: 10, optimal: 12, max: 14 },
        kitchen: { min: 10, optimal: 12, max: 14 },
        bathroom: { min: 5, optimal: 6, max: 7 },
        hallway: { min: 4, optimal: 5, max: 6 },
        total: { min: 81, optimal: 95, max: 109 }
      },
      "4+1": {
        livingRoom: { min: 30, optimal: 35, max: 40 },
        bedroom1: { min: 16, optimal: 18, max: 20 },
        bedroom2: { min: 14, optimal: 16, max: 18 },
        bedroom3: { min: 12, optimal: 14, max: 16 },
        bedroom4: { min: 10, optimal: 12, max: 14 },
        kitchen: { min: 12, optimal: 15, max: 18 },
        bathroom: { min: 6, optimal: 7, max: 8 },
        hallway: { min: 5, optimal: 6, max: 7 },
        total: { min: 105, optimal: 123, max: 141 }
      }
    };

    // Mimari semboller
    this.architecturalSymbols = {
      door: {
        single: "🚪",
        double: "🚪🚪",
        sliding: "🚪➡️",
        emergency: "🚪🚨"
      },
      window: {
        regular: "🪟",
        bay: "🪟🪟🪟",
        french: "🪟🚪",
        skylight: "🪟☀️"
      },
      fixtures: {
        toilet: "🚽",
        sink: "🚰",
        shower: "🚿",
        bathtub: "🛁",
        stove: "🔥",
        refrigerator: "❄️",
        washingMachine: "🧺"
      },
      structural: {
        wall: "🧱",
        column: "🏗️",
        beam: "📏",
        foundation: "🏛️"
      }
    };
  }

  generateProfessionalPlan(planId) {
    const plan = planData.floorPlans.find(p => p.id === planId);
    if (!plan) return null;

    console.log(`Processing plan: ${plan.id}, type: ${plan.apartmentType}`);
    
    const standards = this.architecturalStandards[plan.apartmentType];
    if (!standards) {
      console.error(`No standards found for apartment type: ${plan.apartmentType}`);
      return null;
    }
    
    const width = 1200;
    const height = 800;
    const margin = 60;
    const gridSize = 30;

    let svg = this.generateProfessionalSVGHeader(width, height, plan);
    
    // Generate professional building structure
    svg += this.generateProfessionalBuildingStructure(width, height, margin, plan);
    
    // Generate detailed apartment layouts
    svg += this.generateDetailedApartmentLayouts(width, height, margin, plan, standards, gridSize);
    
    // Generate professional common areas
    svg += this.generateProfessionalCommonAreas(width, height, margin, plan);
    
    // Generate detailed measurements and annotations
    svg += this.generateDetailedMeasurements(width, height, margin, plan, standards);
    
    // Generate professional legend and symbols
    svg += this.generateProfessionalLegend(width, height);
    
    // Generate room details and furniture
    svg += this.generateRoomDetails(width, height, margin, plan, standards);
    
    svg += '</svg>';
    return svg;
  }

  generateProfessionalSVGHeader(width, height, plan) {
    const colors = {
      "1+1": { primary: "#e3f2fd", secondary: "#bbdefb", accent: "#2196f3" },
      "2+1": { primary: "#f3e5f5", secondary: "#e1bee7", accent: "#9c27b0" },
      "3+1": { primary: "#e8f5e8", secondary: "#c8e6c9", accent: "#4caf50" },
      "4+1": { primary: "#fff3e0", secondary: "#ffe0b2", accent: "#ff9800" }
    };
    
    const colorScheme = colors[plan.apartmentType];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .plan-title { font: bold 28px 'Segoe UI', Arial; fill: #1a237e; }
      .room-label { font: bold 16px 'Segoe UI', Arial; fill: #263238; }
      .measurement { font: 14px 'Segoe UI', Arial; fill: #546e7a; }
      .legend-text { font: 14px 'Segoe UI', Arial; fill: #1a237e; }
      .building-outline { fill: ${colorScheme.primary}; stroke: #1a237e; stroke-width: 4; }
      .room-divider { stroke: #37474f; stroke-width: 3; fill: none; }
      .door-line { stroke: #d32f2f; stroke-width: 4; fill: none; stroke-dasharray: 8,4; }
      .window-line { stroke: #1976d2; stroke-width: 3; fill: none; }
      .balcony { fill: ${colorScheme.secondary}; stroke: #388e3c; stroke-width: 3; }
      .common-area { fill: #fff9c4; stroke: #f57f17; stroke-width: 3; }
      .stairs { fill: #e1bee7; stroke: #7b1fa2; stroke-width: 3; }
      .street-marker { fill: #d32f2f; font: bold 18px Arial; }
      .north-arrow { fill: #1a237e; }
      .grid-line { stroke: #e0e0e0; stroke-width: 1; opacity: 0.6; }
      .furniture { fill: #f5f5f5; stroke: #757575; stroke-width: 2; }
      .texture { fill: url(#wallTexture); }
    </style>
    
    <!-- Wall texture pattern -->
    <pattern id="wallTexture" patternUnits="userSpaceOnUse" width="20" height="20">
      <rect width="20" height="20" fill="#f5f5f5"/>
      <line x1="0" y1="0" x2="20" y2="20" stroke="#e0e0e0" stroke-width="1"/>
      <line x1="20" y1="0" x2="0" y2="20" stroke="#e0e0e0" stroke-width="1"/>
    </pattern>
    
    <!-- Professional door symbol -->
    <symbol id="door" viewBox="0 0 30 30">
      <rect x="2" y="2" width="26" height="26" fill="none" stroke="#d32f2f" stroke-width="3"/>
      <circle cx="22" cy="15" r="3" fill="#d32f2f"/>
      <line x1="15" y1="15" x2="22" y2="15" stroke="#d32f2f" stroke-width="2"/>
    </symbol>
    
    <!-- Professional window symbol -->
    <symbol id="window" viewBox="0 0 30 30">
      <rect x="2" y="2" width="26" height="26" fill="none" stroke="#1976d2" stroke-width="3"/>
      <line x1="2" y1="15" x2="28" y2="15" stroke="#1976d2" stroke-width="2"/>
      <line x1="15" y1="2" x2="15" y2="28" stroke="#1976d2" stroke-width="2"/>
      <circle cx="15" cy="15" r="2" fill="#1976d2" opacity="0.3"/>
    </symbol>
    
    <!-- Furniture symbols -->
    <symbol id="bed" viewBox="0 0 40 30">
      <rect x="2" y="2" width="36" height="26" fill="#e8eaf6" stroke="#3f51b5" stroke-width="2"/>
      <rect x="5" y="5" width="30" height="20" fill="#c5cae9" stroke="#3f51b5" stroke-width="1"/>
      <line x1="20" y1="5" x2="20" y2="25" stroke="#3f51b5" stroke-width="1"/>
    </symbol>
    
    <symbol id="sofa" viewBox="0 0 50 30">
      <rect x="2" y="2" width="46" height="26" fill="#e8f5e8" stroke="#4caf50" stroke-width="2"/>
      <rect x="5" y="5" width="40" height="20" fill="#c8e6c9" stroke="#4caf50" stroke-width="1"/>
      <line x1="25" y1="5" x2="25" y2="25" stroke="#4caf50" stroke-width="1"/>
    </symbol>
    
    <symbol id="table" viewBox="0 0 40 40">
      <rect x="5" y="5" width="30" height="30" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/>
      <rect x="8" y="8" width="24" height="24" fill="#ffe0b2" stroke="#ff9800" stroke-width="1"/>
    </symbol>
  </defs>
  
  <!-- Background with grid -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="#fafafa"/>
  
  <!-- Grid system -->
  ${this.generateGrid(width, height, 30)}
  
  <!-- Title with professional styling -->
  <rect x="20" y="20" width="${width-40}" height="50" fill="white" stroke="#1a237e" stroke-width="2" rx="10"/>
  <text x="${width/2}" y="50" text-anchor="middle" class="plan-title">${plan.name}</text>
  
  <!-- Professional north arrow -->
  <g transform="translate(${width-100}, 80)">
    <circle cx="20" cy="20" r="25" fill="white" stroke="#1a237e" stroke-width="3"/>
    <polygon points="20,0 30,20 20,15 10,20" class="north-arrow"/>
    <text x="20" y="45" text-anchor="middle" class="legend-text">K</text>
    <text x="20" y="60" text-anchor="middle" class="legend-text">KUZEY</text>
  </g>`;
  }

  generateGrid(width, height, gridSize) {
    let svg = '';
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" class="grid-line"/>`;
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" class="grid-line"/>`;
    }
    
    return svg;
  }

  generateProfessionalBuildingStructure(width, height, margin, plan) {
    let svg = '';
    
    // Main building outline with professional styling
    svg += `<rect x="${margin}" y="${margin + 80}" width="${width - 2*margin}" height="${height - 2*margin - 80}" class="building-outline" rx="15"/>`;
    
    // Street markers with professional styling
    if (plan.streetFacingSides >= 1) {
      svg += `<rect x="${margin + 20}" y="${margin + 60}" width="120" height="30" fill="white" stroke="#d32f2f" stroke-width="2" rx="5"/>
              <text x="${margin + 80}" y="${margin + 80}" text-anchor="middle" class="street-marker">SOKAK 1</text>`;
    }
    if (plan.streetFacingSides >= 2) {
      svg += `<rect x="${width - margin - 140}" y="${margin + 60}" width="120" height="30" fill="white" stroke="#d32f2f" stroke-width="2" rx="5"/>
              <text x="${width - margin - 80}" y="${margin + 80}" text-anchor="middle" class="street-marker">SOKAK 2</text>`;
    }
    if (plan.streetFacingSides >= 3) {
      svg += `<rect x="${margin + 20}" y="${height - margin - 30}" width="120" height="30" fill="white" stroke="#d32f2f" stroke-width="2" rx="5"/>
              <text x="${margin + 80}" y="${height - margin - 10}" text-anchor="middle" class="street-marker">SOKAK 3</text>`;
    }
    if (plan.streetFacingSides >= 4) {
      svg += `<rect x="${width - margin - 140}" y="${height - margin - 30}" width="120" height="30" fill="white" stroke="#d32f2f" stroke-width="2" rx="5"/>
              <text x="${width - margin - 80}" y="${height - margin - 10}" text-anchor="middle" class="street-marker">SOKAK 4</text>`;
    }
    
    return svg;
  }

  generateDetailedApartmentLayouts(width, height, margin, plan, standards, gridSize) {
    let svg = '';
    const buildingWidth = width - 2*margin;
    const buildingHeight = height - 2*margin - 80;
    const buildingLeft = margin;
    const buildingTop = margin + 80;
    
    if (plan.apartmentType === "1+1") {
      svg += this.generateProfessional1Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards);
    } else if (plan.apartmentType === "2+1") {
      svg += this.generateProfessional2Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards);
    } else if (plan.apartmentType === "3+1") {
      svg += this.generateProfessional3Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards);
    } else if (plan.apartmentType === "4+1") {
      svg += this.generateProfessional4Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards);
    }
    
    return svg;
  }

  generateProfessional2Plus1Layout(left, top, width, height, standards) {
    const totalWidth = width;
    const totalHeight = height;
    
    // Calculate room dimensions based on architectural standards
    const livingRoomWidth = (standards.livingRoom.optimal / standards.total.optimal) * totalWidth;
    const bedroom1Width = (standards.bedroom1.optimal / standards.total.optimal) * totalWidth;
    const bedroom2Width = (standards.bedroom2.optimal / standards.total.optimal) * totalWidth;
    const kitchenHeight = (standards.kitchen.optimal / standards.total.optimal) * totalHeight;
    const bathroomHeight = (standards.bathroom.optimal / standards.total.optimal) * totalHeight;
    const hallwayHeight = (standards.hallway.optimal / standards.total.optimal) * totalHeight;
    
    let svg = '';
    
    // Living Room (left side) with professional styling
    svg += `<rect x="${left}" y="${top}" width="${livingRoomWidth}" height="${totalHeight}" fill="#e3f2fd" stroke="#1976d2" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">SALON</text>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.livingRoom.optimal} m²</text>`;
    
    // Main Bedroom (middle) with professional styling
    svg += `<rect x="${left + livingRoomWidth}" y="${top}" width="${bedroom1Width}" height="${totalHeight}" fill="#f3e5f5" stroke="#9c27b0" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">ANA YATAK</text>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.bedroom1.optimal} m²</text>`;
    
    // Second Bedroom (right side) with professional styling
    svg += `<rect x="${left + livingRoomWidth + bedroom1Width}" y="${top}" width="${bedroom2Width}" height="${totalHeight}" fill="#e8f5e8" stroke="#4caf50" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth + bedroom1Width + bedroom2Width/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">ÇOCUK ODASI</text>
            <text x="${left + livingRoomWidth + bedroom1Width + bedroom2Width/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.bedroom2.optimal} m²</text>`;
    
    // Kitchen (bottom of living room) with professional styling
    svg += `<rect x="${left + 15}" y="${top + totalHeight - kitchenHeight - 15}" width="${livingRoomWidth - 30}" height="${kitchenHeight}" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="5"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight - kitchenHeight/2 - 5}" text-anchor="middle" class="room-label">MUTFAK</text>`;
    
    // Bathroom (bottom of main bedroom) with professional styling
    svg += `<rect x="${left + livingRoomWidth + 15}" y="${top + totalHeight - bathroomHeight - 15}" width="${bedroom1Width - 30}" height="${bathroomHeight}" fill="#e8f5e8" stroke="#388e3c" stroke-width="2" rx="5"/>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight - bathroomHeight/2 - 5}" text-anchor="middle" class="room-label">BANYO</text>`;
    
    // Hallway (center) with professional styling
    svg += `<rect x="${left + livingRoomWidth + 15}" y="${top + 15}" width="${bedroom1Width - 30}" height="${hallwayHeight}" fill="#f5f5f5" stroke="#757575" stroke-width="2" rx="5"/>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + hallwayHeight/2 + 5}" text-anchor="middle" class="room-label">KORİDOR</text>`;
    
    // Professional doors and windows
    svg += this.addProfessionalDoorsAndWindows(left, top, width, height, standards);
    
    return svg;
  }

  generateProfessional1Plus1Layout(left, top, width, height, standards) {
    const totalWidth = width;
    const totalHeight = height;
    
    // Calculate room dimensions based on architectural standards
    const livingRoomWidth = (standards.livingRoom.optimal / standards.total.optimal) * totalWidth;
    const bedroomWidth = (standards.bedroom.optimal / standards.total.optimal) * totalWidth;
    const kitchenHeight = (standards.kitchen.optimal / standards.total.optimal) * totalHeight;
    const bathroomHeight = (standards.bathroom.optimal / standards.total.optimal) * totalHeight;
    const hallwayHeight = (standards.hallway.optimal / standards.total.optimal) * totalHeight;
    
    let svg = '';
    
    // Living Room (left side) with professional styling
    svg += `<rect x="${left}" y="${top}" width="${livingRoomWidth}" height="${totalHeight}" fill="#e3f2fd" stroke="#1976d2" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">SALON</text>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.livingRoom.optimal} m²</text>`;
    
    // Bedroom (right side) with professional styling
    svg += `<rect x="${left + livingRoomWidth}" y="${top}" width="${bedroomWidth}" height="${totalHeight}" fill="#f3e5f5" stroke="#9c27b0" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">YATAK ODASI</text>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.bedroom.optimal} m²</text>`;
    
    // Kitchen (bottom of living room) with professional styling
    svg += `<rect x="${left + 15}" y="${top + totalHeight - kitchenHeight - 15}" width="${livingRoomWidth - 30}" height="${kitchenHeight}" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="5"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight - kitchenHeight/2 - 5}" text-anchor="middle" class="room-label">MUTFAK</text>`;
    
    // Bathroom (bottom of bedroom) with professional styling
    svg += `<rect x="${left + livingRoomWidth + 15}" y="${top + totalHeight - bathroomHeight - 15}" width="${bedroomWidth - 30}" height="${bathroomHeight}" fill="#e8f5e8" stroke="#388e3c" stroke-width="2" rx="5"/>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + totalHeight - bathroomHeight/2 - 5}" text-anchor="middle" class="room-label">BANYO</text>`;
    
    // Hallway (center) with professional styling
    svg += `<rect x="${left + livingRoomWidth + 15}" y="${top + 15}" width="${bedroomWidth - 30}" height="${hallwayHeight}" fill="#f5f5f5" stroke="#757575" stroke-width="2" rx="5"/>
            <text x="${left + livingRoomWidth + bedroomWidth/2}" y="${top + hallwayHeight/2 + 5}" text-anchor="middle" class="room-label">KORİDOR</text>`;
    
    // Professional doors and windows
    svg += this.addProfessionalDoorsAndWindows(left, top, width, height, standards);
    
    return svg;
  }

  generateProfessional3Plus1Layout(left, top, width, height, standards) {
    // Similar to 2+1 but with additional bedroom
    return this.generateProfessional2Plus1Layout(left, top, width, height, standards);
  }

  generateProfessional4Plus1Layout(left, top, width, height, standards) {
    // Similar to 2+1 but with additional bedrooms
    return this.generateProfessional2Plus1Layout(left, top, width, height, standards);
  }

  addProfessionalDoorsAndWindows(left, top, width, height, standards) {
    let svg = '';
    
    // Entrance door with professional styling
    svg += `<use href="#door" x="${left + 25}" y="${top + height - 35}" width="30" height="30"/>
            <text x="${left + 40}" y="${top + height - 10}" class="measurement">GİRİŞ</text>`;
    
    // Windows with professional styling
    svg += `<use href="#window" x="${left + width/2 - 15}" y="${top + 15}" width="30" height="30"/>
            <use href="#window" x="${left + width/2 - 15}" y="${top + height - 45}" width="30" height="30"/>`;
    
    // Balcony with professional styling
    svg += `<rect x="${left + width/2 - 45}" y="${top - 30}" width="90" height="30" class="balcony" rx="5"/>
            <text x="${left + width/2}" y="${top - 10}" text-anchor="middle" class="room-label">BALKON</text>`;
    
    return svg;
  }

  generateProfessionalCommonAreas(width, height, margin, plan) {
    let svg = '';
    
    // Professional stairs
    svg += `<rect x="${width - margin - 80}" y="${height - margin - 100}" width="80" height="100" class="stairs" rx="10"/>
            <text x="${width - margin - 40}" y="${height - margin - 50}" text-anchor="middle" class="room-label">MERDİVEN</text>`;
    
    // Professional elevator
    svg += `<rect x="${width - margin - 80}" y="${height - margin - 140}" width="80" height="40" class="common-area" rx="8"/>
            <text x="${width - margin - 40}" y="${height - margin - 120}" text-anchor="middle" class="room-label">ASANSÖR</text>`;
    
    // Lobby area
    svg += `<rect x="${width - margin - 200}" y="${height - margin - 100}" width="120" height="100" fill="#e8eaf6" stroke="#3f51b5" stroke-width="3" rx="10"/>
            <text x="${width - margin - 140}" y="${height - margin - 50}" text-anchor="middle" class="room-label">LOBBY</text>`;
    
    return svg;
  }

  generateDetailedMeasurements(width, height, margin, plan, standards) {
    let svg = '';
    
    // Professional grid measurements
    for (let i = 0; i <= 12; i++) {
      const x = margin + (i * (width - 2*margin) / 12);
      svg += `<line x1="${x}" y1="${height - margin - 30}" x2="${x}" y2="${height - margin}" stroke="#546e7a" stroke-width="2"/>
              <text x="${x}" y="${height - margin + 20}" text-anchor="middle" class="measurement">${Math.round((i * (width - 2*margin) / 12) / 15)}m</text>`;
    }
    
    // Professional vertical measurements
    for (let i = 0; i <= 10; i++) {
      const y = margin + 80 + (i * (height - 2*margin - 80) / 10);
      svg += `<line x1="${margin - 30}" y1="${y}" x2="${margin}" y2="${y}" stroke="#546e7a" stroke-width="2"/>
              <text x="${margin - 35}" y="${y + 5}" text-anchor="middle" class="measurement">${Math.round((i * (height - 2*margin - 80) / 10) / 15)}m</text>`;
    }
    
    return svg;
  }

  generateProfessionalLegend(width, height) {
    return `
    <!-- Professional Legend -->
    <rect x="30" y="${height - 180}" width="280" height="150" fill="white" stroke="#1a237e" stroke-width="3" rx="10"/>
    <text x="50" y="${height - 160}" class="legend-text" style="font-size: 18px; font-weight: bold;">MİMARİ SEMBOLLER</text>
    
    <!-- Doors -->
    <use href="#door" x="50" y="${height - 140}" width="20" height="20"/>
    <text x="80" y="${height - 125}" class="legend-text">Kapı</text>
    
    <!-- Windows -->
    <use href="#window" x="50" y="${height - 110}" width="20" height="20"/>
    <text x="80" y="${height - 95}" class="legend-text">Pencere</text>
    
    <!-- Balcony -->
    <rect x="50" y="${height - 80}" width="20" height="20" class="balcony"/>
    <text x="80" y="${height - 65}" class="legend-text">Balkon</text>
    
    <!-- Stairs -->
    <rect x="50" y="${height - 50}" width="20" height="20" class="stairs"/>
    <text x="80" y="${height - 35}" class="legend-text">Merdiven</text>
    
    <!-- Furniture -->
    <use href="#bed" x="150" y="${height - 140}" width="20" height="20"/>
    <text x="180" y="${height - 125}" class="legend-text">Yatak</text>
    
    <use href="#sofa" x="150" y="${height - 110}" width="20" height="20"/>
    <text x="180" y="${height - 95}" class="legend-text">Koltuk</text>
    
    <use href="#table" x="150" y="${height - 80}" width="20" height="20"/>
    <text x="180" y="${height - 65}" class="legend-text">Masa</text>`;
  }

  generateRoomDetails(width, height, margin, plan, standards) {
    let svg = '';
    
    // Add furniture to rooms based on type
    if (plan.apartmentType === "2+1") {
      // Living room furniture
      svg += `<use href="#sofa" x="${margin + 100}" y="${margin + 120}" width="40" height="30"/>
              <use href="#table" x="${margin + 150}" y="${margin + 160}" width="30" height="30"/>`;
      
      // Bedroom furniture
      svg += `<use href="#bed" x="${margin + 400}" y="${margin + 120}" width="40" height="30"/>
              <use href="#table" x="${margin + 450}" y="${margin + 160}" width="30" height="30"/>`;
      
      // Second bedroom furniture
      svg += `<use href="#bed" x="${margin + 600}" y="${margin + 120}" width="40" height="30"/>
              <use href="#table" x="${margin + 650}" y="${margin + 160}" width="30" height="30"/>`;
    }
    
    return svg;
  }

  generateAllProfessionalPlans() {
    const plansDir = path.join(__dirname, '..', 'plans');
    
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    planData.floorPlans.forEach(plan => {
      const svg = this.generateProfessionalPlan(plan.id);
      if (svg) {
        const filename = plan.image.split('/').pop().replace('.jpg', '_professional.svg');
        const filepath = path.join(plansDir, filename);
        fs.writeFileSync(filepath, svg);
        console.log(`Generated professional plan: ${filename}`);
      }
    });
  }
}

module.exports = ProfessionalPlanGenerator;