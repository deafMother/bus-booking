import React from "react";
import { connect } from "react-redux";
import RenderMap from "./RenderMap";
import "./map.css";

const MapContainer = props => {
  if (!props.route) {
    return <div></div>;
  } else {
    return (
      <div className="map-container">
        <RenderMap coordinates={props.coordinates} />
      </div>
    );
  }
};

const mapStateToProps = state => {
  if (state.busRoute.startAt && state.busRoute.destination) {
    return {
      route: [state.busRoute.startAt, state.busRoute.destination],
      coordinates: state.coordinates
    };
  } else {
    return {
      route: null
    };
  }
};

export default connect(mapStateToProps)(MapContainer);
