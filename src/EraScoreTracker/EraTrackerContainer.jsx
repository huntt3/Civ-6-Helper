import React, { useEffect, useState, useRef, useCallback } from "react";
import EraScore from "./EraScore";
import ProgressBar from "./ProgressBar";
import EraScoreSums from "./EraScoreSums";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

const FAVORITES_KEY = "civ6-helper-eraScore-favorites";
const SORT_ORDER_KEY = "civ6-helper-eraScore-sortOrder";
const ERA_SCORE_FILTER_KEY = "civ6-helper-eraScore-filter";
const SEARCH_KEY = "civ6-helper-eraScore-search";
const SHOW_ONLY_FAVORITED_KEY = "civ6-helper-eraScore-showOnlyFavorited";
const ERA_TRACKER_COLLAPSED_KEY = "civ6-helper-eraScore-collapsed";

const EraTrackerContainer = ({ settings }) => {
  // State for pagination
  const [cardsPerPage, setCardsPerPage] = useState(() => {
    const saved = localStorage.getItem("civ6-helper-cardsPerPage");
    return saved !== null ? parseInt(saved, 10) : 10;
  });
  const [page, setPage] = useState(0);

  // Save cardsPerPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("civ6-helper-cardsPerPage", cardsPerPage);
  }, [cardsPerPage]);
  const [eraScoreItems, setEraScoreItems] = useState([]);
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem(ERA_TRACKER_COLLAPSED_KEY);
    return saved ? JSON.parse(saved) : true;
  });
  const [sortOrder, setSortOrder] = useState(() => {
    const saved = localStorage.getItem(SORT_ORDER_KEY);
    return saved !== null ? saved : "desc";
  });
  const [eraScoreFilter, setEraScoreFilter] = useState(() => {
    const saved = localStorage.getItem(ERA_SCORE_FILTER_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [search, setSearch] = useState(() => {
    const saved = localStorage.getItem(SEARCH_KEY);
    return saved !== null ? saved : "";
  });
  const [showOnlyFavorited, setShowOnlyFavorited] = useState(() => {
    const saved = localStorage.getItem(SHOW_ONLY_FAVORITED_KEY);
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [previousEraScore, setPreviousEraScore] = useState(0);
  const [currentEraScore, setCurrentEraScore] = useState(0);
  const [itemScores, setItemScores] = useState({});

  // Use refs instead of state to store functions to prevent re-renders
  const nextEraFunctionsRef = useRef({});
  const clearDataFunctionsRef = useRef({});

  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage (array of titles)
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [researchedTechs, setResearchedTechs] = useState(() => {
    // Load researched techs from localStorage (from civ6_tech_state)
    try {
      const saved = localStorage.getItem("civ6_tech_state");
      if (!saved) return [];
      const state = JSON.parse(saved);
      // Normalize tech names to string for comparison
      return Object.entries(state)
        .filter(([name, val]) => val && val.researched)
        .map(([name]) => String(name));
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save other state variables to localStorage when they change
  useEffect(() => {
    localStorage.setItem(SORT_ORDER_KEY, sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    localStorage.setItem(ERA_SCORE_FILTER_KEY, eraScoreFilter.toString());
  }, [eraScoreFilter]);

  useEffect(() => {
    localStorage.setItem(SEARCH_KEY, search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem(
      SHOW_ONLY_FAVORITED_KEY,
      JSON.stringify(showOnlyFavorited)
    );
  }, [showOnlyFavorited]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(ERA_TRACKER_COLLAPSED_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  // Listen for changes to civ6_tech_state in localStorage and also poll for changes every second
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "civ6_tech_state") {
        try {
          const state = JSON.parse(e.newValue);
          setResearchedTechs(
            Object.entries(state)
              .filter(([, val]) => val && val.researched)
              .map(([name]) => String(name))
          );
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // Poll localStorage every second for real-time updates
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem("civ6_tech_state");
        if (!saved) return;
        const state = JSON.parse(saved);
        setResearchedTechs(
          Object.entries(state)
            .filter(([, val]) => val && val.researched)
            .map(([name]) => String(name))
        );
      } catch {}
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Also update researchedTechs on mount in case techs are already researched
  useEffect(() => {
    try {
      const saved = localStorage.getItem("civ6_tech_state");
      if (!saved) return;
      const state = JSON.parse(saved);
      setResearchedTechs(
        Object.entries(state)
          .filter(([name, val]) => val && val.researched)
          .map(([name]) => name)
      );
    } catch {}
  }, []);

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
      // Hide if prerequisites exist and none are researched
      if (
        Array.isArray(item.prerequisites) &&
        item.prerequisites.length > 0 &&
        !item.prerequisites.some((pr) =>
          researchedTechs
            .map((t) => t.toLowerCase())
            .includes(String(pr).toLowerCase())
        )
      ) {
        return false;
      }
      return true;
    });

  // Sort items by eraScore
  filteredItems = filteredItems.sort((a, b) => {
    if (sortOrder === "asc") return a.eraScore - b.eraScore;
    return b.eraScore - a.eraScore;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / cardsPerPage);
  const paginatedItems = filteredItems.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  );

  // Handler to toggle favorite for a card by title
  const handleToggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // Handler for score changes from individual cards
  const handleScoreChange = useCallback((title, eraType, newScore) => {
    setItemScores((prev) => {
      const updated = { ...prev };
      if (!updated[title]) {
        updated[title] = { previous: 0, current: 0 };
      }
      updated[title][eraType] = newScore;
      return updated;
    });
  }, []);

  // Handler to register next era functions from individual cards
  const handleNextEraRegister = useCallback(
    (title, nextEraFunction, clearDataFunction) => {
      nextEraFunctionsRef.current[title] = nextEraFunction;
      if (clearDataFunction) {
        clearDataFunctionsRef.current[title] = clearDataFunction;
      }
    },
    []
  );

  // Handler for the Next Era button
  const handleNextEra = useCallback(() => {
    // Call all registered next era functions
    Object.values(nextEraFunctionsRef.current).forEach((nextEraFunction) => {
      if (typeof nextEraFunction === "function") {
        nextEraFunction();
      }
    });
  }, []);

  // Handler for the Reset button - clear all Era Score localStorage data
  const handleReset = useCallback(() => {
    // Call all registered clear data functions
    Object.values(clearDataFunctionsRef.current).forEach(
      (clearDataFunction) => {
        if (typeof clearDataFunction === "function") {
          clearDataFunction();
        }
      }
    );

    // Remove all Era Tracker related localStorage keys
    localStorage.removeItem("civ6-helper-neededEraScore");
    localStorage.removeItem(FAVORITES_KEY);
    localStorage.removeItem("civ6-helper-cardsPerPage");
    localStorage.removeItem(SORT_ORDER_KEY);
    localStorage.removeItem(ERA_SCORE_FILTER_KEY);
    localStorage.removeItem(SEARCH_KEY);
    localStorage.removeItem(SHOW_ONLY_FAVORITED_KEY);
    localStorage.removeItem(ERA_TRACKER_COLLAPSED_KEY);

    // Reset local state
    setFavorites([]);
    setCardsPerPage(10);
    setPage(0);
    setSortOrder("desc");
    setEraScoreFilter(0);
    setSearch("");
    setShowOnlyFavorited(false);
    setCollapsed(true);

    // Refresh the data
    fetchEraScore();
  }, []);

  // Calculate total scores when itemScores changes
  useEffect(() => {
    let previousTotal = 0;
    let currentTotal = 0;

    Object.values(itemScores).forEach((scores) => {
      previousTotal += scores.previous || 0;
      currentTotal += scores.current || 0;
    });

    setPreviousEraScore(previousTotal);
    setCurrentEraScore(currentTotal);
  }, [itemScores]);

  return (
    <CollapsibleContainer
      title="Era Score Tracker"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      onRefresh={handleReset}
      ariaLabel="Era Tracker"
    >
      <ProgressBar eraScore={currentEraScore} />
      <EraScoreSums
        previousEraScore={previousEraScore}
        currentEraScore={currentEraScore}
        onNextEra={handleNextEra}
      />
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
          max="5"
          placeholder="Filter by Era Score"
          value={eraScoreFilter || ""}
          onChange={(e) => {
            let val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
            if (val > 5) val = 5;
            setEraScoreFilter(val);
          }}
          className="p-1 border rounded w-36 text-center"
        />
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-1 border rounded w-56"
        />
        {/* Cards per page input */}
        <label className="flex items-center ml-auto">
          <span className="mr-2">Cards per page:</span>
          <input
            type="number"
            min="1"
            max="100"
            value={cardsPerPage}
            onChange={(e) => {
              let val =
                e.target.value === "" ? 1 : parseInt(e.target.value, 10);
              if (val < 1) val = 1;
              if (val > 100) val = 100;
              setCardsPerPage(val);
              setPage(0); // Reset to first page when changing cards per page
            }}
            className="p-1 border rounded w-20 text-center"
            aria-label="Cards per page"
          />
        </label>
      </div>
      <div className="era-score-list">
        {paginatedItems.map((item) => (
          <EraScore
            key={item.title}
            {...item}
            favorited={item.favorited}
            onToggleFavorite={() => handleToggleFavorite(item.title)}
            onScoreChange={handleScoreChange}
            onNextEra={handleNextEraRegister}
          />
        ))}
      </div>
      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={`px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
            page === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Previous page"
        >
          &#8592;
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className={`px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
            page >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Next page"
        >
          &#8594;
        </button>
      </div>
    </CollapsibleContainer>
  );
};

export default EraTrackerContainer;
