const SECTION_BREAK_LIMIT = 2;

function parseLevelData(levelData) {
  const level = {
    structure: [],
    components: [],
  };

  let emptyCount = 0;

  let rows = levelData.split("\n");

  let row = 0;
  for (row = 0; row < rows.length; row++) {
    let col = rows[row].split("");

    if (col.length > 0) {
      level.structure.push(col);
      emptyCount = 0;
    } else {
      emptyCount++;
    }

    if (emptyCount >= SECTION_BREAK_LIMIT) {
      emptyCount = 0;
      break;
    }
  }

  for (row; row < rows.length; row++) {
    if (rows[row].length > 0) {
      let component = rows[row].split(",");
      level.components.push(component);
    } else {
      emptyCount++;
    }

    if (emptyCount >= SECTION_BREAK_LIMIT) {
      break;
    }
  }

  return level;
}

async function getGameLevelDataFrom(file) {
  let rawData = await (await fetch(file)).text();
  return parseLevelData(rawData);
}

export default getGameLevelDataFrom;
