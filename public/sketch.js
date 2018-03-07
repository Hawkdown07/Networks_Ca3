// Keep track of our socket connection
var socket;
//variable for color
var c;
//variable for size of lines
var s;

function setup() {
	//gets elements from index.html
  var colors = document.getElementsByClassName('color');
   var sizes = document.getElementsByClassName('LineThic');
  createCanvas(1000, 800);
  background(255,255,255);
  //asigns defaults to colour and size
   c = 'purple';
   s = 1;

   for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }
  for (var i = 0; i < sizes.length; i++){
    sizes[i].addEventListener('click', onSizeUpdate, false);
  }
  // Start a socket connection to the server
  socket = io.connect('http://localhost:3000');
  // We make a named event called 'mouse' and write an anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
		//uses line size to also asigns eraser size
		var es = data.ls * 10;
      console.log("Got: " + data.x + " " + data.y );
	  console.log("Got: " + data.col );
	  //checks to see if white(erase) is selected 
	  if (data.col == "white"){
		  rect(data.x,data.y, es, es);
		  noStroke();
	  }
	  else{
		  //gets data and asigns it to a remake of drawing given by server
	  strokeWeight(data.ls);
	  line(data.x,data.y,data.x2, data.y2);
	  stroke(color(data.col));
	  }
    }
  );
}
//chooses color and size depending on where the user clicks
function onColorUpdate(e){
    c = e.target.className.split(' ')[1];
  }
  function onSizeUpdate(e){
    s = e.target.className.split(' ')[1];
  }

function mouseDragged() {
	 var es = s * 10;
	 //checks to see if white(erase) is selected 
	 if (c == "white"){
		 //rect(mouseX,mouseY,pmouseX, pmouseY);
		  rect(mouseX,mouseY,es, es);
		  //fill(color('white'));
		  noStroke();
	  }
	  else{
	 //else just draws line
  strokeWeight(s);
  line(mouseX,mouseY,pmouseX, pmouseY);
  stroke(color(c));
	  }
  // Send the mouse coordinates
  sendmouse(mouseX,mouseY,pmouseX, pmouseY,c, s);
}

// Function for sending to the socket
function sendmouse(xpos, ypos, xppos, yppos, c, s) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);

  // Make a object with all variables need to recreate
  var data = {
    x: xpos,
    y: ypos,
	x2: xppos,
	y2: yppos,
	col: c,
	ls: s
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
				