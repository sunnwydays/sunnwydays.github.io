import { ACTIONS } from "../actions";

// was a hover dropdown, which is awkward on phones; now three buttons that are always visible
const MODES = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "detailed", label: "Detailed" }
]

export default function ViewSwitch({ dispatch, mode }) {
  return (
    <div className="view-switch" role="group" aria-label="View">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          className={mode === value ? "active" : null}
          aria-pressed={mode === value}
          onClick={() => dispatch({ type: ACTIONS.SET_MODE, payload: value })}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
