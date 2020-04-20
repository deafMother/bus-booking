// use redux form
import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { loginIn } from "../../action";
class LogIn extends React.Component {
  checkError = ({ touched, error }) => {
    if (touched && error) {
      return <span>{`  ${error}!!`}</span>;
    }
  };
  renderInput = ({ input, label, inputType, meta }) => {
    return (
      <div className="form">
        <label>{`${label} : `}</label>
        <input type={inputType} autoComplete="off" {...input} />
        {this.checkError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    console.log(formValues);
    this.props.loginIn(formValues);
  };
  renderForm() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            name="email"
            label="User Email"
            component={this.renderInput}
            inputType="email"
          />
          <Field
            name="password"
            label="Enter Password"
            inputType="password"
            component={this.renderInput}
          />
          <button className="button">LOGIN</button>
        </form>
      </div>
    );
  }

  render() {
    return <div id="redux-form">{this.renderForm()}</div>;
  }
}

const validate = formValues => {
  const errors = {};
  if (!formValues.email) {
    // we can test various conditions here like case and numbers etc
    errors.email = "Enter a vaule";
  }
  if (!formValues.password) {
    errors.password = "password required";
  }
  return errors;
};

const myComp = reduxForm({
  form: "LoginForm",
  validate
})(LogIn);

export default connect(null, { loginIn })(myComp);
