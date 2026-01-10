const Timer = (timeRemaining: number) => {
  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor(time / (60 * 60));

    return (
      <div className="countdown-display">
        <div className="countdown-value">
          {hours > 0 ? (
            <>
              {hours.toString()}
              <span>:</span>
            </>
          ) : (
            <></>
          )}
          {minutes.toString().padStart(2, "0")}
          <span>:</span>
          {seconds.toString().padStart(2, "0")}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full rounded-full bg-indigo-600 p-3 px-8 font-inter text-xl font-semibold">
      {formatTime(timeRemaining)}
    </div>
  );
};

export default Timer;
