import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Card from './componentes/layout/card.jsx';
import Solver from './componentes/solver';



function App() {
  return (
    <div className="App">
    
        <Card titulo="Otimização de Carteira">
            <Solver/>
        </Card>

    </div>
  );
}

export default App;
