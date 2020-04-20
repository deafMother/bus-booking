// use redux form
import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { register } from "../../action";
class Register extends React.Component {
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
    this.props.register(formValues);
  };
  renderForm() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            name="name"
            label="User Name"
            component={this.renderInput}
            inputType="text"
          />
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
          <Field
            name="passwordConfirm"
            label="Confirm Password"
            inputType="password"
            component={this.renderInput}
          />
          <button className="button">REGISTER</button>
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
  if (!formValues.name) {
    // we can test various conditions here like case and numbers etc
    errors.name = "Enter a name";
  }
  if (!formValues.email) {
    // we can test various conditions here like case and numbers etc
    errors.email = "Enter a vaule";
  }
  if (!formValues.password) {
    errors.password = "password required";
  }
  if (!formValues.passwordConfirm) {
    errors.confirmPassword = "password required";
  }
  if (formValues.passwordConfirm !== formValues.password) {
    errors.passwordConfirm = "password not matching";
  }
  return errors;
};

const myComp = reduxForm({
  form: "registerForm",
  validate
})(Register);

export default connect(null, { register })(myComp);
