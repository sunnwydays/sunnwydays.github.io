import { ACTIONS } from '../actions';

export default function ErrorMessage({ error, dispatch }) {
    return (
        <div className="error-message">
            <button className="error-close" onClick={() => dispatch({ type: ACTIONS.SET_ERROR, payload: null })} aria-label="Dismiss">×</button>
            <strong>{error}.</strong><br />
            Check spelling, or add the province/country for cities with the same name
            (e.g. &quot;London, Canada&quot; instead of &quot;London&quot;).
        </div>
    )
}
