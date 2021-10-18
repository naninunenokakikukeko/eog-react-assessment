export default function (handlers, initialState) {
  return function (state, action) {
    void 0 === state && (state = initialState);
    var reducer = handlers[action.type];
    return reducer ? reducer(state, action) : state;
  };
}
