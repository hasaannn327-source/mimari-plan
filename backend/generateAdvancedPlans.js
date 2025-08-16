const AdvancedPlanGenerator = require('./helpers/advancedPlanGenerator');

console.log('🏗️  Gelişmiş Mimari Plan Üretimi Başlıyor...');
console.log('==========================================');

try {
  const generator = new AdvancedPlanGenerator();
  
  console.log('📐 Gelişmiş planlar oluşturuluyor...');
  generator.generateAllAdvancedPlans();
  
  console.log('✅ Tüm gelişmiş planlar başarıyla oluşturuldu!');
  console.log('');
  console.log('📁 Oluşturulan dosyalar:');
  console.log('- backend/plans/ klasöründe _advanced.svg uzantılı dosyalar');
  console.log('');
  console.log('🚀 Özellikler:');
  console.log('- Gerçekçi daire planları');
  console.log('- Kapı ve pencere sembolleri');
  console.log('- Ölçülendirme ve grid sistemi');
  console.log('- Kuzey oku ve açıklama');
  console.log('- Merdiven ve asansör alanları');
  console.log('- Balkon ve ortak alanlar');
  
} catch (error) {
  console.error('❌ Hata oluştu:', error.message);
  process.exit(1);
}