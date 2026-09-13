import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Counter</h1>
      <button>Increment</button>
      <p data-testid="count-value">{count}</p>
    </main>
  );
}
