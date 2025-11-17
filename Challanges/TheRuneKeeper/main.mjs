const runeList = [
  { id: "r-001", symbol: "KHEI", description: "The Key" },
  { id: "r-002", symbol: "TAL", description: "The Shield" },
  { id: "r-003", symbol: "ZOS", description: "The Storm" },
  { id: "r-004", symbol: "RA", description: "The Sun" },
  { id: "r-005", symbol: "NER", description: "The Moon" },
];

const activationSequence = ["r-004", "r-001", "r-003", "r-001", "r-002"];

// Expected output: ["RA", "KHEI", "ZOS", "KHEI", "TAL"]

function getActivationSymbols(runes, sequence) {
  const symbols = [];

  for (const runeId of sequence) {
    for (const rune of runes) {
      if (rune.id === runeId) {
        symbols.push(rune.symbol);
        break;
      }
    }
  }

  return symbols;
}

const activatedSymbols = getActivationSymbols(runeList, activationSequence);
console.log(activatedSymbols);
