const express = require("express");
const cors = require("cors");
const path = require("path");
const planData = require("./planData.json");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files for plan images
app.use('/plans', express.static(path.join(__dirname, 'plans')));

// New API endpoint for plan suggestions
app.post("/api/suggest-plan", (req, res) => {
  const { netUsableArea, streetFacingSides, apartmentType } = req.body;
  
  // Validate input
  if (!netUsableArea || !streetFacingSides || !apartmentType) {
    return res.status(400).json({ 
      error: "Missing required parameters: netUsableArea, streetFacingSides, apartmentType" 
    });
  }

  // Filter plans based on criteria
  const suitablePlans = planData.floorPlans.filter(plan => {
    return (
      plan.apartmentType === apartmentType &&
      plan.streetFacingSides === streetFacingSides &&
      netUsableArea >= plan.minUsableArea &&
      netUsableArea <= plan.maxUsableArea
    );
  });

  // If no exact match, try to find plans with same apartment type and street facing sides
  if (suitablePlans.length === 0) {
    const relaxedPlans = planData.floorPlans.filter(plan => {
      return (
        plan.apartmentType === apartmentType &&
        plan.streetFacingSides === streetFacingSides
      );
    });

    if (relaxedPlans.length > 0) {
      // Return the plan with closest area range
      const closestPlan = relaxedPlans.reduce((closest, current) => {
        const closestDistance = Math.min(
          Math.abs(netUsableArea - closest.minUsableArea),
          Math.abs(netUsableArea - closest.maxUsableArea)
        );
        const currentDistance = Math.min(
          Math.abs(netUsableArea - current.minUsableArea),
          Math.abs(netUsableArea - current.maxUsableArea)
        );
        return currentDistance < closestDistance ? current : closest;
      });

      return res.json(closestPlan);
    }
  }

  // If still no match, try different apartment types with same street facing sides
  if (suitablePlans.length === 0) {
    const alternatePlans = planData.floorPlans.filter(plan => {
      return (
        plan.streetFacingSides === streetFacingSides &&
        netUsableArea >= plan.minUsableArea &&
        netUsableArea <= plan.maxUsableArea
      );
    });

    if (alternatePlans.length > 0) {
      return res.json(alternatePlans[0]);
    }
  }

  // Return the first suitable plan or error
  if (suitablePlans.length > 0) {
    res.json(suitablePlans[0]);
  } else {
    res.status(404).json({ 
      error: "Uygun plan bulunamadı",
      message: "Girilen kriterlere uygun floor plan bulunamadı. Lütfen farklı değerler deneyin."
    });
  }
});

// Legacy endpoint (for backward compatibility)
app.post("/api/plan", (req, res) => {
  const { daireTipi, cepheSayisi } = req.body;
  
  // Find a plan that matches the legacy format
  const plan = planData.floorPlans.find(p => 
    p.apartmentType === daireTipi && p.streetFacingSides === cepheSayisi
  );

  if (!plan) {
    return res.status(404).json({ error: "Uygun plan bulunamadı" });
  }

  // Return in legacy format
  res.json({
    image: plan.image,
    rooms: plan.apartmentType,
    m2: `${plan.minUsableArea}-${plan.maxUsableArea}`,
    bathroom: "1 adet",
    balcony: plan.features.includes("Balkon") ? "Var" : "Opsiyonel"
  });
});

// Get all available plans
app.get("/api/plans", (req, res) => {
  res.json({
    plans: planData.floorPlans,
    apartmentTypes: Object.keys(planData.apartmentTypeAreas),
    apartmentTypeAreas: planData.apartmentTypeAreas
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Mimari Kat Planı Öneri Sistemi çalışıyor",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🏢 Mimari Plan Sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   POST /api/suggest-plan - Plan önerisi`);
  console.log(`   GET  /api/plans - Tüm planlar`);
  console.log(`   GET  /api/health - Sistem durumu`);
});
