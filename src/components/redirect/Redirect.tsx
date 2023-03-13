import { Navigate } from "react-router-dom";

const Redirect = () => {
  return <Navigate to="/" replace={true} />
}

export default Redirect