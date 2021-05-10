import React from "react";
import "../styles/task.css";

function Task({
  id,
  name,
  isSelected,
  isCompleted,
  remove,
  toggleOne,
  renderWindow,
}) {
  return (
    <div
      className={`Task ${isSelected && "Task-active"} ${
        isCompleted && "Task-completed"
      }`}
    >
      <div
        className={`Task-text ${isSelected && "Task-text-active"}`}
        onClick={() => renderWindow(id)}
      >
        {name}
      </div>

      {isCompleted === false &&
        (isSelected ? (
          <i
            className="Task-toggle fas fa-toggle-on"
            onClick={() => toggleOne(id, name, isSelected)}
          />
        ) : (
          <i
            className="Task-toggle fas fa-toggle-off"
            onClick={() => toggleOne(id, name, isSelected)}
          />
        ))}
      <i className="fas fa-times-circle" onClick={() => remove(id)} />
    </div>
  );
}

export default Task;
