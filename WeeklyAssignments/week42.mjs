const numArr = [29, 38, 10, 60, 50, 28, 15, 90, 75, 288];

function printArr(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(`#${i + 1} => ${arr[i]}`);
  }
}

printArr(numArr);

function insertAt(arr, index, value) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === index) {
      newArr.push(value);
    }
    newArr.push(arr[i]);
  }
  return newArr;
}

console.log(insertAt(numArr, 3, 1000));

function sliceManual(arr, start, end) {
  if (start < 0 || start >= arr.length) {
    return [];
  }

  if (end == undefined || end >= arr.lenght || end < start) {
    end = arr.lenght - 1;
  }

  let output = [];

  for (let i = start; i <= end; i++) {
    output.push(arr[i]);
  }

  return output;
}

let slice = sliceManual(numArr, 2);
console.log(slice);
