import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6 mt-12 border-t border-gray-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Bug Report & Discord Links */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-base">Community</h3>
          <a
            href="https://example.com/bug-report"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <img
              src="./icons/bug-solid.svg"
              alt="science"
              style={{ height: "3em", verticalAlign: "middle" }}
            />{" "}
            Report a Bug
          </a>
          <a
            href="https://discord.gg/example"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <img
              src="./icons/discord-brands.svg"
              alt="science"
              style={{ height: "3em", verticalAlign: "middle" }}
            />{" "}
            Join our Discord
          </a>
        </div>

        {/* Credits */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-base">Credits</h3>
          <p>
            This site is a fan-made tool for <em>Civilization VI</em>.
          </p>
          <p>
            All game content and assets are property of Firaxis and 2K Games.
          </p>
        </div>

        {/* Additional Reading */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold text-base">
            Additional Reading
          </h3>
          <ul className="list-disc list-inside">
            <li>
              <a
                href="https://civilization.fandom.com/wiki/Civilization_VI"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Civilization VI Wiki
              </a>
            </li>
            <li>
              <a
                href="https://www.reddit.com/r/civ/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                r/civ Subreddit
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
