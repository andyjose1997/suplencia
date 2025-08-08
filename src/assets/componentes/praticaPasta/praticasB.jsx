import PraticasBmanha from './praticasB-turnos/praticasB-manha';
import PraticasBtarde from './praticasB-turnos/praticasB-tarde';
import PraticasBnoite from './praticasB-turnos/praticasB-noite';
import './praticasB.css'

export default function PraticasBturno({ turno }) {
  return (
    <div className="tabela-turno-b">
      {turno === 'manha' && <PraticasBmanha />}
      {turno === 'tarde' && <PraticasBtarde />}
      {turno === 'noite' && <PraticasBnoite />}
    </div>
  );
}
