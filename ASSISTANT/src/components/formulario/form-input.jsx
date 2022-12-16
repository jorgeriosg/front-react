import React, { Component } from "react";
import PropTypes from "prop-types";
import { formatRut } from "./validator";

export default class FormInput extends Component {

  validateInput = (e) => {
    const { validateFunc ,validate, name } = this.props;
    // if(validate.get("types").filter(type => type === "rut").size > 0){
    //   e.currentTarget.value = formatRut(e.currentTarget);
    // }
    validateFunc(validate, name,e);
  }

  content() {
    const { type, name, placeholder, autocomplete, withError, mainCss, value } = this.props;
    let cssClass = withError?" "+mainCss.Error:"";
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autocomplete}
        onKeyUp={(e) => { this.validateInput(e) }}
        className={cssClass}
        defaultValue={!value?'':value}
      />
    );
  }

  render() {
    return this.content();
  }
}

FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  autocomplete: PropTypes.string.isRequired,
  validateFunc: PropTypes.func.isRequired,
  validate: PropTypes.object,
  withError: PropTypes.bool,
  mainCss: PropTypes.object.isRequired,
  value: PropTypes.string
};
