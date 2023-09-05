/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Get_IP from "./Get_IP.json";

import "./Style_Weather.css";
import nice from "./background_img/nice.jpg";
import nive_hot from "./background_img/nice_hot.jpg";
import cold from "./background_img/cold.jpg";
import very_hot from "./background_img/very_hot.jpg";

const Weather = () => {
  const history = useHistory();

  const [city, setcity] = React.useState("");
  const [weather, setweather] = React.useState({});
  const [background, setbackground] = React.useState(nice);
  const ip = Get_IP.ipAddress;
  const handleClick = () => {
    axios.post(`http://${ip}:8081/Weather`, { city }).then((response) => {
      if (response.status === 200) {
        setweather(response.data);

        const temp = response.data.main.temp;
        if (temp >= 29) setbackground(very_hot);

        if (temp >= 25 && temp < 29) setbackground(nive_hot);

        if (temp >= 20 && temp < 25) setbackground(nice);

        if (temp < 20) setbackground(cold);
      } else alert("try again");
    });
  };

  return (
    <div
      className="page_container"
      style={{ backgroundImage: `url(${background}) ` }}
    >
      <div className="all_page_cover">
        <h1>Search the weather across the world</h1>
        <div className="weather_data">
          <div className="search">
            <input
              type="text"
              placeholder="search city"
              onChange={(e) => setcity(e.target.value)}
              required
            ></input>
            <button onClick={handleClick}>search</button>
          </div>
          {weather.name !== undefined && (
            <div>
              <p>
                Weather in the city {weather.name} is described as{" "}
                {weather.weather[0].description}.
              </p>
              <p>The current tempature is {weather.main.temp}</p>
              <p>
                The current feels like tempature is {weather.main.feels_like}
              </p>
            </div>
          )}
        </div>

        <div className="register">
          Did you know you can sign up to our special program and get weather
          information of your choise in live time?
          <span
            className="register_link"
            onClick={() => {
              history.push({
                pathname: "/Login",
              });
            }}
          >
            click here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
