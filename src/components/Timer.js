import { useEffect } from "react";

function Timer({ secRemaining, dispatch }) {
  const mins = String(Math.floor(secRemaining / 60)).padStart(2, 0);
  const secs = String(secRemaining % 60).padStart(2, 0);

  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins}:{secs}
    </div>
  );
}

export default Timer;
