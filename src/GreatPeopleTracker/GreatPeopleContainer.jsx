import React, { useEffect, useState } from "react";
import "./GreatPeopleContainer.css";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

const getPeopleByEraAndType = (people, era, type) => {
  return people.filter((person) => {
    // Defensive: skip if missing type or era
    if (!person || !person.type || !person.era) return false;
    // Match by type and era
    return person.era === era && person.type === type;
  });
};

const types = [
  "Great General",
  "Great Admiral",
  "Great Engineer",
  "Great Merchant",
  "Great Scientist",
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
  const [collapsedEras, setCollapsedEras] = useState({});
  const [checkedCards, setCheckedCards] = useState(() => {
    const saved = localStorage.getItem("greatPeopleChecked");
    return saved ? JSON.parse(saved) : {};
  });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch("./jsonFiles/GreatPeople.json")
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

  useEffect(() => {
    localStorage.setItem("greatPeopleChecked", JSON.stringify(checkedCards));
  }, [checkedCards]);

  const handleCollapse = (era) => {
    setCollapsedEras((prev) => ({ ...prev, [era]: !prev[era] }));
  };

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
        <div className="header-row" role="row">
          {types.map((type) => (
            <div key={type} className="header-cell" role="columnheader">
              {type}
            </div>
          ))}
        </div>
        {eras.map((era) => (
          <React.Fragment key={era}>
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
