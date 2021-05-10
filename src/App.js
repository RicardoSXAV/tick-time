import { Route, Switch } from "react-router";
import Navbar from "./components/Navbar";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import Statistics from "./components/Statistics";

import "./styles/globalStyles.css";
import { useState } from "react";
import useStickyState from "./hooks/useStickyState";

function App() {
  const [toggledTask, setToggledTask] = useStickyState("", "toggledTask");

  const [timeToAdd, setTimeToAdd] = useState(0);
  const [haveTimeToAdd, setHaveTimeToAdd] = useState(false);

  function getTask(name) {
    setToggledTask(name);
  }

  function getTime(time) {
    setHaveTimeToAdd(true);
    setTimeToAdd(time);
  }

  return (
    <>
      <Navbar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Timer getTime={getTime} taskName={toggledTask} />}
        />
        <Route
          exact
          path="/tasks"
          render={() => (
            <TaskList
              haveTimeToAdd={haveTimeToAdd}
              setHaveTimeToAdd={setHaveTimeToAdd}
              timeToAdd={timeToAdd}
              setTimeToAdd={setTimeToAdd}
              toggleTask={getTask}
            />
          )}
        />
        <Route exact path="/statistics" render={() => <Statistics />} />
      </Switch>
    </>
  );
}

export default App;
