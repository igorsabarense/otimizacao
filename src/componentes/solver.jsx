import React, {Component} from 'react'
import NumberFormat from 'react-number-format';


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
            },

            solver: {
                results: {}
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


    getRentabilidades(perfil, rendaFixa, rendaVariavel){
        
        let modelo = {
            constraintTesouro: '',
            constraintCDB: '' , 
            constraintDebenture: '',
            constraintFII: '',
            constraintAcao: '',
            constraintCripto: '' 
        }


        
        switch(perfil){
            case 'Conservador':
                modelo = {
                    constraintTesouro: 0.80 * rendaFixa,
                    constraintCDB: 0.10  * rendaFixa, 
                    constraintDebenture: 0.10 * rendaFixa,
                    constraintFII: 0.80 * rendaVariavel,
                    constraintAcao: 0.19 * rendaVariavel,
                    constraintCripto: 0.01 * rendaVariavel 
                }
            break;

            case 'Moderado':
                modelo = {
                    constraintTesouro: 0.25 * rendaFixa,
                    constraintCDB: 0.25 * rendaFixa,
                    constraintDebenture: 0.50 * rendaFixa,
                    constraintFII: 0.55 * rendaVariavel,
                    constraintAcao: 0.45 * rendaVariavel,
                    constraintCripto: 0.10 * rendaVariavel
                }
            break;

            case 'Agressivo':
                modelo = {
                    constraintTesouro: 0.10 * rendaFixa,
                    constraintCDB: 0.30 * rendaFixa, 
                    constraintDebenture: 0.60 * rendaFixa,
                    constraintFII: 0.2 * rendaVariavel,
                    constraintAcao: 0.3 * rendaVariavel,
                    constraintCripto: 0.5 * rendaVariavel
                }
            break;
        }

        return modelo;
    }


    setSolverResults = () => {


        const {idade, capital, perfil} = this.state.modelo;
        const rendaFixa = idade / 100;
        const rendaVariavel = (100 - idade) / 100;
        

        let modeloPerfil = this.getRentabilidades(perfil,rendaFixa,rendaVariavel)

        // constraints
        const rendaFixaCapital = rendaFixa * capital;
        const rendaVariavelCapital = rendaVariavel * capital;


        const consTesouro = modeloPerfil.constraintTesouro * capital;
        const consCDB = modeloPerfil.constraintCDB * capital;
        const consDebenture = modeloPerfil.constraintDebenture * capital;
        const consFII = modeloPerfil.constraintFII * capital;
        const consAcoes = modeloPerfil.constraintAcao * capital;
        const consCripto = modeloPerfil.constraintCripto * capital;

        var solver = require("./../../../node_modules/javascript-lp-solver/src/solver"),
            results,
            model = {
                "optimize": "rentabilidade",
                "opType": "max",
                "constraints": {
                    "rendaVariavelMaximo": {
                        "max": capital
                    },
                    "capitalRendaFixa": {
                        "max": rendaFixaCapital
                    },
                    "capitalRendaVariavel": {
                        "max": rendaVariavelCapital
                    },
                    "consTesouro": {
                        "max": consTesouro
                    },
                    "consCDB": {
                        "max": consCDB
                    },
                    "consDebenture": {
                        "max": consDebenture
                    },
                    "consFII": {
                        "max": consFII
                    },
                    "consAcoes": {
                        "max": consAcoes
                    },
                    "consCripto": {
                        "max": consCripto
                    }


                },
                "variables": {
                    "tesouro": {
                        "rentabilidade": 0.03,
                        "capitalMaximo": 1,
                        "capitalRendaFixa": 1,
                        "consTesouro": 1
                    },
                    "cdb": {
                        "rentabilidade": 0.04,
                        "capitalMaximo": 1,
                        "capitalRendaFixa": 1,
                        "consCDB": 1
                    },
                    "debenture": {
                        "rentabilidade": 0.06,
                        "capitalMaximo": 1,
                        "capitalRendaFixa": 1,
                        "consDebenture": 1
                    },
                    "fii": {
                        "rentabilidade": 0.08,
                        "capitalMaximo": 1,
                        "capitalRendaVariavel": 1,
                        "consFII": 1

                    },
                    "acoes": {
                        "rentabilidade": 0.12,
                        "capitalMaximo": 1,
                        "capitalRendaVariavel": 1,
                        "consAcoes": 1

                    },
                    "cripto": {
                        "rentabilidade": 0.16,
                        "capitalMaximo": 1,
                        "capitalRendaVariavel": 1,
                        "consCripto": 1

                    }

                }
            };

        results = solver.Solve(model);
       
        this.setState({solver: {
                results
            }});
    }


    render() {

        console.log(this.state)
        const {capital, perfil} = this.state.modelo;
        const {results} = this.state.solver;
        const {
            tesouro,
            cdb,
            debenture,
            fii,
            acoes,
            cripto,
            result
        } = results;


        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',

            // These options are needed to round to whole numbers if that's what you want.
            // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });


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
                            <option value=""> </option>
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

                        <NumberFormat placeholder={'R$0,00'}
                            className="form-control"
                            value={
                                this.state.modelo.capital
                            }
                            fixedDecimalScale={2}
                            thousandSeparator={true}
                            prefix={'R$'}
                            onValueChange={
                                this.handleChangeCapital
                            }/>

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
                                        <th scope="col">Capital</th>
                                        <th scope="col">Tesouro Direto</th>
                                        <th scope="col">CDB</th>
                                        <th scope="col">Debentures</th>
                                        <th scope="col">Fundos Imobiliários</th>
                                        <th scope="col">Ações</th>
                                        <th scope="col">Cripto Moedas</th>
                                        <th scope="col">Projecão de Retorno (a.a)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr> {/* <td>{pr()}</td> */}
                                        <td>{perfil}</td>
                                        <td>{
                                            capital ? formatter.format(capital) : 'R$ 0,00'
                                        }</td>
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
                                            result ? formatter.format(result) : 'R$ 0,00'
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
                            this.setSolverResults();
                            this.setState({
                                showResults: !this.state.showResults
                            })
                        }
                }>
                    {
                    this.state.showResults ? 'Voltar' : 'Calcular'
                } </button>
            </div>

        )
    }
}
export default Solver;
