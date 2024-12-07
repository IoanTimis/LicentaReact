import axios from "axios";

const logout = async () => {
  try {
    await axios.get("http://localhost:8080/logout", { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Eroare la logout:", error);
    return false;
  }
};

export default logout;
