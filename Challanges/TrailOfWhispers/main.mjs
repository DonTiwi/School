const thorne_log = [
  { id: "t_01", type: "noise", message: "The wind howls.", coordinate: "X0Y0" },
  { id: "t_02", type: "danger", message: "Quicksand bog.", coordinate: "A1B2" },
  {
    id: "t_03",
    type: "safe",
    message: "Sheltered cave found.",
    coordinate: "C3D4",
  },
  {
    id: "t_04",
    type: "noise",
    message: "Strange bird call.",
    coordinate: "X1Y1",
  },
  {
    id: "t_05",
    type: "safe",
    message: "Ancient shrine, good water.",
    coordinate: "E5F6",
  },
  { id: "t_06", type: "danger", message: "Bridge is out!", coordinate: "G7H8" },
  {
    id: "t_07",
    type: "danger",
    message: "Unstable cliffside.",
    coordinate: "I9J0",
  },
  { id: "t_08", type: "safe", message: "Path is clear.", coordinate: "K1L2" },
];

// Expected output: ["C3D4", "E5F6", "K1L2"]

function getSafeCoordinates(log) {
  const safeCoordinates = [];
  for (const entry of log) {
    if (entry.type === "safe") {
      safeCoordinates.push(entry.coordinate);
    }
  }
  return safeCoordinates;
}

const safeCoords = getSafeCoordinates(thorne_log);
console.log(safeCoords);
