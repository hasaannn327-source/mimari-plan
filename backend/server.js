const express = require("express");
const cors = require("cors");
const FloorPlanCalculator = require("./helpers/floorPlanCalculator");
const { generateSimplePlanSVG } = require("./helpers/drawPlanSVG");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Floor plan calculator instance
const calculator = new FloorPlanCalculator();

// Ana endpoint - Mimari plan önerisi
app.post("/api/floor-plan-suggestion", (req, res) => {
  try {
    const { 
      totalBaseArea, 
      commonAreaPercentage, 
      streetFacingSides, 
      apartmentType 
    } = req.body;

    // Giriş doğrulama
    if (!totalBaseArea || !commonAreaPercentage || !streetFacingSides || !apartmentType) {
      return res.status(400).json({
        error: "Tüm alanlar gereklidir",
        required: ["totalBaseArea", "commonAreaPercentage", "streetFacingSides", "apartmentType"]
      });
    }

    // Değer aralığı kontrolü
    if (totalBaseArea <= 0 || commonAreaPercentage < 0 || commonAreaPercentage > 50) {
      return res.status(400).json({
        error: "Geçersiz değerler",
        validRanges: {
          totalBaseArea: "> 0",
          commonAreaPercentage: "0-50%",
          streetFacingSides: "1-4"
        }
      });
    }

    if (streetFacingSides < 1 || streetFacingSides > 4) {
      return res.status(400).json({
        error: "Cephe sayısı 1-4 arasında olmalıdır"
      });
    }

    if (!["2+1", "3+1"].includes(apartmentType)) {
      return res.status(400).json({
        error: "Geçersiz daire tipi",
        validTypes: ["2+1", "3+1"]
      });
    }

    // Hesaplama yap
    const result = calculator.calculateFloorPlan(
      totalBaseArea,
      commonAreaPercentage,
      streetFacingSides,
      apartmentType
    );

    // SVG oluştur
    let svg = null;
    if (result.bestPlan) {
      svg = generateSimplePlanSVG(result.bestPlan);
    }

    res.json({
      success: true,
      result,
      svg,
      message: result.bestPlan 
        ? "Uygun plan bulundu!" 
        : "Belirtilen kriterlere uygun plan bulunamadı. Lütfen parametreleri değiştirin."
    });

  } catch (error) {
    console.error("Hesaplama hatası:", error);
    res.status(500).json({
      error: "Sunucu hatası",
      message: error.message
    });
  }
});

// Tüm planları getir
app.get("/api/plans", (req, res) => {
  try {
    const plans = calculator.getAllPlans();
    res.json({
      success: true,
      plans,
      total: plans.length
    });
  } catch (error) {
    res.status(500).json({
      error: "Planlar getirilemedi",
      message: error.message
    });
  }
});

// Daire tipi ortalamalarını getir
app.get("/api/apartment-averages", (req, res) => {
  try {
    const averages = calculator.getApartmentTypeAverages();
    res.json({
      success: true,
      averages
    });
  } catch (error) {
    res.status(500).json({
      error: "Ortalama değerler getirilemedi",
      message: error.message
    });
  }
});

// Belirli bir planın SVG'sini getir
app.get("/api/plan/:planId/svg", (req, res) => {
  try {
    const { planId } = req.params;
    const { generatePlanSVG } = require("./helpers/drawPlanSVG");
    
    const svg = generatePlanSVG(planId);
    
    if (!svg) {
      return res.status(404).json({
        error: "Plan bulunamadı"
      });
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    res.status(500).json({
      error: "SVG oluşturulamadı",
      message: error.message
    });
  }
});

// Eski endpoint (geriye uyumluluk için)
app.post("/api/plan", (req, res) => {
  res.status(410).json({
    error: "Bu endpoint artık kullanılmıyor",
    message: "Lütfen /api/floor-plan-suggestion endpoint'ini kullanın"
  });
});

app.listen(PORT, () => {
  console.log(`Mimari Plan Önerisi Sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log(`API Endpoint: POST http://localhost:${PORT}/api/floor-plan-suggestion`);
});
