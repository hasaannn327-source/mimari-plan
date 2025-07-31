// Her bir plan tipinin farklı cephe sayılarına göre varyasyonlarını içeren GÜNCELLENMİŞ veri yapısı
const dairePlanlari = [
    // --- 3+1 Planları ---
    {
        tip: '3+1',
        cepheSayisi: 1,
        ad: '3+1 Daire (Tek Cephe)',
        gorselUrl: 'https://i.imgur.com/kP85Bq8.png', // Tek cepheye uygun uzun tip plan
        brutMetrekare: 122.5,
        netMetrekare: 93,
        aciklama: 'Tek cepheli arsalar için tasarlanmış bu planda, salon ve balkon yola bakacak şekilde konumlandırılarak gün ışığından maksimum fayda sağlanmıştır. Odalar arka kısımda yer alır.',
        odaListesi: ['Salon: 25 m²','Mutfak: 10 m²','Ebeveyn Yatak Odası: 15 m²','Ebeveyn Banyosu: 3 m²','Yatak Odası 2: 11 m²','Yatak Odası 3: 10 m²','Genel Banyo: 5 m²','Antre / Hol: 8 m²','Balkon: 6 m²']
    },
    {
        tip: '3+1',
        cepheSayisi: 2,
        ad: '3+1 Daire (Çift Cephe / Köşe Daire)',
        gorselUrl: 'https://i.imgur.com/bQyvjYw.png', // Çift cepheye uygun köşe tip plan
        brutMetrekare: 130, // Köşe daireler genellikle biraz daha büyük olur
        netMetrekare: 105,
        aciklama: 'Köşe parsel avantajını kullanan bu planda, balkon ana yola, mutfak ise yan yola bakmaktadır. Bu sayede hem mükemmel bir hava sirkülasyonu sağlanır hem de mutfak ve salon gün boyu ışık alır.',
        odaListesi: ['Salon: 28 m²','Mutfak: 12 m²','Ebeveyn Yatak Odası: 16 m²','Ebeveyn Banyosu: 4 m²','Yatak Odası 2: 12 m²','Yatak Odası 3: 11 m²','Genel Banyo: 5 m²','Antre / Hol: 9 m²','Balkon: 8 m²']
    },
    // --- 2+1 Planları ---
    {
        tip: '2+1',
        cepheSayisi: 1,
        ad: 'Geniş 2+1 Daire (Tek Cephe)',
        gorselUrl: 'https://i.imgur.com/8a6bQ5j.png', // Tek cepheye uygun geniş 2+1
        brutMetrekare: 122.5,
        netMetrekare: 103,
        aciklama: 'Geniş ve ferah bir yaşam alanı sunan bu tek cepheli planda, büyük salon ve balkon yola bakarak manzarayı içeri taşır.',
        odaListesi: ['Salon: 32 m²','Mutfak: 14 m²','Ebeveyn Yatak Odası: 18 m²','Ebeveyn Banyosu: 4 m²','Yatak Odası 2: 14 m²','Genel Banyo: 6 m²','Antre / Hol: 7 m²','Balkon: 8 m²']
    },
    {
        tip: '2+1',
        cepheSayisi: 2,
        ad: 'Geniş 2+1 Daire (Çift Cephe / Köşe Daire)',
        gorselUrl: 'https://i.imgur.com/eWzLz1x.png', // Çift cepheye uygun köşe 2+1
        brutMetrekare: 125,
        netMetrekare: 105,
        aciklama: 'İki cepheden ışık alan bu köşe dairede, balkon salona entegre şekilde ana yola, geniş mutfak ise aydınlık yan cepheye bakar. Konfor ve ferahlık bir aradadır.',
        odaListesi: ['Salon: 33 m²','Mutfak: 15 m²','Ebeveyn Yatak Odası: 19 m²','Ebeveyn Banyosu: 4 m²','Yatak Odası 2: 15 m²','Genel Banyo: 6 m²','Antre / Hol: 8 m²','Balkon: 10 m²']
    },
    // --- 4+2 Dubleks Planı ---
    {
        tip: '4+2',
        cepheSayisi: 1, // Dubleks için varsayılan olarak tek cephe örneği
        ad: '4+2 Dubleks Daire (Tek Cephe)',
        gorselUrl: 'https://i.imgur.com/3ZfFk9s.png', // Dubleks planı
        brutMetrekare: 220,
        netMetrekare: 185,
        aciklama: 'Çatı katı kullanımıyla geniş bir yaşam alanı sunan dubleks planı. Alt katta salon, mutfak ve misafir odaları; üst katta ise ebeveyn suiti ve teras yer alır. Balkon ve teras ana yola bakmaktadır.',
        odaListesi: ['Alt Kat Salon: 45 m²','Alt Kat Mutfak: 20 m²','Alt Kat Oda 1: 12 m²','Alt Kat Banyo: 5 m²', 'Üst Kat Ebeveyn Odası: 25 m²','Üst Kat Oda 2: 15 m²','Üst Kat Oda 3: 14 m²', 'Üst Kat Banyo: 6 m²', 'Teras: 25 m²']
    }
];

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', () => {
    // HTML'deki elemanlara ulaşıyoruz
    const tipSecici = document.getElementById('tipSecici');
    const cepheSecici = document.getElementById('cepheSecici');
    const planGorseli = document.getElementById('planGorseli');
    const planAdi = document.getElementById('planAdi');
    const planDetaylari = document.getElementById('planDetaylari');
    const hataMesaji = document.getElementById('hataMesaji');

    // Her iki seçim menüsüne de olay dinleyici ekliyoruz.
    tipSecici.addEventListener('change', gostergeyiGuncelle);
    cepheSecici.addEventListener('change', gostergeyiGuncelle);

    function gostergeyiGuncelle() {
        const secilenTip = tipSecici.value;
        const secilenCephe = cepheSecici.value;

        // Kullanıcının seçtiği tip ve cephe sayısına uygun planı veritabanından buluyoruz.
        const secilenPlan = dairePlanlari.find(plan => plan.tip === secilenTip && plan.cepheSayisi == secilenCephe);

        if (secilenPlan) {
            // Plan bulunduysa, bilgileri ekrana yazdır ve hata mesajını gizle
            hataMesaji.style.display = 'none';
            document.querySelector('.plan-gosterici').style.display = 'flex';

            planGorseli.src = secilenPlan.gorselUrl;
            planAdi.textContent = secilenPlan.ad;

            let detayHtml = `
                <p><strong>Açıklama:</strong> ${secilenPlan.aciklama}</p>
                <p><strong>Brüt Alan:</strong> ${secilenPlan.brutMetrekare} m²</p>
                <p><strong>Tahmini Net Alan:</strong> ${secilenPlan.netMetrekare} m²</p>
                <strong>Oda Dağılımı:</strong>
                <ul>
            `;
            secilenPlan.odaListesi.forEach(oda => {
                detayHtml += `<li>${oda}</li>`;
            });
            detayHtml += '</ul>';
            planDetaylari.innerHTML = detayHtml;

        } else {
            // Eğer seçilen kombinasyon için bir plan bulunamazsa (örn: 4+2 ve 2 Cephe)
            // Bir hata mesajı göster ve plan gösterim alanını gizle.
            hataMesaji.textContent = `Seçtiğiniz "${secilenTip}" tipi için "${secilenCephe} Cepheli" bir plan örneği bulunmamaktadır. Lütfen farklı bir kombinasyon deneyin.`;
            hataMesaji.style.display = 'block';
            document.querySelector('.plan-gosterici').style.display = 'none';
        }
    }

    // Sayfa ilk açıldığında varsayılan seçime göre içeriği yükle
    gostergeyiGuncelle();
});
