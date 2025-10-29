const pizzas = [
  "Pepperoni",
  "Margherita",
  "Hawaiian",
  "Pepperoni",
  "BBQ Chicken",
  "Pepperoni",
  "Hawaiian",
];

let groupA = ["Liam", "Sofia", "Noah"];
let groupB = ["Emma", "Lucas", "Olivia"];

let temperatures = [14, 17, 21, 19, 22, 18, 20];

let gear = [
  { name: "Longsword", weight: 12 },
  { name: "Steel Shield", weight: 15 },
  { name: "Healing Potion", weight: 3 },
  { name: "Candle", weight: 1 },
  { name: "Rope Coil", weight: 5 },
  { name: "Crossbow", weight: 9 },
  { name: "Spell Tome", weight: 8 },
  { name: "Traveler’s Cloak", weight: 4 },
  { name: "Mana Crystal", weight: 6 },
  { name: "Rations Pack", weight: 10 },
  { name: "Compass of True North", weight: 2 },
  { name: "Golden Chalice", weight: 7 },
  { name: "Dragon Scale Fragment", weight: 11 },
  { name: "Lantern", weight: 5 },
  { name: "Bag of Coins", weight: 13 },
];

// Task 1
function mostPopularPizza(orders) {
  const count = {};
  for (let pizza of orders) {
    count[pizza] = (count[pizza] || 0) + 1;
  }

  let maxPizza = "";
  let maxCount = 0;
  for (let pizza in count) {
    if (count[pizza] > maxCount) {
      maxCount = count[pizza];
      maxPizza = pizza;
    }
  }

  console.log(`${maxPizza}: ${maxCount}`);
}

mostPopularPizza(pizzas);

// Task 2
function interleaveGroups(groupA, groupB) {
  const result = [];
  const maxLength = Math.max(groupA.length, groupB.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < groupA.length) result.push(groupA[i]);
    if (i < groupB.length) result.push(groupB[i]);
  }

  return result;
}

console.log(interleaveGroups(groupA, groupB));

function temperatureChanges(temperatures) {
  const changes = [];
  for (let i = 1; i < temperatures.length; i++) {
    changes.push(temperatures[i] - temperatures[i - 1]);
  }
  return changes;
}

console.log(temperatureChanges(temperatures));

// Task 4
function packBackpack(gear) {
  const sortedGear = [...gear].sort((a, b) => a.weight - b.weight);

  let totalWeight = 0;
  const packed = [];

  for (let item of sortedGear) {
    if (totalWeight + item.weight <= 40) {
      packed.push(item.name);
      totalWeight += item.weight;
    }
  }

  return {
    items: packed,
    totalWeight: totalWeight,
  };
}

const result = packBackpack(gear);
console.log("Items:", result.items);
console.log("Total Weight:", result.totalWeight + " kg");
