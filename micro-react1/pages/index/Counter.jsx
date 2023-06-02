import { useState } from "react";

export { Counter };

function Counter() {
  const [count, setCount] = useState(15);
  return (
    <button type="button" onClick={() => setCount((count) => count + 5)}>
      Counter {count}
    </button>
  );
}
