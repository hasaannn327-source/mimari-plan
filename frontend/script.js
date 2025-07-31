document.addEventListener("DOMContentLoaded", function () {
  // DOM elementlerini seç
  const totalAreaInput = document.getElementById("totalArea");
  const commonAreaPercentageInput = document.getElementById("commonAreaPercentage");
  const streetFacingSidesSelect = document.getElementById("streetFacingSides");
  const apartmentTypeSelect = document.getElementById("apartmentType");
  const calculateBtn = document.getElementById("calculateBtn");
  
  const resultsPanel = document.getElementById("resultsPanel");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const errorCalculations = document.getElementById("errorCalculations");
  
  const netAreaSpan = document.getElementById("netArea");
  const estimatedApartmentsSpan = document.getElementById("estimatedApartments");
  const avgApartmentAreaSpan = document.getElementById("avgApartmentArea");
  const planSVGDiv = document.getElementById("planSVG");
  const planDetailsDiv = document.getElementById("planDetails");

  // Ortalama daire alanları
  const apartmentTypeAreas = {
    "2+1": 90,
    "3+1": 120,
    "4+1": 150
  };

  // Hesaplama fonksiyonu
  function calculatePlan() {
    // Giriş değerlerini al
    const totalArea = parseFloat(totalAreaInput.value);
    const commonAreaPercentage = parseFloat(commonAreaPercentageInput.value);
    const streetFacingSides = parseInt(streetFacingSidesSelect.value);
    const apartmentType = apartmentTypeSelect.value;

    // Validasyon
    if (!totalArea || !commonAreaPercentage || !streetFacingSides || !apartmentType) {
      showError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (totalArea < 50 || totalArea > 2000) {
      showError("Toplam alan 50-2000 m² arasında olmalıdır.");
      return;
    }

    if (commonAreaPercentage < 5 || commonAreaPercentage > 30) {
      showError("Ortak alan yüzdesi %5-%30 arasında olmalıdır.");
      return;
    }

    // Net alan hesaplama
    const netArea = totalArea * (1 - commonAreaPercentage / 100);
    
    // Tahmini daire sayısı hesaplama
    const avgArea = apartmentTypeAreas[apartmentType];
    const estimatedApartments = Math.floor(netArea / avgArea);

    // API'ye istek gönder
    fetchPlanSuggestion({
      totalArea,
      commonAreaPercentage,
      streetFacingSides,
      apartmentType
    }, {
      netArea,
      estimatedApartments,
      avgArea
    });
  }

  // API isteği gönderme
  function fetchPlanSuggestion(requestData, calculations) {
    calculateBtn.disabled = true;
    calculateBtn.textContent = "🔍 Hesaplanıyor...";

    fetch("http://localhost:3000/api/plan-suggestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        calculateBtn.disabled = false;
        calculateBtn.textContent = "🔍 Uygun Planı Bul";

        if (data.success) {
          showResults(data, calculations);
        } else {
          showError(data.error, data.calculations);
        }
      })
      .catch((error) => {
        calculateBtn.disabled = false;
        calculateBtn.textContent = "🔍 Uygun Planı Bul";
        showError("Sunucu bağlantısında hata oluştu. Lütfen tekrar deneyin.");
        console.error("Error:", error);
      });
  }

  // Sonuçları gösterme
  function showResults(data, calculations) {
    // Hata mesajını gizle
    errorMessage.style.display = "none";
    
    // Hesaplama sonuçlarını göster
    netAreaSpan.textContent = `${Math.round(calculations.netArea)} m²`;
    estimatedApartmentsSpan.textContent = calculations.estimatedApartments;
    avgApartmentAreaSpan.textContent = `${calculations.avgArea} m²`;

    // Plan SVG'sini göster
    planSVGDiv.innerHTML = data.svg;

    // Plan detaylarını göster
    const plan = data.plan;
    planDetailsDiv.innerHTML = `
      <h4>${plan.name}</h4>
      <ul>
        <li><strong>Plan ID:</strong> ${plan.id}</li>
        <li><strong>Daire Tipi:</strong> ${plan.apartmentType}</li>
        <li><strong>Toplam Daire:</strong> ${plan.totalApartments}</li>
        <li><strong>Cephe Sayısı:</strong> ${plan.streetFacingSides}</li>
        <li><strong>Alan Aralığı:</strong> ${plan.minArea}-${plan.maxArea} m²</li>
        <li><strong>Boyutlar:</strong> ${plan.width}x${plan.height}px</li>
      </ul>
      <div class="plan-description">
        <strong>Açıklama:</strong> ${plan.description}
      </div>
    `;

    // Sonuç panelini göster
    resultsPanel.style.display = "block";
  }

  // Hata mesajını gösterme
  function showError(message, calculations = null) {
    errorText.textContent = message;
    
    if (calculations) {
      errorCalculations.innerHTML = `
        <div class="calc-item">
          <span class="label">Toplam Alan:</span>
          <span class="value">${calculations.totalArea} m²</span>
        </div>
        <div class="calc-item">
          <span class="label">Ortak Alan %:</span>
          <span class="value">%${calculations.commonAreaPercentage}</span>
        </div>
        <div class="calc-item">
          <span class="label">Net Alan:</span>
          <span class="value">${calculations.netArea} m²</span>
        </div>
        <div class="calc-item">
          <span class="label">Tahmini Daire:</span>
          <span class="value">${calculations.estimatedApartments}</span>
        </div>
        <div class="calc-item">
          <span class="label">Cephe Sayısı:</span>
          <span class="value">${calculations.streetFacingSides}</span>
        </div>
        <div class="calc-item">
          <span class="label">Daire Tipi:</span>
          <span class="value">${calculations.apartmentType}</span>
        </div>
      `;
    } else {
      errorCalculations.innerHTML = "";
    }

    // Sonuç panelini gizle
    resultsPanel.style.display = "none";
    
    // Hata mesajını göster
    errorMessage.style.display = "block";
  }

  // Event listener'ları ekle
  calculateBtn.addEventListener("click", calculatePlan);

  // Enter tuşu ile hesaplama
  [totalAreaInput, commonAreaPercentageInput].forEach(input => {
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        calculatePlan();
      }
    });
  });

  // Input değişikliklerinde otomatik hesaplama (opsiyonel)
  let calculationTimeout;
  function scheduleCalculation() {
    clearTimeout(calculationTimeout);
    calculationTimeout = setTimeout(calculatePlan, 1000);
  }

  // Otomatik hesaplama için event listener'lar (isteğe bağlı)
  // totalAreaInput.addEventListener("input", scheduleCalculation);
  // commonAreaPercentageInput.addEventListener("input", scheduleCalculation);
  // streetFacingSidesSelect.addEventListener("change", scheduleCalculation);
  // apartmentTypeSelect.addEventListener("change", scheduleCalculation);

  // Sayfa yüklendiğinde varsayılan hesaplama
  // calculatePlan();
});
