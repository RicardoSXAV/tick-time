import { useRef, useState } from "react";
import "../styles/timer.css";

function Timer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const increment = useRef(null);

  function start() {
    increment.current = setInterval(() => setTime((time) => time + 1), 1000);
    setIsActive(true);
  }

  function pause() {
    clearInterval(increment.current);
    setIsActive(false);
  }

  function restart() {
    clearInterval(increment.current);
    setTime(0);
    setIsActive(false);
  }

  function addTime() {
    setShowPopup(false);
  }

  function renderPopup() {
    pause();
    setShowPopup(true);
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
        className="Timer-popup"
        style={showPopup ? { display: "block" } : { display: "none" }}
      >
        <p>Time added to the TASK NAME</p>
        <button className="btn-popup-confirm" onClick={addTime}>
          OK
        </button>
        <button
          className="btn-popup-cancel"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
      </div>
      <div
        className="Timer"
        style={showPopup ? { filter: "opacity(0.5)" } : {}}
      >
        <h2>Selected Task</h2>
        <div className="Timer-time">
          <span className="circle">
            <i className="fas fa-stopwatch" />
          </span>

          {formatTime(time)}
        </div>
        <div className="divider" />
        {isActive ? (
          <button className="btn pause" onClick={pause}>
            Pause
          </button>
        ) : (
          <button className="btn start" onClick={start}>
            Start
          </button>
        )}

        <button className="btn restart" onClick={restart}>
          Restart
        </button>
        <br />
        <button className="btn addTime" onClick={renderPopup}>
          Add Time <i className="fas fa-play-circle" />
        </button>
      </div>
    </>
  );
}

export default Timer;
