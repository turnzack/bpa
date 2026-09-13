import { useState, useEffect } from "react";

export default function App() {
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    setIsError(true);
  }, []);

  if (isError) {
    throw new Error("TEST_RENDER_ERROR");
  }

  return <div>Jamais atteint</div>;
}
