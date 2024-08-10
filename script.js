const aboutContainer = document.querySelector("div#about");
const root = document.querySelector(':root');
const presentation1Element = document.querySelector("h1#presentation-1");
const presentation2Element = document.querySelector("h2#presentation-2");

const imageWel = document.getElementById('tilt')
/* Get the height and width of the element */
const heightImageWel = imageWel.clientHeight
const widthImageWel = imageWel.clientWidth

aboutContainer.addEventListener("mousemove", (event) => {
    root.style.setProperty('--Xpx-gradient', `${event.layerX}px`);
    root.style.setProperty('--Ypx-gradient', `${event.layerY}px`);
});

aboutContainer.addEventListener("mouseleave", () => {
    setTimeout(() => {
        root.style.setProperty('--Xpx-gradient', `${-2220}px`);
        root.style.setProperty('--Ypx-gradient', `${-2220}px`);
    }, 50)
});

/* Store the element in el */
let flock;
let presentation1Progress = 0;
let presentation2Progress = 0;


/*
  * Add a listener for mousemove event
  * Which will trigger function 'handleMove'
  * On mousemove
  */
imageWel.addEventListener('mousemove', handleMove)

/* Define function a */
function handleMove(e) {
  /*
    * Get position of mouse cursor
    * With respect to the element
    * On mouseover
    */
  /* Store the x position */
  const xVal = e.layerX
  /* Store the y position */
  const yVal = e.layerY
  
  /*
    * Calculate rotation valuee along the Y-axis
    * Here the multiplier 20 is to
    * Control the rotation
    * You can change the value and see the results
    */
  const yRotation = 20 * ((xVal - widthImageWel / 2) / widthImageWel)
  
  /* Calculate the rotation along the X-axis */
  const xRotation = -20 * ((yVal - heightImageWel / 2) / heightImageWel)
  
  /* Generate string for CSS transform property */
  const string = 'perspective(500px) scale(1.04) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'
  
  /* Apply the calculated transformation */
  imageWel.style.transform = string
}

/* Add listener for mouseout event, remove the rotation */
imageWel.addEventListener('mouseout', function() {
  imageWel.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)'
})

// /* Add listener for mousedown event, to simulate click */
// imageWel.addEventListener('mousedown', function() {
//   imageWel.style.transform = 'perspective(500px) scale(0.9) rotateX(0) rotateY(0)'
// })

// /* Add listener for mouseup, simulate release of mouse click */
// imageWel.addEventListener('mouseup', function() {
//   imageWel.style.transform = 'perspective(500px) scale(1.1) rotateX(0) rotateY(0)'
// })

const intervalPresentation1 = setInterval(() => {
  presentation1Element.innerText = "¡Hola!".substring(0, presentation1Progress);
  presentation1Progress++;
  if (presentation1Progress > "¡Hola!".length) {
    clearInterval(intervalPresentation1)
    presentation1Element.classList.add("remove-cursor");
    presentation2Element.classList.add("pb-2");
  };
}, 100);

const intervalPresentation2 = setInterval(() => {
  if (presentation1Progress > "¡Hola!".length){
    presentation2Element.innerText = "Soy Yeray".substring(0, presentation2Progress);
    presentation2Progress++;
    if (presentation2Progress > "Soy Yeray".length) clearInterval(intervalPresentation2);
  }
}, 100);


function setup() {
  createCanvas(window.screen.width, window.screen.height);

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let b = new Boid(width / 2,height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  background(253, 224, 71);
  flock.run();
}

// Add a new boid into the System
function mouseClicked() {
  flock.addBoid(new Boid(mouseX, mouseY));
  flock.addBoid(new Boid(mouseX, mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 4.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.1; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.6);
  ali.mult(1.0);
  coh.mult(0.7);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  fill(55);
  stroke(200);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r * 3);
  vertex(-this.r, this.r * 3);
  vertex(this.r, this.r * 3);
  endShape(CLOSE);
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}


