# 🏗️ Mimari Plan Önerisi Sistemi

Otomatik mimari plan önerisi yapan gelişmiş sistem. Kullanıcı girdilerine göre en uygun mimari planı önerir ve görselleştirir.

## ✨ Özellikler

- **Akıllı Hesaplama**: Toplam alan ve ortak alan yüzdesine göre net kullanılabilir alan hesaplama
- **Daire Sayısı Tahmini**: Seçilen daire tipine göre tahmini daire sayısı hesaplama
- **Plan Filtreleme**: Cephe sayısı, daire tipi ve alan aralığına göre uygun planları filtreleme
- **Görsel Plan Gösterimi**: SVG formatında detaylı plan görselleştirme
- **Türkçe Arayüz**: Tamamen Türkçe kullanıcı arayüzü
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu modern tasarım

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd architectural-floor-plan-system
```

2. **Backend bağımlılıklarını yükleyin**
```bash
cd backend
npm install
```

3. **Sunucuyu başlatın**
```bash
npm start
# veya geliştirme modu için:
npm run dev
```

4. **Frontend'i açın**
```bash
# Yeni bir terminal açın
cd frontend
# index.html dosyasını tarayıcıda açın
```

## 📋 Kullanım

### Giriş Parametreleri

1. **Toplam Brüt Alan (m²)**: Projenizin toplam brüt alanı (50-2000 m²)
2. **Ortak Alan Yüzdesi (%)**: Asansör, koridor, giriş gibi ortak alanların yüzdesi (%5-%30)
3. **Sokak Cephe Sayısı**: Projenizin kaç cepheden sokağa baktığı (1-4)
4. **Daire Tipi**: Hedef daire tipi (2+1, 3+1, 4+1)

### Hesaplama Süreci

1. **Net Alan Hesaplama**: `Net Alan = Toplam Alan × (1 - Ortak Alan %)`
2. **Daire Sayısı Tahmini**: `Tahmini Daire = Net Alan ÷ Ortalama Daire Alanı`
3. **Plan Filtreleme**: Cephe sayısı, daire tipi ve alan aralığına göre uygun planları bulma
4. **Sonuç Gösterimi**: En uygun planın SVG görselleştirmesi ve detayları

### Örnek Kullanım

```
Giriş:
- Toplam Alan: 500 m²
- Ortak Alan: %10
- Cephe Sayısı: 2
- Daire Tipi: 2+1

Hesaplama:
- Net Alan: 450 m²
- Tahmini Daire: 5 adet (450 ÷ 90)
- Önerilen Plan: Çift Cephe 2+1
```

## 🏗️ Sistem Mimarisi

### Backend (Node.js + Express)
- **server.js**: Ana sunucu dosyası
- **planData.json**: Plan veritabanı
- **helpers/drawPlanSVG.js**: SVG oluşturma ve hesaplama fonksiyonları

### Frontend (HTML + CSS + JavaScript)
- **index.html**: Kullanıcı arayüzü
- **style.css**: Modern responsive tasarım
- **script.js**: İstemci tarafı mantığı

### API Endpoints

- `POST /api/plan-suggestion`: Ana plan önerisi endpoint'i
- `GET /api/plans`: Mevcut planları listeleme
- `GET /api/apartment-types`: Daire tiplerini listeleme

## 📊 Plan Veritabanı

Sistem şu plan tiplerini destekler:

### Daire Tipleri
- **2+1**: 90 m² ortalama alan
- **3+1**: 120 m² ortalama alan  
- **4+1**: 150 m² ortalama alan

### Cephe Seçenekleri
- 1 Cephe (Tek cepheli)
- 2 Cephe (Çift cepheli)
- 3 Cephe (Üç cepheli)
- 4 Cephe (Dört cepheli)

### Plan Özellikleri
Her plan şu bilgileri içerir:
- Plan ID ve adı
- Daire tipi ve sayısı
- Cephe sayısı
- Alan aralığı (min-max)
- Oda listesi
- SVG renk kodu
- Açıklama

## 🎨 Görsel Özellikler

- **Modern UI**: Gradient arka plan ve modern kart tasarımı
- **Responsive**: Mobil ve masaüstü uyumlu
- **SVG Planlar**: Vektörel, ölçeklenebilir plan görselleri
- **Cephe Göstergeleri**: Kırmızı çizgilerle cephe sayısı gösterimi
- **Renk Kodları**: Her plan tipi için farklı renkler

## 🔧 Geliştirme

### Yeni Plan Ekleme
`backend/planData.json` dosyasına yeni plan ekleyebilirsiniz:

```json
{
  "id": "plan_008",
  "name": "Yeni Plan",
  "apartmentType": "2+1",
  "streetFacingSides": 2,
  "minArea": 80,
  "maxArea": 100,
  "totalApartments": 1,
  "width": 400,
  "height": 200,
  "rooms": ["Salon", "Yatak Odası", "Mutfak", "Banyo"],
  "svgColor": "#e1f5fe",
  "description": "Yeni plan açıklaması"
}
```

### Yeni Daire Tipi Ekleme
`apartmentTypes` bölümüne yeni tip ekleyebilirsiniz:

```json
"5+1": {
  "averageArea": 180,
  "description": "5 yatak odası + 1 salon"
}
```

## 🚀 Deployment

### Production
```bash
cd backend
npm install --production
npm start
```

### Environment Variables
- `PORT`: Sunucu portu (varsayılan: 3000)

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Mimari Plan Önerisi Sistemi** - Akıllı mimari planlama için modern çözüm 🏗️