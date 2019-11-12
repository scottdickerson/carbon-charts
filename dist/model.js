// Internal Imports
import * as Configuration from "./configuration";
import { Tools } from "./tools";
import * as colorPalettes from "./services/colorPalettes";
// D3
import { scaleOrdinal } from "d3-scale";
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
var ChartModel = /** @class */ (function () {
    function ChartModel(services) {
        // Internal Model state
        this.state = {
            options: {}
        };
        // Fill scales & fill related objects
        this.patternScale = {};
        this.colorScale = {};
        this.services = services;
    }
    ChartModel.prototype.getDisplayData = function () {
        var ACTIVE = Configuration.legend.items.status.ACTIVE;
        var dataLabels = this.get("dataLabels");
        if (!this.get("data")) {
            return null;
        }
        // Remove datasets that have been disabled
        var displayData = Tools.clone(this.get("data"));
        displayData.datasets = displayData.datasets.filter(function (dataset) {
            return dataLabels[dataset.label] === ACTIVE;
        });
        return displayData;
    };
    ChartModel.prototype.getData = function () {
        return this.get("data");
    };
    /**
     *
     * @param newData The new raw data to be set
     */
    ChartModel.prototype.setData = function (newData) {
        var dataLabels = this.generateDataLabels(newData);
        this.set({
            data: newData,
            dataLabels: dataLabels
        });
        return this.state.data;
    };
    ChartModel.prototype.generateDataLabels = function (newData) {
        var dataLabels = {};
        newData.datasets.forEach(function (dataset) {
            dataLabels[dataset.label] = Configuration.legend.items.status.ACTIVE;
        });
        return dataLabels;
    };
    /**
     * @return {Object} The chart's options
     */
    ChartModel.prototype.getOptions = function () {
        return this.state.options;
    };
    ChartModel.prototype.set = function (newState, skipUpdate) {
        if (skipUpdate === void 0) { skipUpdate = false; }
        this.state = Object.assign({}, this.state, newState);
        if (!skipUpdate) {
            this.update();
        }
    };
    ChartModel.prototype.get = function (property) {
        if (property) {
            return this.state[property];
        }
        else {
            return this.state;
        }
    };
    /**
     *
     * @param newOptions New options to be set
     */
    ChartModel.prototype.setOptions = function (newOptions) {
        this.set({
            options: Tools.merge(this.getOptions(), newOptions)
        });
    };
    /**
     *
     * Updates miscellanous information within the model
     * such as the color scales, or the legend data labels
     */
    ChartModel.prototype.update = function () {
        if (!this.getDisplayData()) {
            return;
        }
        this.updateAllDataLabels();
        this.setColorScale();
        this.services.events.dispatchEvent("model-update");
    };
    ChartModel.prototype.setUpdateCallback = function (cb) {
        this.updateCallback = cb;
    };
    /*
     * Data labels
    */
    ChartModel.prototype.toggleDataLabel = function (changedLabel) {
        var _a = Configuration.legend.items.status, ACTIVE = _a.ACTIVE, DISABLED = _a.DISABLED;
        var dataLabels = this.get("dataLabels");
        var hasDeactivatedItems = Object.keys(dataLabels).some(function (label) { return dataLabels[label] === DISABLED; });
        var activeItems = Object.keys(dataLabels).filter(function (label) { return dataLabels[label] === ACTIVE; });
        // If there are deactivated items, toggle "changedLabel"
        if (hasDeactivatedItems) {
            // If the only active item is being toggled
            // Activate all items
            if (activeItems.length === 1 && activeItems[0] === changedLabel) {
                // If every item is active, then enable "changedLabel" and disable all other items
                Object.keys(dataLabels).forEach(function (label) {
                    dataLabels[label] = ACTIVE;
                });
            }
            else {
                dataLabels[changedLabel] = dataLabels[changedLabel] === DISABLED ? ACTIVE : DISABLED;
            }
        }
        else {
            // If every item is active, then enable "changedLabel" and disable all other items
            Object.keys(dataLabels).forEach(function (label) {
                dataLabels[label] = (label === changedLabel ? ACTIVE : DISABLED);
            });
        }
        // Update model
        this.set({
            dataLabels: dataLabels
        });
    };
    /*
     * Fill scales
    */
    ChartModel.prototype.setColorScale = function () {
        var _this = this;
        if (this.getDisplayData().datasets[0].fillColors) {
            this.getDisplayData().datasets.forEach(function (dataset) {
                _this.colorScale[dataset.label] = scaleOrdinal().range(dataset.fillColors).domain(_this.allDataLabels);
            });
        }
        else {
            var colors_1 = colorPalettes.DEFAULT;
            this.getData().datasets.forEach(function (dataset, i) {
                _this.colorScale[dataset.label] = scaleOrdinal().range([colors_1[i]]).domain(_this.allDataLabels);
            });
        }
    };
    /**
     * Should the data point be filled?
     * @param datasetLabel
     * @param label
     * @param value
     * @param defaultFilled the default for this chart
     */
    ChartModel.prototype.getIsFilled = function (datasetLabel, label, value, data, defaultFilled) {
        var options = this.getOptions();
        if (options.getIsFilled) {
            return options.getIsFilled(datasetLabel, label, value, data, defaultFilled);
        }
        else {
            return defaultFilled;
        }
    };
    ChartModel.prototype.getFillColor = function (datasetLabel, label, value, data) {
        var options = this.getOptions();
        var defaultFillColor = this.getFillScale()[datasetLabel](label);
        if (options.getFillColor) {
            return options.getFillColor(datasetLabel, label, value, data, defaultFillColor);
        }
        else {
            return defaultFillColor;
        }
    };
    ChartModel.prototype.getStrokeColor = function (datasetLabel, label, value, data) {
        var options = this.getOptions();
        var defaultStrokeColor = this.colorScale[datasetLabel](label);
        if (options.getStrokeColor) {
            return options.getStrokeColor(datasetLabel, label, value, data, defaultStrokeColor);
        }
        else {
            return defaultStrokeColor;
        }
    };
    ChartModel.prototype.getFillScale = function () {
        // Choose patternScale or colorScale based on the "accessibility" flag
        // return this.get("options").accessibility ? this.patternScale : this.colorScale;
        return this.colorScale;
    };
    /*
     * Data labels
    */
    ChartModel.prototype.updateAllDataLabels = function () {
        var _this = this;
        // If allDataLabels hasn't been initialized yet
        // Set it to the current set of chart labels
        if (!this.allDataLabels) {
            this.allDataLabels = this.getDisplayData().labels;
        }
        else {
            // Loop through current chart labels
            this.getDisplayData().labels.forEach(function (label) {
                // If label hasn't been stored yet, store it
                if (_this.allDataLabels.indexOf(label) === -1) {
                    _this.allDataLabels.push(label);
                }
            });
        }
    };
    return ChartModel;
}());
export { ChartModel };
//# sourceMappingURL=../src/model.js.map