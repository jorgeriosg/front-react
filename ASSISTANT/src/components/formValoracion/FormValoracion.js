// import React, {useState} from "react";
// import {connect} from 'react-redux';

// // import {sendValoracion} from '../../actions/index';
// import Star from './Star';

// import './FormValoracion.scss';

// const FormValoracion = ({ generalStates, sendValoracion}) => {

//     const [respuesta, setRespuesta] = useState(null);
//     const [starsSelected, selectStar] = useState(0);
//     const [mensajeAdicional, setMensajeAdicional] = useState('');

//     const general = generalStates.toJS();


//     const style = {
//         boxStar: {
//             width: '100%',
//             display: 'flex',
//             alignItems:'flex-end',
//             justifyContent: 'flex-start',
//             marginBottom: '10px',
//         }
//     }

    
//     const handleOptionChange = (e) => {
//         // console.log(e.target.value);
//         if (e.target.value) {
//             setRespuesta(e.target.value);
//         } else {
//             setRespuesta(e.target.value)
//         }
//     };
    
//     const totalStars = 5;
//     const enviarValoracion = (e) =>{
//         // console.log('Llegué a enviarValoracion:: ');
//         e.preventDefault();
//         if(respuesta === null || starsSelected === 0 || mensajeAdicional === '') {
//             return false;
//         }

//         let resolvio = null;
//         if (respuesta === 'si') {
//             resolvio = 1;
//         } else {
//             resolvio = 0;
//         }
//         const data = {
//             input: "in",
//             output: "out",
//             cid: general.cid,
//             id_data_canal: 123,
//             id_canal: 1,
//             resolvio: resolvio,
//             valoracion: starsSelected,
//             comentario: mensajeAdicional,
//         }
//         // console.log('DATA VALORACIÓN:: ', data);
//         // sendLike(data, general);
//         debugger;
//         sendValoracion(data, general);
//     }




//   return (
//     <div className='conversationBubbleForm Send'>
//       {/* <img className={mainCss.RoundedImg} src={} alt="" /> */}

//       <div className='containerForm'>
      
//       <form autoComplete="off" onSubmit={enviarValoracion}>
        
//         <div className="headerForm">
//             <p>Gracias por utilizar nuestro chat. No dude en dejarnos cualquier comentario adicional.</p>
//         </div>
        
//         <fieldset className="radios">
//             <legend>¿Su caso o inquietud fueron resueltas?</legend>
//             <label>
//                 <div className="round">
//                     <div className={respuesta === 'si' ?  "active circle" : " circle"}></div>Sí
//                     <input type="radio" name="desicion" value='si' 
//                     checked={respuesta === 'si'} onChange={handleOptionChange} />
//                 </div>
//             </label>
//             <label>
//                 <div className="round">
//                     <div className={respuesta === 'no' ?  "active circle" : " circle"}></div>No
//                     <input type="radio" name="desicion" value='no' 
//                     checked={ respuesta === 'no' } onChange={handleOptionChange} />
//                 </div>
//             </label>
//         </fieldset>

//         <fieldset>
//             {/* <StarRating totalStars={5} /> */}

//             <div className="star-rating">
//                 <div  style={style.boxStar}>
//                     {[...Array(totalStars)].map((n, i) => (
//                         <Star key={i} selected={i < starsSelected} onClick={() => selectStar(i + 1)} />
//                     ))}
//                 </div>
        
//                 <div>
//                     { starsSelected === 0 && <p>Seleccione su valoración</p> }
//                     { starsSelected === 1 && <p>Muy insatisfecho <span role="img" aria-label="">😡</span></p> }
//                     { starsSelected === 2 && <p>No fue de mucha ayuda <span role="img" aria-label="">😞</span></p> }
//                     { starsSelected === 3 && <p>Me ayudó, pero necesita mejorar <span role="img" aria-label="">😐</span></p> }
//                     { starsSelected === 4 && <p>¡Buen servicio! <span role="img" aria-label="">🙂</span></p> }
//                     { starsSelected === 5 && <p>¡Excelente servicio! <span role="img" aria-label="">😃</span></p> }
//                 </div>
//             </div>
//         </fieldset>
    
//         <fieldset>
//             <legend style={{fontWeight: 100, marginBottom: '0.8rem'}}>
//                 ¡Gracias por la valoración! Nos ayuda a seguir mejorando. Puedes dejar un mensaje adicional en el espacio siguiente
//             </legend>
//             <textarea name="por-que" rows="2" onChange={(e) => setMensajeAdicional(e.target.value)}></textarea>
//         </fieldset>

//         <fieldset>
//             <button type="submit" >Valorar</button>
//         </fieldset>
//         </form>
//       </div>
//     </div>
//   );
// };

// // export default connect(null, {sendValoracion})(FormValoracion);
// export default FormValoracion;



import {sendValoracion} from '../../actions/index';
import React, { Component } from "react";
import PropTypes from "prop-types";
import "./FormValoracion.scss";
import {useState} from "react";
import {connect} from 'react-redux';


const totalStars = 5;


// class FormularioValoracion extends Component {
 
  const FormValoracion = ({ generalStates, sendValoracion}) => {
    const [respuesta, setRespuesta] = useState(null);
    const [starsSelected, selectStar] = useState(0);
    const [mensajeAdicional, setMensajeAdicional] = useState('');

    const general = generalStates.toJS();

      const handleOptionChange = (e) => {
        // console.log(e.target.value);
        if (e.target.value) {
            setRespuesta(e.target.value);
        } else {
            setRespuesta(e.target.value)
        }
    };
 
    const enviarValoracion = (e) =>{
        // console.log('Llegué a enviarValoracion:: ');
        e.preventDefault();
        if(respuesta === null || starsSelected === 0 || mensajeAdicional === '') {
            return false;
        }

        let resolvio = null;
        if (respuesta === 'si') {
            resolvio = 1;
        } else {
            resolvio = 0;
        }
        const data = {
            input: "in",
            output: "out",
            cid: general.cid,
            id_data_canal: 123,
            id_canal: 1,
            resolvio: resolvio,
            valoracion: starsSelected,
            comentario: mensajeAdicional,
        }
        // console.log('DATA VALORACIÓN:: ', data);
        // sendLike(data, general);
        debugger;
        sendValoracion(data, general);
    }

    return (
      <div className="conversationBubbleForm Send">
        {/* <img className={mainCss.RoundedImg} src={} alt="" /> */}

        <div className="containerForm">
          <form autoComplete="off" onSubmit={enviarValoracion}>
            <div className="headerForm">
              <i class="fas fa-check fa-3x check" />
              <h4>
                Evalúame y comenta por qué, me ayudarás a seguir mejorando
              </h4>
            </div>

            <fieldset className="radios">
              {/* <legend>Evaluame y comenta por que, me ayudarias a seguir mejorando</legend> */}
              {/* <label>
                <div className="round">
                  <div className={ this.state.respuesta === "si" ? "active circle" : " circle" }></div>
                  Sí
                  <input type="radio" name="desicion" value="si" checked={this.state.respuesta === "si"} onChange={this.handleOptionChange} />
                </div>
              </label>
              <label>
                <div className="round">
                  <div className={ this.state.respuesta === "no" ? "active circle" : " circle" }></div>
                  No
                  <input type="radio" name="desicion" value="no" checked={this.state.respuesta === "no"} onChange={this.handleOptionChange} />
                </div>
              </label> */}
            </fieldset>

            <fieldset>
              <div className="star-rating">
                <i
                  className="em em-angry emoticons"
                  aria-role="presentation"
                  onClick={(e) => selectStar({ starsSelected: (e = 1) })}
                />
                <i
                  className="em em-confused emoticons"
                  aria-role="presentation"
                  onClick={(e) => selectStar({ starsSelected: (e = 2) })}
                />
                <i
                  className="em em-neutral_face emoticons"
                  aria-role="presentation"
                  onClick={(e) => selectStar({ starsSelected: (e = 3) })}
                />
                <i
                  className="em em-slightly_smiling_face emoticons"
                  aria-role="presentation"
                  onClick={(e) => selectStar({ starsSelected: (e = 4) })}
                />
                <i
                  className="em em-smiley emoticons"
                  aria-role="presentation"
                  onClick={(e) => selectStar({ starsSelected: (e = 5) })}
                />
              </div>
            </fieldset>

            <fieldset>
              <button type="submit">Valorar</button>
            </fieldset>

            <fieldset
              className={`${(this.state.starsSelected == 1
                ? "expand"
                : "none")}`}
            >
              <h3>NOS PUEDES CONTAR POR QUE</h3>
              <div>
                {this.state.starsSelected === 1}
                <p> No entiende </p>
                <p> Sin respuesta </p>
                <p> No resuelve las consultas </p>
                <p> Surgio error</p>
                <p> Otro </p>
              </div>
            </fieldset>

            <fieldset
              className={`${(this.state.starsSelected == 2
                ? "expand"
                : "none")}`}
            >
               <h3>NOS PUEDES CONTAR POR QUE</h3>
              {this.state.starsSelected === 2}
              <div>
                <p>Respuestas más claras </p>
                <p> Falta información </p>
                <p> No resuelve las consultas </p>
                <p> No es personalizado </p>
                <p> Otro </p>
              </div>
            </fieldset>

            <fieldset
              className={`${(this.state.starsSelected == 3
                ? "expand"
                : "none")}`}
            >
               <h3>¿NOS PUEDES CONTAR POR QUE?</h3>
              {this.state.starsSelected === 3}
              <div>
                <p>Respuestas más claras </p> <p> Soluciones más rápidas </p>
                <p> Respuestas más completas </p>
                <p> Cumple, pero podrías mejorar</p> <p> Otro </p>
              </div>
            </fieldset>

            <fieldset
              className={`${(this.state.starsSelected == 4
                ? "expand"
                : "none")}`}
            >
               <h3>NOS PUEDES CONTAR POR QUE</h3>
              {this.state.starsSelected === 4}
              <div>
                <p>Respuesta útil</p> <p> pero podrías mejorar </p>
                <p> Consulta resuelta </p> <p> Quedé conforme </p> <p> Otro </p>
              </div>
            </fieldset>

            <fieldset
              className={`${(this.state.starsSelected == 5
                ? "expand"
                : "none")}`}
            >
               <h3>NOS PUEDES CONTAR POR QUE</h3>
              {this.state.starsSelected === 5}
              <div>
                <p>Respuesta útil</p> <p> pero podrías mejorar </p>
                <p> Respondió lo que pregunte </p> <p> Excelente </p>
                {/* <p  onClick={(e) => this.setState({ starsSelected: (e = 6) })}> Otro </p> */}
              </div>
              </fieldset >

              
         
          </form>
        </div>
      </div>
    );
  }

//  al apretar click en otro se abre te
// FormularioValoracion.propTypes = {
//   generalStates: PropTypes.any.isRequired,
//   sendValoracion: PropTypes.func.isRequired,
// };

// export default FormValoracion;
export default connect(null, {sendValoracion})(FormValoracion);