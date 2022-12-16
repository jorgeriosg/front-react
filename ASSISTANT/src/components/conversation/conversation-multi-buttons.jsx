import React, { Component } from "react";
import PropTypes from "prop-types";
import ConversationMultiButtonsButton from "./conversation-multi-buttons-button";

export default class ConversationMultiButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectButtons: []
    };
    this.sendButtonresponse = this.sendButtonresponse.bind(this);
    this.toggleSelectButton = this.toggleSelectButton.bind(this);
  }

  sendButtonresponse(event) {
    const { generalStates } = this.props,
      general = generalStates.toJS(),
      conversation = {
        general,
        msg: this.state.selectButtons,
        send: "to",
        enabled: false
      };
    this.props.updateConversationButton(conversation);
  }

  toggleSelectButton(value) {
    //Ver si lo tiene lo quita, si no lo pinta 
    const existe = this.state.selectButtons.filter(item => item === value);
    let array = this.state.selectButtons;
    if(existe.length===0){
      array.push(value);
      this.setState({
        selectButtons: array
      });
    }else{
      array = this.state.selectButtons.filter(item => item !== value);
      this.setState({
        selectButtons: array
      });
    }
  }

  render() {
    const { buttons, animation, send, mainCss } = this.props,
      cssClass = this.state.selectButtons.length>0?"":" "+mainCss.Disabled,
      botones = buttons.map((map, i) => {
        return (
          <ConversationMultiButtonsButton
            key={i}
            button={map}
            toggleSelectButton={this.toggleSelectButton}
            mainCss={mainCss}
          />
        );
      });

    return (
      <div className={mainCss.ConversationBubble+" "+ mainCss.AlignCenter + " " + mainCss.Buttons +" " + animation + send}>
        {botones}
        <div className={mainCss.MultiButtons}>
          <button
            className={mainCss.Btn+" "+mainCss.BtnBig+" "+cssClass}
            onClick={this.sendButtonresponse}
          >
            Enviar
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>
    );
  }
}

ConversationMultiButtons.propTypes = {
  buttons: PropTypes.any.isRequired,
  animation: PropTypes.string.isRequired,
  send: PropTypes.string.isRequired,
  updateConversationButton: PropTypes.func.isRequired,
  generalStates: PropTypes.any.isRequired,
  mainCss: PropTypes.any.isRequired
};
