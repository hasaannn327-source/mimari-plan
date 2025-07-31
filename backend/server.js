// server.js
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// Örnek plan verileri
const plans = {
  "2+1": {
    totalM2: 90,
    rooms: [
      { name: "Salon", m2: 30, coords: [10,10,200,100] },
      { name: "Yatak Odası", m2: 20, coords: [220,10,120,100] },
      { name: "Çocuk Odası", m2: 15, coords: [10,120,150,80] },
      { name: "Mutfak", m2: 15, coords: [170,120,100,80] },
      { name: "Banyo", m2: 10, coords: [280,120,60,80] }
    ]
  },
  "3+1": {
    totalM2: 110,
    rooms: [
      { name: "Salon", m2: 35, coords: [10,10,220,100] },
      { name: "Yatak Odası", m2: 20, coords: [240,10,130,80] },
      { name: "Çocuk Odası 1", m2: 15, coords: [10,120,150,80] },
      { name: "Çocuk Odası 2", m2: 15, coords: [170,120,100,80] },
      { name: "Mutfak", m2: 15, coords: [280,120,90,80] },
      { name: "Banyo", m2: 15, coords: [380,120,70,80] }
    ]
  }
};

// Plan verisini dönen API
app.get('/api/plan/:type', (req, res) => {
  const planType = req.params.type;
  const plan = plans[planType];
  if(plan) {
    res.json(plan);
  } else {
    res.status(404).json({ error: 'Plan bulunamadı' });
  }
});

app.listen(port, () => {
  console.log(`Server çalışıyor http://localhost:${port}`);
});
