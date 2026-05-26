import { Loader2 } from "lucide-react"
import "./Spinner.css"

function Spinner() {
    return (
        <div className="spinner-container">
            <Loader2 className="spinner-icon" size={48} />
        </div>
    )
}

export default Spinner