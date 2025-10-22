const numArr = [29, 38, 10, 60, 50, 28, 15, 90, 75, 288];

// Task 1
function printArr(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(`#${i + 1} => ${arr[i]}`);
  }
}

printArr(numArr);

// Task 2
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

// Task 3
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

// Task 4
function mergeTwoArrays(arr1, arr2) {
  const mergedArr = [];
  for (let i = 0; i < arr1.length; i++) {
    mergedArr.push(arr1[i]);
  }
  for (let j = 0; j < arr2.length; j++) {
    mergedArr.push(arr2[j]);
  }
  return mergedArr;
}

const arrayOne = [1, 2, 3];
const arrayTwo = [4, 5, 6];

console.log(mergeTwoArrays(arrayOne, arrayTwo));

// Task 5
function frequencyCount(items) {
  const frequencyMap = {};
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (frequencyMap[item]) {
      frequencyMap[item]++;
    } else {
      frequencyMap[item] = 1;
    }
  }
  return frequencyMap;
}

const sampleItems = ["a", "b", "a", "a", "b", "c"];
console.log(frequencyCount(sampleItems));

// Task 6
function firstIndexOf(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

console.log(firstIndexOf(numArr, 50));

function chunkArray(arr, chunkSize) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = [];
    for (let j = i; j < i + chunkSize && j < arr.length; j++) {
      chunk.push(arr[j]);
    }
    chunks.push(chunk);
  }
  return chunks;
}

console.log(chunkArray(numArr, 3));

// Task 7
function romoveAll(arr, target) {
  const resultArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== target) {
      resultArr.push(arr[i]);
    }
  }
  return resultArr;
}

console.log(romoveAll(numArr, 28));

// Task 8
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    const chunk = [];
    for (let j = i; j < i + size && j < arr.length; j++) {
      chunk.push(arr[j]);
    }
    result.push(chunk);
  }
  return result;
}

console.log(chunk(numArr, 4));

// Task 9
function reverseString(s) {
  let reversed = "";
  for (let i = s.length - 1; i >= 0; i--) {
    reversed += s[i];
  }
  return reversed;
}

console.log(reverseString("Hello World!"));

// Task 10
function isPalindrome(s) {
  const cleaned = s.replace(/[\W_]/g, "").toLowerCase();
  const len = cleaned.length;
  for (let i = 0; i < len / 2; i++) {
    if (cleaned[i] !== cleaned[len - 1 - i]) {
      return false;
    }
  }
  return true;
}

console.log(isPalindrome("A man a plan a canal Panama"));
console.log(isPalindrome("Hello"));

// Task 11
function fib(n) {
  const fibArr = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      fibArr.push(0);
    } else if (i === 1) {
      fibArr.push(1);
    } else {
      fibArr.push(fibArr[i - 1] + fibArr[i - 2]);
    }
  }
  return fibArr;
}

console.log(fib(10));

// Task 12
function simulateDiceRolls(trials) {
  const rolls = [];
  for (let i = 0; i < trials; i++) {
    const roll = Math.floor(Math.random() * 6) + 1;
    rolls.push(roll);
  }
  return rolls;
}

const trials = 5;
const rolls = simulateDiceRolls(trials);
console.log("Rolls:", rolls);

// Task 13
function wordsFromText(text) {
  const words = [];
  let currentWord = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === " ") {
      if (currentWord.length > 0) {
        words.push(currentWord);
        currentWord = "";
      }
    } else {
      currentWord += char;
    }
  }
  if (currentWord.length > 0) {
    words.push(currentWord);
  }
  return words;
}

const sampleText = "  This is   a sample   text for   testing.  ";
const wordsArray = wordsFromText(sampleText);
console.log("Words Array:", wordsArray);
