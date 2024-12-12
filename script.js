const queryString = window.location.search;
const navigatorLanguage = navigator.language;
if (queryString.length === 0) {
  if (["es", "en"].some((e) => e === navigatorLanguage.substring(0, 2))) {
    window.location.replace(
      `${window.location.href}?Id=${navigatorLanguage.substring(0, 2)}`
    );
  } else {
    window.location.replace(`${window.location.href}?Id=es`);
  }
}

const languageURL = new URLSearchParams(queryString).get("Id");
const languageButton = document.querySelector("#languageButton");

const aboutContainer = document.querySelector("div#about");
const root = document.querySelector(":root");
const presentation1Element = document.querySelector("h1#presentation-1");
const presentation2Element = document.querySelector("h2#presentation-2");

const navLinksEls = document.querySelectorAll("div#navbar-start a");
const sectionEls = document.querySelectorAll("section");
const buttonNavBar = document.querySelector("button#navbar-button");

const projects = [
  {
    name: "Furniro",
    link: {
      en: "https://furniro-nine-orpin.vercel.app/en",
      es: "https://furniro-nine-orpin.vercel.app/es"
    },
    image: {
      en: "./public/proyectos/en/furniro.avif",
      es: "./public/proyectos/es/furniro.avif"
    },
    tec: [
      "React",
      "Next.js",
      "Tailwind CSS"
    ]
  },
  {
    name: "Clim-api",
    link: {
      en: "https://clim-api-yerays-projects-61a4d539.vercel.app/Inicio",
      es: "https://clim-api-yerays-projects-61a4d539.vercel.app/Inicio"
    },
    image: {
      en: "./public/proyectos/es/clim-api.avif",
      es: "./public/proyectos/es/clim-api.avif"
    },
    tec: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "API"
    ]
  }
]

if (languageURL === "en") {
  languageButton.value = "es";
  const imgButton = languageButton.querySelector("img");
  imgButton.src = imgButton.src.replace("GB", "ES");
  imgButton.alt = "Español";
}

aboutContainer.addEventListener("mousemove", (event) => {
  root.style.setProperty("--Xpx-gradient", `${event.layerX}px`);
  root.style.setProperty("--Ypx-gradient", `${event.layerY}px`);
});

aboutContainer.addEventListener("mouseleave", () => {
  setTimeout(() => {
    root.style.setProperty("--Xpx-gradient", `${-2220}px`);
    root.style.setProperty("--Ypx-gradient", `${-2220}px`);
  }, 50);
});

/* Store the element in el */
let flock;
let presentation1Progress = 0;
let presentation2Progress = 0;
let currentSection = "inicio";
let [typedMessage1, typedMessage2] =
  languageURL === "es" ? ["¡Hola!", "Soy Yeray"] : ["Hi!", "I'm Yeray"];

window.addEventListener("scroll", () => {
  sectionEls.forEach((sectionEl) => {
    if (window.scrollY >= sectionEl.offsetTop - sectionEl.clientHeight / 3) {
      currentSection = sectionEl.id;
    }
  });

  navLinksEls.forEach((navLinkEl) => {
    if (navLinkEl.href.includes(currentSection)) {
      document.querySelector(".active-link").classList.remove("active-link");
      navLinkEl.classList.add("active-link");
    }
  });
});

navLinksEls.forEach((navLinkEl) => {
  navLinkEl.addEventListener("click", () => {
    buttonNavBar.click();
  });
});

function setup() {
  createCanvas(window.screen.width, window.screen.height);

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let b = new Boid(width / 2, height / 2);
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

Flock.prototype.run = function () {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
  }
};

Flock.prototype.addBoid = function (b) {
  this.boids.push(b);
};

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
  this.maxspeed = 3; // Maximum speed
  this.maxforce = 0.1; // Maximum steering force
}

Boid.prototype.run = function (boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
};

Boid.prototype.applyForce = function (force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
};

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function (boids) {
  let sep = this.separate(boids); // Separation
  let ali = this.align(boids); // Alignment
  let coh = this.cohesion(boids); // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.6);
  ali.mult(1.0);
  coh.mult(0.7);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
};

// Method to update location
Boid.prototype.update = function () {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
};

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function (target) {
  let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force
  return steer;
};

Boid.prototype.render = function () {
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
};

// Wraparound
Boid.prototype.borders = function () {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
};

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function (boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if (d > 0 && d < desiredseparation) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
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
};

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function (boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if (d > 0 && d < neighbordist) {
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
};

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function (boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if (d > 0 && d < neighbordist) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum); // Steer towards the location
  } else {
    return createVector(0, 0);
  }
};

fetch(`./dictionaries/${languageURL}.json`).then((res) =>
  res.json().then((data) => {
    for (let id of Object.keys(data)) {
      document.querySelector(`#${id}`).innerText = data[id];
      if (id === "DwnCVTxt") document.querySelector(`#${id}`).title = data[id];

    }

    projects.forEach(project => {

      const projectDiv = document.createElement('div');
      projectDiv.className = "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden relative";

      const titleDiv = document.createElement('div');
      titleDiv.className = "flex flex-col space-y-1.5 p-4 absolute top-0 left-0 right-0 bg-black/50 z-10";
      const title = document.createElement('h3');
      title.className = "text-2xl font-semibold leading-none tracking-tight text-white";
      title.textContent = project.name; 
      titleDiv.appendChild(title);

      const img = document.createElement('img');
      img.alt = project.name;
      img.loading = "lazy";
      img.width = 300;
      img.height = 200;
      img.className = "w-full h-64 object-cover";
      img.src = project.image[languageURL]; 

      const footerDiv = document.createElement('div');
      footerDiv.className = "p-4 absolute bottom-0 left-0 right-0 flex justify-between items-end bg-gradient-to-t from-black/70 to-transparent";

      const techDiv = document.createElement('div');
      techDiv.className = "flex flex-wrap gap-2";
      project.tec.forEach(tech => {
        const badge = document.createElement('div');
        badge.className = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-white/20 text-white hover:bg-black/80";
        badge.textContent = tech; 
        techDiv.appendChild(badge);
      });

      footerDiv.appendChild(techDiv);

      const link = document.createElement('a');
      link.href = project.link[languageURL]; 
      link.target = "_blank";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.className = "lucide lucide-globe w-6 h-6 text-white";

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "12");
      circle.setAttribute("cy", "12");
      circle.setAttribute("r", "10");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20");

      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", "M2 12h20");

      svg.appendChild(circle);
      svg.appendChild(path1);
      svg.appendChild(path2);
      link.appendChild(svg);

      footerDiv.appendChild(link);

      projectDiv.appendChild(titleDiv);
      projectDiv.appendChild(img);
      projectDiv.appendChild(footerDiv);

      document.querySelector("#projects-grid").appendChild(projectDiv);
    })

    document.body.classList.replace("overflow-y-hidden", "overflow-y-auto");
    document
      .querySelector("div.loader-wrapper")
      .classList.add("opacity-0",);

    setTimeout(() => {
      document
        .querySelector("div.loader-wrapper")
        .classList.add("hidden");
    }, 400)

    const intervalPresentation1 = setInterval(() => {
      presentation1Element.innerText = typedMessage1.substring(
        0,
        presentation1Progress
      );
      presentation1Progress++;
      if (presentation1Progress > typedMessage1.length) {
        clearInterval(intervalPresentation1);
        presentation1Element.classList.add("remove-cursor");
        presentation2Element.classList.add("pb-2");
      }
    }, 100);

    const intervalPresentation2 = setInterval(() => {
      if (presentation1Progress > typedMessage1.length) {
        presentation2Element.innerText = typedMessage2.substring(
          0,
          presentation2Progress
        );
        presentation2Progress++;
        if (presentation2Progress > typedMessage2.length)
          clearInterval(intervalPresentation2);
      }
    }, 100);
  })
);
