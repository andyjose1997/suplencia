import { useState, useEffect } from "react";
import "./impressoes.css";
import EncarregadoImpressao from "./Enc";


const linksSalas = {
  "101": "https://drive.google.com/drive/folders/1mqYBb4a2gmEkTG0wQto0qRG83vt8cHNS?usp=drive_link",
  "102": "https://drive.google.com/drive/folders/1V8innygAamrLk9yZlCnyNcsU8V3F4AC-?usp=drive_link",
  "103": "https://drive.google.com/drive/folders/15ct5EqZanyqCyUo2MARKrCOBDNE-qrTX?usp=drive_link",
  "104": "https://drive.google.com/drive/folders/1oHHViBgXshtCvcWF8_osAJ_Z_2mSvngs?usp=drive_link",
  "105": "https://drive.google.com/drive/folders/1S4ogU3g8PiX2vwEr5IuYeEl9Cg3Z62bi?usp=drive_link",
  "106": "https://drive.google.com/drive/folders/1zJoYalwKZDaZ_Gc4aE47JMRVacFS960r?usp=drive_link",
  "107": "https://drive.google.com/drive/folders/1nW9E8ttDCNVhsfVNewXf0rOfE-t-dxXs?usp=drive_link",
  "108": "https://drive.google.com/drive/folders/1z8BD2qf7LIQDC0bba8NURkLLLySW3jpN?usp=drive_link",
  "109": "https://drive.google.com/drive/folders/1G898D0abuMJ-gpsK9G_99n2lplPfNrG4?usp=drive_link",
  "110": "https://drive.google.com/drive/folders/1-07dNuKBycoP929VBBtmUohnQoLRtWbM?usp=drive_link",
  "111": "https://drive.google.com/drive/folders/1g7wvDO_vFuVuvLtzO140ExYsQuh3j2VW?usp=drive_link",
  "112": "https://drive.google.com/drive/folders/1KvsnuFR6pkzDVtjRfN7NJOlsnc3r-S8h?usp=drive_link",
  "113": "https://drive.google.com/drive/folders/1J9l3r9cw0x7oEABuOyxh0w_83jFcHZHo?usp=drive_link",
  "114": "https://drive.google.com/drive/folders/1pWQO8sQAOd638h0niwqwdnM1l-c7tvkR?usp=drive_link",
  "115": "https://drive.google.com/drive/folders/1r1UgGSBLAoec5yLsKjSfngvoqnGLoqM4?usp=drive_link",
  "116": "https://drive.google.com/drive/folders/1bYYtjGn2wX0L-dGP21-Fr5WEy-W52nUp?usp=drive_link",
  "117": "https://drive.google.com/drive/folders/1cAMLHFMOpKp-taJbmuF6HRIP5g6c_xnt?usp=drive_link",
  "118": "https://drive.google.com/drive/folders/1GCTJBuw74PJZte8uGFxM0h9KNRRq-0rI?usp=drive_link",
  "119": "https://drive.google.com/drive/folders/1hYACdZ2Y7fp9pA94-ydCbwLTjR3EEigQ?usp=drive_link",
  "120": "https://drive.google.com/drive/folders/11LID6hQDT5iLWrzzuXVvXXfXWR0bjcoq?usp=drive_link",
  "121": "https://drive.google.com/drive/folders/1_VXsvHHEx74dOaC1lMKnmG4GjALh6UBU?usp=drive_link",
  "122": "https://drive.google.com/drive/folders/1A4wl7bDLyuVV3F8z0N7KP6_qtqKepkvp?usp=drive_link",
  "123": "https://drive.google.com/drive/folders/1GPg-Bm1vrqjCKsKNgetS1aR731hJaW29?usp=drive_link",
  "124": "https://drive.google.com/drive/folders/14G7xIzBGUZHMu4Bmyn9bDOJfk89gDkNH?usp=drive_link",
  "125": "https://drive.google.com/drive/folders/1UDSJ8eSaXWwlMoEBpPhhGJojYga2OeSL?usp=drive_link",
  "126": "https://drive.google.com/drive/folders/1sfivt2RWuLjuIP0RE3O4okue3gPB7_3k?usp=drive_link",
  "127": "https://drive.google.com/drive/folders/1OzNptOcw3PkG7G-acQ1ubdNvlXwQOSZW?usp=drive_link",
  "128": "https://drive.google.com/drive/folders/1Phd-0iEnrVwsowIl9XopzpH2ezTiVwSa?usp=drive_link",
  "129": "https://drive.google.com/drive/folders/1cebG1Qdq7SfqWXPlyvcSadDw33oZqddU?usp=drive_link",
  "130": "https://drive.google.com/drive/folders/1cXyvoo_emtrDX5-Ec4aEH8nMBa3sd6R6?usp=drive_link",
  "131": "https://drive.google.com/drive/folders/1_UOskllpnPlbKydZPfrIFpOm71USYbXv?usp=drive_link",
  "132": "https://drive.google.com/drive/folders/12OZ9AdjnLa7mYQTrXF9-PAZTKvU0AlCU?usp=drive_link",
  "202": "https://drive.google.com/drive/folders/1GyynWxf78yne8cgWXURt4-Y5ZJk_f2EJ?usp=drive_link",
  "203": "https://drive.google.com/drive/folders/1VIz0oF21T_5oyon_1mroAUqaT-7neF2X?usp=drive_link",
  "204": "https://drive.google.com/drive/folders/1t60gw6oTE49mSCWO33I8ETDK7cLM8ZRM?usp=drive_link",
  "205": "https://drive.google.com/drive/folders/1jvKIM57OtmiTOA1gXkfln7ua8-WJYKk4?usp=drive_link",
  "207": "https://drive.google.com/drive/folders/1Fe6lBk7urr_zjufDYUsO1y7ZQ2u5SrYn?usp=drive_link",
  "208": "https://drive.google.com/drive/folders/1v5ManP8rdAldvlQJtMmZc90IS6kzjKtT?usp=drive_link",
  "209": "https://drive.google.com/drive/folders/17ER0KEZLsQ_WP8OgdhLvZr0H0-BGp3Fa?usp=drive_link",
  "210": "https://drive.google.com/drive/folders/1IpH0yIxwric9iDo635bG_zeJJr7fQrN6?usp=drive_link",
  "211": "https://drive.google.com/drive/folders/15oz5jPkUwQ74WjXgXXphFrnU_5jSFWyC?usp=drive_link",
  "212": "https://drive.google.com/drive/folders/1KugyQjBCO-aNHxWzhKOOd5QE16gSQWRC?usp=drive_link",
  "213": "https://drive.google.com/drive/folders/1UlUDE8hSBeR3wIEUv3WvOlnQX962YY-y?usp=drive_link",
  "214": "https://drive.google.com/drive/folders/1UkvP9UUF7Hg1_MJjHOg06_cbLoqH0wgm?usp=drive_link",
  "215": "https://drive.google.com/drive/folders/1cBqRPwB-OPe7PYsGwMr6WKgWeA5gQ5Ct?usp=drive_link",
  "216": "https://drive.google.com/drive/folders/1B_h3KLFi2MXkiMT4vvRG7xgY_YZ82hbE?usp=drive_link",
  "217": "https://drive.google.com/drive/folders/1Ud-6GKHEZS-LjNZ21N1wURBtStQ6jayY?usp=drive_link",
  "218": "https://drive.google.com/drive/folders/1HLAkw7RXvx9jWeGXX1ln1GQGOylz1wrE?usp=drive_link",
  "219": "https://drive.google.com/drive/folders/1Ferw0265_7F4mJ8aEQDxFKu79nJVwNRt?usp=drive_link"
};


const opcoesSala = [
  "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
  "111", "112", "113", "114", "115", "116", "117", "118", "119", "120",
  "121", "122", "123", "124", "125", "126", "127", "128", "129", "130",
  "131", "132", "202", "203", "204", "205", "207", "208", "209", "210",
  "211", "212", "213", "214", "215", "216", "217", "218", "219"
];

export default function Impressoes() {
  const [instrutores, setInstrutores] = useState([]);
  const [form, setForm] = useState({
    id: null,
    sala: "",
    instrutor: "",
    podeImprimir: null,
    faltou: null,
    observacoes: "",
    entregue: false
  });

  const [registros, setRegistros] = useState([]);
  const funcaoUsuario = localStorage.getItem("funcao"); // ✅ agora está definido corretamente

  useEffect(() => {
    fetch("https://backend-suplencia.onrender.com/instrutores")
      .then(res => res.json())
      .then(lista => setInstrutores(lista.map(i => i.instrutor)))
      .catch(err => console.error("Erro ao buscar instrutores:", err));
  }, []);

  useEffect(() => {
    const carregar = () => {
      fetch("https://backend-suplencia.onrender.com/impressoes")
        .then(res => res.json())
        .then(data => setRegistros(data))
        .catch(err => console.error("Erro ao carregar registros:", err));
    };
    carregar();
    const intervalo = setInterval(carregar, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const atualizarCampo = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const resetarFormulario = () => {
    setForm({
      id: null,
      sala: "",
      instrutor: "",
      podeImprimir: null,
      faltou: null,
      observacoes: "",
      entregue: false
    });
  };

  const atualizarLista = () => {
    fetch("https://backend-suplencia.onrender.com/impressoes")
      .then(res => res.json())
      .then(data => setRegistros(data));
  };

  const salvar = async () => {
    const salaValida = opcoesSala.includes(form.sala);
    const instrutorValido = instrutores.includes(form.instrutor);

    if (!salaValida || !instrutorValido) {
      alert("Preencha os campos obrigatórios (sala, instrutor e pode imprimir).");
      return;
    }

    const novoRegistro = {
      sala: form.sala,
      instrutor: form.instrutor,
      pode_imprimir: form.podeImprimir,
      faltou: form.faltou,
      observacoes: form.observacoes
    };

    try {
      const res = await fetch("https://backend-suplencia.onrender.com/impressao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoRegistro),
      });

      if (res.ok) {
        atualizarLista();
        resetarFormulario();
      } else {
        const erro = await res.json();
        alert("Erro ao salvar: " + erro.detail);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const marcarEntregue = async () => {
    if (!form.id) return;

    try {
      const res = await fetch(`https://backend-suplencia.onrender.com/impressao/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sala: form.sala,
          instrutor: form.instrutor,
          pode_imprimir: form.podeImprimir,
          faltou: form.faltou,
          observacoes: form.observacoes,
          entregue: true
        }),
      });

      if (res.ok) {
        atualizarLista();
        resetarFormulario();
      } else {
        const erro = await res.json();
        alert("Erro ao marcar como entregue: " + erro.detail);
      }
    } catch (err) {
      console.error("Erro ao marcar entregue:", err);
    }
  };

  const atualizar = async () => {
  if (form.faltou === true) {
    alert("⚠️ Certifique-se de apagar todos os nomes e deixar só os que faltaram.");
  }

  try {
    const atualizacao = {
      sala: form.sala,
      instrutor: form.instrutor,
      pode_imprimir: form.podeImprimir,
      faltou: form.faltou,
      observacoes: form.observacoes
    };

    const res = await fetch(`https://backend-suplencia.onrender.com/impressao/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(atualizacao),
    });

    if (res.ok) {
      atualizarLista();
      resetarFormulario();
    } else {
      const erro = await res.json();
      alert("Erro ao atualizar: " + erro.detail);
    }
  } catch (err) {
    console.error("Erro ao atualizar:", err);
  }
};

  const apagar = async () => {
    if (!form.id) return;

    const confirmar = window.confirm("Tem certeza que deseja apagar este registro?");
    if (!confirmar) return;

    try {
      const res = await fetch(`https://backend-suplencia.onrender.com/impressao/${form.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        atualizarLista();
        resetarFormulario();
      } else {
        const erro = await res.json();
        alert("Erro ao apagar: " + erro.detail);
      }
    } catch (err) {
      console.error("Erro ao apagar:", err);
    }
  };

  const apagarTudo = async () => {
    const confirmar = window.confirm("⚠️ Tem certeza que deseja apagar TODOS os registros?");
    if (!confirmar) return;

    try {
      const res = await fetch("https://backend-suplencia.onrender.com/impressao/tudo", {
  method: "DELETE"
});

      if (res.ok) {
        atualizarLista();
        alert("✅ Todos os registros foram apagados.");
      } else {
        const erro = await res.json();
        alert("Erro ao apagar tudo: " + erro.detail);
      }
    } catch (err) {
      console.error("Erro ao apagar tudo:", err);
    }
  };

  return (
    <div className="formulario-impressoes">

<EncarregadoImpressao funcao={funcaoUsuario} atualizarLista={atualizarLista} />

      {funcaoUsuario === "admin" && (
        <button
          onClick={apagarTudo}
          style={{
            marginTop: "10px",
            backgroundColor: "#000",
            color: "white",
            border: "none",
            padding: "12px",
            width: "100%",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Apagar TUDO
        </button>
      )}

      <h2>📋 Lista de Impressões</h2>

      {registros.length === 0 ? (
        <p>Nenhum registro ainda.</p>
      ) : (
        <table className="tabela-impressoes">
          <thead>
            <tr>
              <th>Sala</th>
              <th>Instrutor(a)</th>
              <th>Pode Imprimir?</th>
              <th>Faltaram?</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(registros) ? (
    registros.map((r, i) => (
      <tr
        key={i}
        onClick={() => setForm({
          id: r.id,
          sala: r.sala,
          instrutor: r.instrutor,
          podeImprimir: r.pode_imprimir,
          faltou: r.faltou,
          observacoes: r.observacoes || "",
          entregue: r.entregue || false
        })}
        className={r.entregue ? "linha-entregue" : r.faltou ? "linha-faltou" : ""}
        style={{ cursor: "pointer" }}
      >
        <td>
          {linksSalas[r.sala] ? (
            <a href={linksSalas[r.sala]} target="_blank" rel="noopener noreferrer">
              {r.sala}
            </a>
          ) : r.sala}
        </td>
        <td>{r.instrutor}</td>
        <td>{r.pode_imprimir ? "Sim" : "Não"}</td>
        <td>{r.faltou ? "Sim" : "Não"}</td>
        <td>{r.observacoes}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ color: "red" }}>
        ❌ Erro: dados de registros inválidos
      </td>
    </tr>
  )}
</tbody>

        </table>
      )}

      <hr style={{ margin: "30px 0" }} />

      {form.id && (
        <button
          onClick={marcarEntregue}
          style={{
            marginTop: "10px",
            backgroundColor: "#43a047",
            color: "white",
            border: "none",
            padding: "12px",
            width: "100%",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          ✅ Marcar como Entregue
        </button>
      )}

      <h2>{form.id ? "✏️ Editar Impressão" : "📝 Solicitar Impressão"}</h2>

      {/* CAMPOS DO FORMULÁRIO */}
      <label>
        Sala:
        <input
          list="salas"
          value={form.sala}
          onChange={(e) => atualizarCampo("sala", e.target.value)}
          placeholder="Digite ou selecione..."
        />
        <datalist id="salas">
          {opcoesSala.map((sala, i) => (
            <option key={i} value={sala} />
          ))}
        </datalist>
      </label>

      <label>
        Instrutor(a):
        <input
          list="instrutores"
          value={form.instrutor}
          onChange={(e) => atualizarCampo("instrutor", e.target.value)}
          placeholder="Digite ou selecione..."
        />
        <datalist id="instrutores">
          {instrutores.map((nome, i) => (
            <option key={i} value={nome} />
          ))}
        </datalist>
      </label>

      <label>
        Pode Imprimir?
        <div>
          <label>
            <input
              type="radio"
              name="podeImprimir"
              checked={form.podeImprimir === true}
              onChange={() => atualizarCampo("podeImprimir", true)}
            /> 
          </label>
         
        </div>
      </label>

      <label>
        Faltaram?
        <div>
          <label>
            <input
              type="radio"
              name="faltou"
              checked={form.faltou === true}
              onChange={() => atualizarCampo("faltou", true)}
            /> 
          </label>
           
        </div>
      </label>

      <label>
        Observações:
        <textarea
          rows="1"
          value={form.observacoes}
          onChange={e => atualizarCampo("observacoes", e.target.value)}
          placeholder="Digite aqui..."
        />
      </label>

      <button onClick={form.id ? atualizar : salvar}>
        {form.id ? "Atualizar" : "Salvar"}
      </button>

      {form.id && (
        <>
          <button onClick={resetarFormulario} style={{ marginTop: "10px", backgroundColor: "#ccc", color: "#333" }}>
            Cancelar Edição
          </button>
          <button
            onClick={apagar}
            style={{
              marginTop: "10px",
              backgroundColor: "#e53935",
              color: "white",
              border: "none",
              padding: "12px",
              width: "100%",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Apagar Registro
          </button>
        </>
      )}
    </div>
  );
}
