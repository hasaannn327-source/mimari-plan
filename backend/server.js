const express = require('express');
const app = express();
const cors = require('cors');
const planData = require('./planData.json');

app.use(cors());

app.get('/api/plan/:tip', (req, res) => {
  const tip = req.params.tip;
  const plan = planData.find(p => p.tip === tip);
  if (plan) {
    res.json(plan);
  } else {
    res.status(404).json({ error: 'Plan bulunamadı' });
  }
});

app.listen(3001, () => {
  console.log('API 3001 portunda çalışıyor');
});
