import React, { useEffect, useState } from "react";
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

// Get color scheme based on Great Person type
const getTypeColorScheme = (type) => {
  switch (type) {
    case "Great General":
      return {
        header: "bg-red-500 text-white",
        card: "bg-red-50 border-red-300",
        cardHover: "hover:bg-red-100",
        cardChecked: "bg-red-200 border-red-600",
      };
    case "Great Admiral":
      return {
        header: "bg-teal-500 text-white",
        card: "bg-teal-50 border-teal-300",
        cardHover: "hover:bg-teal-100",
        cardChecked: "bg-teal-200 border-teal-600",
      };
    case "Great Engineer":
      return {
        header: "bg-orange-500 text-white",
        card: "bg-orange-50 border-orange-300",
        cardHover: "hover:bg-orange-100",
        cardChecked: "bg-orange-200 border-orange-600",
      };
    case "Great Merchant":
      return {
        header: "bg-yellow-500 text-white",
        card: "bg-yellow-50 border-yellow-300",
        cardHover: "hover:bg-yellow-100",
        cardChecked: "bg-yellow-200 border-yellow-600",
      };
    case "Great Scientist":
      return {
        header: "bg-blue-500 text-white",
        card: "bg-blue-50 border-blue-300",
        cardHover: "hover:bg-blue-100",
        cardChecked: "bg-blue-200 border-blue-600",
      };
    default:
      return {
        header: "bg-gray-100 text-gray-800",
        card: "bg-gray-50 border-gray-300",
        cardHover: "hover:bg-blue-50",
        cardChecked: "bg-blue-100 border-blue-600",
      };
  }
};

const GreatPeopleContainer = () => {
  const [greatPeople, setGreatPeople] = useState([]);
  const [error, setError] = useState("");
  // Start these eras as collapsed
  const defaultCollapsed = {
    Medieval: true,
    Renaissance: true,
    Industrial: true,
    Modern: true,
    Atomic: true,
    Information: true,
  };
  const [collapsedEras, setCollapsedEras] = useState(defaultCollapsed);
  const [checkedCards, setCheckedCards] = useState(() => {
    const saved = localStorage.getItem("greatPeopleChecked");
    return saved ? JSON.parse(saved) : {};
  });
  const [collapsed, setCollapsed] = useState(true);

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
      title="Great People Tracker"
      className="my-8 mx-auto p-4 max-w-full bg-white text-gray-900 rounded-lg shadow-md"
      collapsed={collapsed}
      onCollapse={handleCollapseContainer}
      onRefresh={handleRefresh}
    >
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <div
        className="flex flex-col gap-2"
        role="table"
        aria-label="Great People Table"
      >
        <div className="grid grid-cols-5 gap-2" role="row">
          {types.map((type) => {
            const colorScheme = getTypeColorScheme(type);
            return (
              <div
                key={type}
                className={`font-bold text-center py-2 rounded ${colorScheme.header}`}
                role="columnheader"
              >
                {type}
              </div>
            );
          })}
        </div>
        {eras.map((era) => (
          <React.Fragment key={era}>
            <div
              className="font-bold text-base bg-gray-100 px-4 py-2 rounded mb-1 flex items-center gap-2"
              aria-label={`Row for ${era} era`}
            >
              <button
                className="bg-blue-600 text-white border-none rounded px-3 py-1 text-base cursor-pointer transition-colors duration-200 mr-2 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
                aria-expanded={!collapsedEras[era]}
                aria-controls={`era-row-${era}`}
                onClick={() => handleCollapse(era)}
              >
                {collapsedEras[era] ? "Show" : "Hide"}
              </button>
              <span>{era}</span>
            </div>
            {!collapsedEras[era] && (
              <div
                className="grid grid-cols-5 gap-2"
                role="row"
                id={`era-row-${era}`}
              >
                {types.map((type) => {
                  const people = getPeopleByEraAndType(greatPeople, era, type);
                  const colorScheme = getTypeColorScheme(type);
                  return (
                    <div
                      key={type}
                      className="min-h-[80px] flex flex-col items-center justify-start bg-white text-gray-800 rounded shadow p-1"
                      role="cell"
                    >
                      {people.length > 0 ? (
                        people.map((person) => (
                          <article
                            key={person.name}
                            className={`transition-colors duration-200 border rounded w-full box-border text-sm p-2 mb-1 cursor-pointer ${
                              checkedCards[person.name]
                                ? `${colorScheme.cardChecked} filter brightness-90`
                                : `${colorScheme.card} ${colorScheme.cardHover} hover:shadow-md`
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
                          >
                            <span className="font-bold">{person.name}</span>
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
                          className="text-gray-400 text-center py-2"
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
