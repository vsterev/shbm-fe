import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";

const Logout = () => {
  const { setUser } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    document.cookie =
      "hbs-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setUser(undefined);
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
export default Logout;
