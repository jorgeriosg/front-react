import React, { Component } from "react";
import PropTypes from "prop-types";
import Star from "./Star";
import { useState } from "react";
import "./FormValoracion.scss";


class FormularioValoracion extends Component {
  state = {
    respuesta: null,
    starsSelected: 0,
    mensajeAdicional: "",
    otro:0,
    color:0,
  };

  
  enviarValoracion =  async(e) => {
    e.preventDefault();
    if (
      this.state.mensajeAdicional === ""
    ) {
      return false;
    }

    const { generalStates, sendValoracion } = this.props;
    const general = generalStates.toJS();

    let resolvio = null;
    if (this.state.starsSelected == 1 || this.state.starsSelected == 2 || this.state.starsSelected == 3 ) {
      resolvio = "si"
    } else {
      resolvio = "no"
    }

    const data = {
      input: "in",
      origen: "Sitio Público",
      output: "out",
      cid: general.cid,
      intent: "atención general",
      id_nodo: "",
      id_data_canal: 123,
      id_canal: 1,
      pudo_resolver: resolvio,
      valor: this.state.starsSelected,
      comentario: this.state.mensajeAdicional,
      auth: "",
    };
    // sendLike(data, general);
    console.log(data.comentario)
    await sendValoracion(data, general);
  };


  render() {
    return (
      <div className="conversationBubbleForm Send">
        {/* <img className={mainCss.RoundedImg} src={} alt="" /> */}

        <div className="containerForm">
        {/* <div className="mymodal"> */}
          <form autoComplete="off" onSubmit={this.enviarValoracion}>
            <div className="headerForm">
              <i class="fas fa-check fa-3x check" />
              <h4>
                Evalúame y comenta por qué, me ayudarás a seguir mejorando
              </h4>
            </div>
           
            <fieldset>
              <div className="star-rating">
                <i
                  className={`${
                    this.state.starsSelected == 0 ||
                    this.state.starsSelected == 2 ||
                    this.state.starsSelected == 3 ||
                    this.state.starsSelected == 4 ||
                    this.state.starsSelected == 5
                      ? "em em-angry emoticons"
                      : "em em-angry expand-emoji"
                  }`}
                  aria-role="presentation"
                  onClick={(e) => this.setState({ starsSelected: (e = 1) , otro:0})}
                />
                <i
                   className={`${
                    this.state.starsSelected == 0 ||
                    this.state.starsSelected == 1 ||
                    this.state.starsSelected == 3 ||
                    this.state.starsSelected == 4 ||
                    this.state.starsSelected == 5
                      ? "em em-confused emoticons"
                      : "em em-confused expand-emoji"
                  }`}
                  aria-role="presentation"
                  onClick={(e) => this.setState({ starsSelected: (e = 2) , otro:0})}
                />
                <i
                   className={`${
                    this.state.starsSelected == 0 ||
                    this.state.starsSelected == 1 ||
                    this.state.starsSelected == 2 ||
                    this.state.starsSelected == 4 ||
                    this.state.starsSelected == 5
                      ? "em em-neutral_face emoticons"
                      : "em em-neutral_face expand-emoji"
                  }`}
                  aria-role="presentation"
                  onClick={(e) => this.setState({ starsSelected: (e = 3) , otro:0})}
                />
                <i
                   className={`${
                    this.state.starsSelected == 0 ||
                    this.state.starsSelected == 1 ||
                    this.state.starsSelected == 2 ||
                    this.state.starsSelected == 3 ||
                    this.state.starsSelected == 5
                      ? "em em-slightly_smiling_face  emoticons"
                      : "em em-slightly_smiling_face  expand-emoji"
                  }`}
                  aria-role="presentation"
                  onClick={(e) => this.setState({ starsSelected: (e = 4), otro:0 })}
                />
                <i
                 className={`${
                  this.state.starsSelected == 0 ||
                  this.state.starsSelected == 1 ||
                  this.state.starsSelected == 2 ||
                  this.state.starsSelected == 3 ||
                  this.state.starsSelected == 4
                    ? "em em-smiley  emoticons"
                    : "em em-smiley  expand-emoji"
                }`}
                  aria-role="presentation"
                  onClick={(e) => this.setState({ starsSelected: (e = 5) , otro:0})}
                />
              </div>
            </fieldset>

            <fieldset>
              <button type="submit">Evaluar</button>
            </fieldset>

            <fieldset
              className={`${this.state.starsSelected == 1 ? "expand" : "none"}`}
            >
              <h3>¿NOS PUEDES CONTAR POR QUE?</h3>
              <div>
                {this.state.starsSelected === 1}
                <p className={`${this.state.color == 1  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "No entiende "),color:1})}> No entiende </p>
                <p className={`${this.state.color == 2  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Sin respuesta"),color:2})}> Sin respuesta</p>
                <p className={`${this.state.color == 3  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "No resuelve las consultas"),color:3})}> No resuelve las consultas</p>
                <p className={`${this.state.color == 4  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Surgio error"),color:4})}> Surgio error</p>
                <p className={`${this.state.color == 5  ? "active" : ""}`}  onClick={(e) => this.setState({ otro: (e = 6) , starsSelected:0,color:5})}> Otro </p>

              </div>
            </fieldset>

            <fieldset
              className={`${this.state.starsSelected == 2 ? "expand" : "none"}`}
            >
              <h3>¿NOS PUEDES CONTAR POR QUE?</h3>
              {this.state.starsSelected === 2}
              <div>
                <p className={`${this.state.color == 6 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Respuestas más claras"),color:6})}> Respuestas más claras</p> 
                <p className={`${this.state.color == 7 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Falta informació"),color:7})}> Falta informació</p> 
                <p className={`${this.state.color == 8  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "No resuelve las consultas"),color:8})}> No resuelve las consultas</p>
                <p className={`${this.state.color == 9  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "No es personalizado"),color:9})}> No es personalizado</p>
                <p className={`${this.state.color == 10  ? "active" : ""}`} onClick={(e) => this.setState({ otro: (e = 6) , starsSelected:0,color:10})}> Otro </p>

              </div>
            </fieldset>

            <fieldset
              className={`${this.state.starsSelected == 3 ? "expand" : "none"}`}
            >
              <h3>¿NOS PUEDES CONTAR POR QUE?</h3>
              {this.state.starsSelected === 3}
              <div>
                <p className={`${this.state.color == 11 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Respuestas más claras"),color:11})}> Respuestas más claras</p> 
                <p className={`${this.state.color == 12 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Soluciones más rápidas"),color:12})}> Soluciones más rápidas</p> 
                <p className={`${this.state.color == 13  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Respuestas más completas"),color:13})}> Respuestas más completas</p>
                <p className={`${this.state.color == 14  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Cumple, pero podrías mejora"),color:14})}> Cumple, pero podrías mejora</p>
                <p className={`${this.state.color == 15  ? "active" : ""}`} onClick={(e) => this.setState({ otro: (e = 6) , starsSelected:0,color:15})}> Otro </p>
              </div>
            </fieldset>

            <fieldset
              className={`${this.state.starsSelected == 4 ? "expand" : "none"}`}
            >
              <h3>¿NOS PUEDES CONTAR POR QUE?</h3>
              {/* {this.state.starsSelected === 4} */}
              <div>
              <p className={`${this.state.color == 16 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Respuesta útil"),color:16})}> Respuesta útil</p> 
              <p className={`${this.state.color == 17  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "pero podrías mejorar"),color:17})}> pero podrías mejorar</p> 
              <p className={`${this.state.color == 18 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Consulta resuelta"),color:22})}> Consulta resuelta</p> 
              <p className={`${this.state.color == 19  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Quedé conforme"),color:18})}> Quedé conforme</p>
              <p className={`${this.state.color == 20  ? "active" : ""}`} onClick={(e) => this.setState({ otro: (e = 6) , starsSelected:0,color:20})}> Otro </p>
              </div>
            </fieldset>

            <fieldset
              className={`${this.state.starsSelected == 5  ? "expand" : "none"}`}
            >
              <h3>¿NOS PUEDES CONTAR POR QUE?</h3>
              {this.state.starsSelected === 5}
              <div>
                <p className={`${this.state.color == 21 ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Respuesta útil"),color:21})}> Respuesta útil</p> 
                <p className={`${this.state.color == 22  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "pero podrías mejorar"),color:22})}> pero podrías mejorar</p> 
                <p className={`${this.state.color == 23  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Respondió lo que pregunte"),color:23})}> Respondió lo que pregunte </p> 
                <p className={`${this.state.color == 24  ? "active" : ""}`}  onClick={(e) => this.setState({ mensajeAdicional:(e = "Excelente"),color:24})}> Excelente </p>
                <p className={`${this.state.color == 25  ? "active" : ""}`}  onClick={(e) => this.setState({ otro: (e = 6) , starsSelected:0,color:25})}> Otro </p>
              </div>
            </fieldset>


        <fieldset className={`${this.state.otro == 6 ? "expand" : "none"}`}>
            <legend style={{fontWeight: 200, marginBottom: '0.8rem'}}>
            AÚN ESTOY EN PROCESO DE APRENDIZAJE. CUÉNTAME, ¿QUÉ PUEDO MEJORAR?
            </legend>
            <textarea name="mensajeAdicional" rows="2" onChange={ e => this.setState({ ...this.state, mensajeAdicional: e.target.value }) }></textarea>

        </fieldset>

          </form>
        </div>
      </div>
    );
  }
}

FormularioValoracion.propTypes = {
  generalStates: PropTypes.any.isRequired,
  sendValoracion: PropTypes.func.isRequired,
};

export default FormularioValoracion;
