const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const $canvas = $(canvas);

const cursor = { x: 0, y: 0, last: { x: 0, y: 0 } };

$canvas.on("mousemove", e => {
    cursor.last.x = cursor.x;
    cursor.last.y = cursor.y;
    cursor.x = e.pageX - canvas.offsetLeft;
    cursor.y = e.pageY - canvas.offsetTop;
});

$canvas.on("mousedown", () => {
    $canvas.on("mousemove", draw);
});

$canvas.on("mouseup mouseout", () => {
    $canvas.off("mousemove", draw);
    $(".signature-hidden").val(canvas.toDataURL());
});

function draw() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(cursor.last.x, cursor.last.y);
    ctx.lineTo(cursor.x, cursor.y);
    ctx.closePath();
    ctx.stroke();
}

//mouse move//
//watch the event//
//layer X Y//
