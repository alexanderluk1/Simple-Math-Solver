const inputElement = document.querySelector("#equation");
const resultElement = document.querySelector("#results");
const form = document.querySelector("#equation-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const result = parse(inputElement.value);
  resultElement.innerText = result;
});

// Recursively solves the equation
function parse(equation) {
  regex = /[+\-*/]/g;
  const operators = equation.match(regex);

  // Base Case: No more operators
  if (operators == null) {
    return equation;
  }
  const step = getNextStep(equation); // Get each part
  const result = solve(step);
  const newEquation = replaceNextStep(equation, step, result); // Replacing the step with result
  return parse(newEquation);
}

// --- Shrinks the equation with the result ---
function replaceNextStep(equation, step, result) {
  const newEquation = equation.replace(step.originalStr, result);
  return newEquation;
}

// --- Gets the next sub-equation the work on ---
function getNextStep(equation) {
  operatorRegex = /[+\-*/^]/g; // All operators
  numbersRegex = /-?\d+(\.\d)?/g; // Optional `-`, optional float

  operatorsArr = equation.match(operatorRegex);
  numbersArr = equation.match(numbersRegex);

  let num1 = undefined;
  let stepOperator = undefined;
  let num2 = undefined;
  let originalStr = undefined;

  // Brackets - Handles the inner brackets first
  if (equation.includes("(") || equation.includes(")")) {
    // (1 + 2 * (3 + 4)) = 15
    // (1 + 2) * (3 + 4) = 21
    // ((1 + 2) * 3 + (3 - 2) + (4 ^ 4)) = 22

    const bracketRegex = /\(\d+(\.\d)? (\+|\-|\*|\/|\^) (\d)+(\.\d)?\)/g;
    matchedEquation = equation.match(bracketRegex);

    if (matchedEquation != null) {
      originalStr = matchedEquation[0];
      num1 = originalStr.match(/\d+(\.\d)?/g)[0];
      num2 = originalStr.match(/\d+(\.\d)?/g)[1];
      stepOperator = originalStr.match(operatorRegex)[0];
    }
  }

  // Exponent
  if (stepOperator == undefined) {
    stepOperator = operatorsArr.find((each) => each === "^");
  }

  // Multiplication & Division
  if (stepOperator == undefined) {
    stepOperator = operatorsArr.find((each) => each === "*" || each === "/");
  }

  // Addition & Subtraction
  if (stepOperator == undefined) {
    stepOperator = operatorsArr.find((each) => each === "+" || each === "-");
  }

  // Handles the numbers when there are no brackets
  if (num1 == undefined) num1 = numbersArr[operatorsArr.indexOf(stepOperator)];
  if (num2 == undefined)
    num2 = numbersArr[operatorsArr.indexOf(stepOperator) + 1];

  if (originalStr == undefined) originalStr = `${num1} ${stepOperator} ${num2}`;

  return {
    numbers: [num1, num2],
    operator: stepOperator,
    originalStr: originalStr,
  };
}

// --- Solves the subset equation ---
function solve(stepObj) {
  const operator = stepObj.operator;
  const numArr = stepObj.numbers;

  switch (operator) {
    case "^":
      return numArr.reduce((acc, num) => {
        return (acc ** num).toFixed(1);
      });
    case "*":
      return numArr.reduce((acc, num) => {
        return (acc * num).toFixed(1);
      });
    case "/":
      return numArr.reduce((acc, num) => {
        return (acc / num).toFixed(1);
      });
    case "+":
      return numArr.reduce((acc, num) => {
        return parseFloat(acc) + parseFloat(num);
      });
    case "-":
      return numArr.reduce((acc, num) => {
        return parseFloat(acc) - parseFloat(num);
      });
  }
}
