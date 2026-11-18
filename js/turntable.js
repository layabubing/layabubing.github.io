const deck = document.querySelector(".turntable");
const record = deck.querySelector(".record");
const spinSwitch = deck.querySelector(".spin-switch");
const speed = deck.querySelector("input");
const readout = deck.querySelector("output");
let rotation = 0;
let playing = false;
let drag = null;
let frame = null;
let previousTime = null;

function draw() {
  rotation %= 360;
  record.style.setProperty("--rotation", rotation + "deg");
}

function advance(time) {
  if (previousTime !== null) rotation += (time - previousTime) * speed.valueAsNumber * 0.006;
  previousTime = time;
  draw();
  frame = requestAnimationFrame(advance);
}

function updatePlayback() {
  cancelAnimationFrame(frame);
  previousTime = null;
  if (playing && drag === null && !document.hidden) frame = requestAnimationFrame(advance);
}

spinSwitch.addEventListener("click", () => {
  playing = !playing;
  spinSwitch.setAttribute("aria-pressed", String(playing));
  deck.classList.toggle("playing", playing);
  updatePlayback();
});

speed.addEventListener("input", () => {
  readout.value = speed.value + " RPM";
});

function pointerAngle(event) {
  return Math.atan2(event.clientY - drag.y, event.clientX - drag.x) * 180 / Math.PI;
}

record.addEventListener("pointerdown", event => {
  if (drag || event.button !== 0) return;
  const bounds = record.parentElement.getBoundingClientRect();
  const centerX = bounds.left + record.offsetLeft + record.offsetWidth / 2;
  const centerY = bounds.top + record.offsetTop + record.offsetHeight / 2;
  drag = { id: event.pointerId, x: centerX, y: centerY };
  drag.angle = pointerAngle(event);
  record.setPointerCapture(event.pointerId);
  updatePlayback();
});

record.addEventListener("pointermove", event => {
  if (drag?.id !== event.pointerId) return;
  const nextAngle = pointerAngle(event);
  rotation += nextAngle - drag.angle;
  drag.angle = nextAngle;
  draw();
});

record.addEventListener("lostpointercapture", event => {
  if (drag?.id !== event.pointerId) return;
  drag = null;
  updatePlayback();
});

document.addEventListener("visibilitychange", updatePlayback);
deck.querySelector(".deck-controls").hidden = false;
