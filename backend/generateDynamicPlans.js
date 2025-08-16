const DynamicPlanGenerator = require("./helpers/dynamicPlanGenerator");

console.log("🏗️  Dinamik Mimari Plan Üretimi Başlıyor...");
console.log("=============================================");

try {
  const generator = new DynamicPlanGenerator();
  
  // Farklı yol tiplerinde dinamik planlar oluştur
  const streetTypes = ["residential", "secondary", "main", "pedestrian"];
  
  streetTypes.forEach(streetType => {
    console.log(`\n📐 ${streetType.toUpperCase()} yol tipinde dinamik planlar oluşturuluyor...`);
    generator.generateAllDynamicPlans(streetType);
  });
  
  console.log("\n✅ Tüm dinamik planlar başarıyla oluşturuldu!");
  console.log("");
  console.log("🚀 Dinamik Özellikler:");
  console.log("- Cephe sayısına göre otomatik düzen");
  console.log("- Yol tipine göre plan adaptasyonu");
  console.log("- Trafik yoğunluğuna göre otopark");
  console.log("- Gürültü seviyesine göre balkon konumu");
  console.log("- Işık alımına göre oda boyutları");
  console.log("- Yol genişliğine göre ölçülendirme");
  
} catch (error) {
  console.error("❌ Hata oluştu:", error.message);
  process.exit(1);
}
