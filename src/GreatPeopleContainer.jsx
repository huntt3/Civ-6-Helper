import React, { useEffect, useState } from "react";
import "./GreatPeopleContainer.css";

// Helper function to get unique people by era and type
const getPeopleByEraAndType = (people, era, type) => {
  return people.filter(
    (person) =>
      person.era === era &&
      person.requirement.toLowerCase().includes(type.toLowerCase())
  );
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
        setError("Sorry, we couldn't load the Great People data. Please try again later.");
      });
  }, []);

  return (
    <section className="great-people-container" aria-label="Great People Grid">
      <h2>Great People</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="great-people-grid" role="table" aria-label="Great People Table">
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
          <div key={era} className="era-row" role="row">
            {types.map((type) => {
              const people = getPeopleByEraAndType(greatPeople, era, type);
              return (
                <div key={type} className="cell" role="cell">
                  {people.length > 0 ? (
                    people.map((person) => (
                      <article
                        key={person.name}
                        className="great-person-card"
                        tabIndex={0}
                        aria-label={`${person.name}, ${person.requirement}, ${person.era}`}
                      >
                        <h3>{person.name}</h3>
                        <p><strong>Type:</strong> {person.requirement}</p>
                        <p><strong>Era:</strong> {person.era}</p>
                        <p><strong>Ability:</strong> {person.ability}</p>
                        {person.charges && (
                          <p><strong>Charges:</strong> {person.charges}</p>
                        )}
                      </article>
                    ))
                  ) : (
                    <div className="empty-cell" aria-label="No Great Person">-</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GreatPeopleContainer;
