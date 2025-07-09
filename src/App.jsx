import "./App.css";
import EraTrackerContainer from "./EraScoreTracker/EraTrackerContainer";
import WondersContainer from "./WonderTracker/WondersContainer";
import TechTreeContainer from "./TechTree/TechTreeContainer";
import DistrictDiscountingContainer from "./DistrictDiscountingTool/DistrictDiscountingContainer";
import GreatPeopleContainer from "./GreatPeopleTracker/GreatPeopleContainer";
import Footer from "./Footer/Footer";

// Main App component
function App() {
  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      <TechTreeContainer />
      <DistrictDiscountingContainer />
      <WondersContainer />
      <GreatPeopleContainer />
      <EraTrackerContainer />
      <Footer />
    </main>
  );
}

export default App;
