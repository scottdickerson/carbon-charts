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
import { Service } from "./service";
import { AxisPositions, AxisTypes, ScaleTypes } from "../interfaces";
var Axes = /** @class */ (function (_super) {
    __extends(Axes, _super);
    function Axes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Find the main x-axis out of the 2 x-axis on the chart (when 2D axis is used)
    Axes.prototype.getMainXAxis = function () {
        var primaryAxis = this.model.get(AxisTypes.PRIMARY);
        var secondaryAxis = this.model.get(AxisTypes.SECONDARY);
        if (primaryAxis === this.model.get(AxisPositions.TOP) || primaryAxis === this.model.get(AxisPositions.BOTTOM)) {
            return primaryAxis;
        }
        else if (secondaryAxis === this.model.get(AxisPositions.TOP) || secondaryAxis === this.model.get(AxisPositions.BOTTOM)) {
            return secondaryAxis;
        }
        else {
            return this.model.get(AxisPositions.BOTTOM);
        }
    };
    // Find the main y-axis out of the 2 y-axis on the chart (when 2D axis is used)
    Axes.prototype.getMainYAxis = function () {
        var primaryAxis = this.model.get(AxisTypes.PRIMARY);
        var secondaryAxis = this.model.get(AxisTypes.SECONDARY);
        if (primaryAxis === this.model.get(AxisPositions.LEFT) || primaryAxis === this.model.get(AxisPositions.RIGHT)) {
            return primaryAxis;
        }
        else if (secondaryAxis === this.model.get(AxisPositions.LEFT) || secondaryAxis === this.model.get(AxisPositions.RIGHT)) {
            return secondaryAxis;
        }
        else {
            return this.model.get(AxisPositions.LEFT);
        }
    };
    Axes.prototype.getXValue = function (d, i) {
        return this.getMainXAxis().getValueFromScale(d, i);
    };
    Axes.prototype.getYValue = function (d, i) {
        return this.getMainYAxis().getValueFromScale(d, i);
    };
    /** Uses the primary Y Axis to get data items associated with that value.  */
    Axes.prototype.getDataFromDomain = function (domainValue) {
        var displayData = this.model.getDisplayData();
        var activePoints = [];
        var scaleType = this.getMainXAxis().scaleType;
        switch (scaleType) {
            case ScaleTypes.LABELS:
                // based on labels we use the index to get the associated data
                var index_1 = displayData.labels.indexOf(domainValue);
                displayData.datasets.forEach(function (dataset) {
                    activePoints.push({
                        datasetLabel: dataset.label,
                        value: dataset.data[index_1],
                    });
                });
                break;
            case ScaleTypes.TIME:
                // time series we filter using the date
                var domainKey_1 = Object.keys(displayData.datasets[0].data[0]).filter(function (key) { return key !== "value"; })[0];
                displayData.datasets.forEach(function (dataset) {
                    var sharedLabel = dataset.label;
                    // filter the items in each dataset for the points associated with the Domain
                    var dataItems = dataset.data.filter(function (item) {
                        var date1 = new Date(item[domainKey_1]);
                        var date2 = new Date(domainValue);
                        return date1.getTime() === date2.getTime();
                    });
                    // assign the shared label on the data items and add them to the array
                    dataItems.forEach(function (item) {
                        activePoints.push(Object.assign({ datasetLabel: sharedLabel,
                            value: item.value,
                        }, item));
                    });
                });
                break;
        }
        return activePoints;
    };
    return Axes;
}(Service));
export { Axes };
//# sourceMappingURL=../../src/services/axes.js.map