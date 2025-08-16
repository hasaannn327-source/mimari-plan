const planData = require("../planData.json");

class SmartFurniturePlanner {
  constructor() {
    // Feng Shui prensipleri
    this.fengShuiPrinciples = {
      bagua: {
        'north': { element: 'water', color: 'blue', furniture: ['sofa', 'chairs'], avoid: ['fire', 'electronics'] },
        'northeast': { element: 'earth', color: 'yellow', furniture: ['study', 'desk'], avoid: ['water', 'bathroom'] },
        'east': { element: 'wood', color: 'green', furniture: ['plants', 'wooden'], avoid: ['metal', 'sharp'] },
        'southeast': { element: 'wood', color: 'green', furniture: ['plants', 'wealth'], avoid: ['metal', 'clutter'] },
        'south': { element: 'fire', color: 'red', furniture: ['fireplace', 'candles'], avoid: ['water', 'bathroom'] },
        'southwest': { element: 'earth', color: 'yellow', furniture: ['bed', 'romance'], avoid: ['water', 'clutter'] },
        'west': { element: 'metal', color: 'white', furniture: ['metal', 'children'], avoid: ['fire', 'sharp'] },
        'northwest': { element: 'metal', color: 'white', furniture: ['metal', 'helpful'], avoid: ['fire', 'clutter'] }
      },
      
      elements: {
        'wood': { shapes: ['rectangular', 'tall'], colors: ['green', 'brown'], materials: ['wood', 'bamboo'] },
        'fire': { shapes: ['triangular', 'pointed'], colors: ['red', 'orange'], materials: ['silk', 'cotton'] },
        'earth': { shapes: ['square', 'flat'], colors: ['yellow', 'brown'], materials: ['ceramic', 'stone'] },
        'metal': { shapes: ['circular', 'oval'], colors: ['white', 'gray'], materials: ['metal', 'glass'] },
        'water': { shapes: ['wavy', 'irregular'], colors: ['blue', 'black'], materials: ['water', 'mirror'] }
      }
    };

    // Mobilya veritabanı
    this.furnitureDatabase = {
      'livingRoom': [
        {
          name: 'Modern Koltuk Takımı',
          type: 'sofa',
          dimensions: { width: 2.4, depth: 0.9, height: 0.8 },
          materials: ['fabric', 'wood'],
          colors: ['gray', 'beige', 'blue'],
          fengShui: { element: 'earth', direction: 'south', bagua: 'fame' },
          price: { min: 5000, max: 15000 },
          style: 'modern',
          comfort: 9,
          durability: 8
        },
        {
          name: 'Kahve Masası',
          type: 'table',
          dimensions: { width: 1.2, depth: 0.6, height: 0.45 },
          materials: ['wood', 'glass'],
          colors: ['brown', 'black', 'white'],
          fengShui: { element: 'earth', direction: 'center', bagua: 'health' },
          price: { min: 800, max: 2500 },
          style: 'modern',
          comfort: 7,
          durability: 9
        },
        {
          name: 'TV Ünitesi',
          type: 'entertainment',
          dimensions: { width: 1.8, depth: 0.5, height: 0.6 },
          materials: ['wood', 'metal'],
          colors: ['brown', 'black', 'white'],
          fengShui: { element: 'fire', direction: 'south', bagua: 'fame' },
          price: { min: 1200, max: 4000 },
          style: 'modern',
          comfort: 6,
          durability: 8
        }
      ],
      
      'bedroom': [
        {
          name: 'Çift Kişilik Yatak',
          type: 'bed',
          dimensions: { width: 1.6, depth: 2.0, height: 0.4 },
          materials: ['wood', 'fabric'],
          colors: ['brown', 'white', 'gray'],
          fengShui: { element: 'earth', direction: 'southwest', bagua: 'romance' },
          price: { min: 3000, max: 8000 },
          style: 'modern',
          comfort: 10,
          durability: 9
        },
        {
          name: 'Şifonyer',
          type: 'storage',
          dimensions: { width: 1.2, depth: 0.5, height: 0.8 },
          materials: ['wood'],
          colors: ['brown', 'white'],
          fengShui: { element: 'wood', direction: 'east', bagua: 'family' },
          price: { min: 1500, max: 4000 },
          style: 'modern',
          comfort: 5,
          durability: 9
        },
        {
          name: 'Gece Lambası',
          type: 'lighting',
          dimensions: { width: 0.3, depth: 0.3, height: 0.6 },
          materials: ['metal', 'glass'],
          colors: ['white', 'black', 'gold'],
          fengShui: { element: 'fire', direction: 'south', bagua: 'fame' },
          price: { min: 200, max: 800 },
          style: 'modern',
          comfort: 8,
          durability: 7
        }
      ],
      
      'kitchen': [
        {
          name: 'Mutfak Adası',
          type: 'counter',
          dimensions: { width: 1.2, depth: 0.6, height: 0.9 },
          materials: ['stone', 'wood'],
          colors: ['white', 'gray', 'brown'],
          fengShui: { element: 'fire', direction: 'south', bagua: 'fame' },
          price: { min: 2500, max: 6000 },
          style: 'modern',
          comfort: 8,
          durability: 10
        },
        {
          name: 'Bulaşık Makinesi',
          type: 'appliance',
          dimensions: { width: 0.6, depth: 0.6, height: 0.85 },
          materials: ['metal', 'plastic'],
          colors: ['white', 'black', 'stainless'],
          fengShui: { element: 'metal', direction: 'west', bagua: 'children' },
          price: { min: 3000, max: 8000 },
          style: 'modern',
          comfort: 9,
          durability: 9
        },
        {
          name: 'Buzdolabı',
          type: 'appliance',
          dimensions: { width: 0.7, depth: 0.7, height: 1.8 },
          materials: ['metal', 'plastic'],
          colors: ['white', 'black', 'stainless'],
          fengShui: { element: 'water', direction: 'north', bagua: 'career' },
          price: { min: 5000, max: 15000 },
          style: 'modern',
          comfort: 8,
          durability: 10
        }
      ],
      
      'bathroom': [
        {
          name: 'Çift Lavabo',
          type: 'sink',
          dimensions: { width: 1.2, depth: 0.5, height: 0.2 },
          materials: ['ceramic', 'stone'],
          colors: ['white', 'beige', 'gray'],
          fengShui: { element: 'water', direction: 'north', bagua: 'career' },
          price: { min: 800, max: 2500 },
          style: 'modern',
          comfort: 8,
          durability: 10
        },
        {
          name: 'Duşakabin',
          type: 'shower',
          dimensions: { width: 0.9, depth: 0.9, height: 2.1 },
          materials: ['glass', 'metal'],
          colors: ['clear', 'frosted', 'tinted'],
          fengShui: { element: 'water', direction: 'north', bagua: 'career' },
          price: { min: 1500, max: 4000 },
          style: 'modern',
          comfort: 9,
          durability: 8
        }
      ]
    };

    // Erişilebilirlik standartları
    this.accessibilityStandards = {
      'wheelchair': {
        'doorWidth': 0.9,
        'corridorWidth': 1.2,
        'turnRadius': 1.5,
        'counterHeight': 0.85,
        'sinkHeight': 0.85
      },
      'elderly': {
        'stepHeight': 0.15,
        'handrailHeight': 0.9,
        'lightingLevel': 'high',
        'contrastRatio': 'high'
      },
      'children': {
        'counterHeight': 0.6,
        'sinkHeight': 0.6,
        'safetyEdges': true,
        'nonToxicMaterials': true
      }
    };
  }

  generateSmartFurniturePlan(planId, userPreferences = {}) {
    const plan = planData.floorPlans.find(p => p.id === planId);
    if (!plan) return null;

    const {
      budget = 50000,
      style = 'modern',
      accessibility = ['standard'],
      fengShui = true,
      roomPriority = 'livingRoom',
      colorScheme = 'neutral'
    } = userPreferences;

    console.log(`Generating smart furniture plan for ${plan.apartmentType} with budget: ${budget}TL`);

    // Akıllı mobilya seçimi
    const furnitureSelections = this.selectSmartFurniture(plan, userPreferences);
    
    // Feng Shui yerleşimi
    const fengShuiLayout = fengShui ? this.applyFengShuiPrinciples(furnitureSelections, plan) : furnitureSelections;
    
    // Erişilebilirlik optimizasyonu
    const accessibilityLayout = this.optimizeAccessibility(fengShuiLayout, accessibility);
    
    // Bütçe optimizasyonu
    const budgetOptimizedLayout = this.optimizeBudget(accessibilityLayout, budget);
    
    // Stil uyumluluğu
    const styleOptimizedLayout = this.optimizeStyle(budgetOptimizedLayout, style, colorScheme);
    
    return {
      plan: plan,
      furniture: styleOptimizedLayout,
      totalCost: this.calculateTotalCost(styleOptimizedLayout),
      fengShuiScore: this.calculateFengShuiScore(styleOptimizedLayout),
      accessibilityScore: this.calculateAccessibilityScore(styleOptimizedLayout),
      recommendations: this.generateRecommendations(styleOptimizedLayout, userPreferences)
    };
  }

  selectSmartFurniture(plan, preferences) {
    const selections = {};
    const standards = this.getRoomStandards(plan.apartmentType);
    
    Object.entries(standards).forEach(([roomType, dimensions]) => {
      if (roomType === 'total') return;
      
      const roomFurniture = this.furnitureDatabase[roomType] || this.furnitureDatabase['livingRoom'];
      const selectedFurniture = this.selectBestFurniture(roomFurniture, dimensions, preferences);
      
      selections[roomType] = selectedFurniture;
    });
    
    return selections;
  }

  selectBestFurniture(furnitureList, roomDimensions, preferences) {
    // AI algoritması: Mobilya seçimi
    let bestFurniture = [];
    let maxScore = 0;
    
    // Kombinasyonları dene
    const combinations = this.generateFurnitureCombinations(furnitureList, roomDimensions);
    
    combinations.forEach(combination => {
      const score = this.calculateFurnitureScore(combination, roomDimensions, preferences);
      
      if (score > maxScore) {
        maxScore = score;
        bestFurniture = combination;
      }
    });
    
    return bestFurniture;
  }

  generateFurnitureCombinations(furnitureList, roomDimensions) {
    const combinations = [];
    const maxItems = Math.floor(roomDimensions.width * roomDimensions.length / 4); // Her 4m² için 1 mobilya
    
    // Basit kombinasyonlar (3-5 mobilya)
    for (let i = 3; i <= Math.min(maxItems, 5); i++) {
      const combination = this.selectRandomFurniture(furnitureList, i);
      if (this.validateFurnitureFit(combination, roomDimensions)) {
        combinations.push(combination);
      }
    }
    
    return combinations;
  }

  selectRandomFurniture(furnitureList, count) {
    const shuffled = [...furnitureList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  validateFurnitureFit(furniture, roomDimensions) {
    let totalArea = 0;
    let maxWidth = 0;
    let maxDepth = 0;
    
    furniture.forEach(item => {
      totalArea += item.dimensions.width * item.dimensions.depth;
      maxWidth = Math.max(maxWidth, item.dimensions.width);
      maxDepth = Math.max(maxDepth, item.dimensions.depth);
    });
    
    const roomArea = roomDimensions.width * roomDimensions.length;
    const availableArea = roomArea * 0.6; // %60 mobilya için
    
    return totalArea <= availableArea && maxWidth <= roomDimensions.width && maxDepth <= roomDimensions.length;
  }

  calculateFurnitureScore(furniture, roomDimensions, preferences) {
    let score = 0;
    
    furniture.forEach(item => {
      // Temel puan
      score += item.comfort * 2;
      score += item.durability * 1.5;
      
      // Stil uyumu
      if (item.style === preferences.style) score += 5;
      
      // Renk uyumu
      if (this.isColorCompatible(item.colors, preferences.colorScheme)) score += 3;
      
      // Boyut uyumu
      const sizeScore = this.calculateSizeCompatibility(item.dimensions, roomDimensions);
      score += sizeScore;
    });
    
    return score;
  }

  isColorCompatible(itemColors, userColorScheme) {
    const colorCompatibility = {
      'neutral': ['white', 'black', 'gray', 'beige', 'brown'],
      'warm': ['red', 'orange', 'yellow', 'brown', 'beige'],
      'cool': ['blue', 'green', 'purple', 'gray', 'white'],
      'bold': ['red', 'blue', 'green', 'yellow', 'purple']
    };
    
    const compatibleColors = colorCompatibility[userColorScheme] || colorCompatibility['neutral'];
    return itemColors.some(color => compatibleColors.includes(color));
  }

  calculateSizeCompatibility(itemDimensions, roomDimensions) {
    const itemArea = itemDimensions.width * itemDimensions.depth;
    const roomArea = roomDimensions.width * roomDimensions.length;
    const ratio = itemArea / roomArea;
    
    if (ratio <= 0.1) return 5;      // Çok küçük
    if (ratio <= 0.2) return 4;      // Küçük
    if (ratio <= 0.3) return 3;      // Orta
    if (ratio <= 0.4) return 2;      // Büyük
    return 1;                         // Çok büyük
  }

  applyFengShuiPrinciples(furnitureSelections, plan) {
    const fengShuiLayout = {};
    
    Object.entries(furnitureSelections).forEach(([roomType, furniture]) => {
      const roomDirection = this.determineRoomDirection(roomType, plan);
      const optimizedFurniture = this.optimizeFengShuiPlacement(furniture, roomDirection);
      
      fengShuiLayout[roomType] = optimizedFurniture;
    });
    
    return fengShuiLayout;
  }

  determineRoomDirection(roomType, plan) {
    // Basit yön belirleme (gerçek uygulamada daha karmaşık olabilir)
    const directionMap = {
      'livingRoom': 'south',
      'bedroom': 'southwest',
      'kitchen': 'south',
      'bathroom': 'north',
      'hallway': 'center'
    };
    
    return directionMap[roomType] || 'center';
  }

  optimizeFengShuiPlacement(furniture, roomDirection) {
    return furniture.map(item => {
      const bagua = this.fengShuiPrinciples.bagua[roomDirection];
      const element = bagua ? bagua.element : 'earth';
      
      // Element uyumluluğu kontrolü
      const elementCompatibility = this.checkElementCompatibility(item.fengShui.element, element);
      
      return {
        ...item,
        fengShui: {
          ...item.fengShui,
          compatibility: elementCompatibility,
          optimalPlacement: this.getOptimalPlacement(item, roomDirection)
        }
      };
    });
  }

  checkElementCompatibility(itemElement, roomElement) {
    const compatibilityMatrix = {
      'wood': { 'water': 5, 'wood': 4, 'fire': 3, 'earth': 2, 'metal': 1 },
      'fire': { 'wood': 5, 'fire': 4, 'earth': 3, 'metal': 2, 'water': 1 },
      'earth': { 'fire': 5, 'earth': 4, 'metal': 3, 'water': 2, 'wood': 1 },
      'metal': { 'earth': 5, 'metal': 4, 'water': 3, 'wood': 2, 'fire': 1 },
      'water': { 'metal': 5, 'water': 4, 'wood': 3, 'fire': 2, 'earth': 1 }
    };
    
    return compatibilityMatrix[itemElement]?.[roomElement] || 3;
  }

  getOptimalPlacement(item, roomDirection) {
    const placementMap = {
      'bed': { x: 'center', y: 'southwest', rotation: 0 },
      'sofa': { x: 'center', y: 'south', rotation: 0 },
      'desk': { x: 'northeast', y: 'center', rotation: 0 },
      'dining': { x: 'center', y: 'center', rotation: 0 },
      'storage': { x: 'west', y: 'center', rotation: 0 }
    };
    
    return placementMap[item.type] || { x: 'center', y: 'center', rotation: 0 };
  }

  optimizeAccessibility(furnitureLayout, accessibility) {
    const optimizedLayout = {};
    
    Object.entries(furnitureLayout).forEach(([roomType, furniture]) => {
      const roomAccessibility = this.applyAccessibilityStandards(furniture, accessibility);
      optimizedLayout[roomType] = roomAccessibility;
    });
    
    return optimizedLayout;
  }

  applyAccessibilityStandards(furniture, accessibility) {
    return furniture.map(item => {
      let accessibilityModifications = {};
      
      accessibility.forEach(standard => {
        if (standard === 'wheelchair') {
          accessibilityModifications = this.applyWheelchairStandards(item, accessibilityModifications);
        } else if (standard === 'elderly') {
          accessibilityModifications = this.applyElderlyStandards(item, accessibilityModifications);
        } else if (standard === 'children') {
          accessibilityModifications = this.applyChildrenStandards(item, accessibilityModifications);
        }
      });
      
      return {
        ...item,
        accessibility: accessibilityModifications
      };
    });
  }

  applyWheelchairStandards(item, modifications) {
    const standards = this.accessibilityStandards.wheelchair;
    
    if (item.type === 'counter' || item.type === 'sink') {
      modifications.height = standards.counterHeight;
      modifications.undercounterSpace = true;
    }
    
    if (item.type === 'storage') {
      modifications.lowerShelves = true;
      modifications.pullOutShelves = true;
    }
    
    return modifications;
  }

  applyElderlyStandards(item, modifications) {
    const standards = this.accessibilityStandards.elderly;
    
    if (item.type === 'lighting') {
      modifications.brightness = 'high';
      modifications.motionSensor = true;
    }
    
    if (item.type === 'storage') {
      modifications.easyGrip = true;
      modifications.smoothEdges = true;
    }
    
    return modifications;
  }

  applyChildrenStandards(item, modifications) {
    const standards = this.accessibilityStandards.children;
    
    if (item.type === 'counter' || item.type === 'sink') {
      modifications.height = standards.counterHeight;
      modifications.safetyEdges = standards.safetyEdges;
    }
    
    if (item.type === 'storage') {
      modifications.childSafe = true;
      modifications.nonToxic = standards.nonToxicMaterials;
    }
    
    return modifications;
  }

  optimizeBudget(furnitureLayout, budget) {
    const optimizedLayout = {};
    let currentCost = 0;
    
    Object.entries(furnitureLayout).forEach(([roomType, furniture]) => {
      const roomBudget = budget * 0.3; // Her oda için %30 bütçe
      const optimizedFurniture = this.selectBudgetFurniture(furniture, roomBudget);
      
      optimizedLayout[roomType] = optimizedFurniture;
      currentCost += this.calculateRoomCost(optimizedFurniture);
    });
    
    // Bütçe aşımı durumunda alternatif seçenekler
    if (currentCost > budget) {
      return this.findBudgetAlternatives(optimizedLayout, budget);
    }
    
    return optimizedLayout;
  }

  selectBudgetFurniture(furniture, roomBudget) {
    // Bütçeye uygun mobilya seçimi
    const affordableFurniture = furniture.filter(item => 
      item.price.max <= roomBudget
    );
    
    if (affordableFurniture.length === 0) {
      // Bütçe çok düşükse en ucuz seçenekler
      return furniture.sort((a, b) => a.price.min - b.price.min).slice(0, 2);
    }
    
    return affordableFurniture;
  }

  calculateRoomCost(furniture) {
    return furniture.reduce((total, item) => total + item.price.max, 0);
  }

  findBudgetAlternatives(furnitureLayout, budget) {
    // Bütçe aşımı durumunda alternatif mobilya bul
    const alternatives = {};
    
    Object.entries(furnitureLayout).forEach(([roomType, furniture]) => {
      const roomBudget = budget * 0.3;
      const alternativeFurniture = this.findAlternativeFurniture(furniture, roomBudget);
      alternatives[roomType] = alternativeFurniture;
    });
    
    return alternatives;
  }

  findAlternativeFurniture(furniture, budget) {
    // Daha ucuz alternatifler bul
    const allFurniture = Object.values(this.furnitureDatabase).flat();
    const affordableAlternatives = allFurniture.filter(item => 
      item.price.max <= budget && 
      furniture.some(f => f.type === item.type)
    );
    
    return affordableAlternatives.slice(0, 3);
  }

  optimizeStyle(furnitureLayout, style, colorScheme) {
    const optimizedLayout = {};
    
    Object.entries(furnitureLayout).forEach(([roomType, furniture]) => {
      const styleOptimizedFurniture = furniture.map(item => {
        const styleCompatibility = this.calculateStyleCompatibility(item, style, colorScheme);
        const colorHarmony = this.calculateColorHarmony(item, colorScheme);
        
        return {
          ...item,
          styleScore: styleCompatibility + colorHarmony
        };
      }).sort((a, b) => b.styleScore - a.styleScore);
      
      optimizedLayout[roomType] = styleOptimizedFurniture;
    });
    
    return optimizedLayout;
  }

  calculateStyleCompatibility(item, userStyle, colorScheme) {
    let score = 0;
    
    // Stil uyumu
    if (item.style === userStyle) score += 10;
    else if (this.areStylesCompatible(item.style, userStyle)) score += 5;
    
    // Renk uyumu
    if (this.isColorCompatible(item.colors, colorScheme)) score += 5;
    
    // Materyal uyumu
    const materialScore = this.calculateMaterialCompatibility(item.materials, userStyle);
    score += materialScore;
    
    return score;
  }

  areStylesCompatible(style1, style2) {
    const compatibilityMatrix = {
      'modern': ['contemporary', 'minimalist', 'scandinavian'],
      'traditional': ['classic', 'vintage', 'rustic'],
      'industrial': ['modern', 'contemporary', 'loft'],
      'scandinavian': ['modern', 'minimalist', 'natural']
    };
    
    return compatibilityMatrix[style1]?.includes(style2) || false;
  }

  calculateMaterialCompatibility(materials, style) {
    const materialPreferences = {
      'modern': ['metal', 'glass', 'plastic', 'leather'],
      'traditional': ['wood', 'fabric', 'ceramic', 'stone'],
      'industrial': ['metal', 'concrete', 'wood', 'leather'],
      'scandinavian': ['wood', 'fabric', 'natural', 'light']
    };
    
    const preferredMaterials = materialPreferences[style] || [];
    const compatibleCount = materials.filter(material => 
      preferredMaterials.includes(material)
    ).length;
    
    return compatibleCount * 2;
  }

  calculateColorHarmony(item, colorScheme) {
    const colorHarmonyRules = {
      'neutral': { primary: ['white', 'black', 'gray'], accent: ['beige', 'brown'] },
      'warm': { primary: ['red', 'orange', 'yellow'], accent: ['brown', 'beige'] },
      'cool': { primary: ['blue', 'green', 'purple'], accent: ['gray', 'white'] },
      'bold': { primary: ['red', 'blue', 'green'], accent: ['yellow', 'purple'] }
    };
    
    const scheme = colorHarmonyRules[colorScheme] || colorHarmonyRules['neutral'];
    let score = 0;
    
    item.colors.forEach(color => {
      if (scheme.primary.includes(color)) score += 3;
      else if (scheme.accent.includes(color)) score += 2;
      else score += 1;
    });
    
    return score;
  }

  calculateTotalCost(furnitureLayout) {
    let totalCost = 0;
    
    Object.values(furnitureLayout).forEach(furniture => {
      furniture.forEach(item => {
        totalCost += item.price.max;
      });
    });
    
    return totalCost;
  }

  calculateFengShuiScore(furnitureLayout) {
    let totalScore = 0;
    let itemCount = 0;
    
    Object.values(furnitureLayout).forEach(furniture => {
      furniture.forEach(item => {
        if (item.fengShui?.compatibility) {
          totalScore += item.fengShui.compatibility;
          itemCount++;
        }
      });
    });
    
    return itemCount > 0 ? Math.round((totalScore / itemCount) * 20) : 0; // 0-100 arası
  }

  calculateAccessibilityScore(furnitureLayout) {
    let totalScore = 0;
    let itemCount = 0;
    
    Object.values(furnitureLayout).forEach(furniture => {
      furniture.forEach(item => {
        if (item.accessibility) {
          const accessibilityFeatures = Object.keys(item.accessibility).length;
          totalScore += accessibilityFeatures * 10;
          itemCount++;
        }
      });
    });
    
    return itemCount > 0 ? Math.round((totalScore / itemCount) * 2) : 0; // 0-100 arası
  }

  generateRecommendations(furnitureLayout, preferences) {
    const recommendations = [];
    
    // Bütçe önerileri
    const totalCost = this.calculateTotalCost(furnitureLayout);
    if (totalCost > preferences.budget) {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        message: `Toplam maliyet ${totalCost}TL, bütçeniz ${preferences.budget}TL. Daha ekonomik alternatifler önerilir.`,
        suggestions: ['Benzer mobilyaların daha ucuz versiyonlarını tercih edin', 'İkinci el mobilya seçeneklerini değerlendirin']
      });
    }
    
    // Feng Shui önerileri
    const fengShuiScore = this.calculateFengShuiScore(furnitureLayout);
    if (fengShuiScore < 60) {
      recommendations.push({
        type: 'fengShui',
        priority: 'medium',
        message: `Feng Shui uyumluluk skoru: ${fengShuiScore}/100. Daha iyi enerji akışı için düzenlemeler önerilir.`,
        suggestions: ['Mobilyaları doğru yönlere yerleştirin', 'Element uyumluluğunu artırın']
      });
    }
    
    // Stil önerileri
    const styleRecommendations = this.generateStyleRecommendations(furnitureLayout, preferences);
    recommendations.push(...styleRecommendations);
    
    return recommendations;
  }

  generateStyleRecommendations(furnitureLayout, preferences) {
    const recommendations = [];
    
    Object.entries(furnitureLayout).forEach(([roomType, furniture]) => {
      const roomStyle = this.analyzeRoomStyle(furniture);
      
      if (roomStyle !== preferences.style) {
        recommendations.push({
          type: 'style',
          priority: 'low',
          message: `${roomType} odası ${roomStyle} stilinde. ${preferences.style} stiline uyum için öneriler:`,
          suggestions: this.getStyleSuggestions(preferences.style, roomStyle)
        });
      }
    });
    
    return recommendations;
  }

  analyzeRoomStyle(furniture) {
    const styleCounts = {};
    
    furniture.forEach(item => {
      styleCounts[item.style] = (styleCounts[item.style] || 0) + 1;
    });
    
    return Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed';
  }

  getStyleSuggestions(targetStyle, currentStyle) {
    const suggestions = {
      'modern': ['Daha temiz çizgiler', 'Minimalist dekorasyon', 'Metal ve cam detaylar'],
      'traditional': ['Klasik mobilya formları', 'Doğal materyaller', 'Sıcak renkler'],
      'industrial': ['Ham materyaller', 'Metal detaylar', 'Vintage parçalar'],
      'scandinavian': ['Açık renkler', 'Doğal materyaller', 'Minimalist tasarım']
    };
    
    return suggestions[targetStyle] || ['Stil uyumluluğu için benzer tasarım öğeleri kullanın'];
  }

  getRoomStandards(apartmentType) {
    // Basit oda standartları (gerçek uygulamada daha detaylı olabilir)
    const standards = {
      "1+1": {
        livingRoom: { width: 4.5, length: 5.0, height: 2.8 },
        bedroom: { width: 3.5, length: 4.0, height: 2.8 },
        kitchen: { width: 2.5, length: 3.0, height: 2.8 },
        bathroom: { width: 2.0, length: 2.5, height: 2.8 }
      },
      "2+1": {
        livingRoom: { width: 5.0, length: 5.5, height: 2.8 },
        bedroom1: { width: 4.0, length: 4.5, height: 2.8 },
        bedroom2: { width: 3.5, length: 4.0, height: 2.8 },
        kitchen: { width: 3.0, length: 3.5, height: 2.8 },
        bathroom: { width: 2.5, length: 3.0, height: 2.8 }
      }
    };
    
    return standards[apartmentType] || standards["1+1"];
  }
}

module.exports = SmartFurniturePlanner;