# 🏢 Mimari Kat Planı Öneri Sistemi - PWA

Modern web tabanlı mimari kat planı öneri sistemi. Kullanıcı girdilerine göre uygun kat planları öneren Türkçe arayüzlü uygulama. **Offline çalışabilen ve kolay deploy edilebilen PWA (Progressive Web App)** özelliklerine sahiptir.

## ✨ Özellikler

### Hesaplama ve Analiz
- **Toplam taban alanı** girişi (100-5000 m²)
- **Ortak alan yüzdesi** hesaplaması (%5-30)
- **Net kullanılabilir alan** otomatik hesaplama
- **Tahmini daire sayısı** hesaplama
- Daire tipine göre **ortalama alan** kullanımı

### Plan Filtreleme
- **Sokağa bakan cephe sayısı** (1-4 cephe)
- **Daire tipi** seçimi (1+1, 2+1, 3+1, 4+1)
- **Alan aralığı** uyumluluğu
- **Akıllı öneri algoritması**

### Görsel Sunum
- **SVG tabanlı kat planları**
- **Responsive tasarım**
- **Modern Türkçe arayüz**
- **Real-time hesaplama**

### 🚀 PWA Özellikleri
- **Offline çalışma** (Service Worker ile)
- **Ana ekrana ekleme** (Install prompt)
- **Push notifications** desteği
- **App-like deneyim** (Standalone mode)
- **Cache yönetimi** (Akıllı offline storage)

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14+)
- Modern web tarayıcısı (PWA desteği için)

### Hızlı Başlangıç

#### 1. Otomatik Deploy (Önerilen)
```bash
# Deploy script'ini çalıştırın
./deploy.sh

# Seçeneklerden birini seçin:
# 1) Local Development
# 2) Static Hosting (GitHub Pages, Netlify, Vercel)
# 3) Docker Container
# 4) Production Server
# 5) Cloud Platform (AWS, GCP, Azure)
```

#### 2. Manuel Kurulum

**Projeyi klonlayın**
```bash
git clone <repo-url>
cd architectural-floor-plan-system
```

**Backend bağımlılıklarını yükleyin**
```bash
cd backend
npm install
```

**Plan görsellerini oluşturun**
```bash
npm run generate-plans
```

**Sunucuyu başlatın**
```bash
npm start
```

**Frontend'i açın**
- `frontend/index.html` dosyasını tarayıcıda açın
- Veya bir HTTP sunucusu kullanın:
```bash
cd frontend
python -m http.server 8080
# veya
npx serve .
```

## 📁 Proje Yapısı

```
📦 architectural-floor-plan-system
├── 📁 backend/
│   ├── 📁 helpers/
│   │   └── drawPlanSVG.js       # SVG plan oluşturucu
│   ├── 📁 plans/                # Oluşturulan plan görselleri
│   ├── package.json             # Backend bağımlılıkları
│   ├── planData.json            # Plan veritabanı
│   ├── server.js                # Express sunucusu
│   └── generatePlans.js         # Plan oluşturma scripti
├── 📁 frontend/
│   ├── 📁 icons/                # PWA icon'ları
│   ├── index.html               # Ana sayfa (PWA meta tags ile)
│   ├── script.js                # Frontend JavaScript (PWA özellikleri ile)
│   ├── style.css                # Modern CSS stilleri
│   ├── sw.js                    # Service Worker (offline çalışma)
│   └── manifest.json            # PWA manifest dosyası
├── deploy.sh                    # Otomatik deploy script'i
└── README.md
```

## 🎯 Kullanım

### 1. Proje Bilgilerini Girin
- **Toplam Taban Alanı**: Projenin toplam alanını m² cinsinden girin
- **Ortak Alan Yüzdesi**: Merdiven, koridor, vb. ortak alanların yüzdesini belirleyin
- **Sokağa Bakan Cephe Sayısı**: Binanın kaç sokağa baktığını seçin
- **İstenen Daire Tipi**: Hedeflenen daire tipini seçin

### 2. Hesaplama Sonuçlarını İnceleyin
- Net kullanılabilir alan otomatik hesaplanır
- Tahmini daire sayısı gösterilir
- Ortalama daire alanı bilgisi sunulur

### 3. Önerilen Planı Görüntüleyin
- Uygun plan otomatik olarak seçilir
- Plan özellikleri detaylandırılır
- SVG tabanlı görsel sunum

## 🏗️ Plan Veritabanı

Sistem şu plan tiplerini destekler:

### Daire Tipleri
- **1+1**: 60 m² ortalama (Kompakt yaşam)
- **2+1**: 85 m² ortalama (Küçük aileler)
- **3+1**: 110 m² ortalama (Orta büyüklük aileler)
- **4+1**: 140 m² ortalama (Büyük aileler)

### Cephe Konfigürasyonları
- **1 Cephe**: Tek sokağa bakan
- **2 Cephe**: Köşe konumu
- **3 Cephe**: Üç sokağa bakan
- **4 Cephe**: Ada konumu

## 🛠️ API Endpoints

### POST `/api/suggest-plan`
Plan önerisi için ana endpoint.

**Request Body:**
```json
{
  "netUsableArea": 450,
  "streetFacingSides": 2,
  "apartmentType": "2+1"
}
```

**Response:**
```json
{
  "id": "plan_2",
  "name": "Köşe Blok - 2+1",
  "apartmentType": "2+1",
  "streetFacingSides": 2,
  "minUsableArea": 400,
  "maxUsableArea": 800,
  "image": "plans/plan_2_2plus1_2side.svg",
  "features": ["Köşe konumu avantajı", "İki cephe ışık alımı"]
}
```

### GET `/api/plans`
Tüm mevcut planları listeler.

### GET `/api/health`
Sistem durumu kontrolü.

## 🎨 Teknik Detaylar

### Frontend
- **Vanilla JavaScript** (Framework yok)
- **Modern CSS Grid/Flexbox**
- **Responsive design**
- **Progressive enhancement**

### Backend
- **Node.js + Express**
- **CORS enabled**
- **JSON-based data store**
- **SVG generation**

### Plan Algoritması
1. **Tam eşleşme**: Daire tipi, cephe sayısı ve alan aralığı
2. **Kısmi eşleşme**: Daire tipi ve cephe sayısı
3. **Alternatif**: En yakın alan aralığı
4. **Fallback**: Hata mesajı

## 🔧 Geliştirme

### Development Mode
```bash
cd backend
npm run dev  # nodemon ile auto-restart
```

### Plan Güncelleme
1. `backend/planData.json` dosyasını düzenleyin
2. `npm run generate-plans` komutunu çalıştırın
3. Sunucuyu yeniden başlatın

### Yeni Plan Ekleme
```json
{
  "id": "plan_new",
  "apartmentType": "2+1",
  "streetFacingSides": 1,
  "minUsableArea": 300,
  "maxUsableArea": 600,
  "name": "Yeni Plan",
  "description": "Plan açıklaması",
  "image": "plans/plan_new.svg",
  "features": ["Özellik 1", "Özellik 2"]
}
```

## 🌟 Öne Çıkan Özellikler

- **Türkçe arayüz** - Tamamen Türkçe kullanıcı deneyimi
- **Real-time hesaplama** - Anında sonuç gösterimi
- **Responsive tasarım** - Mobil uyumlu
- **Modern UI/UX** - Gradient ve animasyonlar
- **Akıllı filtreleme** - Çoklu kriter desteği
- **SVG planlar** - Ölçeklenebilir görseller
- **🚀 PWA desteği** - Offline çalışma ve ana ekrana ekleme
- **📱 Mobil uygulama deneyimi** - App-like kullanım
- **💾 Offline storage** - İnternet olmadan da çalışır
- **🔧 Kolay deploy** - Tek script ile çoklu platform desteği

## 🚀 Deploy Seçenekleri

### 1. Otomatik Deploy (En Kolay)
```bash
./deploy.sh
```

### 2. Static Hosting (GitHub Pages, Netlify, Vercel)
- Frontend dosyaları otomatik olarak hazırlanır
- PWA özellikleri korunur
- HTTPS otomatik olarak sağlanır

### 3. Docker Container
- Tam containerized uygulama
- Production-ready
- Kolay scaling

### 4. Production Server
- Nginx konfigürasyonu
- Systemd service
- SSL sertifika desteği

### 5. Cloud Platform
- AWS CloudFormation template
- Terraform configuration
- S3 + CloudFront setup

## 📱 PWA Özellikleri

### Offline Çalışma
- Service Worker ile cache yönetimi
- Tüm statik dosyalar offline'da erişilebilir
- API çağrıları cache'lenir

### Ana Ekrana Ekleme
- Install prompt otomatik gösterilir
- App-like deneyim
- Standalone mode

### Push Notifications
- Yeni plan önerileri için bildirimler
- Background sync desteği

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasını inceleyin.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Bu proje AI Assistant tarafından geliştirilmiştir.

---

⭐ Bu projeyi beğendiyseniz star atmayı unutmayın!