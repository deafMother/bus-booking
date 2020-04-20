const initialState = {};

export const fetchGeoCode = (state = initialState, action) => {
  switch (action.type) {
    case "GEOCODE":
      const source = action.source;
      console.log(source);
      let newCoordinates = {
        [source]: action.coordinates
      };
      return { ...state, ...newCoordinates };
    default:
      return state;
  }
};
