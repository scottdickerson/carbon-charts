var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Internal Imports
import { AxisChart } from "../axis-chart";
import * as Configuration from "../configuration";
import { Tools } from "../tools";
// Components
import { Grid, Scatter, TwoDimensionalAxes, TooltipScatter } from "../components/index";
var ScatterChart = /** @class */ (function (_super) {
    __extends(ScatterChart, _super);
    function ScatterChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.merge(Tools.clone(Configuration.options.scatterChart), chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    ScatterChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new TwoDimensionalAxes(this.model, this.services),
            new Grid(this.model, this.services),
            new Scatter(this.model, this.services)
        ];
        var components = this.getAxisChartComponents(graphFrameComponents);
        components.push(new TooltipScatter(this.model, this.services));
        return components;
    };
    return ScatterChart;
}(AxisChart));
export { ScatterChart };
//# sourceMappingURL=../../src/charts/scatter.js.map