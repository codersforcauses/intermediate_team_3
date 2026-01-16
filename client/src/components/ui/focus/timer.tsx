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
    <div className="flex aspect-square w-64 items-center justify-center rounded-full bg-indigo-500 font-inter text-3xl font-semibold">
      {formatTime(timeRemaining)}
    </div>
  );
};

export default Timer;
