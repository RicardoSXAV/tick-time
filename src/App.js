import { Route, Switch } from "react-router";
import Navbar from "./components/Navbar";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import Statistics from "./components/Statistics";

import "./styles/globalStyles.css";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <Timer />} />
        <Route exact path="/tasks" render={() => <TaskList />} />
        <Route exact path="/statistics" render={() => <Statistics />} />
      </Switch>
    </>
  );
}

export default App;
