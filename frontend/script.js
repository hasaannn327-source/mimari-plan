document.addEventListener("DOMContentLoaded", function () {
  const planTipi = document.getElementById("planTipi");
  const m2 = document.getElementById("m2");
  const kat = document.getElementById("kat");
  const hataMesaji = document.getElementById("hataMesaji");
  const planGorseli = document.getElementById("planGorseli");
  const planDetaylari = document.getElementById("planDetaylari");
  const planGosterici = document.getElementById("planGosterici");

  function planYukle() {
    const url = `http://localhost:3001/api/plan/${planTipi.value}?m2=${m2.value}&kat=${kat.value}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Plan bulunamadı");
        return res.json();
      })
      .then(data => {
        hataMesaji.style.display = "none";
        planGosterici.style.display = "flex";
        planGorseli.src = data.image;
        planDetaylari.innerHTML = `
          <h2>Plan Özellikleri</h2>
          <ul>
            <li>Oda Sayısı: ${data.rooms}</li>
            <li>Toplam m²: ${data.m2}</li>
            <li>Banyo: ${data.bathroom}</li>
            <li>Balkon: ${data.balcony}</li>
          </ul>
        `;
      })
      .catch(() => {
        planGosterici.style.display = "none";
        hataMesaji.style.display = "block";
      });
  }

  planTipi.addEventListener("change", planYukle);
  m2.addEventListener("change", planYukle);
  kat.addEventListener("change", planYukle);

  planYukle(); // Sayfa yüklendiğinde başlat
});
