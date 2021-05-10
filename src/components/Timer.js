import { useEffect, useRef, useState } from "react";
import useStickyState from "../hooks/useStickyState";
import "../styles/timer.css";

function Timer({ toggledTask, getTime }) {
  const [time, setTime] = useStickyState(0, "time");
  const [isActive, setIsActive] = useState(false);
  const [isStopwatch, setIsStopwatch] = useStickyState(true, "isStopwatch");
  const [showPopup, setShowPopup] = useState(false);
  const [alert, setAlert] = useState("");

  const [countDownStart, setCountDownStart] = useStickyState(
    false,
    "countDownStart"
  );
  const [countSeconds, setCountSeconds] = useStickyState("", "countSeconds");
  const [countMinutes, setCountMinutes] = useStickyState("", "countMinutes");
  const [countHours, setCountHours] = useStickyState("", "countHours");
  const [countTime, setCountTime] = useStickyState(0, "countTime");
  const [originalCountTime, setOriginalCountTime] = useStickyState(
    0,
    "originalCountTime"
  );

  const increment = useRef(null);
  const decrement = useRef(countTime);

  useEffect(() => {
    if (countTime === 0 && countDownStart === true) {
      clearInterval(decrement.current);

      pause();
      setShowPopup(true);
    }
  });

  function start() {
    if (toggledTask || toggledTask !== "") {
      if (isStopwatch) {
        increment.current = setInterval(
          () => setTime((time) => time + 1),
          1000
        );
        setIsActive(true);
      } else {
        const seconds = formatString(
          `${countHours.padStart(2, "0")}:${countMinutes.padStart(
            2,
            "0"
          )}:${countSeconds.padStart(2, "0")}`
        );

        if (countTime === 0) {
          setCountTime(seconds);
          setOriginalCountTime(seconds);
        }

        decrement.current = setInterval(
          () => setCountTime((time) => time - 1),
          1000
        );

        setIsActive(true);
        setCountDownStart(true);
      }
    } else {
      setAlert("Before start, select a task");
    }
  }

  function pause() {
    clearInterval(increment.current);
    clearInterval(decrement.current);
    setIsActive(false);
  }

  function restart() {
    clearInterval(increment.current);
    clearInterval(decrement.current);
    setTime(0);
    setCountTime(0);
    setCountDownStart(false);
    setIsActive(false);
  }

  function addTime() {
    if (isStopwatch) {
      getTime(time);
      setShowPopup(false);
      setTime(0);
    } else {
      getTime(originalCountTime);
      setShowPopup(false);
      setCountDownStart(false);
    }
  }

  function handleHourChange(event) {
    setCountHours(event.target.value);
  }

  function handleMinuteChange(event) {
    setCountMinutes(event.target.value);
  }

  function handleSecondChange(event) {
    setCountSeconds(event.target.value);
  }

  function renderCountdow() {
    return (
      <form id="count-form" className="count-down-form">
        <input
          value={countHours}
          type="number"
          placeholder="00"
          min="0"
          max="24"
          onChange={handleHourChange}
        />
        :
        <input
          value={countMinutes}
          type="number"
          placeholder="00"
          min="0"
          max="59"
          onChange={handleMinuteChange}
        />
        :
        <input
          value={countSeconds}
          type="number"
          placeholder="00"
          min="0"
          max="59"
          onChange={handleSecondChange}
        />
      </form>
    );
  }

  function renderPopup() {
    if (time === 0 && isStopwatch === true) {
      setAlert("Start the timer before add time");
    } else if (time !== 0 && countTime === 0) {
      pause();
      setShowPopup(true);
    } else if (time === 0 && countTime !== 0) {
      setAlert("Wait the countdown finish before add time");
    } else if (countTime === 0 && countDownStart === true) {
      setAlert("Time added");
    } else if (isStopwatch === false && countDownStart === false) {
      setAlert("Start the countdown before add time");
    }
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

  function formatString(str) {
    var p = str.split(":"),
      s = 0,
      m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return s;
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
        className="Timer-popup"
        style={showPopup ? { display: "block" } : { display: "none" }}
      >
        <p>Time added to '{toggledTask}'</p>
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
        <h2>{toggledTask}</h2>
        <div className="Timer-time">
          <span className="circle" onClick={() => setIsStopwatch(!isStopwatch)}>
            <i
              className={
                isStopwatch ? `fas fa-stopwatch` : "fas fa-stopwatch-20"
              }
            />
          </span>

          {isStopwatch && countDownStart === false ? (
            formatTime(time)
          ) : isStopwatch === false && countDownStart === false ? (
            renderCountdow()
          ) : (
            <div>{formatTime(countTime)}</div>
          )}
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
