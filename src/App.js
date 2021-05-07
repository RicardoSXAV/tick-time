import { Route, Switch } from "react-router";
import Navbar from "./components/Navbar";
import Timer from "./components/Timer";
import Tasks from "./components/Tasks";
import Statistics from "./components/Statistics";

import "./styles/globalStyles.css";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <Timer />} />
        <Route exact path="/tasks" render={() => <Tasks />} />
        <Route exact path="/statistics" render={() => <Statistics />} />
      </Switch>
    </>
  );
}

export default App;
