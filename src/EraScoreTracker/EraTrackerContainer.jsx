import React, { useEffect, useState } from "react";
import EraScore from "./EraScore";
import ProgressBar from "./ProgressBar";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import "./EraTracker.css";

const FAVORITES_KEY = "civ6-helper-eraScore-favorites";

const EraTrackerContainer = ({ settings }) => {
  const [eraScoreItems, setEraScoreItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [eraScoreFilter, setEraScoreFilter] = useState(0);
  const [search, setSearch] = useState("");
  const [showOnlyFavorited, setShowOnlyFavorited] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage (array of titles)
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const fetchEraScore = () => {
    fetch("./jsonFiles/EraScore.json")
      .then((res) => res.json())
      .then((data) => setEraScoreItems(data.EraScore || []))
      .catch(() => setEraScoreItems([]));
  };

  useEffect(() => {
    fetchEraScore();
  }, []);

  const handleCollapse = () => setCollapsed((prev) => !prev);

  // Filter items based on settings and only include items with a title
  const safeSettings = settings || {
    heroesLegends: false,
    monopoliesCorporations: false,
  };
  let filteredItems = eraScoreItems
    .map((item) => ({
      ...item,
      favorited: favorites.includes(item.title),
    }))
    .filter((item) => {
      if (!item.title) return false;
      if (
        item.gameMode === "Monopolies and Corporations" &&
        !safeSettings.monopoliesCorporations
      )
        return false;
      if (item.gameMode === "Heroes & Legends" && !safeSettings.heroesLegends)
        return false;
      if (eraScoreFilter && item.eraScore !== eraScoreFilter) return false;
      if (
        search &&
        !(
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(search.toLowerCase()))
        )
      )
        return false;
      if (showOnlyFavorited && !item.favorited) return false;
      return true;
    });

  // Sort items by eraScore
  filteredItems = filteredItems.sort((a, b) => {
    if (sortOrder === "asc") return a.eraScore - b.eraScore;
    return b.eraScore - a.eraScore;
  });

  // Handler to toggle favorite for a card by title
  const handleToggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  return (
    <CollapsibleContainer
      title="Era Score Tracker"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      onRefresh={fetchEraScore}
      ariaLabel="Era Tracker"
    >
      <ProgressBar />
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <button
          className={`px-3 py-1 rounded ${
            showOnlyFavorited ? "bg-yellow-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowOnlyFavorited((v) => !v)}
          aria-pressed={showOnlyFavorited}
        >
          {showOnlyFavorited ? "Show All" : "Show Favorites"}
        </button>
        <button
          className={`px-3 py-1 rounded ${
            sortOrder === "asc" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSortOrder("asc")}
        >
          Sort Ascending
        </button>
        <button
          className={`px-3 py-1 rounded ${
            sortOrder === "desc" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSortOrder("desc")}
        >
          Sort Descending
        </button>
        <input
          type="number"
          min="0"
          placeholder="Filter by Era Score"
          value={eraScoreFilter || ""}
          onChange={(e) =>
            setEraScoreFilter(
              e.target.value === "" ? 0 : parseInt(e.target.value, 10)
            )
          }
          className="p-1 border rounded w-36 text-center"
        />
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-1 border rounded w-56"
        />
      </div>
      <div className="era-score-list">
        {filteredItems.map((item) => (
          <EraScore
            key={item.title}
            {...item}
            favorited={item.favorited}
            onToggleFavorite={() => handleToggleFavorite(item.title)}
          />
        ))}
      </div>
    </CollapsibleContainer>
  );
};

export default EraTrackerContainer;
