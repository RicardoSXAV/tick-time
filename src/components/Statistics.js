import "../styles/statistics.css";

function Statistics({ totalTime, sortTasks }) {
  const sortedTasks = sortTasks();

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
    <div className="Statistics">
      <h1>General Statistics</h1>
      <div className="Statistics-totalTime">
        <i className="fas fa-hourglass-start" />
        <p>
          You have spent a total of {formatTime(totalTime)}{" "}
          {totalTime < 60
            ? "seconds"
            : totalTime > 60 && totalTime < 3600
            ? "minutes"
            : totalTime > 3600
            ? "hours"
            : ""}{" "}
          doing tasks!
        </p>
      </div>
      <div
        className="Statistics-sortingTasks"
        style={sortedTasks ? {} : { display: "none" }}
      >
        <h2>Sorting tasks by time</h2>
        {sortedTasks?.map((task, index) => {
          return (
            <div className="single-sorted-task">
              <div className="number-circle">
                <p
                  className={
                    index < 9
                      ? "number"
                      : index >= 9 && index < 99
                      ? "number-2d"
                      : "number-3d"
                  }
                >
                  {index + 1}
                </p>
              </div>
              <p>{task.taskName}</p>
              <h3>{formatTime(task.totalTime)}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Statistics;
