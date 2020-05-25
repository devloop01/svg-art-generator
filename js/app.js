console.clear();

import Shape from "./shape.js";

const GUI = new dat.GUI();
let settings = {
	setups: {
		long: true,
		puzzle: false,
		circles: false,
		flat: false,
		semi: false,
	},
	redraw: function () {
		draw();
	},
	saveAs: {
		svg: true,
		png: false,
	},
	save: function () {
		const format = Object.entries(this.saveAs)
			.filter((el) => el[1] === true)
			.flat()[0];
		download(format);
	},
};

const setupConfigs = [
	{
		// Normal
		circleRadiusOffset: 1,
		rectRadiusOffset: 1,
	},
	{
		// Puzzle
		circleRadiusOffset: 0.5,
		rectRadiusOffset: 1,
	},
	{
		// Circles
		circleRadiusOffset: 2,
		rectRadiusOffset: 2,
	},
	{
		// Flat
		circleRadiusOffset: 0,
		rectRadiusOffset: 2,
	},
	{
		// Semi
		circleRadiusOffset: 4,
		rectRadiusOffset: 4,
		rectPositionFactor: 4,
	},
];

const randomHSLFunctions = [
	(x, y) =>
		`hsl(${(x * y) % (Math.random() * 360)}, ${25 + Math.random() * 50}%, ${
			15 + Math.random() * 45
		}%)`,
	(x, y) =>
		`hsl(${(x * y) % (Math.cos(Math.random()) * 180)}, ${15 + Math.sin(Math.random()) * 50}%, ${
			(Math.cos(Math.random()) + Math.sin(Math.random())) * 35
		}%)`,
	(x, y) =>
		`hsl(${(x * y) % (Math.sin(Math.random()) * 360)}, ${25 + Math.cos(Math.random()) * 50}%, ${
			(Math.sin(Math.random()) + Math.cos(Math.random())) * 45
		}%)`,
	(x, y) =>
		`hsl(${y % 360}, ${50 + Math.random() * (x % 50)}%, ${
			45 + Math.random() * ((x * y) % 5)
		}%)`,
];

const svgNs = "http://www.w3.org/2000/svg";
let svg;
let w;
let h;

function setup() {
	svg = document.querySelector("svg");
	window.addEventListener("resize", onResize);
	onResize();
	setupUI();
}

function draw() {
	let group = document.querySelector("g");
	if (group) group.remove();

	group = document.createElementNS(svgNs, "g");
	group.setAttribute("fill", "none");
	group.setAttribute("stroke", "black");
	group.setAttribute("stroke-linecap", "round");
	group.setAttribute("stroke-linejoin", "round");

	let shapes = [];
	let cellSize = 60 + Math.random() * 40;
	let cols = Math.floor(w / cellSize) + 4,
		rows = Math.floor(h / cellSize) + 4;
	let gap = 80 + Math.random() * 40;

	let currentConfigIndex = Object.entries(settings.setups)
		.map((el) => el[1])
		.indexOf(true);
	let currentConfig = setupConfigs[currentConfigIndex];

	let hslFunction = getRandomHSLFunction(randomHSLFunctions);

	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			let randomPos = {
				x: x * cellSize - cellSize / 2,
				y: y * cellSize + (Math.random() + 0.5) * gap - cellSize * 4,
			};

			shapes.push(
				new Shape({
					position: {
						x: randomPos.x,
						y: randomPos.y,
					},
					fillColor: hslFunction(randomPos.x, randomPos.y),
					radius: cellSize / 2,
					config: currentConfig,
				})
			);
		}
	}

	shapes.forEach((c) => c.draw(group));

	svg.appendChild(group);
}

function onResize() {
	w = window.innerWidth;
	h = window.innerHeight;
	svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
	draw();
}

function download(format) {
	let svgDoc = svg.outerHTML;
	let filename = `pattern.${format}`;

	if (format === "svg") {
		let element = document.createElement("a");
		element.setAttribute("download", filename);
		element.setAttribute(
			"href",
			"data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgDoc)
		);
		element.style.display = "none";
		document.body.appendChild(element);
		element.addEventListener("click", (e) => e.stopPropagation());
		element.click();
		document.body.removeChild(element);
	} else if (format === "png") saveSvgAsPng(document.getElementById("svg"), filename);
}

function setupUI() {
	let setupsFolder = GUI.addFolder("Shape Setups");
	addCheckbox(setupsFolder, settings.setups, "long", "Long", draw);
	addCheckbox(setupsFolder, settings.setups, "puzzle", "Puzzle", draw);
	addCheckbox(setupsFolder, settings.setups, "circles", "Circles", draw);
	addCheckbox(setupsFolder, settings.setups, "flat", "Flat", draw);
	addCheckbox(setupsFolder, settings.setups, "semi", "Semi", draw);

	GUI.add(settings, "redraw").name("Re-Draw");

	let saveAsFolder = GUI.addFolder("Save As");
	addCheckbox(saveAsFolder, settings.saveAs, "svg");
	addCheckbox(saveAsFolder, settings.saveAs, "png");

	GUI.add(settings, "save").name("Save");
}

setup();

///////////////////////////////////////////////////////
// -------------------- UTILS ------------------------
//////////////////////////////////////////////////////

function getRandomHSLFunction(functions) {
	return functions[Math.floor(Math.random() * functions.length)];
}

function getRandomHex(x, y) {
	return "#000000".replace(/0/g, function () {
		return (~~(Math.random() * 16)).toString(16);
	});
}

function getRandomValuesFromList(items) {
	return items[Math.floor(Math.random() * items.length)];
}

function addCheckbox(container, object, prop, name = prop, callback, limitedProps) {
	container
		.add(object, prop)
		.name(name)
		.listen()
		.onChange(function () {
			if (limitedProps) setChecked(object, prop, limitedProps);
			else setChecked(object, prop);
			if (callback) callback();
		});
}

function setChecked(object, prop, limitedProps) {
	if (limitedProps) {
		limitedProps.forEach((p) => {
			if (p == prop) object[p] = true;
			else object[p] = false;
		});
	} else {
		for (let p in object) {
			if (typeof p != Function || typeof p != Number) {
				object[p] = false;
			}
		}
		object[prop] = true;
	}
}
