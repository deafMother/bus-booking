import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

export default function RenderMap(props) {
  let coordinates = props.coordinates;
  coordinates = Object.values(coordinates);
  console.log(coordinates);
  const [viewport, setViewPort] = useState({
    latitude: 27.329046,
    longitude: 88.6122673,
    width: "100%",
    height: "100%",
    zoom: 10
  });

  const [selectedPark, setSelectedPark] = useState(null);

  return (
    <div className="map-container">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={viewport => {
          setViewPort(viewport);
        }}
        mapStyle="mapbox://styles/sarovar123456/ck2x8q6si2b6l1cp5q2r43yhd"
      >
        {coordinates.map((source, index) => (
          <Popup
            key={index}
            latitude={source.lat}
            longitude={source.lng}
            // onClose={() => this.setState({showPopup: false})}
            anchor="top"
          >
            <div className="bus-img-box">
              <img src="/bus.svg" alt="skatboarding" />
            </div>
          </Popup>
        ))}
      </ReactMapGL>
    </div>
  );
}
