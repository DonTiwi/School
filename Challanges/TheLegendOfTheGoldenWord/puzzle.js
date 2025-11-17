import Tools from "./tools.mjs";
// puzzle.js
// Welcome, apprentice. Fill in the functions below to find the Golden Word.

// --- DATA SOURCES ---
// Do not modify these.

const SCROLLS = [
  { id: 101, type: "common" },
  { id: 102, type: "cursed" },
  { id: 103, type: "sacred" },
  { id: 104, type: "common" },
  { id: 105, type: "sacred" },
  { id: 106, type: "cursed" },
  { id: 107, type: "common" },
  { id: 108, type: "sacred" },
];

const GEMS = [
  { id: 2001, scrollId: 102, glyph: 120, order: 1 },
  { id: 2002, scrollId: 103, glyph: 105, order: 3 },
  { id: 2003, scrollId: 104, glyph: 121, order: 2 },
  { id: 2004, scrollId: 105, glyph: 111, order: 5 },
  { id: 2005, scrollId: 108, glyph: 99, order: 7 },
  { id: 2006, scrollId: 103, glyph: 114, order: 2 },
  { id: 2007, scrollId: 101, glyph: 122, order: 3 },
  { id: 2008, scrollId: 108, glyph: 101, order: 8 },
  { id: 2009, scrollId: 105, glyph: 102, order: 4 },
  { id: 2010, scrollId: 102, glyph: 120, order: 4 },
  { id: 2011, scrollId: 103, glyph: 116, order: 1 },
  { id: 2012, scrollId: 105, glyph: 114, order: 6 },
];

/**
 * 1. Filters the SCROLLS array to find those with type 'sacred'.
 * @param {Array<Object>} scrolls - The full array of scroll objects.
 * @returns {Array<Number>} An array of scroll IDs (e.g., [103, 105, 108]).
 */
const findSacredScrollIds = (scrolls) => {
  const isSacred = function (item) {
    return item.type == "sacred";
  };
  return Tools.filter(scrolls, isSacred);
};

/**
 * 2. Filters the GEMS array to find gems belonging to the sacred scrolls.
 * @param {Array<Object>} gems - The full array of gem objects.
 * @param {Array<Number>} sacredScrollIds - An array of IDs from step 1.
 * @returns {Array<Object>} An array of 'sacred' gem objects.
 */
const findSacredGems = (gems, sacredScrollIds) => {
  const fn = function (gems) {
    return Tools.isIn(sacredScrollIds, function (id) {
      console.log(gems.scrollId, id);
      return id == gems.scrollId;
    });
  };
  return Tools.filter(gems, fn);
};

/**
 * 3. Sorts the sacred gems by their 'order' property.
 * @param {Array<Object>} sacredGems - The filtered array of gems from step 2.
 * @returns {Array<Object>} The same array, but sorted by `order`.
 */
const sortGemsByOrder = (sacredGems) => {
  return sacredGems.sort((a, b) => a.order - b.order);
};

/**
 * 4. Decodes the 'glyph' (a character code) from each sorted gem.
 * @param {Array<Object>} sortedGems - The sorted array of gems from step 3.
 * @returns {Array<String>} An array of single characters (e.g., ['t', 'r', 'i', ...]).
 */
const decodeGlyphs = (sortedGems) => {
  // Your code here
  return []; // Placeholder
};

/**
 * 5. Joins the decoded characters into a single string.
 * @param {Array<String>} decodedChars - The array of characters from step 4.
 * @returns {String} The final, revealed Golden Word.
 */
const revealWord = (decodedChars) => {
  // Your code here
  return decodedChars.join("");
};

// --- MAIN EXECUTION ---
// This part is already complete. It runs your functions in a chain.
// Do not modify this function.

const main = () => {
  // Step 1
  const sacredIds = findSacredScrollIds(SCROLLS);

  // Step 2
  const sacredGems = findSacredGems(GEMS, sacredIds);

  // Step 3
  const sortedGems = sortGemsByOrder(sacredGems);
  console.log(sortedGems);

  // Step 4
  const decodedChars = decodeGlyphs(sortedGems);
  return Map(sortedGems, (gem) => String.fromCharCode(gem.glyph));

  // Step 5
  const goldenWord = revealWord(decodedChars);

  console.log("The Golden Word is...");
  console.log(goldenWord);
};

// Run the script
main();
