document.addEventListener("DOMContentLoaded", function () {
  // DOM elementleri
  const totalBaseAreaInput = document.getElementById("totalBaseArea");
  const commonAreaPercentageInput = document.getElementById("commonAreaPercentage");
  const streetFacingSidesSelect = document.getElementById("streetFacingSides");
  const apartmentTypeSelect = document.getElementById("apartmentType");
  const calculateBtn = document.getElementById("calculateBtn");
  
  // Sonuç bölümleri
  const loadingSection = document.getElementById("loadingSection");
  const resultsSection = document.getElementById("resultsSection");
  const errorSection = document.getElementById("errorSection");
  const noPlanSection = document.getElementById("noPlanSection");
  
  // Sonuç elementleri
  const summaryGrid = document.getElementById("summaryGrid");
  const planVisual = document.getElementById("planVisual");
  const planDetails = document.getElementById("planDetails");
  const errorMessage = document.getElementById("errorMessage");

  // API URL
  const API_BASE_URL = "http://localhost:3000";

  // Hesaplama fonksiyonu
  async function calculateFloorPlan() {
    // Giriş değerlerini al
    const totalBaseArea = parseFloat(totalBaseAreaInput.value);
    const commonAreaPercentage = parseFloat(commonAreaPercentageInput.value);
    const streetFacingSides = parseInt(streetFacingSidesSelect.value);
    const apartmentType = apartmentTypeSelect.value;

    // Giriş doğrulama
    if (!validateInputs(totalBaseArea, commonAreaPercentage, streetFacingSides, apartmentType)) {
      return;
    }

    // Loading göster
    showLoading();

    try {
      // API çağrısı
      const response = await fetch(`${API_BASE_URL}/api/floor-plan-suggestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalBaseArea,
          commonAreaPercentage,
          streetFacingSides,
          apartmentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sunucu hatası");
      }

      // Sonuçları göster
      displayResults(data);

    } catch (error) {
      console.error("Hata:", error);
      showError(error.message);
    }
  }

  // Giriş doğrulama
  function validateInputs(totalBaseArea, commonAreaPercentage, streetFacingSides, apartmentType) {
    if (!totalBaseArea || totalBaseArea <= 0) {
      showError("Lütfen geçerli bir toplam taban alanı girin (0'dan büyük)");
      return false;
    }

    if (commonAreaPercentage < 0 || commonAreaPercentage > 50) {
      showError("Ortak alan yüzdesi 0-50 arasında olmalıdır");
      return false;
    }

    if (streetFacingSides < 1 || streetFacingSides > 4) {
      showError("Cephe sayısı 1-4 arasında olmalıdır");
      return false;
    }

    if (!["2+1", "3+1"].includes(apartmentType)) {
      showError("Geçersiz daire tipi");
      return false;
    }

    return true;
  }

  // Loading göster
  function showLoading() {
    hideAllSections();
    loadingSection.style.display = "block";
  }

  // Hata göster
  function showError(message) {
    hideAllSections();
    errorSection.style.display = "block";
    errorMessage.textContent = message;
  }

  // Tüm bölümleri gizle
  function hideAllSections() {
    loadingSection.style.display = "none";
    resultsSection.style.display = "none";
    errorSection.style.display = "none";
    noPlanSection.style.display = "none";
  }

  // Sonuçları göster
  function displayResults(data) {
    hideAllSections();

    if (!data.result.bestPlan) {
      noPlanSection.style.display = "block";
      return;
    }

    resultsSection.style.display = "block";
    
    // Hesaplama özetini göster
    displayCalculationSummary(data.result);
    
    // Plan görselini göster
    displayPlanVisual(data.svg);
    
    // Plan detaylarını göster
    displayPlanDetails(data.result.bestPlan);
  }

  // Hesaplama özetini göster
  function displayCalculationSummary(result) {
    const summaryHTML = `
      <div class="summary-item">
        <h3>Toplam Taban Alanı</h3>
        <div class="value">${result.totalBaseArea}</div>
        <div class="unit">m²</div>
      </div>
      <div class="summary-item">
        <h3>Net Kullanılabilir Alan</h3>
        <div class="value">${result.netUsableArea}</div>
        <div class="unit">m²</div>
      </div>
      <div class="summary-item">
        <h3>Ortak Alan</h3>
        <div class="value">${result.calculationDetails.commonArea.toFixed(1)}</div>
        <div class="unit">m² (${result.commonAreaPercentage}%)</div>
      </div>
      <div class="summary-item">
        <h3>Tahmini Daire Sayısı</h3>
        <div class="value">${result.estimatedApartments}</div>
        <div class="unit">adet</div>
      </div>
      <div class="summary-item">
        <h3>Daire Başına Ortalama Alan</h3>
        <div class="value">${result.calculationDetails.averageAreaPerApartment}</div>
        <div class="unit">m²</div>
      </div>
      <div class="summary-item">
        <h3>Uygun Plan Sayısı</h3>
        <div class="value">${result.suitablePlans}</div>
        <div class="unit">adet</div>
      </div>
    `;
    
    summaryGrid.innerHTML = summaryHTML;
  }

  // Plan görselini göster
  function displayPlanVisual(svg) {
    if (svg) {
      planVisual.innerHTML = svg;
    } else {
      planVisual.innerHTML = `
        <div style="color: #666; font-size: 1.1rem;">
          Plan görseli mevcut değil
        </div>
      `;
    }
  }

  // Plan detaylarını göster
  function displayPlanDetails(plan) {
    const detailsHTML = `
      <h3>${plan.name}</h3>
      
      <div class="detail-item">
        <div class="detail-label">Plan Açıklaması</div>
        <div class="detail-value">${plan.description}</div>
      </div>
      
      <div class="detail-item">
        <div class="detail-label">Daire Tipi</div>
        <div class="detail-value">${plan.apartmentType}</div>
      </div>
      
      <div class="detail-item">
        <div class="detail-label">Cephe Sayısı</div>
        <div class="detail-value">${plan.streetFacingSides} cephe</div>
      </div>
      
      <div class="detail-item">
        <div class="detail-label">Alan Aralığı</div>
        <div class="detail-value">${plan.minArea} - ${plan.maxArea} m²</div>
      </div>
      
      <div class="detail-item">
        <div class="detail-label">Daire Başına Ortalama Alan</div>
        <div class="detail-value">${plan.averageAreaPerApartment} m²</div>
      </div>
      
      <div class="detail-item">
        <div class="detail-label">Odalar</div>
        <div class="detail-value">${plan.rooms.join(", ")}</div>
      </div>
      
      <div class="detail-item">
        <div class="detail-label">Özellikler</div>
        <ul class="features-list">
          ${plan.features.map(feature => `<li>${feature}</li>`).join("")}
        </ul>
      </div>
    `;
    
    planDetails.innerHTML = detailsHTML;
  }

  // Event listeners
  calculateBtn.addEventListener("click", calculateFloorPlan);

  // Enter tuşu ile hesaplama
  [totalBaseAreaInput, commonAreaPercentageInput].forEach(input => {
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        calculateFloorPlan();
      }
    });
  });

  // Input değişikliklerinde otomatik hesaplama (opsiyonel)
  // [totalBaseAreaInput, commonAreaPercentageInput, streetFacingSidesSelect, apartmentTypeSelect].forEach(input => {
  //   input.addEventListener("change", calculateFloorPlan);
  // });

  // Sayfa yüklendiğinde varsayılan değerlerle hesaplama yap
  // calculateFloorPlan();
});
