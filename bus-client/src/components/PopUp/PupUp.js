import React from "react";
import { connect } from "react-redux";
import "./pop-up.css";

function PopUp(props) {
  function removePopUp() {
    setTimeout(() => {
      let popUp = document.querySelector(".pop-up");
      popUp.classList.remove("error");
      popUp.classList.remove("success");
    }, 3000);
  }

  if (props.popup.message) {
    removePopUp();
    return (
      <div className={`pop-up ${props.popup.error ? "error" : "success"} `}>
        {props.popup.message}
      </div>
    );
  }
  return <div className="pop-up"></div>;
}

const mapStateToProps = state => {
  return {
    popup: state.PopUp
  };
};

export default connect(mapStateToProps)(PopUp);
