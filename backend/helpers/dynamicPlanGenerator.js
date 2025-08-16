const planData = require("../planData.json");
const fs = require('fs');
const path = require('path');

class DynamicPlanGenerator {
  constructor() {
    // Mimari standartları
    this.architecturalStandards = {
      "1+1": { livingRoom: 22, bedroom: 12, kitchen: 8, bathroom: 4, hallway: 3, total: 49 },
      "2+1": { livingRoom: 26, bedroom1: 14, bedroom2: 12, kitchen: 10, bathroom: 5, hallway: 4, total: 71 },
      "3+1": { livingRoom: 30, bedroom1: 16, bedroom2: 14, bedroom3: 12, kitchen: 12, bathroom: 6, hallway: 5, total: 95 },
      "4+1": { livingRoom: 35, bedroom1: 18, bedroom2: 16, bedroom3: 14, bedroom4: 12, kitchen: 15, bathroom: 7, hallway: 6, total: 123 }
    };

    // Cephe konfigürasyonları
    this.facadeConfigs = {
      1: { // Tek cephe
        orientation: "north",
        balconyPosition: "front",
        windowDistribution: "front-heavy",
        entrancePosition: "side",
        parkingPosition: "back"
      },
      2: { // İki cephe (köşe)
        orientation: "north-east",
        balconyPosition: "both",
        windowDistribution: "balanced",
        entrancePosition: "corner",
        parkingPosition: "corner"
      },
      3: { // Üç cephe
        orientation: "north-east-south",
        balconyPosition: "three-sides",
        windowDistribution: "excellent",
        entrancePosition: "center",
        parkingPosition: "perimeter"
      },
      4: { // Dört cephe
        orientation: "all-directions",
        balconyPosition: "all-sides",
        windowDistribution: "maximum",
        entrancePosition: "multiple",
        parkingPosition: "underground"
      }
    };

    // Yol tipi konfigürasyonları
    this.streetConfigs = {
      "main": { width: 20, traffic: "high", noise: "high", view: "city" },
      "secondary": { width: 12, traffic: "medium", noise: "medium", view: "mixed" },
      "residential": { width: 8, traffic: "low", noise: "low", view: "quiet" },
      "pedestrian": { width: 6, traffic: "none", noise: "minimal", view: "garden" }
    };
  }

  generateDynamicPlan(planId, streetType = "residential") {
    const plan = planData.floorPlans.find(p => p.id === planId);
    if (!plan) return null;

    const facadeConfig = this.facadeConfigs[plan.streetFacingSides];
    const streetConfig = this.streetConfigs[streetType];
    const standards = this.architecturalStandards[plan.apartmentType];

    console.log(`Generating dynamic plan for ${plan.apartmentType} with ${plan.streetFacingSides} facades on ${streetType} street`);

    const width = 1200;
    const height = 800;
    const margin = 60;

    let svg = this.generateDynamicSVGHeader(width, height, plan, facadeConfig, streetConfig);
    
    // Generate dynamic building structure based on facades
    svg += this.generateDynamicBuildingStructure(width, height, margin, plan, facadeConfig, streetConfig);
    
    // Generate dynamic apartment layouts
    svg += this.generateDynamicApartmentLayouts(width, height, margin, plan, standards, facadeConfig);
    
    // Generate dynamic common areas
    svg += this.generateDynamicCommonAreas(width, height, margin, plan, facadeConfig, streetConfig);
    
    // Generate dynamic measurements
    svg += this.generateDynamicMeasurements(width, height, margin, plan, standards);
    
    // Generate dynamic legend
    svg += this.generateDynamicLegend(width, height, facadeConfig, streetConfig);
    
    svg += '</svg>';
    return svg;
  }

  generateDynamicSVGHeader(width, height, plan, facadeConfig, streetConfig) {
    const colors = this.getDynamicColorScheme(plan.apartmentType, facadeConfig, streetConfig);
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .plan-title { font: bold 28px 'Segoe UI', Arial; fill: #1a237e; }
      .room-label { font: bold 16px 'Segoe UI', Arial; fill: #263238; }
      .measurement { font: 14px 'Segoe UI', Arial; fill: #546e7a; }
      .legend-text { font: 14px 'Segoe UI', Arial; fill: #1a237e; }
      .building-outline { fill: ${colors.primary}; stroke: #1a237e; stroke-width: 4; }
      .facade-highlight { fill: ${colors.accent}; stroke: #d32f2f; stroke-width: 3; }
      .street-area { fill: ${colors.street}; stroke: #666; stroke-width: 2; }
      .balcony { fill: ${colors.secondary}; stroke: #388e3c; stroke-width: 3; }
      .common-area { fill: #fff9c4; stroke: #f57f17; stroke-width: 3; }
      .stairs { fill: #e1bee7; stroke: #7b1fa2; stroke-width: 3; }
      .parking { fill: #e8eaf6; stroke: #3f51b5; stroke-width: 2; }
      .grid-line { stroke: #e0e0e0; stroke-width: 1; opacity: 0.6; }
    </style>
    
    <!-- Dynamic symbols based on facade configuration -->
    ${this.generateDynamicSymbols(facadeConfig)}
  </defs>
  
  <!-- Background with grid -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="#fafafa"/>
  
  <!-- Dynamic grid system -->
  ${this.generateDynamicGrid(width, height, facadeConfig)}
  
  <!-- Title with dynamic information -->
  <rect x="20" y="20" width="${width-40}" height="60" fill="white" stroke="#1a237e" stroke-width="2" rx="10"/>
  <text x="${width/2}" y="50" text-anchor="middle" class="plan-title">${plan.name}</text>
  <text x="${width/2}" y="70" text-anchor="middle" class="measurement">${plan.streetFacingSides} Cephe - ${streetConfig.width}m Yol</text>
  
  <!-- Dynamic north arrow based on facade orientation -->
  ${this.generateDynamicNorthArrow(width, height, facadeConfig)}`;
  }

  getDynamicColorScheme(apartmentType, facadeConfig, streetConfig) {
    const baseColors = {
      "1+1": { primary: "#e3f2fd", secondary: "#bbdefb", accent: "#2196f3" },
      "2+1": { primary: "#f3e5f5", secondary: "#e1bee7", accent: "#9c27b0" },
      "3+1": { primary: "#e8f5e8", secondary: "#c8e6c9", accent: "#4caf50" },
      "4+1": { primary: "#fff3e0", secondary: "#ffe0b2", accent: "#ff9800" }
    };

    const colors = baseColors[apartmentType];
    
    // Adjust colors based on street type
    if (streetConfig.traffic === "high") {
      colors.street = "#ffebee"; // Light red for busy streets
    } else if (streetConfig.traffic === "low") {
      colors.street = "#e8f5e8"; // Light green for quiet streets
    } else {
      colors.street = "#fff3e0"; // Light orange for medium traffic
    }

    return colors;
  }

  generateDynamicSymbols(facadeConfig) {
    let symbols = '';
    
    // Door symbols based on facade configuration
    if (facadeConfig.entrancePosition === "corner") {
      symbols += `
      <symbol id="corner-door" viewBox="0 0 30 30">
        <rect x="2" y="2" width="26" height="26" fill="none" stroke="#d32f2f" stroke-width="3"/>
        <circle cx="22" cy="15" r="3" fill="#d32f2f"/>
        <line x1="15" y1="15" x2="22" y2="15" stroke="#d32f2f" stroke-width="2"/>
        <path d="M2 2 L30 30" stroke="#d32f2f" stroke-width="2"/>
      </symbol>`;
    }

    // Window symbols based on distribution
    if (facadeConfig.windowDistribution === "front-heavy") {
      symbols += `
      <symbol id="large-window" viewBox="0 0 40 30">
        <rect x="2" y="2" width="36" height="26" fill="none" stroke="#1976d2" stroke-width="3"/>
        <line x1="2" y1="15" x2="38" y2="15" stroke="#1976d2" stroke-width="2"/>
        <line x1="20" y1="2" x2="20" y2="28" stroke="#1976d2" stroke-width="2"/>
      </symbol>`;
    }

    return symbols;
  }

  generateDynamicGrid(width, height, facadeConfig) {
    let svg = '';
    const gridSize = facadeConfig.orientation.includes("all") ? 20 : 30;
    
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

  generateDynamicNorthArrow(width, height, facadeConfig) {
    const arrowConfig = {
      "north": { x: width-100, y: 80, rotation: 0 },
      "north-east": { x: width-120, y: 100, rotation: -45 },
      "north-east-south": { x: width-140, y: 120, rotation: -30 },
      "all-directions": { x: width-160, y: 140, rotation: 0 }
    };

    const config = arrowConfig[facadeConfig.orientation] || arrowConfig["north"];
    
    return `
    <g transform="translate(${config.x}, ${config.y}) rotate(${config.rotation})">
      <circle cx="20" cy="20" r="25" fill="white" stroke="#1a237e" stroke-width="3"/>
      <polygon points="20,0 30,20 20,15 10,20" fill="#1a237e"/>
      <text x="20" y="45" text-anchor="middle" class="legend-text">K</text>
      <text x="20" y="60" text-anchor="middle" class="legend-text">KUZEY</text>
    </g>`;
  }

  generateDynamicBuildingStructure(width, height, margin, plan, facadeConfig, streetConfig) {
    let svg = '';
    
    // Main building outline with dynamic positioning
    const buildingWidth = width - 2*margin;
    const buildingHeight = height - 2*margin - 80;
    const buildingLeft = margin;
    const buildingTop = margin + 80;
    
    svg += `<rect x="${buildingLeft}" y="${buildingTop}" width="${buildingWidth}" height="${buildingHeight}" class="building-outline" rx="15"/>`;
    
    // Dynamic street areas based on facade configuration
    svg += this.generateDynamicStreetAreas(width, height, margin, facadeConfig, streetConfig);
    
    // Dynamic facade highlights
    svg += this.generateDynamicFacadeHighlights(width, height, margin, facadeConfig);
    
    return svg;
  }

  generateDynamicStreetAreas(width, height, margin, facadeConfig, streetConfig) {
    let svg = '';
    
    if (facadeConfig.orientation === "north") {
      // Single street at top
      svg += `<rect x="${margin + 20}" y="${margin + 20}" width="120" height="40" class="street-area" rx="5"/>
              <text x="${margin + 80}" y="${margin + 45}" text-anchor="middle" class="legend-text">${streetConfig.width}m YOL</text>`;
    } else if (facadeConfig.orientation === "north-east") {
      // Two streets at top and right
      svg += `<rect x="${margin + 20}" y="${margin + 20}" width="120" height="40" class="street-area" rx="5"/>
              <text x="${margin + 80}" y="${margin + 45}" text-anchor="middle" class="legend-text">${streetConfig.width}m YOL</text>`;
      svg += `<rect x="${width - margin - 60}" y="${margin + 20}" width="40" height="120" class="street-area" rx="5"/>
              <text x="${width - margin - 40}" y="${margin + 80}" text-anchor="middle" class="legend-text" transform="rotate(90, ${width - margin - 40}, ${margin + 80})">${streetConfig.width}m YOL</text>`;
    } else if (facadeConfig.orientation === "north-east-south") {
      // Three streets
      svg += `<rect x="${margin + 20}" y="${margin + 20}" width="120" height="40" class="street-area" rx="5"/>
              <text x="${margin + 80}" y="${margin + 45}" text-anchor="middle" class="legend-text">${streetConfig.width}m YOL</text>`;
      svg += `<rect x="${width - margin - 60}" y="${margin + 20}" width="40" height="120" class="street-area" rx="5"/>
              <text x="${width - margin - 40}" y="${margin + 80}" text-anchor="middle" class="legend-text" transform="rotate(90, ${width - margin - 40}, ${margin + 80})">${streetConfig.width}m YOL</text>`;
      svg += `<rect x="${margin + 20}" y="${height - margin - 60}" width="120" height="40" class="street-area" rx="5"/>
              <text x="${margin + 80}" y="${height - margin - 35}" text-anchor="middle" class="legend-text">${streetConfig.width}m YOL</text>`;
    } else if (facadeConfig.orientation === "all-directions") {
      // Four streets
      svg += `<rect x="${margin + 20}" y="${margin + 20}" width="120" height="40" class="street-area" rx="5"/>
              <text x="${margin + 80}" y="${margin + 45}" text-anchor="middle" class="legend-text">${streetConfig.width}m YOL</text>`;
      svg += `<rect x="${width - margin - 60}" y="${margin + 20}" width="40" height="120" class="street-area" rx="5"/>
              <text x="${width - margin - 40}" y="${margin + 80}" text-anchor="middle" class="legend-text" transform="rotate(90, ${width - margin - 40}, ${margin + 80})">${streetConfig.width}m YOL</text>`;
      svg += `<rect x="${margin + 20}" y="${height - margin - 60}" width="120" height="40" class="street-area" rx="5"/>
              <text x="${margin + 80}" y="${height - margin - 35}" text-anchor="middle" class="legend-text">${streetConfig.width}m YOL</text>`;
      svg += `<rect x="${margin + 20}" y="${margin + 20}" width="40" height="120" class="street-area" rx="5"/>
              <text x="${margin + 40}" y="${margin + 80}" text-anchor="middle" class="legend-text" transform="rotate(90, ${margin + 40}, ${margin + 80})">${streetConfig.width}m YOL</text>`;
    }
    
    return svg;
  }

  generateDynamicFacadeHighlights(width, height, margin, facadeConfig) {
    let svg = '';
    
    if (facadeConfig.orientation === "north") {
      // Highlight top facade
      svg += `<rect x="${margin + 10}" y="${margin + 70}" width="${width - 2*margin - 20}" height="10" class="facade-highlight" rx="5"/>`;
    } else if (facadeConfig.orientation === "north-east") {
      // Highlight top and right facades
      svg += `<rect x="${margin + 10}" y="${margin + 70}" width="${width - 2*margin - 20}" height="10" class="facade-highlight" rx="5"/>`;
      svg += `<rect x="${width - margin - 20}" y="${margin + 70}" width="10" height="${height - 2*margin - 80}" class="facade-highlight" rx="5"/>`;
    } else if (facadeConfig.orientation === "north-east-south") {
      // Highlight three facades
      svg += `<rect x="${margin + 10}" y="${margin + 70}" width="${width - 2*margin - 20}" height="10" class="facade-highlight" rx="5"/>`;
      svg += `<rect x="${width - margin - 20}" y="${margin + 70}" width="10" height="${height - 2*margin - 80}" class="facade-highlight" rx="5"/>`;
      svg += `<rect x="${margin + 10}" y="${height - margin - 20}" width="${width - 2*margin - 20}" height="10" class="facade-highlight" rx="5"/>`;
    } else if (facadeConfig.orientation === "all-directions") {
      // Highlight all facades
      svg += `<rect x="${margin + 10}" y="${margin + 70}" width="${width - 2*margin - 20}" height="10" class="facade-highlight" rx="5"/>`;
      svg += `<rect x="${width - margin - 20}" y="${margin + 70}" width="10" height="${height - 2*margin - 80}" class="facade-highlight" rx="5"/>`;
      svg += `<rect x="${margin + 10}" y="${height - margin - 20}" width="${width - 2*margin - 20}" height="10" class="facade-highlight" rx="5"/>`;
      svg += `<rect x="${margin + 10}" y="${margin + 70}" width="10" height="${height - 2*margin - 80}" class="facade-highlight" rx="5"/>`;
    }
    
    return svg;
  }

  generateDynamicApartmentLayouts(width, height, margin, plan, standards, facadeConfig) {
    let svg = '';
    const buildingWidth = width - 2*margin;
    const buildingHeight = height - 2*margin - 80;
    const buildingLeft = margin;
    const buildingTop = margin + 80;
    
    if (plan.apartmentType === "1+1") {
      svg += this.generateDynamic1Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards, facadeConfig);
    } else if (plan.apartmentType === "2+1") {
      svg += this.generateDynamic2Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards, facadeConfig);
    } else if (plan.apartmentType === "3+1") {
      svg += this.generateDynamic3Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards, facadeConfig);
    } else if (plan.apartmentType === "4+1") {
      svg += this.generateDynamic4Plus1Layout(buildingLeft, buildingTop, buildingWidth, buildingHeight, standards, facadeConfig);
    }
    
    return svg;
  }

  generateDynamic2Plus1Layout(left, top, width, height, standards, facadeConfig) {
    let svg = '';
    
    // Calculate room dimensions based on facade configuration
    const totalWidth = width;
    const totalHeight = height;
    
    // Adjust room proportions based on facade orientation
    let livingRoomWidth, bedroom1Width, bedroom2Width;
    
    if (facadeConfig.orientation === "north") {
      // Single facade - living room gets more width
      livingRoomWidth = (standards.livingRoom / standards.total) * totalWidth * 1.2;
      bedroom1Width = (standards.bedroom1 / standards.total) * totalWidth * 0.9;
      bedroom2Width = (standards.bedroom2 / standards.total) * totalWidth * 0.9;
    } else if (facadeConfig.orientation === "north-east") {
      // Two facades - balanced distribution
      livingRoomWidth = (standards.livingRoom / standards.total) * totalWidth;
      bedroom1Width = (standards.bedroom1 / standards.total) * totalWidth;
      bedroom2Width = (standards.bedroom2 / standards.total) * totalWidth;
    } else {
      // Multiple facades - bedrooms get more width for better light
      livingRoomWidth = (standards.livingRoom / standards.total) * totalWidth * 0.8;
      bedroom1Width = (standards.bedroom1 / standards.total) * totalWidth * 1.1;
      bedroom2Width = (standards.bedroom2 / standards.total) * totalWidth * 1.1;
    }
    
    // Living Room with dynamic positioning
    svg += `<rect x="${left}" y="${top}" width="${livingRoomWidth}" height="${totalHeight}" fill="#e3f2fd" stroke="#1976d2" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">SALON</text>
            <text x="${left + livingRoomWidth/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.livingRoom} m²</text>`;
    
    // Main Bedroom
    svg += `<rect x="${left + livingRoomWidth}" y="${top}" width="${bedroom1Width}" height="${totalHeight}" fill="#f3e5f5" stroke="#9c27b0" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">ANA YATAK</text>
            <text x="${left + livingRoomWidth + bedroom1Width/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.bedroom1} m²</text>`;
    
    // Second Bedroom
    svg += `<rect x="${left + livingRoomWidth + bedroom1Width}" y="${top}" width="${bedroom2Width}" height="${totalHeight}" fill="#e8f5e8" stroke="#4caf50" stroke-width="3" rx="8"/>
            <text x="${left + livingRoomWidth + bedroom1Width + bedroom2Width/2}" y="${top + totalHeight/2}" text-anchor="middle" class="room-label">ÇOCUK ODASI</text>
            <text x="${left + livingRoomWidth + bedroom1Width + bedroom2Width/2}" y="${top + totalHeight/2 + 25}" text-anchor="middle" class="measurement">${standards.bedroom2} m²</text>`;
    
    // Dynamic kitchen and bathroom positioning
    svg += this.generateDynamicKitchenBathroom(left, top, width, height, standards, facadeConfig);
    
    // Dynamic balcony positioning
    svg += this.generateDynamicBalcony(left, top, width, height, facadeConfig);
    
    return svg;
  }

  generateDynamicKitchenBathroom(left, top, width, height, standards, facadeConfig) {
    let svg = '';
    
    // Kitchen positioning based on facade
    if (facadeConfig.orientation === "north") {
      // Single facade - kitchen at back
      svg += `<rect x="${left + 15}" y="${top + height - 60}" width="120" height="45" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="5"/>
              <text x="${left + 75}" y="${top + height - 37}" text-anchor="middle" class="room-label">MUTFAK</text>`;
    } else {
      // Multiple facades - kitchen gets better light
      svg += `<rect x="${left + 15}" y="${top + height - 60}" width="150" height="45" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="5"/>
              <text x="${left + 90}" y="${top + height - 37}" text-anchor="middle" class="room-label">MUTFAK</text>`;
    }
    
    // Bathroom positioning
    svg += `<rect x="${left + width - 75}" y="${top + height - 60}" width="60" height="45" fill="#e8f5e8" stroke="#388e3c" stroke-width="2" rx="5"/>
            <text x="${left + width - 45}" y="${top + height - 37}" text-anchor="middle" class="room-label">BANYO</text>`;
    
    return svg;
  }

  generateDynamicBalcony(left, top, width, height, facadeConfig) {
    let svg = '';
    
    if (facadeConfig.balconyPosition === "front") {
      // Single balcony at front
      svg += `<rect x="${left + width/2 - 45}" y="${top - 30}" width="90" height="30" class="balcony" rx="5"/>
              <text x="${left + width/2}" y="${top - 10}" text-anchor="middle" class="room-label">BALKON</text>`;
    } else if (facadeConfig.balconyPosition === "both") {
      // Balconies on both facades
      svg += `<rect x="${left + width/2 - 45}" y="${top - 30}" width="90" height="30" class="balcony" rx="5"/>
              <text x="${left + width/2}" y="${top - 10}" text-anchor="middle" class="room-label">BALKON</text>`;
      svg += `<rect x="${left + width - 30}" y="${top + height/2 - 45}" width="30" height="90" class="balcony" rx="5"/>
              <text x="${left + width - 15}" y="${top + height/2}" text-anchor="middle" class="room-label" transform="rotate(90, ${left + width - 15}, ${top + height/2})">BALKON</text>`;
    } else if (facadeConfig.balconyPosition === "three-sides") {
      // Balconies on three sides
      svg += `<rect x="${left + width/2 - 45}" y="${top - 30}" width="90" height="30" class="balcony" rx="5"/>
              <text x="${left + width/2}" y="${top - 10}" text-anchor="middle" class="room-label">BALKON</text>`;
      svg += `<rect x="${left + width - 30}" y="${top + height/2 - 45}" width="30" height="90" class="balcony" rx="5"/>
              <text x="${left + width - 15}" y="${top + height/2}" text-anchor="middle" class="room-label" transform="rotate(90, ${left + width - 15}, ${top + height/2})">BALKON</text>`;
      svg += `<rect x="${left + width/2 - 45}" y="${top + height}" width="90" height="30" class="balcony" rx="5"/>
              <text x="${left + width/2}" y="${top + height + 20}" text-anchor="middle" class="room-label">BALKON</text>`;
    } else if (facadeConfig.balconyPosition === "all-sides") {
      // Balconies on all sides
      svg += `<rect x="${left + width/2 - 45}" y="${top - 30}" width="90" height="30" class="balcony" rx="5"/>
              <text x="${left + width/2}" y="${top - 10}" text-anchor="middle" class="room-label">BALKON</text>`;
      svg += `<rect x="${left + width - 30}" y="${top + height/2 - 45}" width="30" height="90" class="balcony" rx="5"/>
              <text x="${left + width - 15}" y="${top + height/2}" text-anchor="middle" class="room-label" transform="rotate(90, ${left + width - 15}, ${top + height/2})">BALKON</text>`;
      svg += `<rect x="${left + width/2 - 45}" y="${top + height}" width="90" height="30" class="balcony" rx="5"/>
              <text x="${left + width/2}" y="${top + height + 20}" text-anchor="middle" class="room-label">BALKON</text>`;
      svg += `<rect x="${left - 30}" y="${top + height/2 - 45}" width="30" height="90" class="balcony" rx="5"/>
              <text x="${left - 15}" y="${top + height/2}" text-anchor="middle" class="room-label" transform="rotate(90, ${left - 15}, ${top + height/2})">BALKON</text>`;
    }
    
    return svg;
  }

  // Simplified versions for other apartment types
  generateDynamic1Plus1Layout(left, top, width, height, standards, facadeConfig) {
    return this.generateDynamic2Plus1Layout(left, top, width, height, standards, facadeConfig);
  }

  generateDynamic3Plus1Layout(left, top, width, height, standards, facadeConfig) {
    return this.generateDynamic2Plus1Layout(left, top, width, height, standards, facadeConfig);
  }

  generateDynamic4Plus1Layout(left, top, width, height, standards, facadeConfig) {
    return this.generateDynamic2Plus1Layout(left, top, width, height, standards, facadeConfig);
  }

  generateDynamicCommonAreas(width, height, margin, plan, facadeConfig, streetConfig) {
    let svg = '';
    
    // Dynamic parking based on street configuration
    if (streetConfig.traffic === "high") {
      // Underground parking for busy streets
      svg += `<rect x="${width - margin - 200}" y="${height - margin - 100}" width="200" height="100" fill="#e8eaf6" stroke="#3f51b5" stroke-width="3" rx="10"/>
              <text x="${width - margin - 100}" y="${height - margin - 50}" text-anchor="middle" class="room-label">YERALTI OTOPARK</text>`;
    } else {
      // Surface parking for quiet streets
      svg += `<rect x="${width - margin - 200}" y="${height - margin - 100}" width="200" height="100" class="parking" rx="10"/>
              <text x="${width - margin - 100}" y="${height - margin - 50}" text-anchor="middle" class="room-label">OTOPARK</text>`;
    }
    
    // Stairs and elevator
    svg += `<rect x="${width - margin - 80}" y="${height - margin - 100}" width="80" height="100" class="stairs" rx="10"/>
            <text x="${width - margin - 40}" y="${height - margin - 50}" text-anchor="middle" class="room-label">MERDİVEN</text>`;
    
    svg += `<rect x="${width - margin - 80}" y="${height - margin - 140}" width="80" height="40" class="common-area" rx="8"/>
            <text x="${width - margin - 40}" y="${height - margin - 120}" text-anchor="middle" class="room-label">ASANSÖR</text>`;
    
    return svg;
  }

  generateDynamicMeasurements(width, height, margin, plan, standards) {
    let svg = '';
    
    // Dynamic measurements based on facade configuration
    const facadeCount = plan.streetFacingSides;
    const measurementPoints = facadeCount === 1 ? 8 : facadeCount === 2 ? 10 : facadeCount === 3 ? 12 : 15;
    
    for (let i = 0; i <= measurementPoints; i++) {
      const x = margin + (i * (width - 2*margin) / measurementPoints);
      svg += `<line x1="${x}" y1="${height - margin - 30}" x2="${x}" y2="${height - margin}" stroke="#546e7a" stroke-width="2"/>
              <text x="${x}" y="${height - margin + 20}" text-anchor="middle" class="measurement">${Math.round((i * (width - 2*margin) / measurementPoints) / 15)}m</text>`;
    }
    
    return svg;
  }

  generateDynamicLegend(width, height, facadeConfig, streetConfig) {
    return `
    <!-- Dynamic Legend -->
    <rect x="30" y="${height - 200}" width="320" height="170" fill="white" stroke="#1a237e" stroke-width="3" rx="10"/>
    <text x="50" y="${height - 180}" class="legend-text" style="font-size: 18px; font-weight: bold;">DİNAMİK MİMARİ ÖZELLİKLER</text>
    
    <!-- Facade Information -->
    <text x="50" y="${height - 160}" class="legend-text">Cephe Sayısı: ${facadeConfig.orientation}</text>
    <text x="50" y="${height - 140}" class="legend-text">Yol Genişliği: ${streetConfig.width}m</text>
    <text x="50" y="${height - 120}" class="legend-text">Trafik: ${streetConfig.traffic}</text>
    <text x="50" y="${height - 100}" class="legend-text">Gürültü: ${streetConfig.noise}</text>
    
    <!-- Dynamic Features -->
    <text x="50" y="${height - 80}" class="legend-text">Balkon: ${facadeConfig.balconyPosition}</text>
    <text x="50" y="${height - 60}" class="legend-text">Giriş: ${facadeConfig.entrancePosition}</text>
    <text x="50" y="${height - 40}" class="legend-text">Pencere: ${facadeConfig.windowDistribution}</text>`;
  }

  generateAllDynamicPlans(streetType = "residential") {
    const plansDir = path.join(__dirname, '..', 'plans');
    
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    planData.floorPlans.forEach(plan => {
      const svg = this.generateDynamicPlan(plan.id, streetType);
      if (svg) {
        const filename = plan.image.split('/').pop().replace('.svg', `_dynamic_${streetType}.svg`);
        const filepath = path.join(plansDir, filename);
        fs.writeFileSync(filepath, svg);
        console.log(`Generated dynamic plan: ${filename}`);
      }
    });
  }
}

module.exports = DynamicPlanGenerator;