document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const totalAreaInput = document.getElementById("totalArea");
  const commonAreaInput = document.getElementById("commonAreaPercentage");
  const streetFacingSidesSelect = document.getElementById("streetFacingSides");
  const apartmentTypeSelect = document.getElementById("apartmentType");
  const calculateBtn = document.getElementById("calculateBtn");
  
  const calculationSection = document.getElementById("calculationSection");
  const calculationResults = document.getElementById("calculationResults");
  const planSection = document.getElementById("planSection");
  const planImage = document.getElementById("planImage");
  const planPlaceholder = document.getElementById("planPlaceholder");
  const planDetails = document.getElementById("planDetails");
  const errorSection = document.getElementById("errorSection");
  const errorMessage = document.getElementById("errorMessage");

  // Apartment type area mapping
  const apartmentTypeAreas = {
    "1+1": 60,
    "2+1": 85,
    "3+1": 110,
    "4+1": 140
  };

  // Event listeners
  calculateBtn.addEventListener("click", calculateAndSuggestPlan);
  
  // Input validation and real-time feedback
  totalAreaInput.addEventListener("input", validateInputs);
  commonAreaInput.addEventListener("input", validateInputs);

  function validateInputs() {
    const totalArea = parseFloat(totalAreaInput.value);
    const commonAreaPercentage = parseFloat(commonAreaInput.value);
    
    // Validate total area
    if (totalArea < 100 || totalArea > 5000) {
      totalAreaInput.style.borderColor = "#e74c3c";
    } else {
      totalAreaInput.style.borderColor = "#ddd";
    }
    
    // Validate common area percentage
    if (commonAreaPercentage < 5 || commonAreaPercentage > 30) {
      commonAreaInput.style.borderColor = "#e74c3c";
    } else {
      commonAreaInput.style.borderColor = "#ddd";
    }
  }

  function calculateAndSuggestPlan() {
    // Hide previous results
    hideAllSections();
    
    // Get input values
    const totalArea = parseFloat(totalAreaInput.value);
    const commonAreaPercentage = parseFloat(commonAreaInput.value);
    const streetFacingSides = parseInt(streetFacingSidesSelect.value);
    const apartmentType = apartmentTypeSelect.value;
    
    // Validate inputs
    if (!validateCalculationInputs(totalArea, commonAreaPercentage)) {
      return;
    }
    
    // Calculate net usable area
    const commonArea = (totalArea * commonAreaPercentage) / 100;
    const netUsableArea = totalArea - commonArea;
    
    // Get average area per apartment
    const averageApartmentArea = apartmentTypeAreas[apartmentType];
    
    // Estimate number of apartments
    const estimatedApartments = Math.floor(netUsableArea / averageApartmentArea);
    
    // Display calculation results
    displayCalculationResults(totalArea, commonArea, netUsableArea, estimatedApartments, apartmentType, averageApartmentArea);
    
    // Find suitable floor plan
    findAndDisplaySuitablePlan(netUsableArea, streetFacingSides, apartmentType);
  }

  function validateCalculationInputs(totalArea, commonAreaPercentage) {
    if (isNaN(totalArea) || totalArea < 100 || totalArea > 5000) {
      showError("Lütfen 100-5000 m² arasında geçerli bir toplam alan girin.");
      return false;
    }
    
    if (isNaN(commonAreaPercentage) || commonAreaPercentage < 5 || commonAreaPercentage > 30) {
      showError("Lütfen 5-30% arasında geçerli bir ortak alan yüzdesi girin.");
      return false;
    }
    
    return true;
  }

  function displayCalculationResults(totalArea, commonArea, netUsableArea, estimatedApartments, apartmentType, averageApartmentArea) {
    calculationResults.innerHTML = `
      <div class="calculation-grid">
        <div class="calc-item">
          <div class="calc-label">Toplam Taban Alanı:</div>
          <div class="calc-value">${totalArea.toLocaleString('tr-TR')} m²</div>
        </div>
        <div class="calc-item">
          <div class="calc-label">Ortak Alan:</div>
          <div class="calc-value">${commonArea.toLocaleString('tr-TR')} m²</div>
        </div>
        <div class="calc-item">
          <div class="calc-label">Net Kullanılabilir Alan:</div>
          <div class="calc-value highlight">${netUsableArea.toLocaleString('tr-TR')} m²</div>
        </div>
        <div class="calc-item">
          <div class="calc-label">Ortalama Daire Alanı (${apartmentType}):</div>
          <div class="calc-value">${averageApartmentArea} m²</div>
        </div>
        <div class="calc-item">
          <div class="calc-label">Tahmini Daire Sayısı:</div>
          <div class="calc-value highlight">${estimatedApartments} adet</div>
        </div>
      </div>
    `;
    
    calculationSection.style.display = "block";
  }

  async function findAndDisplaySuitablePlan(netUsableArea, streetFacingSides, apartmentType) {
    try {
      const response = await fetch(`http://localhost:3000/api/suggest-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          netUsableArea: netUsableArea,
          streetFacingSides: streetFacingSides,
          apartmentType: apartmentType
        })
      });

      if (!response.ok) {
        throw new Error("Plan bulunamadı");
      }

      const planData = await response.json();
      displayPlan(planData);
      
    } catch (error) {
      showError("Girilen kriterlere uygun plan bulunamadı. Lütfen farklı değerler deneyin.");
    }
  }

  function displayPlan(plan) {
    // Hide placeholder and show image
    planPlaceholder.style.display = "none";
    planImage.style.display = "block";
    planImage.src = plan.image;
    planImage.onerror = function() {
      // If image fails to load, show placeholder with plan name
      planImage.style.display = "none";
      planPlaceholder.style.display = "flex";
      planPlaceholder.innerHTML = `
        <span>🏗️</span>
        <p><strong>${plan.name}</strong></p>
        <small>Plan görseli hazırlanıyor</small>
      `;
    };
    
    // Display plan details
    planDetails.innerHTML = `
      <div class="plan-info">
        <h3>${plan.name}</h3>
        <p class="plan-description">${plan.description}</p>
        
        <div class="plan-specs">
          <div class="spec-item">
            <span class="spec-label">Daire Tipi:</span>
            <span class="spec-value">${plan.apartmentType}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Cephe Sayısı:</span>
            <span class="spec-value">${plan.streetFacingSides} cephe</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Uygun Alan Aralığı:</span>
            <span class="spec-value">${plan.minUsableArea.toLocaleString('tr-TR')} - ${plan.maxUsableArea.toLocaleString('tr-TR')} m²</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Tahmini Daire Sayısı:</span>
            <span class="spec-value">${plan.estimatedApartments} adet</span>
          </div>
        </div>
        
        <div class="plan-features">
          <h4>Plan Özellikleri:</h4>
          <ul>
            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    planSection.style.display = "block";
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = "block";
  }

  function hideAllSections() {
    calculationSection.style.display = "none";
    planSection.style.display = "none";
    errorSection.style.display = "none";
  }

  // Initialize with default calculation
  setTimeout(() => {
    calculateAndSuggestPlan();
  }, 500);
});
