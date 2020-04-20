// this will be a functional component holding the signin and register component
import React from "react";
import Login from "../login/Login";
import Register from "../register/Register";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

function SignInSignUp(props) {
  if (props.loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="form-container">
      <div>
        <Login />
      </div>
      <div>
        <Register />
      </div>
    </div>
  );
}

let mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  };
};

export default connect(mapStateToProps)(SignInSignUp);
