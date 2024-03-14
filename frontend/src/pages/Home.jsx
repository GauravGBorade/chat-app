import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { useEffect } from "react";
export const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    if (userInfo) {
      navigate("/chat");
    }
  }, [navigate]);
  return <SignIn />;
};

export default Home;
