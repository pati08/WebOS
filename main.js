document.addEventListener("DOMContentLoaded", () => {
  // Setup the clock
  const clock = document.getElementById("clock");

  // set initial time
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();

  setInterval(() => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
  }, 1000);

  // Setup window dragging
  document.querySelectorAll(".window").forEach((window) => {
    makeDraggable(window);
  });

  // Setup window opening and closing
  setupWindowOpenClose();

  // Setup icons
  setupIcons();

  // Setup stats effect
  setupStatsEffect();

  // Setup calc buttons
  setupCalcButtons();
});

function makeDraggable(window) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  window.querySelector(".winbar").onmousedown = startDragging;

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    window.style.top = window.offsetTop - currentY + "px";
    window.style.left = window.offsetLeft - currentX + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function setupWindowOpenClose() {
  insertCloseButtons();
}

function openWindow(window) {
  window.style.display = "block";
  closedApps = closedApps.filter((closedApp) => closedApp.window !== window);
  updateClosedApps();
}

// structure of each closed app:
// { title: "", window: window }

let closedApps = [];
function updateClosedApps() {
  if (closedApps.length === 0) {
    document.getElementById("topbar-apps").textContent = "No Closed Apps";
  } else {
    document.getElementById("topbar-apps").textContent = "";
    let apps = document.getElementById("topbar-apps");
    for (let i = 0; i < apps.children.length; i++) {
      apps.children[i].remove();
    }
    closedApps.forEach((app) => {
      let openButton = document.createElement("button");
      openButton.textContent = app.title;
      openButton.classList.add("open-button");
      openButton.addEventListener("click", () => {
        openWindow(app.window);
        closedApps = closedApps.filter(
          (closedApp) => closedApp.title !== app.title,
        );
        updateClosedApps();
      });
      apps.appendChild(openButton);
    });
  }
}

function closeWindow(window) {
  window.style.display = "none";
  const title = window.querySelector(".winbar-title").textContent;
  if (!closedApps.some((app) => app.title === title)) {
    closedApps.push({ title: title, window: window });
  }
  updateClosedApps();
}

function insertCloseButtons() {
  document.querySelectorAll(".window").forEach((window) => {
    const winbar = window.querySelector(".winbar-buttons");
    const closeButton = document.createElement("button");
    closeButton.textContent = "❌";
    closeButton.classList.add("close-button");
    winbar.appendChild(closeButton);
    closeButton.addEventListener("click", () => {
      closeWindow(window);
    });
  });
}

let selectedIcon = null;
function updateSelectedIcon() {
  document.querySelectorAll(".appicon").forEach((icon) => {
    icon.classList.remove("selectedIcon");
    if (selectedIcon && icon === selectedIcon) {
      icon.classList.add("selectedIcon");
    }
  });
}

function setupIcons() {
  document.querySelectorAll(".appicon").forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      const appName = icon.getAttribute("data-app");
      const window = document.getElementById(appName);
      openWindow(window);
    });
    icon.addEventListener("click", () => {
      selectedIcon = icon;
      updateSelectedIcon();
    });
  });
}

function setupStatsEffect() {
  const NUM_GROUPS = 10;
  const NUM_PER_GROUP = 5;
  const SWAPS_PER_SECOND = 10;
  const groups = [];
  for (let i = 0; i < NUM_GROUPS; i++) {
    const group = [];
    for (let j = 0; j < NUM_PER_GROUP; j++) {
      group.push(Math.floor(Math.random() + 0.5));
    }
    groups.push(group);
  }

  const statsDiv = document.querySelector("#system-stats .window-body");
  statsDiv.innerHTML = "";
  for (let i = 0; i < NUM_GROUPS; i++) {
    const group = document.createElement("div");
    group.textContent = groups[i].join("");
    statsDiv.appendChild(group);
  }

  setInterval(() => {
    let x = Math.floor(Math.random() * NUM_PER_GROUP);
    let y = Math.floor(Math.random() * NUM_GROUPS);
    if (groups[y][x] === 0) {
      groups[y][x] = 1;
    } else {
      groups[y][x] = 0;
    }
    statsDiv.innerHTML = "";
    for (let i = 0; i < NUM_GROUPS; i++) {
      const group = document.createElement("div");
      group.textContent = groups[i].join("");
      statsDiv.appendChild(group);
    }
  }, 1000 / SWAPS_PER_SECOND);
}

let calcBuffer = "";
let calcStored = null;
let calcOperator = "";

function renderCalc() {
  const el = document.getElementById("calc-result");
  if (calcStored !== null) {
    el.textContent = Number(calcStored.toFixed(2));
    if (calcOperator !== "") {
      el.textContent += ` ${calcOperator} ${calcBuffer}`;
    }
  } else if (calcBuffer !== "") {
    el.textContent = calcBuffer;
  } else {
    el.textContent = "0";
  }
}

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  x: (a, b) => a * b,
  "/": (a, b) => a / b,
};

function inStateEmpty() {
  return calcStored === null && calcOperator === "" && calcBuffer === "";
}
function inStateBufferOnly() {
  return calcStored === null && calcOperator === "" && calcBuffer !== "";
}
function inStateStoredOnly() {
  return calcStored !== null && calcOperator === "" && calcBuffer === "";
}
function inStateStoredAndOperator() {
  return calcStored !== null && calcOperator !== "" && calcBuffer === "";
}
function inStateAll() {
  return calcStored !== null && calcOperator !== "" && calcBuffer !== "";
}

function operatorClick(operator) {
  if (inStateBufferOnly()) {
    calcStored = parseFloat(calcBuffer);
    calcBuffer = "";
    calcOperator = operator;
    renderCalc();
  } else if (inStateAll()) {
    calcStored = operators[calcOperator](calcStored, parseFloat(calcBuffer));
    calcBuffer = "";
    calcOperator = operator;
    renderCalc();
  } else if (inStateStoredOnly()) {
    calcOperator = operator;
    renderCalc();
  }
}

function numberClick(number) {
  if (
    inStateEmpty() ||
    inStateBufferOnly() ||
    inStateStoredAndOperator() ||
    inStateAll()
  ) {
    calcBuffer += number;
    renderCalc();
  } else if (inStateStoredOnly()) {
    calcBuffer = number;
    calcStored = null;
    renderCalc();
  }
}

function clearClick() {
  calcBuffer = "";
  calcStored = null;
  calcOperator = "";
  renderCalc();
}

function equalsClick() {
  if (inStateAll()) {
    calcStored = operators[calcOperator](calcStored, parseFloat(calcBuffer));
    calcBuffer = "";
    calcOperator = "";
    renderCalc();
  }
}

function setupCalcButtons() {
  const buttons = document.querySelectorAll("#calculator .window-body td");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;
      if (operators[value]) {
        operatorClick(value);
      } else if (value === "=") {
        equalsClick();
      } else if (value === "C") {
        clearClick();
      } else {
        numberClick(value);
      }
    });
  });
}
