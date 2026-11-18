const deck = document.querySelector(".turntable");
const record = deck.querySelector(".record");
const spinSwitch = deck.querySelector(".spin-switch");
const speed = deck.querySelector("input");
const readout = deck.querySelector("output");
const turnsPerSide = 16;
let rotation = 0;
let playing = false;
let drag = null;
let frame = null;
let previousTime = null;

function draw() {
  const sideDegrees = turnsPerSide * 360;
  rotation = (rotation % sideDegrees + sideDegrees) % sideDegrees;
  record.style.setProperty("--rotation", rotation % 360 + "deg");

  // 前十五圈向内循迹，最后一圈平滑返回外缘。
  const turns = rotation / 360;
  const returnTurn = turns - (turnsPerSide - 1);
  const groove = returnTurn < 0 ? turns / (turnsPerSide - 1) : (1 + Math.cos(Math.PI * returnTurn)) / 2;
  const sway = 0.75 * Math.sin(rotation * Math.PI / 180);
  deck.style.setProperty("--needle-angle", 37 + 19 * groove + sway + "deg");
}

function advance(time) {
  if (previousTime !== null) rotation += (time - previousTime) * speed.valueAsNumber * 0.006;
  previousTime = time;
  draw();
  frame = requestAnimationFrame(advance);
}

function updatePlayback() {
  deck.classList.toggle("tracking", playing || drag !== null);
  cancelAnimationFrame(frame);
  previousTime = null;
  if (playing && drag === null && !document.hidden) frame = requestAnimationFrame(advance);
}

spinSwitch.addEventListener("click", () => {
  playing = !playing;
  spinSwitch.setAttribute("aria-pressed", String(playing));
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
  const bounds = record.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  drag = { id: event.pointerId, x: centerX, y: centerY };
  drag.angle = pointerAngle(event);
  record.setPointerCapture(event.pointerId);
  updatePlayback();
});

record.addEventListener("pointermove", event => {
  if (drag?.id !== event.pointerId) return;
  const nextAngle = pointerAngle(event);
  rotation += ((nextAngle - drag.angle + 540) % 360) - 180;
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
