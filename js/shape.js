export default class Circle {
	constructor(options = {}) {
		this.position = options.position;
		this.fillColor = options.fillColor;
		this.radius = options.radius;
		this.config = options.config;
		this.svgNs = "http://www.w3.org/2000/svg";
	}
	draw(groupElement) {
		let circle = document.createElementNS(this.svgNs, "circle");
		let rect = document.createElementNS(this.svgNs, "rect");

		circle.setAttributeNS(null, "cx", this.position.x);
		circle.setAttributeNS(null, "cy", this.position.y);
		circle.setAttributeNS(null, "r", this.radius * this.config.circleRadiusOffset);
		circle.setAttributeNS(null, "fill", this.fillColor);
		circle.setAttributeNS(null, "stroke", "none");

		rect.setAttributeNS(
			null,
			"x",
			this.position.x -
				this.radius *
					(this.config.rectPositionFactor != undefined
						? this.config.rectPositionFactor
						: 1)
		);
		rect.setAttributeNS(null, "y", this.position.y);
		rect.setAttributeNS(null, "width", this.radius * 2 * this.config.rectRadiusOffset);
		rect.setAttributeNS(null, "height", innerHeight);
		rect.setAttributeNS(null, "fill", this.fillColor);
		rect.setAttributeNS(null, "stroke", "none");

		groupElement.appendChild(circle);
		groupElement.appendChild(rect);
	}
}
