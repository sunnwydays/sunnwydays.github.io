export default function ErrorMessage({ error }) {
    return (
        <div className="error-message">
            ERROR: {error}.<br/>
            Check spelling and special characters.<br/>
            Also try being more specific for cities with same name<br/>
            (e.g. "London, Canada" instead of "London").<br/>
            2 character input only returns exact location.
        </div>
    )
}