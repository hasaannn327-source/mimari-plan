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

  // PWA Features
  initializePWA();
});

// PWA Initialization
function initializePWA() {
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Install Prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });

  // App installed
  window.addEventListener('appinstalled', () => {
    hideInstallPrompt();
    showNotification('Uygulama başarıyla yüklendi!', 'success');
  });

  // Offline Detection
  window.addEventListener('online', () => {
    hideOfflineIndicator();
  });

  window.addEventListener('offline', () => {
    showOfflineIndicator();
  });

  // Check initial status
  if (!navigator.onLine) {
    showOfflineIndicator();
  }

  // Install button click
  document.getElementById('installBtn').addEventListener('click', () => {
    installApp();
  });

  // Dismiss install prompt
  document.getElementById('dismissInstall').addEventListener('click', () => {
    hideInstallPrompt();
  });
}

// PWA Functions
function showInstallPrompt() {
  document.getElementById('installPrompt').classList.add('show');
}

function hideInstallPrompt() {
  document.getElementById('installPrompt').classList.remove('show');
}

function showOfflineIndicator() {
  document.getElementById('offlineIndicator').classList.add('show');
}

function hideOfflineIndicator() {
  document.getElementById('offlineIndicator').classList.remove('show');
}

async function installApp() {
  if (!window.deferredPrompt) return;

  window.deferredPrompt.prompt();
  const { outcome } = await window.deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    hideInstallPrompt();
  }
  
  window.deferredPrompt = null;
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `;

  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .notification-icon {
      font-size: 1.2rem;
    }
    .notification-message {
      flex: 1;
      color: #2c3e50;
    }
    .notification-close {
      background: none;
      border: none;
      color: #95a5a6;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
      border-radius: 4px;
    }
    .notification-close:hover {
      background: #ecf0f1;
      color: #2c3e50;
    }
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Add close functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return icons[type] || icons.info;
}
