import "./App.css";
import DistrictCards from "./DistrictDiscountingTool/DistrictCards";

import EraTrackerContainer from "./EraScoreTracker/EraTrackerContainer";
import WondersContainer from "./WonderTracker/WondersContainer";
import TechCarousel from "./TechTree/TechCarousel";
import CivicCarousel from "./CivicTree/CivicCarousel";
import GreatPeopleContainer from "./GreatPeopleTracker/GreatPeopleContainer";

// Main App component
function App() {
  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      <DistrictCards />
      <TechCarousel />
      <CivicCarousel />
      <EraTrackerContainer />
      <WondersContainer />
      <GreatPeopleContainer />
    </main>
  );
}

export default App;
