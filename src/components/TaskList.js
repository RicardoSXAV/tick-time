import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Task from "./Task";

function TaskList() {
  const [inputTask, setInputTask] = useState("");
  const [inputSubTask, setInputSubTask] = useState("");
  const [tasks, setTasks] = useState([
    /*     {
      id: 1,
      taskName: "Estudar Javascript",
      totalTime: 3652,
      isCompleted: false,
      isSelected: true,
      subTasks: [{ subTaskName: "Aprender DOM", isCompleted: true }],
    },
    {
      id: 2,
      taskName: "Estudar HTML",
      totalTime: 2458,
      isCompleted: true,
      isSelected: false,
      subTasks: [{ subTaskName: "Ver sobre tabelas", isCompleted: true }],
    }, */
  ]);
  const [showWindow, setShowWindow] = useState(false);
  const [alert, setAlert] = useState("");
  const [selectedTask, setSelectedTask] = useState({});

  function renderWindow(id) {
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
  }

  function undoComplete() {
    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    selectedTask.isCompleted = false;
    setTasks([selectedTask, ...filteredTasks]);
    setShowWindow(false);
  }

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
    if (inputSubTask.length === 0) {
      setAlert("Please, enter a name");
    } else {
      selectedTask.subTasks.unshift({
        id: uuidv4(),
        subTaskName: name,
        isCompleted: false,
      });
    }
  }

  function removeTask(id) {
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

  function toggleOne(id, isSelected) {
    tasks.forEach((task) => {
      if (task.isSelected === true) {
        task.isSelected = false;
      }
    });

    const newObject = tasks.find((task) => task.id === id);
    newObject.isSelected = !isSelected;

    const filtered = tasks.filter((task) => task.id !== id);
    setTasks([newObject, ...filtered]);
  }

  function toggleCheck(id) {
    const filtered = selectedTask.subTasks.filter(
      (subtask) => subtask.id !== id
    );

    const newObject = selectedTask.subTasks.find(
      (subtask) => subtask.id === id
    );
    newObject.isCompleted = !newObject.isCompleted;

    selectedTask.subTasks = [...filtered, newObject];

    const filteredTasks = tasks.filter((task) => task.id !== selectedTask.id);
    setTasks([selectedTask, ...filteredTasks]);
    console.log(selectedTask.subTasks);
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
                    onClick={() => toggleCheck(subTask.id)}
                  />
                ) : (
                  <i
                    className="far fa-square"
                    onClick={() => toggleCheck(subTask.id)}
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

        <h1>Completed Tasks</h1>

        {renderCompletedTasks()}
      </div>
    </>
  );
}

export default TaskList;
