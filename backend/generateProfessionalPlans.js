const ProfessionalPlanGenerator = require('./helpers/professionalPlanGenerator');

console.log('🏗️  Profesyonel Mimari Plan Üretimi Başlıyor...');
console.log('==============================================');

try {
  const generator = new ProfessionalPlanGenerator();
  
  console.log('📐 Profesyonel planlar oluşturuluyor...');
  generator.generateAllProfessionalPlans();
  
  console.log('✅ Tüm profesyonel planlar başarıyla oluşturuldu!');
  console.log('');
  console.log('📁 Oluşturulan dosyalar:');
  console.log('- backend/plans/ klasöründe _professional.svg uzantılı dosyalar');
  console.log('');
  console.log('🚀 Profesyonel Özellikler:');
  console.log('- 1200x800 yüksek çözünürlük');
  console.log('- Grid sistemi ve ölçülendirme');
  console.log('- Gerçek mimari standartları');
  console.log('- Profesyonel renk paleti');
  console.log('- Detaylı mobilya sembolleri');
  console.log('- Kuzey oku ve açıklama');
  console.log('- Lobby ve ortak alanlar');
  console.log('- Duvar dokuları ve gölgeler');
  
} catch (error) {
  console.error('❌ Hata oluştu:', error.message);
  process.exit(1);
}