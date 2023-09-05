import React, { useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import "./Style_Weather_Register.css";
import Subscribe_bar from "./Subscribe_bar";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Get_IP from "./Get_IP.json";

const Weather_Register = () => {
  const history = useHistory();
  const ip = Get_IP.ipAddress;
  const location = useLocation();

  const user_id = parseFloat(location.state.user_id);

  const user_name = location.state.user_name;
  const [arr, setarr] = React.useState([]);
  const [is_last_added, set_is_last_added] = React.useState(true);

  useEffect(() => {
    axios
      .post(`http://${ip}:8081/Weather_Register`, { user_id })
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          setarr(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubscribe_added = () => {
    set_is_last_added(true);
  };

  function handleclick() {
    if (is_last_added) {
      setarr([...arr, { id: `${user_id}-${arr.length + 1}` }]);

      set_is_last_added(false);
    } else
      alert(
        "you must add the previous request before adding another one to the screen"
      );
  }

  function handleDelete(component_id) {
    axios
      .post("http://localhost:8081/Weather_Register/Delete", { component_id })
      .then((response) => {
        if (response.status === 200) {
          console.log("delete succese");
          let newarray = [];
          arr.map((item) => {
            console.log(item);
            if (component_id !== item.id) newarray.push(item);
          });
          setarr(newarray);
          alert("subscribe is canceled");
        } else {
          alert("Delete failed, try again");
        }
      });
  }

  const handleBackPrass = (event) => {
    if (event.type === "popstate") history.push("/");
  };

  window.addEventListener("popstate", handleBackPrass);

  return (
    <div className="page_container">
      <div className="allpage">
        <h2>
          Hello {user_name}, here you can select cities that you would like our
          web to track thier tampature for you, and to let you know when the
          tampature is below or above your preferences.
        </h2>
        <button className="add_city" onClick={handleclick}>
          add new city
        </button>

        <div className="subscribe_container">
          {arr.map((item, index) => {
            return (
              <Subscribe_bar
                id={item.city !== undefined ? `${item.id}` : item.id}
                key={item.city !== undefined ? `${item.id}` : item.id}
                city={item.city}
                temp={item.temp}
                is_above={item.is_above !== 0}
                is_email_send={item.is_email_send !== 0}
                is_below={item.is_above === 0}
                onSubscribe_added={handleSubscribe_added}
                is_added={item.city !== undefined}
                count={arr.length}
                onDelete={handleDelete}
              ></Subscribe_bar>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Weather_Register;
