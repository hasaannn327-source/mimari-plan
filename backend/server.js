const express = require("express");
const cors = require("cors");
const generatePlan = require("./drawPlanSVG");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/plan", (req, res) => {
  const { daireTipi, cepheSayisi } = req.body;
  const svg = generatePlan(daireTipi, cepheSayisi);

  if (!svg) {
    return res.status(404).json({ error: "Uygun plan bulunamadı" });
  }

  res.send(svg);
});

app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
