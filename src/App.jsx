import "./App.css";
import DistrictCards from "./DistrictCards";
import TreeCarousel from "./TreeCarousel";
import EraTrackerContainer from "./EraTrackerContainer";

// Main App component
function App() {
  return (
    <>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      {/* Render the DistrictCards component above the carousels */}
      <DistrictCards />
      {/* Render two TreeCarousels below the tracker */}
      <TreeCarousel />
      <TreeCarousel />
      {/* Render EraTrackerContainer below the District Cards */}
      <EraTrackerContainer />
    </>
  );
}

export default App;
