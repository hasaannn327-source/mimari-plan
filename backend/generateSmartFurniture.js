const SmartFurniturePlanner = require('./helpers/smartFurniturePlanner');

console.log('🏠 Akıllı Mobilya Planı Üretimi Başlıyor...');
console.log('==========================================');

try {
  const planner = new SmartFurniturePlanner();
  
  // Test için örnek kullanıcı tercihleri
  const testPreferences = {
    budget: 75000,
    style: 'modern',
    accessibility: ['wheelchair', 'elderly'],
    fengShui: true,
    roomPriority: 'livingRoom',
    colorScheme: 'neutral'
  };
  
  console.log('📐 Akıllı mobilya planları oluşturuluyor...');
  console.log('👤 Kullanıcı tercihleri:', testPreferences);
  
  // Tüm planlar için mobilya planları oluştur
  const planData = require('./planData.json');
  
  planData.floorPlans.forEach(plan => {
    console.log(`\n🏗️ ${plan.name} için mobilya planı oluşturuluyor...`);
    
    const furniturePlan = planner.generateSmartFurniturePlan(plan.id, testPreferences);
    
    if (furniturePlan) {
      console.log(`✅ ${plan.name} mobilya planı oluşturuldu!`);
      console.log(`💰 Toplam maliyet: ${furniturePlan.totalCost}TL`);
      console.log(`🧘 Feng Shui skoru: ${furniturePlan.fengShuiScore}/100`);
      console.log(`♿ Erişilebilirlik skoru: ${furniturePlan.accessibilityScore}/100`);
      
      // Önerileri göster
      if (furniturePlan.recommendations.length > 0) {
        console.log('💡 Öneriler:');
        furniturePlan.recommendations.forEach(rec => {
          console.log(`  - ${rec.message}`);
        });
      }
    }
  });
  
  console.log('\n✅ Tüm akıllı mobilya planları başarıyla oluşturuldu!');
  console.log('');
  console.log('🚀 Akıllı Özellikler:');
  console.log('- AI destekli mobilya seçimi');
  console.log('- Feng Shui prensipleri');
  console.log('- Erişilebilirlik standartları');
  console.log('- Bütçe optimizasyonu');
  console.log('- Stil uyumluluğu');
  console.log('- Renk harmonisi');
  console.log('- Boyut uyumluluğu');
  
} catch (error) {
  console.error('❌ Hata oluştu:', error.message);
  process.exit(1);
}