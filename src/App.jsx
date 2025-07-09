import "./App.css";
import DistrictCards from "./DistrictDiscountingTool/DistrictCards";

import EraTrackerContainer from "./EraScoreTracker/EraTrackerContainer";
import WondersContainer from "./WonderTracker/WondersContainer";
import TechCarousel from "./TechTree/TechCarousel";
import DistrictDiscountingContainer from "./DistrictDiscountingTool/DistrictDiscountingContainer";
import GreatPeopleContainer from "./GreatPeopleTracker/GreatPeopleContainer";

// Main App component
function App() {
  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      <TechCarousel />
      <DistrictDiscountingContainer />
      <WondersContainer />
      <GreatPeopleContainer />
      <EraTrackerContainer />
    </main>
  );
}

export default App;
