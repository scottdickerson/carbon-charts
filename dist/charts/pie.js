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
import { PieChartModel } from "../model-pie";
import { Chart } from "../chart";
import * as Configuration from "../configuration";
import { Tools } from "../tools";
// Components
import { Pie, 
// the imports below are needed because of typescript bug (error TS4029)
Tooltip } from "../components/index";
var PieChart = /** @class */ (function (_super) {
    __extends(PieChart, _super);
    // TODO - Optimize the use of "extending"
    function PieChart(holder, chartConfigs, extending) {
        if (extending === void 0) { extending = false; }
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.model = new PieChartModel(_this.services);
        // TODO - Optimize the use of "extending"
        if (extending) {
            return _this;
        }
        // Merge the default options for this chart
        // With the user provided options
        _this.model.setOptions(Tools.merge(Tools.clone(Configuration.options.pieChart), chartConfigs.options));
        // Initialize data, services, components etc.
        _this.init(holder, chartConfigs);
        return _this;
    }
    PieChart.prototype.getComponents = function () {
        // Specify what to render inside the graph-frame
        var graphFrameComponents = [
            new Pie(this.model, this.services)
        ];
        // get the base chart components and export with tooltip
        var components = this.getChartComponents(graphFrameComponents);
        components.push(new Tooltip(this.model, this.services));
        return components;
    };
    return PieChart;
}(Chart));
export { PieChart };
//# sourceMappingURL=../../src/charts/pie.js.map