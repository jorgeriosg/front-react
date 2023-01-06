import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ConversationButtons extends Component {
  constructor(props) {
    super(props);
    this.sendButtonresponse = this.sendButtonresponse.bind(this);
  }

  

 
  sendButtonresponse(event) {
      // let href = "location.href=https://www.google.com"
    const $item = event.target,
      msg = $item.dataset.msg.toString();
      console.log("msg botones", event)
    const { generalStates } = this.props,
      general = generalStates.toJS(),
      conversation = {
        general,
        msg: [msg],
        send: "to",
        enabled: false
      };
     
    this.props.updateConversationButton(conversation);
  }


handleButtonClick = (h) => {
  window.open(h, '_blank');
}



  render() {
    const { buttons, animation, send, mainCss } = this.props,
      botones = buttons.map((map, i) => {
        if(map.get("value").includes("http")|| map.get("value").includes("https")){
        return (
          <button
            key={i}
            className={mainCss.Btn + " " + mainCss.BtnBig}
            data-msg={map.get("value")}
            onClick={(e) => this.handleButtonClick(map.get("value"))}
          >
            {map.get("title")}
          </button>
        )}
        else (map.get("value"))
        return (
          <button
            key={i}
            className={mainCss.Btn + " " + mainCss.BtnBig}
            data-msg={map.get("value")}
            onClick={this.sendButtonresponse}
          >
            {map.get("title")}
          </button>
        );
        
      });
      
    return (
      <div className={mainCss.ConversationBubble+" "+mainCss.Buttons + " " + animation + send}>
        {botones}
      </div>
    );
  }
}
    

ConversationButtons.propTypes = {
  buttons: PropTypes.any.isRequired,
  animation: PropTypes.string.isRequired,
  send: PropTypes.string.isRequired,
  updateConversationButton: PropTypes.func.isRequired,
  generalStates: PropTypes.any.isRequired,
  mainCss: PropTypes.any.isRequired
};
