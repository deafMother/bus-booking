let initialState = {};

export const bookBusSeats = (state = initialState, action) => {
  switch (action.type) {
    case "BOOK_BUS_SEATS":
      return { ...action.data };
    default:
      return state;
  }
};

export const PopUp = (state = initialState, action) => {
  switch (action.type) {
    case "POPUP":
      return {
        ...action
      };
    default:
      return {};
  }
};
