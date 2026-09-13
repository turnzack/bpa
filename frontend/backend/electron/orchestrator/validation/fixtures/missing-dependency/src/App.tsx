import { z } from "zod";

export default function App() {
  return <div>{z.string().parse("ok")}</div>;
}
