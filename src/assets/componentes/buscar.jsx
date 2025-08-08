import { useState } from "react";
import "./buscar.css";

export default function BuscarEscritura() {
  const [livro, setLivro] = useState("");
  const [capitulo, setCapitulo] = useState("");
  const [versiculo, setVersiculo] = useState("");
  const [idioma, setIdioma] = useState("por");
  const [frasesAtivas, setFrasesAtivas] = useState([]);

  const nomesLivros = [
    "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
    "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester", "Jó",
    "Salmos", "Provérbios", "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel",
    "Oseias", "Joel", "Amós", "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias",
    "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses",
    "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago",
    "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João", "Judas", "Apocalipse",
    "1 Néfi", "2 Néfi", "Jacó", "Enos", "Jarom", "Ômni", "Palavras de Mórmon", "Mosias", "Alma", "Helamã", "3 Néfi", "4 Néfi",
    "Mórmon", "Éter", "Morôni", "Doutrina e Convênios", "Moisés", "Abraão", "Joseph Smith História", "regras de Fé"
  ];

  const traducoes = {
    por: "Por favor, coloque a inicial do seu idioma nativo no início do seu nome missionário. Por exemplo: P Élder Silva.",
    eng: "Please place the initial of your native language at the beginning of your missionary name. For example: I Elder Johnson.",
    spa: "Por favor, coloque la inicial de su idioma nativo al comienzo de su nombre misionero. Por ejemplo: E Élder García.",
    fra: "Veuillez ajouter l’initiale de votre langue maternelle au début de votre nom missionnaire. Par exemple : F Elder Dubois.",
    ita: "Per favore, metti l'iniziale della tua lingua madre all'inizio del tuo nome missionario. Ad esempio: I Anziano Rossi.",
    jpn: "宣教師の名前の最初に母国語の頭文字をつけてください。例：J 長老 たなか。",
    kor: "선교사 이름 앞에 모국어 초자를 넣어주세요. 예: K 엘더 김"
  };

  const normalizar = texto =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, "e").replace(/\s+/g, " ").trim().toLowerCase();

  const livrosBOM = {
    "1 nefi": "1-ne", "2 nefi": "2-ne", "jaco": "jacob", "enos": "enos",
    "jarom": "jarom", "omni": "omni", "palavras de mormon": "w-of-m",
    "mosias": "mosiah", "alma": "alma", "helama": "hel", "3 nefi": "3-ne",
    "4 nefi": "4-ne", "mormon": "morm", "eter": "ether", "moroni": "moro"
  };
  const livrosPGP = {
    "moises": "moses", "abraao": "abr", "js-h": "js-h",
    "joseph smith historia": "js-h", "regras de fe": "a-of-f", "artigos": "a-of-f"
  };
  const livrosNT = {
    "mateus": "matt", "marcos": "mark", "lucas": "luke", "joao": "john", "atos": "acts", "romanos": "rom",
    "1 corintios": "1-cor", "2 corintios": "2-cor", "galatas": "gal", "efesios": "eph", "filipenses": "philip",
    "colossenses": "col", "1 tessalonicenses": "1-thes", "2 tessalonicenses": "2-thes",
    "1 timoteo": "1-tim", "2 timoteo": "2-tim", "tito": "titus", "filemom": "philem", "hebreus": "heb", "tiago": "james",
    "1 pedro": "1-pet", "2 pedro": "2-pet", "1 joao": "1-jn", "2 joao": "2-jn", "3 joao": "3-jn", "judas": "jude", "apocalipse": "rev"
  };
  const livrosOT = {
    "genesis": "gen", "exodo": "ex", "levitico": "lev", "numeros": "num", "deuteronomio": "deut", "josue": "josh",
    "juizes": "judg", "rute": "ruth", "1 samuel": "1-sam", "2 samuel": "2-sam", "1 reis": "1-kgs", "2 reis": "2-kgs",
    "1 cronicas": "1-chr", "2 cronicas": "2-chr", "esdras": "ezra", "neemias": "neh", "ester": "esth", "jo": "job",
    "salmos": "ps", "proverbios": "prov", "eclesiastes": "eccl", "canticos": "song", "isaias": "isa", "jeremias": "jer",
    "lamentacoes": "lam", "ezequiel": "ezek", "daniel": "dan", "oseias": "hosea", "joel": "joel", "amos": "amos",
    "obadias": "obad", "jonas": "jonah", "miqueias": "micah", "naum": "nahum", "habacuque": "hab", "sofonias": "zeph",
    "ageu": "hag", "zacarias": "zech", "malaquias": "mal"
  };

  const redirecionarParaEscritura = () => {
    const livroN = normalizar(livro);
    const base = "https://www.churchofjesuschrist.org/study/scriptures/";
    const idiomaURL = idioma;

    let url = "";

    if (livrosBOM[livroN]) {
      url = `${base}bofm/${livrosBOM[livroN]}/${capitulo}?lang=${idioma}${versiculo ? "#p" + versiculo : ""}`;
    } else if (["d e c", "d c", "doutrina e convenios", "doutrina", "dyc"].includes(livroN)) {
      if (!capitulo) return alert("Informe a seção de Doutrina e Convênios.");
      url = `${base}dc-testament/dc/${capitulo}?lang=${idioma}${versiculo ? "&id=p" + versiculo + "#p" + versiculo : ""}`;
    } else if (livrosPGP[livroN]) {
      url = `${base}pgp/${livrosPGP[livroN]}/${capitulo}?lang=${idioma}${versiculo ? "#p" + versiculo : ""}`;
    } else if (livrosNT[livroN]) {
      url = `${base}nt/${livrosNT[livroN]}/${capitulo}?lang=${idioma}${versiculo ? "#p" + versiculo : ""}`;
    } else if (livrosOT[livroN]) {
      url = `${base}ot/${livrosOT[livroN]}/${capitulo}?lang=${idioma}${versiculo ? "#p" + versiculo : ""}`;
    } else {
      return alert("Livro não reconhecido.");
    }

    window.open(url, "_blank");
  };

  const copiarFrases = () => {
    const texto = frasesAtivas.map(id => traducoes[id]).join("\n");
    if (!texto.trim()) return alert("Não há nada para copiar ainda!");
    navigator.clipboard.writeText(texto).then(() => {
      alert("Texto copiado!");
    });
  };

  const alternarFrase = (codigo) => {
    setFrasesAtivas(prev =>
      prev.includes(codigo) ? prev.filter(i => i !== codigo) : [...prev, codigo]
    );
  };

  return (
    <div id="tudo">
      <div id="buscarEscritura-container">
        <h1>Buscar Escritura SUD</h1>
        <label>Nome do livro:</label>
        <input list="livros" value={livro} onChange={e => setLivro(e.target.value)} placeholder="Ex. 1 Néfi" />
        <datalist id="livros">
          {nomesLivros.map(nome => (
            <option key={nome} value={nome} />
          ))}
        </datalist>

        <label>Capítulo:</label>
        <input value={capitulo} onChange={e => setCapitulo(e.target.value)} placeholder="Ex. 12" />

        <label>Versículo:</label>
        <input value={versiculo} onChange={e => setVersiculo(e.target.value)} placeholder="Ex. 2" />

        <label>Idioma:</label>
        <select value={idioma} onChange={e => setIdioma(e.target.value)}>
          <option value="por">Português</option>
          <option value="eng">Inglês</option>
          <option value="spa">Espanhol</option>
          <option value="fra">Francês</option>
          <option value="jpn">Japonês</option>
          <option value="kor">Coreano</option>
        </select>

        <button onClick={redirecionarParaEscritura}>Ir para Escritura</button>
      </div>

      <div id="frase-container">
        <h2>Para organizador do zoom</h2>
        <div id="idiomas-botoes">
          <button onClick={copiarFrases}>📋 Copiar texto</button>
          {Object.keys(traducoes).map((cod) => (
            <button
              key={cod}
              className={frasesAtivas.includes(cod) ? "selected" : ""}
              onClick={() => alternarFrase(cod)}
            >
              {cod.toUpperCase()}
            </button>
          ))}
        </div>

        <div id="frases-traduzidas">
          {frasesAtivas.map((id) => (
            <p key={id}>{traducoes[id]}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
