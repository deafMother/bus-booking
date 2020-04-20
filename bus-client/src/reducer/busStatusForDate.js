// state to keep track of all busses for a given date between route

const initialState = [];

export const bussesForDate = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BUSSES_FORDATE":
      return [...action.data];
    default:
      return state;
  }
};

export const busRoute = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_BUSSES_FORDATE":
      return {
        startAt: action.startAt,
        destination: action.destination,
        date: action.date
      };
    default:
      return state;
  }
};
