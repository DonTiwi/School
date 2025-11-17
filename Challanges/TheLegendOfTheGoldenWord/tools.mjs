function filter(list, fn) {
  const result = [];

  for (let item of list) {
    if (fn(item)) {
      result.push(item);
    }
  }

  return result;
}

function map(list, fn) {
  const result = [];

  for (let item of list) {
    result.push(fn(item));
  }

  return result;
}

function isIn(list, fn) {
  const result = [];
  for (let item of list) {
    if (fn(item)) {
      result.push(item);
    }
  }
  return result;
}

const Tools = {
  filter,
  isIn,
  map,
};

export default Tools;
