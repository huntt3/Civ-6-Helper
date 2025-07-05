import "./App.css";
import DistrictCards from "./DistrictCards";
import TreeCarousel from "./TreeCarousel";
import EraTrackerContainer from "./EraTrackerContainer";
import WondersContainer from "./WondersContainer";
import TechCarousel from "./Tech";

// Main App component
function App() {
  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      {/* Render the DistrictCards component above the carousels */}
      <DistrictCards />
      {/* Render TechCarousel below DistrictCards */}
      <TechCarousel />
      {/* Render EraTrackerContainer below the District Cards */}
      <EraTrackerContainer />
      {/* Render WondersContainer at the bottom */}
      <WondersContainer />
    </main>
  );
}

export default App;
