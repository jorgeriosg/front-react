import axios from "axios";
import Geocode from "react-geocode";
import { APIURL } from "./constans";
import AES from "crypto-js/aes";
import { KEY_ENCRYPT } from "./key-encrypt";
import { isMobile } from 'react-device-detect';

//GENERAL
function defaultGeneral() {
    return {
        type: "DEFAULT_GENERAL"
    };
}

function setGeneral(data) {
    return {
        type: "SET_GENERAL",
        data
    };
}

function setNodoId(data) {
    return {
        type: "SET_NODO_ID",
        data
    };
}
export function getLocation() {
    return function action(dispatch) {
        const geolocation = navigator.geolocation;
        const location = new Promise((resolve, reject) => {
            if (!geolocation) {
                reject(new Error("Not Supported"));
            }

            geolocation.getCurrentPosition(
                position => {
                    resolve(position);
                },
                () => {
                    console.log("Permiso denegado");
                    //reject(new Error("Permission denied"));
                }
            );
        });

        location
            .then(res => {
                const keyGoogleMaps = "AIzaSyDcsYlKbJi5SIYzYtZuaXEkTZXiXBLrym8",
                    latitud = res.coords.latitude.toString(),
                    longitud = res.coords.longitude.toString();
                Geocode.setApiKey(keyGoogleMaps);
                Geocode.enableDebug();
                Geocode.fromLatLng(latitud, longitud).then(
                    response => {
                        let data = getLocationObject(response.results);
                        dispatch({ type: "SET_LOCATION", data: data });
                    },
                    error => {
                        console.log(error);
                    }
                );
            })
            .catch(err => {
                console.log(err);
            });
    };
}
export function getLocationObject(results) {
    let data = {};
    for (let i = 0; i < results.length; i++) {
        const ele = results[i];
        let types = ele.types;
        for (let j = 0; j < types.length; j++) {
            const type = types[j];
            if (type === "administrative_area_level_3") {
                let address_components = ele.address_components;
                for (let k = 0; k < address_components.length; k++) {
                    const address = address_components[k];
                    if (address.types[0] === "administrative_area_level_3") {
                        data.comuna = address.long_name;
                    } else if (address.types[0] === "administrative_area_level_1") {
                        data.region = address.long_name;
                    } else if (address.types[0] === "country") {
                        data.pais = address.long_name;
                    }
                }
                i = results.length;
                break;
            }
        }
    }
    return data;
}
export function setOrigen(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_ORIGEN", data });
    };
}
export function setIntegracion(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_INTEGRACION", data });
    };
}

export function setUrlParams(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_URL_PARAMS", data });
    };
}

export function setRegion(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_REGION", data });
    };
}
//LAUNCHER
export function closeLauncher() {
    return function action(dispatch) {
        dispatch({ type: "CLOSE_LAUNCHER" });
        dispatch({ type: "TOGGLE_MINIMIZED", data: false });
    };
}
export function sendNotification(data) {
    return {
        type: "SET_NOTIFICATION",
        data
    };
}

//CUSTOM PARAMS
export function getCustomParams() {
    return function action(dispatch) {
        dispatch(getCustomParamsStart());

        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            url: APIURL + "/customize_param",
            data: { id_cliente: "1" }
        });
        return request.then(
            response => {
                if (response.status === 200) {
                    //UPDATE COLORS
                    setColors(response.data.color_header);
                    console.log(response.data.color_header)
                    updateCustomColorBtn("#f2ad35")
                    console.log(response.data);
                    dispatch(getCustomParamsEnd(response.data));
                    let str_md5v = AES.encrypt(JSON.stringify(response.data), KEY_ENCRYPT).toString();
                    localStorage.setItem("customParams", str_md5v);
                    window.top.postMessage({ customParams: response.data }, "*");

                    //Si tiene notificación
                    if (response.data.settings.bubble === true) {
                        dispatch(sendNotification(response.data.saludo_burbuja));
                    }
                } else {
                    dispatch(getCustomParamsError(response.statusText));
                }
            },
            err => {
                dispatch(
                    getCustomParamsError(
                        "Error de conexión con el servidor, intente nuevamente"
                    )
                );
            }
        );
    };
}

function getCustomParamsError(error) {
    return {
        type: "GET_CUSTOM_PARAMS_ERROR",
        error
    };
}

function getCustomParamsStart() {
    return {
        type: "GET_CUSTOM_PARAMS_START"
    };
}

function getCustomParamsEnd(data) {
    return {
        type: "GET_CUSTOM_PARAMS_END",
        data
    };
}
export function setCustomParams(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_PARAMS", data });
    };
}
export function updateCustomTitle(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_TITULO", data });
    };
}
export function updateCustomSubtitle(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_SUBTITULO", data });
    };
}
export function updateCustomColorHeader(data) {
    setColors(data);
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_COLOR_HEADER", data });
    };
}
export function updateCustomColorBtn(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_COLOR_BTN", data });
    };
}
export function updateCustomLogo(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_LOGO", data });
    };
}
export function updateCustomAvatar(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_CUSTOM_AVATAR", data });
    };
}
export function setColors(colorHeader) {
    document.documentElement.style.setProperty("--first", colorHeader);
    document.documentElement.style.setProperty("--laucher", colorHeader);
}
//SALUDO
export function getSaludo() {
    return function action(dispatch, getState) {
        dispatch(getSaludoStart());

        let origen = null;

        if (isMobile) {
            origen = 5;
        } else {
            origen = 1;
        }

        const data = {
                general: {
                    cid: null,
                    id_cliente: "1",
                    origen: origen,
                    rut: getUrlParams(getState, 'rut'),
                    user: getUrlParams(getState, 'user'),
                    clave: getUrlParams(getState, 'clave')
                },
                
                msg: null,
            },
            request = axios({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                url: APIURL + "/message",
                data: {
                    ...data,
                    rut: getUrlParams(getState, 'rut'),
                    user: getUrlParams(getState, 'user'),
                    clave: getUrlParams(getState, 'clave')
                }
            });
        return request.then(
            response => {
                if (response.status === 200) {
                    let item = {};
                    item.msg = response.data.msg;
                    let str_md5v = AES.encrypt(JSON.stringify(item), KEY_ENCRYPT).toString();
                    localStorage.setItem("gr", str_md5v);
                    dispatch(getSaludoEnd(item));
                    //Si tiene notificación, la envía
                 
                    if (response.data.notification) {

                        dispatch(sendNotification(response.data.notification));
                    }
                    //PRIMER MENSAJE
                    const msg_inicial = Array.from([response.data.msg])
                  
                    // msg_inicial ? item = msg_inicial : item.msg = ["¿Qué puedo hacer por ti?"];
                    item.msg = msg_inicial
                    item.send = "from";
                    item.enabled = true;
                   
                    console.log("item",item)
                    dispatch(pushConversation(item));
                    dispatch(setNodoId(item));
                } else {
                    dispatch(getSaludoError(response.statusText));
                }
            },
            err => {
                dispatch(
                    getSaludoError(
                        "Error de conexión con el servidor, intente nuevamente"
                    )
                );
            }
        );
    };
}
export function sendSaludo(data) {
    return function action(dispatch) {
        dispatch(pushConversation(data));
    };
}

function getSaludoStart() {
    return {
        type: "GET_SALUDO_START"
    };
}
export function getSaludoEnd(data) {
    return {
        type: "GET_SALUDO_END",
        data
    };
}

function getSaludoError(error) {
    return {
        type: "GET_SALUDO_ERROR",
        error
    };
}
export function updateSaludo(data) {
    return function action(dispatch) {
        dispatch({ type: "UPDATE_SALUDO", data: [data] });
        dispatch({ type: "UPDATE_SALUDO_CONVERSATION", data: [data] });
    };
}
//ASSISTANT
export function openAssistant() {
    return function action(dispatch) {
        dispatch({ type: "OPEN_ASSISTANT" });
    };
}
export function closeAssistant() {
    return function action(dispatch) {
        dispatch(defaultGeneral());
        dispatch({ type: "CLOSE_ASSISTANT" });
        dispatch({ type: "SET_NOTIFICATION", data: null });
        dispatch({ type: "ENABLED_INPUT" });
        dispatch({ type: "ENABLED_HELP" });
        dispatch({ type: "TOGGLE_MINIMIZED", data: false });
        dispatch({ type: "OPEN_LAUNCHER" });
        dispatch(deleteHistory());
    };
}
export function toggleMinimizedAssistant(data) {
    return function action(dispatch) {
        dispatch({ type: "TOGGLE_MINIMIZED", data });
        dispatch({ type: "OPEN_LAUNCHER" });

    };
}
export function defaultAssistant() {
    return function action(dispatch) {
        dispatch({ type: "TOGGLE_MINIMIZED", data: false });
    };
}
//AYUDA
export function getAyuda() {
    return function action(dispatch) {
        dispatch(getAyudaStart());
        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            url: APIURL + "/preguntas_ejemplo"
        });
        return request.then(
            response => {
                // console.log('RESPONSE MENSAJE 2::');
                if (response.data.estado.codigoEstado === 200) {
                    dispatch(getAyudaEnd(response.data.respuesta));
                } else {
                    dispatch(getAyudaError(response.data.respuesta));
                }
            },
            err => {
                dispatch(
                    getAyudaError("Error de conexión con el servidor, intente nuevamente")
                );
            }
        );

        // setTimeout(() => {
        //   let item;
        //   item = [
        //     {
        //       action: false,
        //       collapse: false,
        //       description:
        //         "Te puedo ayudar a consultar tu remanente, formas para aumentarlo, detalle de tus cuotas de participaci\u00f3n, entre otras cosas.\r\nPreg\u00fantame algo o usa alguna de estas alternativas:",
        //       listChild: [
        //         {
        //           title: "\u00bfQu\u00e9 es el remanente?"
        //         },
        //         {
        //           title: "Detalle de las Cuotas de Participaci\u00f3n"
        //         },
        //         {
        //           title: "Formas de pago de la cuota de participaci\u00f3n"
        //         }
        //       ],
        //       title: "Remanente y Cuotas de Participaci\u00f3n"
        //     },
        //     {
        //       action: false,
        //       collapse: false,
        //       description:
        //         "Me puedes preguntar sobre la Cooperativa, sus representantes, como hacerte socio y todos los beneficios que Coopeuch te entrega en tu comuna, en comercios, salud, educaci\u00f3n, espect\u00e1culos y productos SUMA.\u00a0\u000bPreg\u00fantame algo o usa alguna de estas alternativas:",
        //       listChild: [
        //         {
        //           title: "\u00bfQuiero ser socio?"
        //         },
        //         {
        //           title: "\u00bfQu\u00e9 beneficios tengo? "
        //         },
        //         {
        //           title: "Quiero actualizar mis datos"
        //         }
        //       ],
        //       title: "La Cooperativa y sus beneficios"
        //     },
        //     {
        //       action: false,
        //       collapse: false,
        //       description:
        //         "Te puedo ayudar a obtener, bloquear y recuperar tus distintas claves, indicarte direcciones y horarios de oficinas y a comunicarte con Coopeuch.\u00a0\u000bPreg\u00fantame algo o usa alguna de estas alternativas:",
        //       listChild: [
        //         {
        //           title: "\u00bfDonde hay una oficina en mi comuna?"
        //         },
        //         {
        //           title: "\u00bfComo obtener o activar mi clave?"
        //         },
        //         {
        //           title: "\u00bfComo contacto a un ejecutivo?"
        //         }
        //       ],
        //       title: "Claves y Oficinas"
        //     }
        //   ];
        //   dispatch(getAyudaEnd(item));
        // }, 500);
    };
}

function getAyudaStart() {
    return {
        type: "GET_AYUDA_START"
    };
}

function getAyudaEnd(data) {
    return {
        type: "GET_AYUDA_END",
        data
    };
}

function getAyudaError(error) {
    return {
        type: "GET_AYUDA_ERROR",
        error
    };
}
export function openHelp() {
    return function action(dispatch) {
        dispatch({ type: "OPEN_HELP" });
    };
}
export function closeHelp() {
    return function action(dispatch) {
        dispatch({ type: "CLOSE_HELP" });
    };
}
export function enabledHelp() {

    return function action(dispatch) {
        dispatch({ type: "ENABLED_HELP" });
    };
}
export function disabledHelp() {

    return function action(dispatch) {
        dispatch({ type: "DISABLED_HELP" });
    };
}
export function showWarningHelp() {
    return function action(dispatch) {
        dispatch({ type: "SHOW_WARNING_HELP" });
    };
}
export function hideWarningHelp() {
    return function action(dispatch) {
        dispatch({ type: "SHOW_WARNING_HELP_END" });
    };
}
//CONVERSATION
function pushConversation(data) {
    return {
        type: "PUSH_CONVERSATION",
        data
    };
}
export function updateConversationCalendar(data) {
    return function action(dispatch) {
        dispatch({ type: "UPDATE_CONVERSATION_CALENDAR", data });
    };
}

function updateConversationError(data) {
    let conv = {};
    console.log(data)
    conv.msg = data
    conv.enabled = true;
    conv.from = "from";
    
    // if (data.exitoFormulario) {
    //     conv.exito_formulario = data.exitoFormulario;
    // }
    return { type: "PUSH_CONVERSATIONS_ERROR", data: conv };
}

function snapEngage(addContext, addWId) {
    window.top.postMessage({
      notifications: [{
        msg: "",
        snapEngage: true,
        context: addContext,
        widgetId: addWId
      }]
    }, "*");
  }

// updateConversation
export function updateConversation(data) {
    return function action(dispatch, getState) {
        dispatch(setGeneral(data.general));
        dispatch(pushConversation(data));
        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json "
            },
            url: APIURL + "/message",
            data: {
                ...data,
                rut: getUrlParams(getState, 'rut'),
                user: getUrlParams(getState, 'user'),
                clave: getUrlParams(getState, 'clave')
            }
        });
        return request
            .then(response => {
                console.log('message updateConversation:: ', response.data);
                console.log('message updateConversation MSG:: ', response.data.msg);
                let msg = "";
                let addContext = "";
                let addWid = "";
                if (
                    response.status === 200 &&
                    response.data.msg !== undefined &&
                    response.data.msg !== null &&
                    response.data.estado.codigoEstado === 200
                ) {
                   if(response.snapEngage === true){
                      msg = ""
                      addContext = response.contexto;
                      addWid = response.widgetId;

                     snapEngage(addContext, addWid);
                   }
                    let item = response.data
                    item.send = "from";
                    item.enabled = true;
                    // dispatch(setNodoId(item.msg[item.msg.length - 1]));
                    // if(response.data.msg)
                    //   item.msg[0] = item.msg[0].replace("$/^","")
                    
                    messageResponse(dispatch, item);
                } else {
                    dispatch(updateConversationError(response.data.msg));
                }
            })
            .catch(err => {
                dispatch(updateConversationError(err.response.data.msg));

            });

        //Respuesta
        // const msg = parseInt(data.msg[0]);
        // setTimeout(() => {
        //   const rand = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        //   let data;
        //   //1 = MSG + Buttons (Valoración)
        //   //2 = MSG + Buttons (Contactar)
        //   //3 = MSG + Attach
        //   //4 = MSG + Select
        //   //5 = MSG + Multibutton
        //   //6 = MSG + Datepicker
        //   //8 = MULTIMSG
        //   //9 =
        //   // debugger

        //   switch (msg) {
        //     case 1:
        // data = {
        //   general: {
        //     cid: "SOYELCID",
        //     origen: "Sitio Público",
        //     nodo_id: null,
        //     intent: null,
        //     auth: null,
        //     token: null,
        //     location: null
        //   },
        //   msg: ["Soy una respuesta", "Te gustaría valorar la respuesta?"],
        //   buttons: [
        //     {
        //       title: "SI",
        //       value: "siValorar"
        //     },
        //     {
        //       title: "NO",
        //       value: "noValorar"
        //     }
        //   ]
        // };
        //       break;
        //     case 2:
        // data = {
        //   general: {
        //     cid: "SOYELCID",
        //     origen: "Sitio Público",
        //     nodo_id: null,
        //     intent: null,
        //     auth: null,
        //     token: null,
        //     location: null
        //   },
        //   msg: ["Contactar?"],
        //   buttons: [
        //     {
        //       title: "SI",
        //       value: "siContacto"
        //     },
        //     {
        //       title: "NO",
        //       value: "noContacto"
        //     }
        //   ]
        // };
        //       break;
        //     case 3:
        //       data = {
        //         general: {
        //           cid: "SOYELCID",
        //           origen: "Sitio Público",
        //           nodo_id: null,
        //           intent: null,
        //           auth: null,
        //           token: null,
        //           location: null
        //         },
        //         msg: ["Debes adjuntar tu imagen"],
        //         attach: {
        //           types: [
        //             "image/jpeg",
        //             "image/gif",
        //             "image/png",
        //             "application/pdf",
        //             "application/word"
        //           ],
        //           maxSize: 300000
        //         }
        //       };
        //       break;
        //     case 4:
        // data = {
        //   general: {
        //     cid: "SOYELCID",
        //     origen: "Sitio Público",
        //     nodo_id: null,
        //     intent: null,
        //     auth: null,
        //     token: null,
        //     location: null
        //   },
        //   msg: ["Por favor, selecciona una opción: "],
        //   selects: [
        //     {
        //       text: "Seleccione",
        //       value: "-1"
        //     },
        //     {
        //       text: "Option 1",
        //       value: "1"
        //     },
        //     {
        //       text: "Option 2",
        //       value: "2"
        //     },
        //     {
        //       text: "Option 3",
        //       value: "3"
        //     },
        //     {
        //       text: "Option 4",
        //       value: "4"
        //     },
        //     {
        //       text: "Option 5",
        //       value: "5"
        //     },
        //     {
        //       text: "Option 6",
        //       value: "6"
        //     }
        //   ]
        // };
        //       break;
        //     case 5:
        // data = {
        //   general: {
        //     cid: "SOYELCID",
        //     origen: "Sitio Público",
        //     nodo_id: null,
        //     intent: null,
        //     auth: null,
        //     token: null,
        //     location: null
        //   },
        //   msg: ["Hola, selecciona uno o varios botones:"],
        //   multibuttons: [
        //     { title: "hola", value: "1" },
        //     { title: "holanda", value: "2" },
        //     { title: "holiwis", value: "3" },
        //     { title: "holo", value: "4" },
        //     { title: "holawa", value: "5" }
        //   ]
        // };
        //       break;
        //     case 6:
        // data = {
        //   general: {
        //     cid: "SOYELCID",
        //     origen: "Sitio Público",
        //     nodo_id: null,
        //     intent: null,
        //     auth: null,
        //     token: null,
        //     location: null
        //   },
        //   msg: ["Hola, seleccione una fecha:"],
        //   datepicker: [
        //     { name: "inicial", value: "22/05/1991" },
        //     { name: "final", value: "22/05/1991" }
        //   ]
        // };
        //       break;
        //     // case 7:
        //     //   data = {
        //     //     general: {
        //     //       cid: "SOYELCID",
        //     //       origen: "Sitio Público",
        //     //       nodo_id: null,
        //     //       intent: null,
        //     //       auth: null,
        //     //       token: null,
        //     //       location: null
        //     //     },
        //     //     msg: ["Hola, seleccione una fecha:"],
        //     //     datepicker: [{ name: "", value: "" }, { name: "", value: "" }]
        //     //   };
        //     //   break;
        //     case 8:
        //       data = {
        //         general: {
        //           cid: "SOYELCID",
        //           origen: "Sitio Público",
        //           nodo_id: null,
        //           intent: null,
        //           auth: null,
        //           token: null,
        //           location: null
        //         },
        //         msg: ["lorem ipsum", "lorem ipsum", "lorem ipsum", "lorem ipsum"]
        //       };
        //       break;
        //     case 9:
        // data = {
        //   general: {
        //     cid: "SOYELCID",
        //     origen: "Sitio Público",
        //     nodo_id: null,
        //     intent: null,
        //     auth: null,
        //     token: null,
        //     location: null
        //   },
        //   like: true
        // };
        //       break;
        //     default:
        //       data = {
        //         general: {
        //           cid: "SOYELCID",
        //           origen: "Sitio Público",
        //           nodo_id: null,
        //           intent: null,
        //           auth: null,
        //           token: null,
        //           location: null
        //         },
        //         msg: ["Soy una respuesta", "Puedes seguir hablándome"]
        //       };
        //     break;
        //   }

        // data.send = "from";
        // data.enabled = true;

        // messageResponse(dispatch, data);
        // }, 500);
    };
}

function messageResponse(dispatch, data) {
    console.log('messageResponse:: ', data);
    if (data.liftUp !== undefined) {
        //Si trae para levantar modales
        switch (data.liftUp) {
            case "valoracion":
                if (data.general !== undefined) {
                    dispatch(setGeneral(data.general));
                    if (data.general.integracion !== undefined) dispatch(setIntegracion(data.general.integracion));
                }
                dispatch({ type: "ENABLED_VALORACION" });
                disabledHelp();
                disabledInput();
                dispatch(pushConversation(data));
                break;
            case "form":
                if (data.general !== undefined) {
                    dispatch(setGeneral(data.general));
                    if (data.general.integracion !== undefined) dispatch(setIntegracion(data.general.integracion));
                }
                dispatch({ type: "ENABLED_FORM" });
                dispatch(pushConversation(data));
                break;
                case "formContacto":
                if (data.general !== undefined) {
                    dispatch(setGeneral(data.general));
                    if (data.general.integracion !== undefined) dispatch(setIntegracion(data.general.integracion));
                }
                dispatch({ type: "ENABLED_FORM" });
                dispatch(pushConversation(data));
                break;
            default:
                break;
        }
    } else {
        console.log('data.general888 ', data)
        if (data.general !== undefined) {
            dispatch(setGeneral(data.general));
            if (data.general.region !== undefined) {
                dispatch(setRegion(data.general.region))
            };
            if (data.general.integracion !== undefined) {
                dispatch(setIntegracion(data.general.integracion))
            };
        }
        dispatch(pushConversation(data));
    }
}
export function setHistory(data) {
    return function action(dispatch) {
        const lastConversation = data[data.length - 1],
            liftUp = lastConversation.liftUp;
        if (liftUp !== undefined) {
            switch (liftUp) {
                case "valoracion":
                    dispatch({ type: "ENABLED_VALORACION" });
                    break;
                case "form":
                    dispatch({ type: "ENABLED_FORM" });
                    break;
                default:
                    break;
            }
        }
        dispatch(setGeneral(lastConversation.general));
        dispatch({ type: "SET_HISTORY", data });
    };
}

function deleteHistory() {
    return { type: "DELETE_HISTORY" };
}
export function setModal(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_MODAL", data });
    };
}
//BOTONES
export function updateConversationButton(data) {
    // return function action(dispatch) {
    //   dispatch(setGeneral(data.general));
    //   dispatch(pushConversation(data));
    //   const request = axios({
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     url: APIURL + "/message",
    //     data: data
    //   });
    //   return request.then(
    //     response => {
    //       if (response.status === 200) {
    //         let item = response.data;
    //         item.send = "from";
    //         item.enabled = true;
    //         messageResponse(dispatch, item);
    //       } else {
    //         dispatch(updateConversationError(response.statusText));
    //       }
    //     },
    //     err => {
    //       dispatch(
    //         updateConversationError(
    //           "Error de conexión con el servidor, intente nuevamente"
    //         )
    //       );
    //     }
    //   );
    // };
    switch (data.msg[0]) {
        case "siValorar":
            return function action(dispatch) {
                dispatch(setGeneral(data.general));
                dispatch(pushConversation(data));
                setTimeout(() => {
                    let _data = {
                        general: data.general,
                        send: "from",
                        enabled: true,
                        liftUp: "valoracion",
                        withStars: false
                    };
                    messageResponse(dispatch, _data);
                }, 500);
            };
        case "noValorar":
            return function action(dispatch) {
                dispatch({ type: "DISABLED_VALORACION" });
                dispatch(setGeneral(data.general));
                dispatch(pushConversation(data));
                setTimeout(() => {
                    let _data = {
                        general: data.general,
                        send: "from",
                        enabled: true,
                        msg: [
                            "Lamentamos que no quieras.",
                            "Recuerda que si vuelves a necesitar ayuda, estoy acá las 24 horas del día."
                        ]
                    };
                    messageResponse(dispatch, _data);
                }, 500);
            };
        case "siContacto":
            return function action(dispatch) {
                dispatch(setGeneral(data.general));
                dispatch(pushConversation(data));

                // setTimeout(() => {
                //   let data = {
                //     general: {
                //       cid: "SOYELCID",
                //       origen: "Sitio Público",
                //       nodo_id: null,
                //       intent: null,
                //       auth: null,
                //       token: null,
                //       location: null
                //     },
                //     send: "from",
                //     enabled: true,
                //     liftUp: "form",
                //     form: {
                //       header: {
                //         icon: "fas fa-user-tie",
                //         textA: "Por favor ingrese sus datos y",
                //         textStrong:
                //           "uno de nuestros ejecutivos le responderá a la brevedad posible",
                //         textB: "o en horario hábil siguiente",
                //         closeMsg: "No"
                //       },
                //       bajada: "Campos obligatorios (*)",
                //       url: "",
                //       fields: [
                //         {
                //           legend: "Nombre*",
                //           type: "text",
                //           name: "nombre",
                //           placeholder: "Ej. Juan",
                //           autocomplete: "off",
                //           validate: {
                //             types: ["required", "text"],
                //             rules: { min: 3, max: 10 },
                //             error: "Debes completar el nombre (mínimo 3, máximo 10)"
                //           }
                //         },
                //         {
                //           type: "selects-link",
                //           parent: {
                //             legend: "Select",
                //             type: "select",
                //             name: "region",
                //             options: [
                //               { text: "Seleccione", value: -1 },
                //               { text: "Region 1", value: "R1" },
                //               { text: "Region 2", value: "R2" },
                //               { text: "Region 3", value: "R3" }
                //             ],
                //             validate: {
                //               types: ["required", "select"],
                //               error: "Debes seleccionar una opción"
                //             }
                //           },
                //           children: {
                //             legend: "Select Search",
                //             type: "search",
                //             name: "cursos",
                //             options: [
                //               {
                //                 key: "R1",
                //                 options: [
                //                   { text: "Curso 1 R1", value: "COD1" },
                //                   { text: "Curso 2 R1", value: "COD2" },
                //                   { text: "Curso 3 R1", value: "COD3" },
                //                   { text: "Curso 4 R1", value: "COD4" }
                //                 ]
                //               },
                //               {
                //                 key: "R2",
                //                 options: [
                //                   { text: "Curso 1 R2", value: "COD1" },
                //                   { text: "Curso 2 R2", value: "COD2" },
                //                   { text: "Curso 3 R2", value: "COD3" },
                //                   { text: "Curso 4 R2", value: "COD4" }
                //                 ]
                //               },
                //               {
                //                 key: "R3",
                //                 options: [
                //                   { text: "Curso 1 R3", value: "COD1" },
                //                   { text: "Curso 2 R3", value: "COD2" },
                //                   { text: "Curso 3 R3", value: "COD3" },
                //                   { text: "Curso 4 R3", value: "COD4" }
                //                 ]
                //               },

                //             ],
                //             validate: {
                //               types: ["required", "text"],
                //               rules: { min: 3, max: 1000 },
                //               error: "Debes seleccionar una opción"
                //             }
                //           }
                //         },
                        // {
                        //   legend: "Select Search",
                        //   type: "search",
                        //   name: "opciones",
                        //   options: [
                        //     { text: "Perro" },
                        //     { text: "Gato" },
                        //     { text: "Cocodrilo" },
                        //     { text: "Serpiente" },
                        //     { text: "Chancho" },
                        //     { text: "Ratón" }
                        //   ],
                        //   validate: {
                        //     types: ["required", "search"],
                        //     error: "Debes seleccionar una opción"
                        //   }
                        // },
            //             {
            //               legend: "Rut*",
            //               type: "text",
            //               name: "rut",
            //               placeholder: "Ej. 11111111-1",
            //               autocomplete: "off",
            //               validate: {
            //                 types: ["required", "rut"],
            //                 error: "Debes ingresar un rut válido"
            //               }
            //             },
            //             {
            //               legend: "Teléfono",
            //               type: "tel",
            //               name: "telefono",
            //               placeholder: "Ej. 912345678",
            //               autocomplete: "off",
            //               validate: {
            //                 types: ["tel"],
            //                 error: "Debes ingresar un teléfono válido"
            //               }
            //             },
            //             {
            //               legend: "Correo electrónico*",
            //               type: "email",
            //               name: "email",
            //               placeholder: "Ej. nombre@micorreo.cl",
            //               autocomplete: "off",
            //               validate: {
            //                 types: ["required", "email"],
            //                 error: "Debes ingresar un correo electrónico válido"
            //               }
            //             },
            //             {
            //               legend: "Switch*",
            //               type: "checkbox",
            //               name: "switch",
            //               validate: {
            //                 types: ["checkbox"],
            //                 error: "Debes seleccionar el checkbox"
            //               }
            //             },
            //             {
            //               legend: "Select prueba",
            //               type: "select",
            //               name: "opciones",
            //               options: [
            //                 { text: "Seleccione", value: -1 },
            //                 { text: "Opcion #1", value: 1 },
            //                 { text: "Opcion #2", value: 2 },
            //                 { text: "Opcion #3", value: 3 }
            //               ],
            //               validate: {
            //                 types: ["required", "select"],
            //                 error: "Debes seleccionar una opción"
            //               }
            //             },
            //             {
            //               legend: "Adjuntar*",
            //               type: "file",
            //               name: "attach",
            //               validate: {
            //                 types: ["required", "file"],
            //                 error: "Debes adjuntar",
            //                 rules: {
            //                   types: [
            //                     "image/jpeg",
            //                     "image/gif",
            //                     "image/png",
            //                     "application/pdf",
            //                     "application/word"
            //                   ],
            //                   maxSize: 300000,
            //                   maxQuantity: 3
            //                 }
            //               }
            //             },
            //             {
            //               legend: "Comentario",
            //               type: "textarea",
            //               name: "comentario",
            //               placeholder: "Escriba aquí su comentario",
            //               autocomplete: "off",
            //               rows: 5,
            //               validate: {
            //                 types: ["text"],
            //                 rules: { min: 3, max: 150 },
            //                 error: "Debes completar el nombre (mínimo 3, máximo 150)"
            //               }
            //             }
            //           ]
            //         }
            //       };
            //        data = {
            //         general: {
            //           cid: "SOYELCID",
            //           origen: "Sitio Público",
            //           nodo_id: null,
            //           intent: null,
            //           auth: null,
            //           token: null,
            //           location: null
            //         },
            //         send: "from",
            //         enabled: true,
            //         liftUp: "form",
            //         form: {
            //           header: {
            //             icon: "fas fa-user-tie",
            //             textA: "Por favor ingrese sus datos y",
            //             textStrong:
            //               "uno de nuestros ejecutivos le responderá a la brevedad posible",
            //             textB: "o en horario hábil siguiente",
            //             closeMsg: "No"
            //           },
            //           bajada: "Campos obligatorios (*)",
            //           url: "",
            //           fields: [
            //             {
            //               type: "selects-link",
            //               parent: {
            //                 legend: "Select",
            //                 type: "select",
            //                 name: "region",
            //                 options: [
            //                   { text: "Seleccione", value: -1 },
            //                   { text: "Region 1", value: "R1" },
            //                   { text: "Region 2", value: "R2" },
            //                   { text: "Region 3", value: "R3" }
            //                 ],
            //                 validate: {
            //                   types: ["required", "select"],
            //                   error: "Debes seleccionar una opción"
            //                 }
            //               },
            //               children: {
            //                 legend: "Select Search",
            //                 type: "search",
            //                 name: "cursos",
            //                 options: [
            //                   {
            //                     key: "R1",
            //                     options: [
            //                       { text: "Curso 1 R1", value: "COD1" },
            //                       { text: "Curso 2 R1", value: "COD2" },
            //                       { text: "Curso 3 R1", value: "COD3" },
            //                       { text: "Curso 4 R1", value: "COD4" },
            //                       { text: "Curso 4 R1", value: "COD4" },
            //                       { text: "Curso 4 R1", value: "COD4" },
            //                       { text: "Curso 4 R1", value: "COD4" },
            //                       { text: "Curso 4 R1", value: "COD4" }
            //                     ]
            //                   },
            //                   {
            //                     key: "R2",
            //                     options: [
            //                       { text: "Curso 1 R2", value: "COD1" },
            //                       { text: "Curso 2 R2", value: "COD2" },
            //                       { text: "Curso 3 R2", value: "COD3" },
            //                       { text: "Curso 4 R2", value: "COD4" }
            //                     ]
            //                   },
            //                   {
            //                     key: "R3",
            //                     options: [
            //                       { text: "Curso 1 R3", value: "COD1" },
            //                       { text: "Curso 2 R3", value: "COD2" },
            //                       { text: "Curso 3 R3", value: "COD3" },
            //                       { text: "Curso 4 R3", value: "COD4" }
            //                     ]
            //                   },

            //                 ],
            //                 validate: {
            //                   types: ["required", "text"],
            //                   rules: { min: 3, max: 1000 },
            //                   error: "Debes seleccionar una opción"
            //                 }
            //               }
            //             },
            //             {
            //               legend: "Comentario",
            //               type: "textarea",
            //               name: "comentario",
            //               placeholder: "Escriba aquí su comentario",
            //               autocomplete: "off",
            //               rows: 5,
            //               validate: {
            //                 types: ["text"],
            //                 rules: { min: 3, max: 150 },
            //                 error: "Debes completar el nombre (mínimo 3, máximo 150)"
            //               }
            //             }
            //           ]
            //         }
            //       };
            //       messageResponse(dispatch, data);
            //     }, 500);
            };
        default:
            return function action(dispatch, getState) {
                dispatch(setGeneral(data.general));
                dispatch(pushConversation(data));
                const request = axios({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json "
                    },
                    url: APIURL + "/message",
                    data: {
                        ...data,
                        rut: getUrlParams(getState, 'rut'),
                        user: getUrlParams(getState, 'user'),
                        clave: getUrlParams(getState, 'clave')
                    }
                });
                return request.then(
                    response => {
                        // console.log('RESPONSE MENSAJE 3::');
                        if (response.status === 200) {
                            let item = response.data;
                            console.log('RESPONSE MENSAJE 3::', item);
                            item.send = "from";
                            item.enabled = true;
                            // dispatch(setNodoId(item.msg[item.msg.length - 1]));
                            messageResponse(dispatch, item);
                        } else {
                            dispatch(updateConversationError(response.statusText));
                        }
                    },
                    err => {
                        dispatch(updateConversationError(err.response.data.msg));
                    }
                );
            };
    }
}
//INPUT
export function enabledInput() {
    return function action(dispatch) {
        dispatch({ type: "ENABLED_INPUT" });
    };
}
export function disabledInput() {
    return function action(dispatch) {
        dispatch({ type: "DISABLED_INPUT" });
    };
}
export function attachFile(data) {
    return function action(dispatch) {
        dispatch(attachFileStart());
        setTimeout(() => {
            let item;
            item = {
                files: [
                    "http://panikors.s3-website-us-east-1.amazonaws.com/wp-content/uploads/2015/01/Panteras-Negras.jpg",
                    "http://www.google.com"
                ]
            };
            item.send = "from";
            item.enabled = true;
            item.general = data.general;
            dispatch(pushConversation(item));
            dispatch(attachFileEnd(item));
        }, 1500);
    };
}
export function deleteFileForm(data) {
    return function action(dispatch) {
        dispatch({ type: "DELETE_FILE", data });
    };
}
export function attachFileForm(data) {
    return function action(dispatch) {
        dispatch(attachFileStart());
        setTimeout(() => {
            let files = {
                name: "imagen",
                url: "http://panikors.s3-website-us-east-1.amazonaws.com/wp-content/uploads/2015/01/Panteras-Negras.jpg"
            };
            dispatch({ type: "SET_FILES", data: files });
            dispatch(attachFileEnd());
        }, 3000);
    };
}

function attachFileStart() {
    return {
        type: "GET_CONVERSATIONS_START"
    };
}
// function attachFileError(error) {
//   return {
//     type: "GET_CONVERSATIONS_ERROR",
//     error
//   };
// }
function attachFileEnd(data) {
    return {
        type: "GET_CONVERSATIONS_END"
    };
}
export function openEmoji() {
    return function action(dispatch) {
        dispatch({ type: "OPEN_EMOJI" })
    }
}
export function closeEmoji() {
    return function action(dispatch) {
        dispatch({ type: "CLOSE_EMOJI" })
    }
}
export function openVoice() {
    return function action(dispatch) {
        dispatch({ type: "OPEN_VOICE" })
    }
}
export function closeVoice() {
    return function action(dispatch) {
        dispatch({ type: "CLOSE_VOICE" })
    }
}
//VALORACIÓN
export function setStar(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_STARS_VALORACION", data });
        dispatch({ type: "SET_BUTTON_VALORACION", data: true });
    };
}
export function setOverStar(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_OVER_STAR_VALORACION", data });
    };
}
export function setCommentValoracion(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_COMMENT_VALORACION", data });
    };
}
export function setServicioValoracion(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_SERVICIO_VALORACION", data });
    };
}
export function setPudoResolverValoracion(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_PUDO_RESOLVER_VALORACION", data });
    };
}
export function setErrorValoracion(data) {
    return function action(dispatch) {
        dispatch({ type: "SET_ERROR_VALORACION", data });
        setTimeout(() => {
            dispatch({ type: "SET_ERROR_VALORACION", data: false });
        }, 4000);
    };
}
export function sendValoracion(data, general) {
    return function action(dispatch) {
        // dispatch({ type: "GET_CONVERSATIONS_START" });
        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            url: APIURL + "/valorar",
            data: data
        });
        return request.then(
            response => {
                if (
                    response.status === 200 &&
                    response.data.estado.codigoEstado === 200
                ) {
                    console.log("sendvaloracion",response.data)
                    let item = {};
                    item.send = "form";
                    item.enabled = true;
                    item.general = general;
                    item.yaValoro = true;
                    item.yaCv= false;
                    item.yaContacto = false;
                    item.yaEvalucion= false;
                    item.yaSolicito= false;
                    item.yaSuma= false;
                    item.yaTC= false;
                    item.yaTransfirio= false;
                    item.msg =['Muchas gracias por tu evaluación, nos ayuda a seguir mejorando.'];
                    dispatch(pushConversation(item));
                    dispatch({ type: "GET_CONVERSATIONS_END" });
                    // dispatch(updateConversation(item));
                    // dispatch({ type: "GET_CONVERSATIONS_START" });
                   
                 
                } else {
                    let msg = ['error_formulario'];
                    dispatch(updateConversationError(msg));
                    dispatch({ type: "GET_CONVERSATIONS_END" });
                }
            },
            err => {
                dispatch(updateConversationError(err.response.data.msg));
                dispatch({ type: "GET_CONVERSATIONS_END" });
            }
        );
    };
}
export function closeValoracion(data) {
    return function action(dispatch) {
        dispatch({ type: "DISABLED_VALORACION" });
        updateConversationButton(data);
    };
}

//LIKE
export function sendLike(data, general) {
    return function action(dispatch) {
        dispatch({ type: "GET_CONVERSATIONS_START" });
        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            url: APIURL + "/valorar",
            data: data
        });
        console.log(data)
        return request.then(response => {

                console.log('RESPONSE:: like ', response);

                if (
                    response.status === 200 &&
                    response.data.estado.codigoEstado === 200
                ) {
                    let item = {};
                    item.msg = [response.data.respuesta];
                    item.send = "from";
                    item.enabled = true;
                    item.general = general;
                    messageResponse(dispatch, item);
                } else {
                    dispatch(updateConversationError(response.statusText));
                }
                // dispatch({ type: "GET_CONVERSATIONS_END" });
            },
            err => {
                dispatch(
                    updateConversationError(
                        "Disculpa, se ha producido un error al valorar. Puedes continuar con la conversación."
                    )
                );
                dispatch({ type: "GET_CONVERSATIONS_END" });
            }
        );
    };
}
//FORM
export function closeForm(data) {
    return function action(dispatch, getState) {
        dispatch({ type: "DISABLED_FORM" });
        dispatch(setGeneral(data.general));
        dispatch(pushConversation(data));
        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            url: APIURL + "/message",
            data: {
                ...data,
                rut: getUrlParams(getState, 'rut'),
                user: getUrlParams(getState, 'user'),
                clave: getUrlParams(getState, 'clave')
            }
        });
        return request.then(
            response => {
                if (
                    response.status === 200 &&
                    response.data.estado.codigoEstado === 200
                ) {
                    let item = response.data;
                    item.send = "from";
                    item.enabled = true;
                    dispatch(setNodoId(item.msg[item.msg.length - 1]));
                    messageResponse(dispatch, item);
                } else {
                    dispatch(updateConversationError(response.statusText));
                }
            },
            err => {
                dispatch(updateConversationError(err.response.data.msg));
            }
        );
    };
}
export function sendForm(data, url, general) {
    console.log("sendForm",data,url,general)
    data.general = general;
    return function action(dispatch, getState) {
        dispatch({ type: "SEND_FORM_START" });
        const request = axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            url: url,
            data: data
        });
        return request.then(
            response => {
                if (response.status === 200 && response.data.estado.codigoEstado === 200) {
                    let item = {}
                    if (response.data.estado.glosaEstado == 'Formulario') {
                        item.send = "to";
                        item.enabled = false;
                        item.general = general
                        item.yaContacto= true;
                        item.yaValoro = false;
                        item.yaCv= false;
                        item.yaEvalucion= false;
                        item.yaSolicito= false;
                        item.yaSuma= false;
                        item.yaTC= false;
                        item.yaTransfirio= false;
                        item.msg= ['No'];
                        item.origen=["Sitio Publico"]
                    }else{
                        item.msg = ["autenticado"];
                        item.send = "to";
                        item.enabled = false;
                        item.general = general;
                        item.token = response.data.respuesta.access_token
                    }
                    
                    
                    //updateConversation(item);
                    // messageResponse(dispatch, item);
                    dispatch({ type: "DISABLED_FORM" });
                    const request = axios({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        url: APIURL + "/message",
                        data: {
                            ...item,
                            rut: getUrlParams(getState, 'rut'),
                            user: getUrlParams(getState, 'user'),
                            clave: getUrlParams(getState, 'clave')
                        }
                    });
                    return request
                        .then(response => {
                            console.log('RESPONSE MENSAJE 5::');
                            console.log(response.data,"reponse5");
                            if (
                                response.status === 200 &&
                                response.data.estado.codigoEstado === 200
                            ) {
                                dispatch({ type: "SEND_FORM_END" });
                                let item = response.data
                                item.send = "form";
                                item.enabled = true;
                                // item.msg = [response.data.general.msg]
                                // dispatch(setGeneral(data.general));
                                // dispatch(pushConversation(data));
                                //  updateConversation(item);
                                console.log("Conversation updated w",item);
                                // dispatch(setNodoId(item.msg[item.msg.length - 1]));
                                messageResponse(dispatch, item);
                            } else if (response.data !== undefined) {
                                // dispatch(updateConversationError(response.data));
                                dispatch(updateConversationError(response.data.msg));
                            } else {
                                dispatch({ type: "SEND_FORM_END" });
                                dispatch(updateConversationError(response.data.msg));
                            }
                        })
                        .catch(err => {
                            dispatch({ type: "SEND_FORM_END" });
                            // dispatch(updateConversationError(err.response.data));
                            dispatch(updateConversationError(response.data.msg));
                        });
                } else {
                    dispatch(updateConversationError(response.statusText = 'error_formulario'));
                    dispatch({ type: "DISABLED_FORM" });
                }
            },
            err => {
                dispatch({ type: "DISABLED_FORM" });
                dispatch(
                    updateConversationError(
                        err.response === undefined ? err.message : err.response.data.msg
                    )
                );
            }
        );

        // dispatch(setGeneral(data.general));
        // dispatch(pushConversation(data));

        //Respuesta
        // setTimeout(() => {
        //   console.log("url ==> ", url);
        //   let data = {
        //     general: {
        //       cid: "SOYELCID",
        //       origen: "Sitio Público",
        //       nodo_id: null,
        //       intent: null,
        //       auth: null,
        //       token: null,
        //       location: null
        //     },
        //     msg: ["Se ha enviado el formulario"]
        //   };
        //   data.send = "from";
        //   data.enabled = true;
        //   messageResponse(dispatch, data);
        //   dispatch({ type: "SEND_FORM_END" });
        //   dispatch({ type: "DISABLED_FORM" });
        // }, 500);
    };
}
//RESPONSIVE
export function responsive(data) {
    return function action(dispatch) {
        dispatch({ type: "RESPONSIVE", data });
    };
}
//VOICE
export function enabledVoice() {

    return function action(dispatch) {
        dispatch({ type: "ENABLED_VOICE" });
    };
}
export function disabledVoice() {

    return function action(dispatch) {
        dispatch({ type: "DISABLED_VOICE" });
    };
}

// getUrlParams
export function getUrlParams(getState, urlParam) {
    const paramValue = getState().generalStates.getIn(["url_params", urlParam]);
    if (paramValue === "null") return null;
    return paramValue;
}