// Internal Imports
import {
	ChartConfig,
	BaseChartOptions,
	LayoutGrowth,
	LayoutDirection,
	LegendOrientations,
	ChartTheme
} from "./interfaces/index";

// Misc
import { ChartModel } from "./model";
import { Component,
	Title,
	Legend,
	LayoutComponent,
	Tooltip
} from "./components";
import { Tools } from "./tools";

// Services
import {
	DOMUtils,
	Events,
	Themes,
	Transitions
} from "./services/index";

export class Chart {
	components: Component[];
	services: any = {
		domUtils: DOMUtils,
		events: Events,
		transitions: Transitions,
		themes: Themes
	};
	model: ChartModel = new ChartModel(this.services);

	constructor(holder: Element, chartConfigs: ChartConfig<BaseChartOptions>) {}

	// Contains the code that uses properties that are overridable by the super-class
	init(holder: Element, chartConfigs: ChartConfig<BaseChartOptions>) {
		// Store the holder in the model
		this.model.set({ holder }, true);

		// Initialize all services
		Object.keys(this.services).forEach(serviceName => {
			const serviceObj = this.services[serviceName];
			this.services[serviceName] = new serviceObj(this.model, this.services);
		});

		// Call update() when model has been updated
		this.services.events
			.addEventListener("model-update", () => {
				this.update(true);
			});

		// Set model data & options
		this.model.setData(chartConfigs.data);

		// Set chart resize event listener
		this.services.events
			.addEventListener("chart-resize", () => {
				this.update(false);
			});

		this.components = this.getComponents();

		this.update();
	}

	getComponents(): any[] {
		console.error("getComponents() method is not implemented");

		return null;
	}



	update(animate = true) {
		if (!this.components) {
			return;
		}

		// Render all components
		this.components.forEach(component => component.render(animate));

		// Asynchronously dispatch a "render-finished" event
		// This is needed because of d3-transitions
		// Since at the start of the transition
		// Elements do not hold their final size or position
		const pendingTransitions = this.services.transitions.getPendingTransitions();
		const promises = Object.keys(pendingTransitions)
			.map(transitionID => {
				const transition = pendingTransitions[transitionID];
				return transition.end()
					.catch(e => e); // Skip rejects since we don't care about those;
			});

		Promise.all(promises)
			.then(() => this.services.events.dispatchEvent("render-finished"));
	}

	destroy() {
		// Call the destroy() method on all components
		this.components.forEach(component => component.destroy());

		// Remove the chart holder
		this.services.domUtils.getHolder().remove();

		this.model.set({ destroyed: true }, true);
	}


	protected getChartComponents(graphFrameComponents: any[]) {
		const titleComponent = {
			id: "title",
			components: [
				new Title(this.model, this.services)
			],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		const legendComponent = {
			id: "legend",
			components: [
				new Legend(this.model, this.services)
			],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		const graphFrameComponent = {
			id: "graph-frame",
			components: graphFrameComponents,
			growth: {
				x: LayoutGrowth.STRETCH,
				y: LayoutGrowth.FIXED
			}
		};

		// TODORF - REUSE BETWEEN AXISCHART & CHART
		// Decide the position of the legend in reference to the chart
		let fullFrameComponentDirection = LayoutDirection.COLUMN;
		const legendPosition = Tools.getProperty(this.model.getOptions(), "legend", "position");
		if (legendPosition === "left") {
			fullFrameComponentDirection = LayoutDirection.ROW;

			if (!this.model.getOptions().legend.orientation) {
				this.model.getOptions().legend.orientation = LegendOrientations.VERTICAL;
			}
		} else if (legendPosition === "right") {
			fullFrameComponentDirection = LayoutDirection.ROW_REVERSE;

			if (!this.model.getOptions().legend.orientation) {
				this.model.getOptions().legend.orientation = LegendOrientations.VERTICAL;
			}
		} else if (legendPosition === "bottom") {
			fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
		}

		const fullFrameComponent = {
			id: "full-frame",
			components: [
				new LayoutComponent(
					this.model,
					this.services,
					[
						...((this.model.getOptions().legend.visible !== false) ? [ legendComponent ] : [ ]),
						graphFrameComponent
					],
					{
						direction: fullFrameComponentDirection
					}
				)
			],
			growth: {
				x: LayoutGrowth.STRETCH,
				y: LayoutGrowth.FIXED
			}
		};

		// Add chart title if it exists
		const topLevelLayoutComponents = [];
		if (this.model.getOptions().title) {
			topLevelLayoutComponents.push(titleComponent);
		}
		topLevelLayoutComponents.push(fullFrameComponent);

		return [
			new LayoutComponent(
				this.model,
				this.services,
				topLevelLayoutComponents,
				{
					direction: LayoutDirection.COLUMN
				}
			)
		];
	}
}
