import { Route, Switch } from "react-router";
import Navbar from "./components/Navbar";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import Statistics from "./components/Statistics";

import "./styles/globalStyles.css";
import { useState } from "react";
import useStickyState from "./hooks/useStickyState";

function App() {
  /*   const [taskList, setTaskList] = useStickyState([], "taskList"); */
  const [toggledTask, setToggledTask] = useStickyState("", "toggledTask");

  const [timeToAdd, setTimeToAdd] = useState(0);
  const [totalTime, setTotalTime] = useStickyState(0, "totalTime");
  const [haveTimeToAdd, setHaveTimeToAdd] = useState(false);

  function getTask(name) {
    setToggledTask(name);
  }

  /*   function getTaskList(list) {
    setTaskList(list);
  } */

  function getTime(time) {
    setHaveTimeToAdd(true);
    setTimeToAdd(time);
    setTotalTime(totalTime + time);
  }

  function sortTasks() {
    const taskListString = localStorage.getItem("tasks");
    const taskList = JSON.parse(taskListString);

    if (taskList?.length > 0) {
      const sortedArray = taskList.sort((a, b) =>
        a.totalTime > b.totalTime ? -1 : 1
      );

      return sortedArray;
    }

    /*   if (taskList && taskList.length > 0) {
      const newArray = taskList.sort((a, b) =>
        a.totalTime > b.totalTime ? 1 : -1
      );

      console.log(newArray);
    } */
  }

  return (
    <>
      <Navbar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Timer getTime={getTime} toggledTask={toggledTask} />}
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
        <Route
          exact
          path="/statistics"
          render={() => (
            <Statistics sortTasks={sortTasks} totalTime={totalTime} />
          )}
        />
      </Switch>
    </>
  );
}

export default App;
