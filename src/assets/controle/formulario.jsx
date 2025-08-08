import './formulario.css';

export default function Formulario({ dados, setDados, onSalvar, onCancelar }) {
  return (
    <div className="modal-edicao">
      <h3>✏️ Editar Instrutor</h3>

      <label>Nome:</label>
      <input
        type="text"
        value={dados.instrutor || ""}
        onChange={(e) => setDados({ ...dados, instrutor: e.target.value })}
      />

      <label>Link do Zoom:</label>
      <input
        type="text"
        value={dados.link_zoom || ""}
        onChange={(e) => setDados({ ...dados, link_zoom: e.target.value })}
      />

     <label>Função:</label>
<select
  value={dados.funcao || "instrutor"}
  onChange={(e) => setDados({ ...dados, funcao: e.target.value })}
>
  <option value="instrutor">Instrutor</option>
  <option value="admin">Admin</option>
</select>



      <div className="botoes-edicao">
        <button onClick={onSalvar}>💾 Salvar</button>
        <button onClick={onCancelar}>❌ Cancelar</button>
      </div>
    </div>
  );
}
