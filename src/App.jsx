import "./App.css";
import DistrictCards from "./DistrictCards";

// Main App component
function App() {
  return (
    <>
      <header className="App-header">
        <h1>
          Civ 6 Helper
        </h1>
      </header>
      {/* Render the DistrictCards component below the header */}
      <DistrictCards />
    </>
  );
}

export default App;
