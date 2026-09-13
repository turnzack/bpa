import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <main>
      <h1>App</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </main>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/saved">Go to Saved</Link>
    </div>
  );
}

function Saved() {
  return (
    <div>
      <h2>Saved Page</h2>
      <p data-testid="status">You are on saved page</p>
    </div>
  );
}
