export default function Dropdown(props) {
  function handleDay() {
    if (props.mode === "day") return;
    props.setIsLoaded({});
    props.setMode("day");
  }
  function handleWeek() {
    if (props.mode === "week") return;
    props.setIsLoaded({});
    props.setMode("week");
  }
  function handleDetailed() {
    if (props.mode === "detailed") return;
    props.setIsLoaded({});
    props.setMode("detailed");
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