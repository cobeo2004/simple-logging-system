import { useState } from "react";
import { Logger } from "experimental-logging-client";

function Card() {
  const [count, setCount] = useState(0);
  const logger = new Logger({
    apiUrl: "http://localhost:4000/logs",
    apiKey: "this-is-a-secret-key",
    source: "logger-client",
  });
  const handleClick = () => {
    logger.info("Button clicked", { count });
    console.log(logger.getQueueLogs());
    setCount((count) => count + 1);
  };
  return (
    <div className="card">
      <button onClick={handleClick}>count is {count}</button>
    </div>
  );
}

export default Card;
