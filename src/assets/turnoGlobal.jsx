import { useEffect } from "react";

export default function TurnoGlobal({ aoMudarTurno }) {
  useEffect(() => {
    const buscarTurno = () => {
      fetch("https://backend-suplencia.onrender.com/turno")
        .then(res => res.json())
        .then(data => {
          console.log("🌐 Turno recebido do backend:", data.turno);
          if (data.turno) {
            aoMudarTurno(data.turno); // ✅ atualiza o App.jsx
          }
        })
        .catch(err => {
          console.error("Erro ao buscar turno:", err);
        });
    };

    buscarTurno(); // 🔁 busca inicial
    const intervalo = setInterval(buscarTurno, 5000); // 🔁 busca automática
    return () => clearInterval(intervalo);
  }, [aoMudarTurno]);

  return null;
}
