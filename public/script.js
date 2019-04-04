let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
console.log(ctx);

let cursor = { x: 0, y: 0 };
let last_cursor = { x: 0, y: 0 };

$(canvas).on("mousemove", function(evt) {
    last_cursor.x = cursor.x;
    last_cursor.y = cursor.y;
    cursor.x = evt.pageX - this.offsetLeft;
    cursor.y = evt.pageY - this.offsetTop;
});

$(canvas).on("mousedown", function() {
    $(canvas).on("mousemove", draw);
});

$(canvas).on("mouseup mouseout", function() {
    $(canvas).off("mousemove", draw);
    $(".signature-hidden").val(canvas.toDataURL());
});

let draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(last_cursor.x, last_cursor.y);
    ctx.lineTo(cursor.x, cursor.y);
    ctx.closePath();
    ctx.stroke();
};

//mouse move//
//watch the event//
//layer X Y//
