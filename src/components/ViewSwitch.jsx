import { ACTIONS } from "../App";

export default function Dropdown( {dispatch, mode} ) {
  function handleDay() {
    if (mode === "day") return;
    dispatch({ type: ACTIONS.RESET_IS_LOADED });
    dispatch({ type: ACTIONS.SET_MODE, payload: "day" });
  }
  function handleWeek() {
    if (mode === "week") return;
    dispatch({ type: ACTIONS.RESET_IS_LOADED });
    dispatch({ type: ACTIONS.SET_MODE, payload: "week" });
  }
  function handleDetailed() {
    if (mode === "detailed") return;
    dispatch({ type: ACTIONS.RESET_IS_LOADED });
    dispatch({ type: ACTIONS.SET_MODE, payload: "detailed" });
  }
  return (
    <div className="dropdown-container">
      <button>View</button>
      <div>
        <div onClick={handleDay}>Day</div>
        <div onClick={handleWeek}>Week</div>
        <div onClick={handleDetailed}>Detailed</div>
      </div>
    </div>
  );
}