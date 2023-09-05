import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Style_Login.css";
import Get_IP from "./Get_IP.json";

function Login() {
  const history = useHistory();
  const ip = Get_IP.ipAddress;
  const [username, setusername] = React.useState("");
  const [password, setpassword] = React.useState("");
  function handleSubmit(event) {
    event.preventDefault();

    axios
      .post(`http://${ip}:8081/login`, { username, password })
      .then((response) => {
        if (response.status === 200) {
          const userdata = {
            user_id: ` ${response.data.id} `,
            user_name: response.data.username,
          };
          history.push({
            pathname: "/Weather_Register",
            state: userdata,
          });
        } else alert("user is wrong");
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="page_container">
      <div className="data_container">
        <form onSubmit={handleSubmit} className="form_container">
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setusername(e.target.value)}
            required
          ></input>

          <input
            type="password"
            placeholder="password"
            onChange={(e) => setpassword(e.target.value)}
            required
          ></input>

          <button>Login</button>
        </form>
        <div className="sign_in">
          Dont have an acount?{" "}
          <span
            className="sign_in_link"
            onClick={() => {
              history.push({
                pathname: "/Sign_in",
              });
            }}
          >
            click here
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
