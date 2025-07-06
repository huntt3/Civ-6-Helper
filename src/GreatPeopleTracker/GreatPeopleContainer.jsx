import React, { useEffect, useState } from "react";
import "./GreatPeopleContainer.css";
import "./GreatPeopleContainerExtra.css";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// Helper function to get unique people by era and type
// Helper function to get unique people by era and type, with null safety
const getPeopleByEraAndType = (people, era, type) => {
  return people.filter((person) => {
    // Defensive: skip if missing requirement or era
    if (!person || !person.requirement || !person.era) return false;
    // Use loose match for type (case-insensitive, substring)
    return (
      person.era === era &&
      person.requirement.toLowerCase().includes(type.toLowerCase())
    );
  });
};

// Define the order of types and eras
const types = [
  "Great General",
  "Great Admiral",
  "Great Engineer",
  "Great Merchant",
  "Great Scientist",
  "Great Writer",
  "Great Artist",
  "Great Musician",
];

const eras = [
  "Classical",
  "Medieval",
  "Renaissance",
  "Industrial",
  "Modern",
  "Atomic",
  "Information",
];

const GreatPeopleContainer = () => {
  const [greatPeople, setGreatPeople] = useState([]);
  const [error, setError] = useState("");
  // Track which eras are collapsed
  const [collapsedEras, setCollapsedEras] = useState({});
  // Track which cards are checked (by name)
  const [checkedCards, setCheckedCards] = useState(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem("greatPeopleChecked");
    return saved ? JSON.parse(saved) : {};
  });
  // Collapsed state for the whole container
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Fetch the GreatPeople.json file
    fetch("/jsonFiles/GreatPeople.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load Great People data.");
        }
        return response.json();
      })
      .then((data) => {
        setGreatPeople(data.GreatPeople);
      })
      .catch((err) => {
        setError(
          "Sorry, we couldn't load the Great People data. Please try again later."
        );
      });
  }, []);

  // Save checkedCards to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("greatPeopleChecked", JSON.stringify(checkedCards));
  }, [checkedCards]);

  // Toggle collapse for an era
  const handleCollapse = (era) => {
    setCollapsedEras((prev) => ({ ...prev, [era]: !prev[era] }));
  };

  // Toggle card checked state by clicking the card
  const handleCardClick = (name) => {
    setCheckedCards((prev) => {
      const updated = { ...prev, [name]: !prev[name] };
      return updated;
    });
  };

  // Reset all checked cards
  const handleRefresh = () => {
    setCheckedCards({});
  };

  // Collapse/expand handler for the whole container
  const handleCollapseContainer = () => setCollapsed((prev) => !prev);

  return (
    <CollapsibleContainer
      title="Great People"
      className="great-people-container"
      collapsed={collapsed}
      onCollapse={handleCollapseContainer}
      onRefresh={handleRefresh}
    >
      {error && <p className="error-message">{error}</p>}
      <div
        className="great-people-grid"
        role="table"
        aria-label="Great People Table"
      >
        {/* Table header */}
        <div className="header-row" role="row">
          {types.map((type) => (
            <div key={type} className="header-cell" role="columnheader">
              {type}
            </div>
          ))}
        </div>
        {/* Table body */}
        {eras.map((era) => (
          <React.Fragment key={era}>
            {/* Row label and collapse button */}
            <div className="era-label" aria-label={`Row for ${era} era`}>
              <button
                className="collapse-btn"
                aria-expanded={!collapsedEras[era]}
                aria-controls={`era-row-${era}`}
                onClick={() => handleCollapse(era)}
              >
                {collapsedEras[era] ? "Show" : "Hide"}
              </button>
              <span>{era}</span>
            </div>
            {/* Collapsible row */}
            {!collapsedEras[era] && (
              <div className="era-row" role="row" id={`era-row-${era}`}>
                {types.map((type) => {
                  const people = getPeopleByEraAndType(greatPeople, era, type);
                  return (
                    <div key={type} className="cell" role="cell">
                      {people.length > 0 ? (
                        people.map((person) => (
                          <article
                            key={person.name}
                            className={`great-person-card${
                              checkedCards[person.name] ? " selected" : ""
                            }`}
                            tabIndex={0}
                            aria-label={`${person.name}, ${person.ability}`}
                            role="button"
                            aria-pressed={!!checkedCards[person.name]}
                            onClick={() => handleCardClick(person.name)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleCardClick(person.name);
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <span style={{ fontWeight: "bold" }}>
                              {person.name}
                            </span>
                            <p>{person.ability}</p>
                            {person.charges && (
                              <p>
                                <strong>Charges:</strong> {person.charges}
                              </p>
                            )}
                          </article>
                        ))
                      ) : (
                        <div
                          className="empty-cell"
                          aria-label="No Great Person"
                        >
                          -
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleContainer>
  );
};

export default GreatPeopleContainer;
