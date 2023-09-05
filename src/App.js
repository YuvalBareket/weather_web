import "./App.css";
import Login from "./Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Weather from "./Weather";
import Weather_Register from "./Weather_Register";
import Sign_in from "./Sign_in";
function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Weather></Weather>
          </Route>
          <Route exact path="/Sign_in">
            <Sign_in></Sign_in>
          </Route>
          <Route path="/Login">
            <Login></Login>
          </Route>
          <Route path="/Weather_Register">
            <Weather_Register></Weather_Register>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
