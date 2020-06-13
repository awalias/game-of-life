import { initialState } from "./initialState.js";

$(document).ready(function () {
  let canvas = document.getElementById("mycanvas");
  var ctx = canvas.getContext("2d");

  const ROWS = Math.floor(canvas.offsetHeight / 10);
  const COLUMNS = Math.floor(canvas.offsetWidth / 10);
  let run = false;

  let state = initialState;

  // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  // Any live cell with two or three live neighbours lives on to the next generation.
  // Any live cell with more than three live neighbours dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  const nextState = () => {
    let newState = Array(ROWS)
      .fill()
      .map(() => Array(COLUMNS));

    for (var i = 0; i < state.length; i++) {
      for (var j = 0; j < state[i].length; j++) {
        // edges
        if (!i || !j || i === state.length - 1 || j === state.length - 1) {
          newState[i][j] = 0;
        } else {
          const live = state[i][j];
          let neighbourCount =
            state[i - 1][j - 1] +
            state[i + 1][j + 1] +
            state[i - 1][j + 1] +
            state[i + 1][j - 1] +
            state[i][j + 1] +
            state[i][j - 1] +
            state[i - 1][j] +
            state[i + 1][j];

          newState[i][j] = live
            ? neighbourCount === 2
              ? 1
              : neighbourCount === 3
              ? 1
              : 0
            : Number(neighbourCount === 3);
        }
      }
    }

    state = newState;

    return;
  };

  const draw = () => {
    for (var i = 0; i < state.length; i++) {
      for (var j = 0; j < state[i].length; j++) {
        ctx.fillStyle = state[i][j] ? "#9563b5" : "#fad9f6";
        ctx.fillRect(j * 10, i * 10, i * 10 + 10, j * 10 + 10);
      }
    }

    if (run) {
      setTimeout(() => {
        if (run) {
          nextState();
          draw();
        }
      }, 500);
    }
  };

  $("#step").click(() => {
    nextState();
    draw();
  });

  $("#run").click(() => {
    run = !run;
    $("#run").html(run ? "Stop" : "Run");
    if (run === true) {
      nextState();
      draw();
    }
  });

  $("#mycanvas").click((e) => {
    getCursorPosition(canvas, e);
  });

  $("#clear").click(() => {
    state = Array(ROWS)
      .fill()
      .map(() => Array(COLUMNS).fill(0));
    draw();
    run = false;
    $("#run").html(run ? "Stop" : "Run");
  });

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - 10 - rect.left) / 10);
    const y = Math.floor((event.clientY - 10 - rect.top) / 10);
    state[y][x] = !state[y][x];
    draw();
  }

  draw();
});
