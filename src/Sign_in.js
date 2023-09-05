import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Style_Sign_in.css";
import Get_IP from "./Get_IP.json";

const Sign_in = () => {
  const history = useHistory();
  const ip = Get_IP.ipAddress;
  const [username, setusername] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [email, setemail] = React.useState("");

  function handleSubmit(event) {
    event.preventDefault();

    axios
      .post(`http://${ip}:8081/sign_in`, { email, username, password })
      .then((response) => {
        if (response.status === 200) {
          history.push({
            pathname: "/Login",
          });
        } else
          alert(
            `this ${response.data.massege} is already registred in the system`
          );
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="page_container">
      <div className="data_container">
        <form className="form_container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="email"
            onChange={(e) => setemail(e.target.value)}
            required
          ></input>

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

          <button>Sing in</button>
        </form>
      </div>
    </div>
  );
};

export default Sign_in;
