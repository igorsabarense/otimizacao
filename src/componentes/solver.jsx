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


    getRentabilidades(perfil){
        
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
                    constraintTesouro: 0.30,
                    constraintCDB: 0.25 , 
                    constraintDebenture: 0.21,
                    constraintFII: 0.12,
                    constraintAcao: 0.10,
                    constraintCripto: 0.02 
                }
            break;

            case 'Moderado':
                modelo = {
                    constraintTesouro: 0.17,
                    constraintCDB: 0.18 , 
                    constraintDebenture: 0.16,
                    constraintFII: 0.24,
                    constraintAcao: 0.14,
                    constraintCripto: 0.11 
                }
            break;

            case 'Agressivo':
                modelo = {
                    constraintTesouro: 0.08,
                    constraintCDB: 0.10 , 
                    constraintDebenture: 0.12,
                    constraintFII: 0.25,
                    constraintAcao: 0.28,
                    constraintCripto: 0.17
                }
            break;
        }

        return modelo;
    }


    setSolverResults = () => {


            /*  
            *   MAX Lucro = 0.03TESOURO + 0.04CDB + 0.06DEB+ 0.08FII + 0.12ACOES + 0.16CRIPTO
            *   Sujeito a: 
            *           TESOURO + CDB + DEBENTURES <= rendaFixa * CAPITAL  
                        FII + ACOES + CRIPTO <= rendaVariavel * CAPITAL 
                        TESOURO + CDB + DB +FII + ACOES+ CRIPTO <= CAPITAL 
                        TESOURO <= 0.20 * capital                                           CONSTRAINTS MUDAM DE ACORDO COM O PERFIL
                        CDB <= 0.19 * capital
                        DEBENTURES <= 0.18 * capital
                        FII <= 0.16 * capital
                        ACOES <= 0.15 * capital
                        CRIPTO <= 0.12 * capital

            */

        const {idade, capital, perfil} = this.state.modelo;
        const rendaFixa = idade / 100;
        const rendaVariavel = (100 - idade) / 100;
        

        let modeloPerfil = this.getRentabilidades(perfil)

        // constraints
        const rendaFixaCapital = rendaFixa * capital;
        const rendaVariavelCapital = rendaVariavel * capital;
        const consTesouro = modeloPerfil.constraintTesouro * capital;
        const consCDB = modeloPerfil.constraintCDB * capital;
        const consDebenture = modeloPerfil.constraintDebenture * capital;
        const consFII = modeloPerfil.constraintFII * capital;
        const consAcoes = modeloPerfil.constraintAcoes * capital;
        const consCripto = modeloPerfil.constraintCripto * capital;

        var solver = require("./../../../node_modules/javascript-lp-solver/src/solver"),
            results,
            model = {
                "optimize": "rentabilidade",
                "opType": "max",
                "constraints": {
                    "capitalMaximo": {
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
        console.log(`result`, results)
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
