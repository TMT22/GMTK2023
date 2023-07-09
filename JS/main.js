

// Canvas width/height hardcoded to 384/216
// Css takes care of scaling
let canvas = document.getElementById('GUICanvas');
let dummy_canvas = document.getElementById('DummyCanvas');

//interface.resize_canvas()
//window.addEventListener("resize", () => {interface.resize_canvas()});

let game_manager = new GameManager(canvas, dummy_canvas)

canvas.addEventListener("mousemove", (event) => {game_manager.update_mouse_pos(event)});
canvas.addEventListener("click", (event) => {game_manager.click_event(event)});
window.addEventListener("keydown", (event) => {game_manager.keypress_event(event)});
var start = Date.now();
function gameLoop() {
    var current = Date.now(),
    delta_t = current - start;
    start = current;
    game_manager.update(delta_t)
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);