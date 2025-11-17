const dataMaelstrom = `region,id,energy\nnorth,s-01,50\nsouth,s-02,120\neast,s-03,75\nwest,s-04,90\nnorth,s-05,35\nsouth,s-06,110`;

// Expected output: 480

function data(input) {
  const lines = input.split("\n");
  let totalEnergy = 0;
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const energy = parseInt(parts[2]);
    totalEnergy += energy;
  }
  return totalEnergy;
}

const total = data(dataMaelstrom);
console.log(total);
