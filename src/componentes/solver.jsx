import React, {Component} from 'react'
import NumberFormat from 'react-number-format';


const SimpleSimplex = require('simple-simplex');class Solver extends Component {

constructor(props) {
    super(props);
    this.state = {
        showResults: false,
        modelo: {
            idade: '',
            capital: '',
            perfil: 'Conservador'
        },

        solver: {
            solution: {
                coefficients: {},
                optimum: undefined
            },
            isOptimal: undefined
        }

    }

}


handleChangeIdade = (event) => (this.setState({
    modelo: {
        ...this.state.modelo,
        'idade': event.target.value <= 100 && event.target.value >= 0 ? event.target.value : Math.floor(Math.random() * (100 - 0 + 1)) + 0
    }
}))

handleChangeCapital = (currency) => (this.setState({
    modelo: {
        ...this.state.modelo,
        'capital': currency.value
    }
}))


handleChangePerfilInvestidor = (event) => (this.setState({
    modelo: {
        ...this.state.modelo,
        'perfil': event.target.value
    }
}))

// getRandomPerfil() {
//     const min = 0;
//     const max = 11;
//     let random = 0;
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     random =  Math.floor(Math.random() * (max - min + 1)) + min;

//     if(random <= 3){
//         return 'CONSERVADOR'
//     }else if(random >= 4 && random <= 7){
//         return 'MODERADO'
//     }else if(random >=8 && random <= 11){
//         return 'AGRESSIVO'
//     }
// }

// getPesos (generateRandomPerfil , perfil){
//     peso = 0;

//     if(generateRandomPerfil == 'CONSERVADOR' && perfil == 'MODERADO'){
//         peso = 0.20;
//     }

//     if(generateRandomPerfil == 'CONSERVADOR' && perfil == 'AGRESSIVO'){
//         peso = 0.40;
//     }

//     if(generateRandomPerfil == 'MODERADO' && perfil == 'AGRESSIVO'){
//         peso = 0.30
//     }

//     if(generateRandomPerfil == 'MODERADO' && perfil == 'CONSERVADOR'){
//         peso = 0.50
//     }

//     if(generateRandomPerfil == 'AGRESSIVO' && perfil == 'CONSERVADOR'){
//         peso = 0.60
//     }

//     return peso;
// }


getPerfilInvestidor = () => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    const {idade, capital, perfil} = this.state.modelo;
    console.log(`idade: ${idade}`)
    const rendaFixa = idade / 100;
    const rendaVariavel = (100 - idade) / 100;

    // const generateRandomPerfil =  getRandomPerfil(0, 11);
    // const rentabilidade = perfil == 'CONSERVADOR' ? 0.02 : perfil == 'MODERADO' ? 0.03 : 0.05;
    // const peso = getPesos(generateRandomPerfil, perfil);

    /*
*   MAX Lucro = 0.03TESOURO + 0.04CDB + 0.06DEBENTURES + 0.08FII + 0.12ACOES+ 0.16CRIPTO
*   Sujeito a: 
*           TESOURO + CDB + DEBENTURES <= rendaFixa * CAPITAL  240.000
            FII + ACOES + CRIPTO <= rendaVariavel * CAPITAL 760.000
            TESOURO + CDB +DB +FII + ACOES+ CRIPTO <= CAPITAL 1.000.000

             TESOURO <= 250000
             CDB <= 300.000
             DEBENTURES <= 700.000
             FII <= 850.000
             ACOES <= 1.200.000
             CRIPTO <= 1.500.000

*/

    console.log(formatter.format(rendaFixa * capital), `renda fixa * capital`)
    console.log(formatter.format(rendaVariavel * capital), `renda variavel * capital`)
    console.log(formatter.format(capital), `capital`)


    return new SimpleSimplex({
        objective: {
            tesouro: 0.03,
            cdb: 0.04,
            debenture: 0.06,
            fii: 0.08,
            acoes: 0.12,
            cripto: 0.16
        },
        constraints: [
            {
                namedVector: {
                    tesouro: 1,
                    cdb: 1,
                    debenture: 1,
                    fii: 0,
                    acoes: 0,
                    cripto: 0

                },
                constraint: '<=',
                constant: rendaFixa * capital
            },
            {
                namedVector: {
                    tesouro: 0,
                    cdb: 0,
                    debenture: 0,
                    fii: 1,
                    acoes: 1,
                    cripto: 1
                },
                constraint: '<=',
                constant: rendaVariavel * capital
            },
            {
                namedVector: {
                    tesouro: 1,
                    cdb: 1,
                    debenture: 1,
                    fii: 1,
                    acoes: 1,
                    cripto: 1
                },
                constraint: '<=',
                constant: capital
            },
            {
                namedVector: {
                    tesouro: 1,
                    cdb: 1,
                    debenture: 1,
                    fii: 1,
                    acoes: 1,
                    cripto: 1
                },
                constraint: '>=',
                constant: 0
            }, {
                namedVector: {
                    tesouro: 1,
                    cdb: 0,
                    debenture: 0,
                    fii: 0,
                    acoes: 0,
                    cripto: 0
                },
                constraint: '<=',
                constant: 250000
            }, {
                namedVector: {
                    tesouro: 0,
                    cdb: 1,
                    debenture: 0,
                    fii: 0,
                    acoes: 0,
                    cripto: 0
                },
                constraint: '<=',
                constant: 300000
            }, {
                namedVector: {
                    tesouro: 0,
                    cdb: 0,
                    debenture: 1,
                    fii: 0,
                    acoes: 0,
                    cripto: 0
                },
                constraint: '<=',
                constant: 700000
            }, {
                namedVector: {
                    tesouro: 0,
                    cdb: 0,
                    debenture: 0,
                    fii: 1,
                    acoes: 0,
                    cripto: 0
                },
                constraint: '<=',
                constant: 850000
            }, {
                namedVector: {
                    tesouro: 0,
                    cdb: 0,
                    debenture: 0,
                    fii: 0,
                    acoes: 1,
                    cripto: 0
                },
                constraint: '<=',
                constant: 1200000
            }, {
                namedVector: {
                    tesouro: 0,
                    cdb: 0,
                    debenture: 0,
                    fii: 0,
                    acoes: 0,
                    cripto: 1
                },
                constraint: '<=',
                constant: 1500000
            },

        ],
        optimizationType: 'max'
    });
}

callSolver() { // initialize a solver
    const solver = this.getPerfilInvestidor();

    // call the solve method with a method name
    const result = solver.solve({methodName: 'simplex'});

    // see the solution and meta data
    this.setState({ 
                    solver : {
                         solution: result.solution, 
                         isOptimal: result.details.isOptimal
                    }
    });
}


render() {
    const {capital, perfil} = this.state.modelo;
    const {solution} = this.state.solver;
    const {optimum} = solution;
    const {
        tesouro,
        cdb,
        debenture,
        fii,
        acoes,
        cripto
    } = solution.coefficients;

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',

        // These options are needed to round to whole numbers if that's what you want.
        // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

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
                        <option value="Conservador">
                            Conservador
                        </option>
                        <option value="Moderado">
                            Moderado
                        </option>
                        <option value="Agressivo">
                            Agressivo
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
                            this.state.modelo.idade
                        }/>
                </div>
                <br/>


                <div className="form-group ">
                    <label>Capital Inicial:
                    </label>

                    <NumberFormat 
                    placeholder={'R$0,00'}
                    className="form-control"
                    value={ this.state.modelo.capital }
                    fixedDecimalScale= {2}
                    thousandSeparator={true} 
                    prefix={'R$'} 
                    onValueChange={this.handleChangeCapital}/>

                </div>
                <br/>


            </form>
        }


            {
            this.state.showResults && (
                <div className=" col-sm-12 m-t-20">

                    <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Perfil</th>
                                    <th scope="col">Tesouro Direto</th>
                                    <th scope="col">CDB</th>
                                    <th scope="col">Debentures</th>
                                    <th scope="col">Fundos Imobiliarios</th>
                                    <th scope="col">Ações</th>
                                    <th scope="col">Cripto Moedas</th>
                                    <th scope="col">Capital</th>
                                    <th scope="col">Projecão de Retorno (a.a)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{perfil}</td>
                                    <td>{
                                        tesouro ? formatter.format(tesouro) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                        cdb ? formatter.format(cdb) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                        debenture ? formatter.format(debenture) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                        fii ? formatter.format(fii) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                        acoes ? formatter.format(acoes) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                        cripto ? formatter.format(cripto) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                        capital ? formatter.format(capital) : 'R$ 0,00'
                                    }</td>
                                    <td>{
                                       optimum ? formatter.format(optimum) : 'R$ 0,00'
                                    }</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            )
        }
            <br/>
            <button type="button" className="btn btn-outline-primary"
                onClick={
                    () => {
                        this.callSolver();
                        this.setState({
                            showResults: !this.state.showResults
                        })
                    }}>
                {
                this.state.showResults ? 'Voltar' : 'Calcular'
            } </button>
        </div>

    )
}}export default Solver;
