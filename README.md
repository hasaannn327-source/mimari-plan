# 🏗️ Mimari Kat Planı Önerisi Sistemi

Bu sistem, kullanıcıların girdiği parametrelere göre otomatik olarak uygun mimari kat planları öneren bir web uygulamasıdır.

## ✨ Özellikler

- **Otomatik Hesaplama**: Toplam taban alanı ve ortak alan yüzdesine göre net kullanılabilir alan hesaplama
- **Daire Sayısı Tahmini**: Seçilen daire tipine göre kaç daire sığabileceğini otomatik hesaplama
- **Akıllı Filtreleme**: Cephe sayısı, daire tipi ve alan aralığına göre uygun planları filtreleme
- **Görsel Plan Gösterimi**: SVG formatında detaylı kat planı görselleri
- **Türkçe Arayüz**: Tamamen Türkçe kullanıcı arayüzü
- **Responsive Tasarım**: Mobil ve masaüstü cihazlarda mükemmel görünüm

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
npm start
```

Backend sunucusu `http://localhost:3000` adresinde çalışacaktır.

### Frontend Kurulumu

Frontend dosyaları statik HTML/CSS/JS dosyalarıdır. Herhangi bir web sunucusu ile çalıştırabilirsiniz:

```bash
cd frontend
# Python ile basit sunucu
python -m http.server 8000

# veya Node.js ile
npx http-server -p 8000
```

Frontend `http://localhost:8000` adresinde çalışacaktır.

## 📋 Kullanım

### Giriş Parametreleri

1. **Toplam Taban Alanı (m²)**: Projenizin toplam taban alanını girin
2. **Ortak Alan Yüzdesi (%)**: Koridor, asansör vb. ortak alanların yüzdesi (0-50%)
3. **Cephe Sayısı**: Binanın kaç cephesi caddeye bakıyor (1-4)
4. **Daire Tipi**: Hangi tip daire planı arıyorsunuz (2+1, 3+1)

### Hesaplama Süreci

1. Sistem önce net kullanılabilir alanı hesaplar:
   ```
   Net Alan = Toplam Alan - (Toplam Alan × Ortak Alan %)
   ```

2. Daire sayısını tahmin eder:
   ```
   Daire Sayısı = Net Alan ÷ Daire Başına Ortalama Alan
   ```

3. Uygun planları filtreler:
   - Cephe sayısı eşleşmesi
   - Daire tipi eşleşmesi
   - Alan aralığı uygunluğu

4. En uygun planı seçer ve görselleştirir

## 🏠 Plan Tipleri

### 2+1 Daireler
- **Ortalama Alan**: 90 m²
- **Alan Aralığı**: 70-110 m²
- **Odalar**: Salon, Yatak Odası, Çocuk Odası, Mutfak, Banyo

### 3+1 Daireler
- **Ortalama Alan**: 140 m²
- **Alan Aralığı**: 110-180 m²
- **Odalar**: Salon, Yatak Odası, Çocuk Odası 1, Çocuk Odası 2, Mutfak, Banyo

## 🔧 API Endpoints

### Ana Endpoint
```
POST /api/floor-plan-suggestion
```

**Request Body:**
```json
{
  "totalBaseArea": 500,
  "commonAreaPercentage": 10,
  "streetFacingSides": 2,
  "apartmentType": "2+1"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "totalBaseArea": 500,
    "netUsableArea": 450,
    "estimatedApartments": 5,
    "bestPlan": { ... },
    "calculationDetails": { ... }
  },
  "svg": "<svg>...</svg>",
  "message": "Uygun plan bulundu!"
}
```

### Diğer Endpoints
- `GET /api/plans` - Tüm planları listele
- `GET /api/apartment-averages` - Daire tipi ortalamalarını getir
- `GET /api/plan/:planId/svg` - Belirli planın SVG'sini getir

## 📁 Proje Yapısı

```
├── backend/
│   ├── server.js                 # Ana sunucu dosyası
│   ├── package.json              # Backend bağımlılıkları
│   ├── planData.json             # Plan veritabanı
│   └── helpers/
│       ├── floorPlanCalculator.js # Hesaplama mantığı
│       └── drawPlanSVG.js        # SVG oluşturucu
├── frontend/
│   ├── index.html               # Ana sayfa
│   ├── style.css                # Stil dosyası
│   └── script.js                # Frontend mantığı
└── README.md                    # Bu dosya
```

## 🎨 Özelleştirme

### Yeni Plan Ekleme

`backend/planData.json` dosyasına yeni planlar ekleyebilirsiniz:

```json
{
  "id": "plan_007",
  "name": "Yeni Plan Adı",
  "apartmentType": "2+1",
  "streetFacingSides": 2,
  "minArea": 80,
  "maxArea": 100,
  "averageAreaPerApartment": 90,
  "description": "Plan açıklaması",
  "rooms": ["Salon", "Yatak Odası", "Çocuk Odası", "Mutfak", "Banyo"],
  "features": ["Balkon", "Depo"],
  "color": "#e3f2fd"
}
```

### Daire Tipi Ortalamalarını Değiştirme

`planData.json` dosyasındaki `apartmentTypeAverages` bölümünü düzenleyebilirsiniz.

## 🐛 Sorun Giderme

### Backend Çalışmıyor
- Node.js sürümünü kontrol edin
- `npm install` komutunu çalıştırın
- Port 3000'in boş olduğundan emin olun

### Frontend API Bağlantı Hatası
- Backend'in çalıştığından emin olun
- CORS ayarlarını kontrol edin
- API URL'sini doğru olduğundan emin olun

### Plan Bulunamıyor
- Giriş parametrelerini kontrol edin
- Alan aralıklarını kontrol edin
- Cephe sayısı ve daire tipi uyumluluğunu kontrol edin

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.