document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  const topbar = document.getElementById("topbar");

  // set initial time
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();

  setInterval(() => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
  }, 1000);
});
