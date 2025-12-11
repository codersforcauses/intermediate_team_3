const Timer = (timeRemaining: number) => {
  const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor((time / (60 * 60)) % 24);

    return (
      <div className="countdown-display">
        <div className="countdown-value">
          {hours.toString().padStart(2, "0")}
          <span>:</span>
          {minutes.toString().padStart(2, "0")}
          <span>:</span>
          {seconds.toString().padStart(2, "0")}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-full bg-indigo-400 p-3 px-8">
      {formatTime(timeRemaining)}
    </div>
  );
};

export default Timer;
