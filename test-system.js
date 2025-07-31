// Test the architectural floor plan system
const planData = require('./backend/planData.json');

console.log('🏗️ Mimari Plan Önerisi Sistemi Test');
console.log('=====================================');

// Test data
const testInput = {
  totalArea: 500,
  commonAreaPercentage: 10,
  streetFacingSides: 2,
  apartmentType: "2+1"
};

console.log('\n📋 Test Giriş Verileri:');
console.log(`- Toplam Alan: ${testInput.totalArea} m²`);
console.log(`- Ortak Alan: %${testInput.commonAreaPercentage}`);
console.log(`- Cephe Sayısı: ${testInput.streetFacingSides}`);
console.log(`- Daire Tipi: ${testInput.apartmentType}`);

// Hesaplamalar
const netArea = testInput.totalArea * (1 - testInput.commonAreaPercentage / 100);
const avgArea = planData.apartmentTypes[testInput.apartmentType].averageArea;
const estimatedApartments = Math.floor(netArea / avgArea);

console.log('\n📊 Hesaplama Sonuçları:');
console.log(`- Net Kullanılabilir Alan: ${Math.round(netArea)} m²`);
console.log(`- Ortalama Daire Alanı: ${avgArea} m²`);
console.log(`- Tahmini Daire Sayısı: ${estimatedApartments}`);

// Uygun plan bulma
const suitablePlan = planData.floorPlans.find(plan => 
  plan.apartmentType === testInput.apartmentType &&
  plan.streetFacingSides === testInput.streetFacingSides &&
  netArea >= plan.minArea &&
  netArea <= plan.maxArea
);

console.log('\n🎯 Plan Önerisi:');
if (suitablePlan) {
  console.log(`✅ Uygun plan bulundu: ${suitablePlan.name}`);
  console.log(`- Plan ID: ${suitablePlan.id}`);
  console.log(`- Alan Aralığı: ${suitablePlan.minArea}-${suitablePlan.maxArea} m²`);
  console.log(`- Toplam Daire: ${suitablePlan.totalApartments}`);
  console.log(`- Açıklama: ${suitablePlan.description}`);
} else {
  console.log('❌ Uygun plan bulunamadı');
}

console.log('\n📋 Mevcut Planlar:');
planData.floorPlans.forEach(plan => {
  console.log(`- ${plan.name} (${plan.apartmentType}, ${plan.streetFacingSides} cephe, ${plan.minArea}-${plan.maxArea}m²)`);
});

console.log('\n✅ Test tamamlandı!');