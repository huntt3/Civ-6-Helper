import "./App.css";
import DistrictCards from "./DistrictCards";
import TreeCarousel from "./TreeCarousel";

// Main App component
function App() {
  return (
    <>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      {/* Render the DistrictCards component above the carousels */}
      <DistrictCards />
      {/* Render two TreeCarousels below the District Cards */}
      <TreeCarousel />
      <TreeCarousel />
    </>
  );
}

export default App;
