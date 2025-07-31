import React, { useEffect, useState } from 'react';

function Plan({ type }) {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    fetch(`/api/plan/${type}`)
      .then(res => res.json())
      .then(data => setPlan(data))
      .catch(() => setPlan(null));
  }, [type]);

  if (!plan) return <div>Plan yükleniyor veya bulunamadı.</div>;

  return (
    <div>
      <h2>{type} Planı - Toplam Metrekare: {plan.totalM2} m²</h2>
      <svg width="480" height="240" style={{border: "1px solid #ccc"}}>
        {plan.rooms.map((room, idx) => (
          <g key={idx}>
            <rect
              x={room.coords[0]} y={room.coords[1]}
              width={room.coords[2]} height={room.coords[3]}
              fill="#90caf9"
              stroke="#0d47a1"
              strokeWidth="2"
            />
            <text
              x={room.coords[0] + 5}
              y={room.coords[1] + 20}
              fontSize="14"
              fill="#0d47a1"
              fontWeight="bold"
            >
              {room.name}
            </text>
            <text
              x={room.coords[0] + 5}
              y={room.coords[1] + 40}
              fontSize="12"
              fill="#0d47a1"
            >
              {room.m2} m²
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function App() {
  const [planType, setPlanType] = useState("2+1");

  return (
    <div style={{ padding: 20 }}>
      <h1>Mimarî Plan Görsel Modülü</h1>
      <select value={planType} onChange={e => setPlanType(e.target.value)}>
        <option value="2+1">2+1</option>
        <option value="3+1">3+1</option>
      </select>
      <Plan type={planType} />
    </div>
  );
  }
