
const tileDimension = 20;
const padding = tileDimension * 2;
const screenRows = 25;
const screenColumns = 35;
const totalWidth = padding * 2 + screenColumns * tileDimension;
const totalHeight = padding * 2 + screenRows * tileDimension;
const startX = padding;
const startY = padding;

const DIMENSIONS = {
    tileDimension,
    padding,
    screenColumns,
    screenRows,
    totalHeight,
    totalWidth,
    startX,
    startY
};

export default DIMENSIONS