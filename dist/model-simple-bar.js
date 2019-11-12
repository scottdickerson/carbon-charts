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
import * as Configuration from "./configuration";
import { ChartModel } from "./model";
import { Tools } from "./tools";
import * as colorPalettes from "./services/colorPalettes";
// D3 Imports
import { scaleOrdinal } from "d3-scale";
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
var SimpleBarChartModel = /** @class */ (function (_super) {
    __extends(SimpleBarChartModel, _super);
    function SimpleBarChartModel(services) {
        return _super.call(this, services) || this;
    }
    SimpleBarChartModel.prototype.generateDataLabels = function (newData) {
        var dataLabels = {};
        newData.labels.forEach(function (label) {
            dataLabels[label] = Configuration.legend.items.status.ACTIVE;
        });
        return dataLabels;
    };
    SimpleBarChartModel.prototype.getDisplayData = function () {
        var ACTIVE = Configuration.legend.items.status.ACTIVE;
        var dataLabels = this.get("dataLabels");
        if (!this.get("data")) {
            return null;
        }
        // Remove datasets that have been disabled
        var displayData = Tools.clone(this.get("data"));
        var dataset = displayData.datasets[0];
        // Remove data values that correspond to labels that are disabled
        dataset.data = dataset.data.filter(function (datum, i) {
            var label = displayData.labels[i];
            return dataLabels[label] === ACTIVE;
        });
        // Remove labels that are disabled
        displayData.labels = displayData.labels.filter(function (label) { return dataLabels[label] === ACTIVE; });
        return displayData;
    };
    /*
     * Fill scales
     *
    */
    SimpleBarChartModel.prototype.setColorScale = function () {
        var dataset = this.getDisplayData().datasets[0];
        if (dataset.fillColors) {
            this.colorScale = scaleOrdinal().range(dataset.fillColors).domain(this.allDataLabels);
        }
        else {
            var colors = colorPalettes.DEFAULT;
            this.colorScale = scaleOrdinal().range(colors).domain(this.allDataLabels);
        }
    };
    SimpleBarChartModel.prototype.getFillColor = function (label) {
        var options = this.getOptions();
        if (options.getFillColor) {
            return options.getFillColor(label);
        }
        else {
            return this.getFillScale()(label);
        }
    };
    SimpleBarChartModel.prototype.getStrokeColor = function (label) {
        var options = this.getOptions();
        if (options.getStrokeColor) {
            return options.getStrokeColor(label);
        }
        else {
            return this.colorScale(label);
        }
    };
    return SimpleBarChartModel;
}(ChartModel));
export { SimpleBarChartModel };
//# sourceMappingURL=../src/model-simple-bar.js.map