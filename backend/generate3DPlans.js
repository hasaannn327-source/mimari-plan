const ThreeDPlanGenerator = require('./helpers/threeDPlanGenerator');

console.log('🏗️  3D Mimari Plan Üretimi Başlıyor...');
console.log('=====================================');

try {
  const generator = new ThreeDPlanGenerator();
  
  console.log('📐 3D planlar oluşturuluyor...');
  generator.generateAll3DPlans();
  
  console.log('✅ Tüm 3D planlar başarıyla oluşturuldu!');
  console.log('');
  console.log('📁 Oluşturulan dosyalar:');
  console.log('- backend/plans/3d/ klasöründe HTML, JS ve CSS dosyaları');
  console.log('');
  console.log('🚀 3D Özellikler:');
  console.log('- Three.js ile gerçekçi 3D görüntüleme');
  console.log('- 360° döndürme ve zoom');
  console.log('- Gerçekçi materyal ve ışık efektleri');
  console.log('- Mobilya detayları');
  console.log('- Kamera kontrolleri');
  console.log('- Kalite ayarları');
  console.log('- Export özellikleri');
  
} catch (error) {
  console.error('❌ Hata oluştu:', error.message);
  process.exit(1);
}