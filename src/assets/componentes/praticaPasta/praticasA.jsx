import PraticasAmanha from './praticasA-turnos/praticasA-manha';
import PraticasAtarde from './praticasA-turnos/praticasA-tarde';
import PraticasAnoite from './praticasA-turnos/praticasA-noite';

export default function PraticasAturno({ turno }) {
  return (
    <div className="tabela-turno">
      {turno === 'manha' && <PraticasAmanha />}
      {turno === 'tarde' && <PraticasAtarde />}
      {turno === 'noite' && <PraticasAnoite />}
    </div>
  );
}
