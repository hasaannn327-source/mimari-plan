const planData = require('../planData.json');

class FloorPlanCalculator {
  constructor() {
    this.floorPlans = planData.floorPlans;
    this.apartmentTypeAverages = planData.apartmentTypeAverages;
  }

  /**
   * Ana hesaplama fonksiyonu
   * @param {number} totalBaseArea - Toplam taban alanı (m²)
   * @param {number} commonAreaPercentage - Ortak alan yüzdesi (%)
   * @param {number} streetFacingSides - Cephe sayısı (1-4)
   * @param {string} apartmentType - Daire tipi (2+1, 3+1)
   * @returns {object} Hesaplama sonuçları
   */
  calculateFloorPlan(totalBaseArea, commonAreaPercentage, streetFacingSides, apartmentType) {
    // Net kullanılabilir alan hesaplama
    const netUsableArea = this.calculateNetUsableArea(totalBaseArea, commonAreaPercentage);
    
    // Daire sayısı tahmini
    const estimatedApartments = this.estimateApartmentCount(netUsableArea, apartmentType);
    
    // Uygun planları filtrele
    const suitablePlans = this.filterSuitablePlans(streetFacingSides, apartmentType, netUsableArea);
    
    // En uygun planı seç
    const bestPlan = this.selectBestPlan(suitablePlans, netUsableArea, estimatedApartments);
    
    return {
      totalBaseArea,
      commonAreaPercentage,
      netUsableArea,
      streetFacingSides,
      apartmentType,
      estimatedApartments,
      suitablePlans: suitablePlans.length,
      bestPlan,
      calculationDetails: {
        commonArea: totalBaseArea * (commonAreaPercentage / 100),
        averageAreaPerApartment: this.apartmentTypeAverages[apartmentType]?.averageArea || 0
      }
    };
  }

  /**
   * Net kullanılabilir alan hesaplama
   */
  calculateNetUsableArea(totalBaseArea, commonAreaPercentage) {
    const commonArea = totalBaseArea * (commonAreaPercentage / 100);
    return Math.round(totalBaseArea - commonArea);
  }

  /**
   * Daire sayısı tahmini
   */
  estimateApartmentCount(netUsableArea, apartmentType) {
    const averageArea = this.apartmentTypeAverages[apartmentType]?.averageArea;
    if (!averageArea) return 0;
    
    return Math.floor(netUsableArea / averageArea);
  }

  /**
   * Uygun planları filtrele
   */
  filterSuitablePlans(streetFacingSides, apartmentType, netUsableArea) {
    return this.floorPlans.filter(plan => {
      // Cephe sayısı kontrolü
      if (plan.streetFacingSides !== streetFacingSides) return false;
      
      // Daire tipi kontrolü
      if (plan.apartmentType !== apartmentType) return false;
      
      // Alan aralığı kontrolü
      const estimatedApartments = this.estimateApartmentCount(netUsableArea, apartmentType);
      const totalPlanArea = plan.averageAreaPerApartment * estimatedApartments;
      
      return totalPlanArea >= plan.minArea && totalPlanArea <= plan.maxArea;
    });
  }

  /**
   * En uygun planı seç
   */
  selectBestPlan(suitablePlans, netUsableArea, estimatedApartments) {
    if (suitablePlans.length === 0) return null;
    
    // Alan uyumluluğuna göre sırala
    const scoredPlans = suitablePlans.map(plan => {
      const planTotalArea = plan.averageAreaPerApartment * estimatedApartments;
      const areaDifference = Math.abs(planTotalArea - netUsableArea);
      const score = 1000 - areaDifference; // Daha düşük fark = daha yüksek skor
      
      return {
        ...plan,
        score,
        estimatedTotalArea: planTotalArea,
        areaEfficiency: (netUsableArea / planTotalArea) * 100
      };
    });
    
    // En yüksek skorlu planı döndür
    return scoredPlans.sort((a, b) => b.score - a.score)[0];
  }

  /**
   * Tüm planları getir (debug için)
   */
  getAllPlans() {
    return this.floorPlans;
  }

  /**
   * Daire tipi ortalamalarını getir
   */
  getApartmentTypeAverages() {
    return this.apartmentTypeAverages;
  }
}

module.exports = FloorPlanCalculator;