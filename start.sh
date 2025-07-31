#!/bin/bash

echo "🏢 Mimari Kat Planı Öneri Sistemi Başlatılıyor..."
echo "=================================================="

# Backend'i başlat
echo "📊 Backend sunucusu başlatılıyor..."
cd backend
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!

# Backend'in başlamasını bekle
echo "⏳ Backend başlatılması bekleniyor..."
sleep 3

# Backend'in çalıştığını kontrol et
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Backend başarıyla başlatıldı!"
else
    echo "❌ Backend başlatılamadı!"
    exit 1
fi

# Frontend için talimatlar
echo ""
echo "🌐 Frontend'i başlatmak için:"
echo "   Option 1: frontend/index.html dosyasını tarayıcıda açın"
echo "   Option 2: HTTP sunucusu kullanın:"
echo "             cd frontend && python -m http.server 8080"
echo "             cd frontend && npx serve ."
echo ""
echo "📱 Uygulama kullanıma hazır!"
echo "   Backend: http://localhost:3000"
echo "   Frontend: Tarayıcıda açtığınız dosya"
echo ""
echo "🛑 Sistem'i durdurmak için: Ctrl+C"

# Sinyal yakalayıcısı - temizlik için
trap 'echo ""; echo "🛑 Sistem kapatılıyor..."; kill $BACKEND_PID 2>/dev/null; echo "✅ Backend durduruldu."; exit 0' INT

# Backend'in çalışmasını bekle
wait $BACKEND_PID