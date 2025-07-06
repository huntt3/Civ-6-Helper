import "./App.css";
import DistrictCards from "./DistrictCards";

import EraTrackerContainer from "./EraTrackerContainer";
import WondersContainer from "./WondersContainer";
import TechCarousel from "./Tech";
import GreatPeopleContainer from "./GreatPeopleContainer";

// Main App component
function App() {
  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      <DistrictCards />
      <TechCarousel />
      <EraTrackerContainer />
      <WondersContainer />
      <GreatPeopleContainer />
    </main>
  );
}

export default App;
