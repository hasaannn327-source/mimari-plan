const express = require("express");
const cors = require("cors");
const { 
  generatePlanSVG, 
  findSuitablePlan, 
  calculateNetArea, 
  estimateApartmentCount,
  planData 
} = require("./helpers/drawPlanSVG");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ana API endpoint - mimari plan önerisi
app.post("/api/plan-suggestion", (req, res) => {
  const { 
    totalArea, 
    commonAreaPercentage, 
    streetFacingSides, 
    apartmentType 
  } = req.body;

  // Giriş validasyonu
  if (!totalArea || !commonAreaPercentage || !streetFacingSides || !apartmentType) {
    return res.status(400).json({ 
      error: "Tüm alanlar gereklidir: totalArea, commonAreaPercentage, streetFacingSides, apartmentType" 
    });
  }

  // Net kullanılabilir alan hesaplama
  const netArea = calculateNetArea(totalArea, commonAreaPercentage);
  
  // Tahmini daire sayısı hesaplama
  const estimatedApartments = estimateApartmentCount(netArea, apartmentType);
  
  // Uygun plan bulma
  const suitablePlan = findSuitablePlan(apartmentType, streetFacingSides, netArea);
  
  if (!suitablePlan) {
    return res.status(404).json({ 
      error: "Belirtilen kriterlere uygun plan bulunamadı",
      calculations: {
        totalArea,
        commonAreaPercentage,
        netArea: Math.round(netArea),
        estimatedApartments,
        streetFacingSides,
        apartmentType
      }
    });
  }

  // SVG plan oluşturma
  const svgPlan = generatePlanSVG(suitablePlan);

  res.json({
    success: true,
    plan: suitablePlan,
    svg: svgPlan,
    calculations: {
      totalArea,
      commonAreaPercentage,
      netArea: Math.round(netArea),
      estimatedApartments,
      streetFacingSides,
      apartmentType
    }
  });
});

// Mevcut planları listeleme endpoint'i
app.get("/api/plans", (req, res) => {
  const { apartmentType, streetFacingSides } = req.query;
  
  let filteredPlans = planData.floorPlans;
  
  if (apartmentType) {
    filteredPlans = filteredPlans.filter(plan => plan.apartmentType === apartmentType);
  }
  
  if (streetFacingSides) {
    filteredPlans = filteredPlans.filter(plan => plan.streetFacingSides === parseInt(streetFacingSides));
  }
  
  res.json({
    plans: filteredPlans,
    apartmentTypes: planData.apartmentTypes
  });
});

// Daire tiplerini listeleme endpoint'i
app.get("/api/apartment-types", (req, res) => {
  res.json(planData.apartmentTypes);
});

// Eski endpoint uyumluluğu için
app.post("/api/plan", (req, res) => {
  const { daireTipi, cepheSayisi } = req.body;
  
  // Eski format için uygun plan bulma
  const suitablePlan = planData.floorPlans.find(plan => 
    plan.apartmentType === daireTipi && 
    plan.streetFacingSides === cepheSayisi
  );
  
  if (!suitablePlan) {
    return res.status(404).json({ error: "Uygun plan bulunamadı" });
  }

  const svg = generatePlanSVG(suitablePlan);
  res.send(svg);
});

app.listen(PORT, () => {
  console.log(`Mimari Plan Önerisi Sistemi çalışıyor: http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`- POST /api/plan-suggestion - Ana plan önerisi`);
  console.log(`- GET /api/plans - Plan listesi`);
  console.log(`- GET /api/apartment-types - Daire tipleri`);
});
