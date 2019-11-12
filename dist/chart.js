var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Internal Imports
import { LayoutGrowth, LayoutDirection, LegendOrientations } from "./interfaces/index";
// Misc
import { ChartModel } from "./model";
import { Title, Legend, LayoutComponent } from "./components";
import { Tools } from "./tools";
// Services
import { DOMUtils, Events, Themes, Transitions } from "./services/index";
var Chart = /** @class */ (function () {
    function Chart(holder, chartConfigs) {
        this.services = {
            domUtils: DOMUtils,
            events: Events,
            transitions: Transitions,
            themes: Themes
        };
        this.model = new ChartModel(this.services);
    }
    // Contains the code that uses properties that are overridable by the super-class
    Chart.prototype.init = function (holder, chartConfigs) {
        var _this = this;
        // Store the holder in the model
        this.model.set({ holder: holder }, true);
        // Initialize all services
        Object.keys(this.services).forEach(function (serviceName) {
            var serviceObj = _this.services[serviceName];
            _this.services[serviceName] = new serviceObj(_this.model, _this.services);
        });
        // Call update() when model has been updated
        this.services.events
            .addEventListener("model-update", function () {
            _this.update(true);
        });
        // Set model data & options
        this.model.setData(chartConfigs.data);
        // Set chart resize event listener
        this.services.events
            .addEventListener("chart-resize", function () {
            _this.update(false);
        });
        this.components = this.getComponents();
        this.update();
    };
    Chart.prototype.getComponents = function () {
        console.error("getComponents() method is not implemented");
        return null;
    };
    Chart.prototype.update = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        if (!this.components) {
            return;
        }
        // Render all components
        this.components.forEach(function (component) { return component.render(animate); });
        // Asynchronously dispatch a "render-finished" event
        // This is needed because of d3-transitions
        // Since at the start of the transition
        // Elements do not hold their final size or position
        var pendingTransitions = this.services.transitions.getPendingTransitions();
        var promises = Object.keys(pendingTransitions)
            .map(function (transitionID) {
            var transition = pendingTransitions[transitionID];
            return transition.end()
                .catch(function (e) { return e; }); // Skip rejects since we don't care about those;
        });
        Promise.all(promises)
            .then(function () { return _this.services.events.dispatchEvent("render-finished"); });
    };
    Chart.prototype.destroy = function () {
        // Call the destroy() method on all components
        this.components.forEach(function (component) { return component.destroy(); });
        // Remove the chart holder
        this.services.domUtils.getHolder().remove();
        this.model.set({ destroyed: true }, true);
    };
    Chart.prototype.getChartComponents = function (graphFrameComponents) {
        var titleComponent = {
            id: "title",
            components: [
                new Title(this.model, this.services)
            ],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED
            }
        };
        var legendComponent = {
            id: "legend",
            components: [
                new Legend(this.model, this.services)
            ],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED
            }
        };
        var graphFrameComponent = {
            id: "graph-frame",
            components: graphFrameComponents,
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.FIXED
            }
        };
        // TODORF - REUSE BETWEEN AXISCHART & CHART
        // Decide the position of the legend in reference to the chart
        var fullFrameComponentDirection = LayoutDirection.COLUMN;
        var legendPosition = Tools.getProperty(this.model.getOptions(), "legend", "position");
        if (legendPosition === "left") {
            fullFrameComponentDirection = LayoutDirection.ROW;
            if (!this.model.getOptions().legend.orientation) {
                this.model.getOptions().legend.orientation = LegendOrientations.VERTICAL;
            }
        }
        else if (legendPosition === "right") {
            fullFrameComponentDirection = LayoutDirection.ROW_REVERSE;
            if (!this.model.getOptions().legend.orientation) {
                this.model.getOptions().legend.orientation = LegendOrientations.VERTICAL;
            }
        }
        else if (legendPosition === "bottom") {
            fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
        }
        var fullFrameComponent = {
            id: "full-frame",
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays(((this.model.getOptions().legend.visible !== false) ? [legendComponent] : []), [
                    graphFrameComponent
                ]), {
                    direction: fullFrameComponentDirection
                })
            ],
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.FIXED
            }
        };
        // Add chart title if it exists
        var topLevelLayoutComponents = [];
        if (this.model.getOptions().title) {
            topLevelLayoutComponents.push(titleComponent);
        }
        topLevelLayoutComponents.push(fullFrameComponent);
        return [
            new LayoutComponent(this.model, this.services, topLevelLayoutComponents, {
                direction: LayoutDirection.COLUMN
            })
        ];
    };
    return Chart;
}());
export { Chart };
//# sourceMappingURL=../src/chart.js.map