const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

const dairePlanlari = [
    {
        tip: '3+1',
        cepheSayisi: 1,
        ad: '3+1 Daire (Tek Cephe)',
        gorselUrl: 'https://i.imgur.com/kP85Bq8.png',
        brutMetrekare: 122.5,
        netMetrekare: 93,
        aciklama: 'Tek cepheli arsalar için tasarlanmış...',
        odaListesi: ['Salon: 25 m²','Mutfak: 10 m²','Ebeveyn Yatak Odası: 15 m²','Ebeveyn Banyosu: 3 m²','Yatak Odası 2: 11 m²','Yatak Odası 3: 10 m²','Genel Banyo: 5 m²','Antre / Hol: 8 m²','Balkon: 6 m²']
    },
    {
        tip: '3+1',
        cepheSayisi: 2,
        ad: '3+1 Daire (Çift Cephe / Köşe Daire)',
        gorselUrl: 'https://i.imgur.com/bQyvjYw.png',
        brutMetrekare: 130,
        netMetrekare: 105,
        aciklama: 'Köşe parsel avantajını kullanan bu planda...',
        odaListesi: ['Salon: 28 m²','Mutfak: 12 m²','Ebeveyn Yatak Odası: 16 m²','Ebeveyn Banyosu: 4 m²','Yatak Odası 2: 12 m²','Yatak Odası 3: 11 m²','Genel Banyo: 5 m²','Antre / Hol: 9 m²','Balkon: 8 m²']
    },
    // Diğer planlar...
];

app.get('/api/plan', (req, res) => {
    const { tip, cepheSayisi } = req.query;
    if (!tip || !cepheSayisi) {
        return res.status(400).json({ error: 'tip ve cepheSayisi sorgu parametreleri gereklidir' });
    }

    const plan = dairePlanlari.find(p => p.tip === tip && p.cepheSayisi == cepheSayisi);

    if (plan) {
        res.json(plan);
    } else {
        res.status(404).json({ error: 'Plan bulunamadı' });
    }
});

app.listen(port, () => {
    console.log(`API çalışıyor http://localhost:${port}`);
});
