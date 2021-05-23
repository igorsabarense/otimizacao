import React, {Component} from 'react'

const SimpleSimplex = require('simple-simplex');

class Solver extends Component {

constructor(props) {
    super(props);
    this.state = {
        showResults: false,
        modelo: {
            idade: '',
            capital: '',
            perfil: ''
        }

    }

}


handleChangeIdade = (event) => (this.setState({
    modelo: {
        ...this.state.modelo,
        'idade': event.target.value
    }
}))

handleChangeCapital = (event) => (this.setState({
    modelo: {
        ...this.state.modelo,
        'capital': event.target.value
    }
}))

handleChangePerfilInvestidor = (event) => (
    this.setState({
    modelo: {
        ...this.state.modelo,
        'perfil': event.target.value
    }})
)


callSolver(){
    const solver = new SimpleSimplex({
        objective: {
            a: this.state.idade,
            b: this.state.capital,
            c: 0,
        },
        constraints: [
            {
                namedVector: {
                    a: 1,
                    b: 1,
                    c: 1
                },
                constraint: '>=',
                constant: 100
            }, {
                namedVector: {
                    a: 5,
                    b: 4,
                    c: 4
                },
                constraint: '<=',
                constant: 480
            }, {
                namedVector: {
                    a: 40,
                    b: 20,
                    c: 30
                },
                constraint: '<=',
                constant: 3200
            },
        ],
        optimizationType: 'max'
    });

    // initialize a solver
  

    // call the solve method with a method name
    const result = solver.solve({methodName: 'simplex'});

    // see the solution and meta data
    console.log({solution: result.solution, isOptimal: result.details.isOptimal});
}

render() {

  

    console.log(this.state)


    return (

        <div> {
            !this.state.showResults && <form className="col-sm-12">
                <div className="form-group">
                    Bem vindo Investidor!
                </div>
                <br/>

                <div className="form-group">
                    <label>Perfil:
                    </label>

                    <select className="form-control" id="perfil" name="perfil"
                        onChange={
                            this.handleChangePerfilInvestidor
                    }>
                        <option value = "0.25">
                            Conservador
                        </option>
                        <option value = "0.50">
                            Moderado
                        </option>
                        <option value = "0.75">
                            Agressivo
                        </option>
                        <option value = "1.0">
                            Elon Musk
                        </option>
                    </select>
                </div>
                <br/>

                <div className="form-group">
                    <label>Idade:
                    </label>
                    <span style={
                        {paddingLeft: 63}
                    }></span>
                    <input className="form-control" type='number'
                        min={0}
                        max={100}
                        name={'idade'}
                        id={'idade'}
                        placeholder={'0'}
                        onChange={
                            this.handleChangeIdade
                        }
                        value={
                            this.state.value
                        }/>
                </div>
                <br/>


                <div className="form-group ">
                    <label>Capital Inicial:
                    </label>

                    <input className="form-control" type='number'
                        name={'capital'}
                        id={'capital'}
                        placeholder={'0.00'}
                        onChange={
                            this.handleChangeCapital
                        }
                        value={
                            this.state.value
                        }/>

                </div>
                <br/>

             


               


            </form>
        }


            {
            this.state.showResults && (
                <div className=" col-sm-12 m-t-20">
                    <span><b>Resultados</b></span>
                    <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Renda Fixa</th>
                                    <th scope="col">Renda Variavel</th>
                                    <th scope="col">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            )
        }
            <br/>
            <button type="button" className="btn btn-primary"
                onClick={
                    () => this.setState({
                        showResults: !this.state.showResults
                    })
            }>
                {
                this.state.showResults ? 'Voltar' : 'Calcular'
            } </button>
        </div>

    )
}}export default Solver;
