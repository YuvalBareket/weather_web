const express = require("express");
const mysql = require("mysql");
const corn = require("node-cron");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aa1234567",
  database: "login",
});

const api = {
  key: "5cfd1c0e45de28a68f316dd6eb88bc65",
  base: "https://api.openweathermap.org/data/2.5/",
};

const sendemail = async (recipent, temp, above) => {
  try {
    let txt = "";
    if (above === 0) txt = `the tempature is below ${temp}`;
    else txt = `the tempature is above ${temp}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "web022061@gmail.com",
        pass: "wjbyirivzqyjgpaw",
      },
    });
    const mailOptions = {
      from: "web022061@gmail.com",
      to: recipent,
      subject: "Temperature",
      text: txt,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("email sent", info.response);
  } catch (error) {
    console.error(error);
  }
};
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM login_data WHERE username ='${username}' AND password='${password}'`;

  db.query(sql, (err, data) => {
    if (err || data.length === 0) return res.status(201).json("login faild");
    if (data.length > 0) res.status(200).json(data[0]);
  });
});
app.post("/sign_in", (req, res) => {
  const { email, username, password } = req.body;
  const sql_select_username = `SELECT * FROM login_data WHERE username ='${username}'`;
  const sql_select_email = `SELECT * FROM login_data WHERE email ='${email}'`;
  let alert = "";
  db.query(sql_select_email, (err, data) => {
    if (err) console.log(err);
    else if (data.length > 0) {
      res.status(201).json({ massege: "email" });
      return;
    }
    db.query(sql_select_username, (err, data) => {
      if (err) console.log(err);
      else if (data.length > 0) {
        res.status(201).json({ massege: "user name" });
        return;
      }
    });

    const sql_insert = `INSERT INTO login_data(email,username,password) values ('${email}','${username}','${password}')`;
    db.query(sql_insert, (err, data) => {
      if (err) console.log(err);
      else {
        res.status(200).json({ sucsess: true });
      }
    });
  });
});

app.post("/Weather", async (req, res) => {
  try {
    const { city } = req.body;
    const weatherData = await getWeather(city);
    res.status(200).json(weatherData);
  } catch (err) {
    res.json(201);
    console.log(err);
  }
});
app.post("/Weather_Register", (req, res) => {
  const { user_id } = req.body;
  const sql = `SELECT * FROM weather_subscribe WHERE user_id =${user_id}`;

  db.query(sql, (err, data) => {
    if (err) return res.status(201).json("login faild");
    if (data.length > 0) res.status(200).json(data);
  });
});

app.post("/Weather_Register/Delete", (req, res) => {
  const { component_id } = req.body;
  const sql = `DELETE FROM weather_subscribe WHERE id ='${component_id}'`;

  db.query(sql, (err, data) => {
    if (err) return res.status(201).json("delet faild");
    else res.status(200).json(data);
  });
});

app.post("/Weather_Register/Subscribe", (req, res) => {
  const { city, temp, above, user_id, is_added, id } = req.body;
  let userid = parseFloat(user_id);
  let sql_insert;
  if (is_added)
    sql_insert = `UPDATE weather_subscribe SET city='${city}',temp= ${parseFloat(
      temp
    )}, is_above=${above ? 1 : 0} WHERE id='${id}'`;
  else
    sql_insert = `INSERT INTO weather_subscribe(id,user_id,city,temp,is_above) values ('${id}',${parseFloat(
      userid
    )},'${city}',${parseFloat(temp)},${above ? 1 : 0} )`;

  db.query(sql_insert, (err, data) => {
    if (err) return res.status(201).json("login faild");
    else {
      console.log("insert succses");
      res.status(200).json({ sucsess: true });
    }
  });
});

const getWeather = async (city) => {
  const url = `${api.base}weather?q=${city}&units=metric&appid=${api.key}`;
  const response = await axios.get(url);
  const weatherData = response.data;
  return weatherData;
};

const fetchWeather = async (id, email, city, temp, above, is_email_send) => {
  try {
    const weatherData = await getWeather(city);
    const feels_like = parseFloat(weatherData.main.feels_like);
    const sql_sent_email = `UPDATE weather_subscribe SET is_email_send=${1} WHERE id='${id}'`;
    const sql_email_wasnt_sent = `UPDATE weather_subscribe SET is_email_send=${0} WHERE id='${id}'`;
    if (above === 0) {
      ///that means we need to check if current_temp is below our temp
      if (is_email_send === 0 && feels_like < temp) {
        await sendemail(email, temp, above);
        db.query(sql_sent_email, (err, data) => {
          if (err) console.log(err);
        });
      } else if (is_email_send === 1) {
        db.query(sql_email_wasnt_sent, (err, data) => {
          if (err) console.log(err);
        });
      }
    } else {
      ///that means we need to check if current_temp is above our temp
      if (is_email_send === 0 && temp < feels_like) {
        await sendemail(email, temp, above);
        db.query(sql_sent_email, (err, data) => {
          if (err) console.log(err);
        });
      } else if (is_email_send === 1) {
        db.query(sql_sent_email, (err, data) => {
          if (err) console.log(err);
        });
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
corn.schedule("0 * * * * ", async () => {
  let email = "";
  const sql_get_all_data = `SELECT * FROM weather_subscribe`;
  db.query(sql_get_all_data, (err, data) => {
    if (err) return res.status(201).json("login faild");
    else {
      for (let i = 0; i < data.length; i++) {
        let user_id = parseFloat(data[i].user_id);
        let id = data[i].id;
        const sql_get_user_email = `SELECT * FROM login_data WHERE id=${user_id}`;
        db.query(sql_get_user_email, (err, user_data) => {
          if (err) return res.status(201).json("login faild");
          else {
            email = user_data[0].email;
            const weatherData = fetchWeather(
              id,
              email,
              data[i].city,
              data[i].temp,
              data[i].is_above,
              data[i].is_email_send
            );
          }
        });
      }
    }
  });
});

app.listen(8081, "0.0.0.0", () => {
  console.log("listening");
});
