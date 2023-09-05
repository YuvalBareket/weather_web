import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import "./Style_Subscribe.css";
import Get_IP from "./Get_IP.json";

const Subscribe_bar = (props) => {
  const location = useLocation();
  const ip = Get_IP.ipAddress;
  const [city, setcity] = React.useState(props.city);
  const [temp, settemp] = React.useState(props.temp);
  const [above, set_above] = React.useState(props.is_above);
  const [below, set_below] = React.useState(props.is_below);
  const [is_disabled, set_is_disabled] = React.useState(props.is_added);
  const [is_added, set_is_added] = React.useState(props.is_added);

  const user_id = location.state.user_id;
  const id = props.id;

  function handlesubmit(event) {
    event.preventDefault();
    if (is_disabled) {
      set_is_disabled(false);
    } else {
      axios
        .post(`http://${ip}:8081/Weather_Register/Subscribe`, {
          city,
          temp,
          above,
          user_id,
          is_added,
          id,
        })
        .then((response) => {
          if (response.status === 200) {
            if (is_added) alert("Subscribe was saved");
            else alert("Subscribe was added");

            console.log(response);

            set_is_disabled(true);

            set_is_added(true);

            props.onSubscribe_added();
          }
        });
    }
  }

  return (
    <div>
      <div
        className="select_data"
        onClick={() => {
          console.log(props);
        }}
      >
        <form onSubmit={handlesubmit} className="select_data">
          <input
            type="text"
            placeholder="city"
            onChange={(e) => {
              setcity(e.target.value);
            }}
            value={city}
            disabled={is_disabled}
            required
          ></input>
          <label className={below ? "above_or_below" : ""}>
            <input
              type="radio"
              name="range"
              value="below"
              disabled={is_disabled}
              onChange={(e) => {
                set_below(e.target.value === "below");
                set_above(e.target.value === "above");
              }}
            ></input>
            below
          </label>
          <label className={above ? "above_or_below" : ""}>
            <input
              type="radio"
              name="range"
              value="above"
              disabled={is_disabled}
              onChange={(e) => {
                set_above(e.target.value === "above");
                set_below(e.target.value === "below");
              }}
            ></input>
            above
          </label>
          <input
            type="text"
            placeholder="temp"
            onChange={(e) => {
              settemp(e.target.value);
            }}
            value={temp}
            disabled={is_disabled}
            required
          ></input>
          <button>{is_disabled ? "edit" : is_added ? "save" : "add"}</button>
        </form>
        <button onClick={() => props.onDelete(props.id)}>delete </button>
      </div>
      <div></div>
    </div>
  );
};

export default Subscribe_bar;
