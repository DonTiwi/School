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
