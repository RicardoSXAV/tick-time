import React, { useEffect, useState } from "react";
import useStickyState from "../hooks/useStickyState";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";

function TaskList({
  timeToAdd,
  setTimeToAdd,
  haveTimeToAdd,
  setHaveTimeToAdd,
  toggleTask,
}) {
  const [inputTask, setInputTask] = useState("");
  const [inputSubTask, setInputSubTask] = useState("");
  const [tasks, setTasks] = useStickyState([], "tasks");

  const [showWindow, setShowWindow] = useState(false);
  const [alert, setAlert] = useState("");
  const [selectedTask, setSelectedTask] = useState({});

  useEffect(() => {
    if (haveTimeToAdd) {
      const filteredTasks = tasks.filter((task) => task.isSelected === false);
      const taskToAdd = tasks.find((task) => task.isSelected === true);
      taskToAdd.totalTime = taskToAdd.totalTime + timeToAdd;

      setTasks([taskToAdd, ...filteredTasks]);
      setHaveTimeToAdd(false);
      setTimeToAdd(0);
    }
  });

  /*  function useStickyState(defaultValue, key) {
    const [value, setValue] = useState(() => {
      const stickyValue = window.localStorage.getItem(key);

      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });

    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
  } */

  function renderWindow(id) {
    window.scrollTo(0, 0);
    const selected = tasks.find((task) => task.id === id);
    setSelectedTask(selected);
    setShowWindow(true);
  }

  function renderTaskList() {
    const not_completed = tasks
      .filter((task) => task.isCompleted === false)
      .map((task) => (
        <Task
          key={task.id}
          id={task.id}
          name={task.taskName}
          isSelected={task.isSelected}
          isCompleted={task.isCompleted}
          toggleOne={toggleOne}
          remove={removeTask}
          renderWindow={renderWindow}
        />
      ));

    return not_completed;
  }

  function renderCompletedTasks() {
    const completed = tasks
      .filter((task) => task.isCompleted === true)
      .map((task) => (
        <Task
          key={task.id}
          id={task.id}
          name={task.taskName}
          isSelected={task.isSelected}
          isCompleted={task.isCompleted}
          toggleOne={toggleOne}
          remove={removeTask}
          renderWindow={renderWindow}
        />
      ));

    return completed;
  }

  function completeTask() {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    selectedTask.isSelected = false;
    selectedTask.isCompleted = true;
    setTasks([selectedTask, ...filteredTasks]);
    setShowWindow(false);
    toggleTask("");
  }

  function undoComplete() {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    selectedTask.isCompleted = false;
    setTasks([selectedTask, ...filteredTasks]);
    setShowWindow(false);
  }

  /*  function addTimeToTask() {
    const filteredTasks = tasks.filter((task) => task.isSelected === false);
    const taskToAdd = tasks.find((task) => task.isSelected === true);
    taskToAdd.totalTime = taskToAdd.totalTime + timeToAdd;

    setTasks([taskToAdd, ...filteredTasks]);
  } */

  function addTask(name) {
    if (inputTask.length === 0) {
      setAlert("Please, enter a name");
    } else {
      setTasks([
        {
          id: uuidv4(),
          taskName: name,
          totalTime: 0,
          isSelected: false,
          isCompleted: false,
          subTasks: [],
        },
        ...tasks,
      ]);
    }
  }

  function addSubTask(name) {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    selectedTask.subTasks.unshift({
      id: uuidv4(),
      subTaskName: name,
      isCompleted: false,
    });

    setTasks([selectedTask, ...filteredTasks]);

    /* Old (localStorage wasn't working)
    
    if (inputSubTask.length === 0) {
      setAlert("Please, enter a name");
    } else {
      selectedTask.subTasks.unshift({
        id: uuidv4(),
        subTaskName: name,
        isCompleted: false,
      });
    } */
  }

  function removeTask(id) {
    const thisTask = tasks.find((task) => task.id === id);
    if (thisTask.isSelected || thisTask.isCompleted) {
      toggleTask("");
    }

    setShowWindow(false);
    setSelectedTask({});

    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  }

  function removeSubTask(id) {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    const filteredSubTasks = selectedTask.subTasks.filter(
      (subtask) => subtask.id !== id
    );

    selectedTask.subTasks = filteredSubTasks;

    setTasks([selectedTask, ...filteredTasks]);
  }

  function taskNameChange(event) {
    setInputTask(event.target.value);
  }

  function subTaskNameChange(event) {
    setInputSubTask(event.target.value);
  }

  function submitTask(event) {
    event.preventDefault();
    const taskName = inputTask;
    addTask(taskName);
    setInputTask("");
  }

  function submitSubTask(event) {
    event.preventDefault();
    const subTaskName = inputSubTask;
    addSubTask(subTaskName);
    setInputSubTask("");
  }

  function toggleOne(id, name, isSelected) {
    console.log(isSelected);
    tasks.forEach((task) => {
      if (task.isSelected === true) {
        task.isSelected = false;
      }
    });

    const newObject = tasks.find((task) => task.id === id);
    newObject.isSelected = !isSelected;

    const filtered = tasks.filter((task) => task.id !== id);
    setTasks([newObject, ...filtered]);

    const updateTimer = tasks.forEach((task) => {
      if (task.isSelected === true) {
        return task.taskName;
      }
    });

    toggleTask(updateTimer);
  }

  function toggleCheck(name, id) {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);

    const filtered = selectedTask.subTasks.filter(
      (subtask) => subtask.id !== id
    );

    const newObject = selectedTask.subTasks.find(
      (subtask) => subtask.id === id
    );
    newObject.isCompleted = !newObject.isCompleted;

    selectedTask.subTasks = [...filtered, newObject];
    setTasks([selectedTask, ...filteredTasks]);
  }

  function formatTime(time) {
    const seconds = `${time % 60}`.padStart(2, "0");
    const minutes = `${Math.floor((time / 60) % 60)}`.padStart(2, "0");
    const hours = `${Math.floor(time / 3600)}`.padStart(2, "0");

    if (time >= 3600) {
      return `${hours} : ${minutes} : ${seconds}`;
    } else {
      return `${minutes} : ${seconds}`;
    }
  }

  return (
    <>
      <div
        className="alert-popup"
        style={alert ? { display: "block" } : { display: "none" }}
      >
        {alert}
        <br />
        <button onClick={() => setAlert("")}>OK</button>
      </div>
      <div
        className={`Task-window ${
          selectedTask.isSelected && "window-selected"
        } ${selectedTask.isCompleted && "window-completed"}`}
        style={showWindow ? { display: "block" } : { display: "none" }}
      >
        <i
          className="fas fa-window-close"
          onClick={() => setShowWindow(false)}
        />
        <h1 className={`${selectedTask.isCompleted && "taskName-completed"}`}>
          {selectedTask.taskName}
        </h1>
        <p className="time-info">Total Time</p>
        <h3>{formatTime(selectedTask.totalTime)}</h3>
        <h4>List of Subtasks</h4>

        {selectedTask.isCompleted === false && (
          <form onSubmit={submitSubTask}>
            <input
              className="small-input"
              type="text"
              placeholder="Add Subtask"
              value={inputSubTask}
              onChange={subTaskNameChange}
            />

            <button type="submit" className="submit-new">
              <i className="fas fa-plus-circle" />
            </button>
          </form>
        )}

        <div
          className="subtasksList"
          style={selectedTask.subTasks?.length > 10 ? { overflow: "auto" } : {}}
        >
          {showWindow &&
            selectedTask.subTasks.map((subTask) => (
              <div key={subTask.id} className="single-subtask">
                {subTask.isCompleted ? (
                  <i
                    className="fas fa-check-square"
                    onClick={() => toggleCheck(subTask.subTaskName, subTask.id)}
                  />
                ) : (
                  <i
                    className="far fa-square"
                    onClick={() => toggleCheck(subTask.subTaskName, subTask.id)}
                  />
                )}
                <p
                  key={subTask.id}
                  className={`${
                    subTask.isCompleted ? "completed-task" : "uncompleted-task"
                  }`}
                >
                  {subTask.subTaskName}
                </p>
                <i
                  style={selectedTask.isCompleted ? { display: "none" } : {}}
                  className="fas fa-times-circle"
                  onClick={() => removeSubTask(subTask.id)}
                />
              </div>
            ))}
        </div>
        {selectedTask.isCompleted ? (
          <button className="btn btn-undocomplete" onClick={undoComplete}>
            Undo Completed
          </button>
        ) : (
          <button className="btn btn-complete" onClick={completeTask}>
            Complete Task
          </button>
        )}

        <button
          className="btn btn-remove"
          onClick={() => removeTask(selectedTask.id)}
        >
          Delete Task
        </button>
      </div>

      <div className="Task-list">
        <h1>Task List</h1>
        <form onSubmit={submitTask}>
          <input
            className="task-input"
            type="text"
            placeholder="Add Task"
            value={inputTask}
            onChange={taskNameChange}
          />

          <button type="submit" className="submit-new">
            <i className="fas fa-plus-circle" />
          </button>
        </form>

        {renderTaskList()}

        <div className="divider" />

        <h1 className="completed-h1">Completed Tasks</h1>

        {renderCompletedTasks()}
      </div>
    </>
  );
}

export default TaskList;
