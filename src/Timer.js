import { useEffect, useState } from "react";

function Timer({ dispatch }) {
  const [timer, setTimer] = useState(5 * 60);
  let mintues, seconds;
  mintues = Math.floor(timer / 60)
    .toString()
    .padStart(2, 0);

  seconds = (timer % 60).toString().padStart(2, 0);

  useEffect(
    function () {
      const id = setInterval(() => {
        setTimer((pre) => {
          if (pre < 1) {
            clearInterval(id);
            dispatch({ type: "finish" });
            return 0;
          }
          return pre - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );
  return <div className="timer">{`${mintues}:${seconds}`}</div>;
}

export default Timer;
