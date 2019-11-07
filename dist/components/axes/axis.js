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
import { Component } from "../component";
import { AxisPositions, ScaleTypes, AxisTypes } from "../../interfaces";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
var englishLocale = require("d3-time-format/locale/en-US.json");
// D3 Imports
import { scaleBand, scaleLinear, scaleTime, scaleLog } from "d3-scale";
import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis";
import { min, extent } from "d3-array";
import { timeFormatDefaultLocale } from "d3-time-format";
var Axis = /** @class */ (function (_super) {
    __extends(Axis, _super);
    function Axis(model, services, configs) {
        var _this = _super.call(this, model, services, configs) || this;
        _this.type = "axes";
        if (configs) {
            _this.configs = configs;
        }
        _this.margins = _this.configs.margins;
        return _this;
    }
    Axis.prototype.createOrGetScale = function () {
        var _a;
        var position = this.configs.position;
        var axisOptions = Tools.getProperty(this.model.getOptions(), "axes", position);
        this.scaleType = (axisOptions && axisOptions.scaleType) ? axisOptions.scaleType : ScaleTypes.LINEAR;
        var scaleFunction;
        if (this.scaleType === ScaleTypes.TIME) {
            scaleFunction = scaleTime();
        }
        else if (this.scaleType === ScaleTypes.LOG) {
            scaleFunction = scaleLog().base(axisOptions.base || 10);
        }
        else if (this.scaleType === ScaleTypes.LABELS) {
            scaleFunction = scaleBand();
        }
        else {
            scaleFunction = scaleLinear();
        }
        // If scale doesn't exist in the model, store it
        if (!this.model.get(position)) {
            var modelUpdates = (_a = {},
                _a[position] = this,
                _a);
            if (axisOptions) {
                if (axisOptions.primary === true) {
                    modelUpdates[AxisTypes.PRIMARY] = this;
                }
                if (axisOptions.secondary === true) {
                    modelUpdates[AxisTypes.SECONDARY] = this;
                }
            }
            this.model.set(modelUpdates, true);
        }
        this.scale = scaleFunction;
        return scaleFunction;
    };
    Axis.prototype.getScale = function () {
        return !this.scale ? this.createOrGetScale() : this.scale;
    };
    Axis.prototype.getScaleDomain = function () {
        var options = this.model.getOptions();
        var position = this.configs.position;
        var axisOptions = Tools.getProperty(options, "axes", position);
        var _a = this.model.getDisplayData(), datasets = _a.datasets, labels = _a.labels;
        // If scale is a LABELS scale, return some labels as the domain
        if (axisOptions && axisOptions.scaleType === ScaleTypes.LABELS) {
            if (labels) {
                return labels;
            }
            else {
                return this.model.getDisplayData().datasets[0].data.map(function (d, i) { return i + 1; });
            }
        }
        // Get the extent of the domain
        var domain;
        // If the scale is stacked
        if (axisOptions.stacked) {
            domain = extent(labels.reduce(function (m, label, i) {
                var correspondingValues = datasets.map(function (dataset) {
                    return !isNaN(dataset.data[i]) ? dataset.data[i] : dataset.data[i].value;
                });
                var totalValue = correspondingValues.reduce(function (a, b) { return a + b; }, 0);
                // Save both the total value and the minimum
                return m.concat(totalValue, min(correspondingValues));
            }, [])
                // Currently stack layouts in the library
                // Only support positive values
                .concat(0));
        }
        else {
            // Get all the chart's data values in a flat array
            var allDataValues = datasets.reduce(function (dataValues, dataset) {
                dataset.data.forEach(function (datum) {
                    if (axisOptions.scaleType === ScaleTypes.TIME) {
                        dataValues = dataValues.concat(datum.date);
                    }
                    else {
                        dataValues = dataValues.concat(isNaN(datum) ? datum.value : datum);
                    }
                });
                return dataValues;
            }, []);
            if (axisOptions.scaleType !== ScaleTypes.TIME) {
                allDataValues = allDataValues.concat(0);
            }
            domain = extent(allDataValues);
        }
        if (axisOptions.scaleType === ScaleTypes.TIME) {
            if (Tools.getProperty(options, "timeScale", "addSpaceOnEdges")) {
                // TODO - Need to account for non-day incrementals as well
                var startDate = domain[0], endDate = domain[1];
                startDate.setDate(startDate.getDate() - 1);
                endDate.setDate(endDate.getDate() + 1);
            }
            return [
                new Date(domain[0]),
                new Date(domain[1])
            ];
        }
        // TODO - Work with design to improve logic
        domain[1] = domain[1] * 1.1;
        return domain;
    };
    Axis.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        var axisPosition = this.configs.position;
        var options = this.model.getOptions();
        var axisOptions = Tools.getProperty(options, "axes", axisPosition);
        var svg = this.getContainerSVG();
        var _a = DOMUtils.getSVGElementSize(this.parent, { useAttrs: true }), width = _a.width, height = _a.height;
        var startPosition, endPosition;
        if (axisPosition === AxisPositions.BOTTOM || axisPosition === AxisPositions.TOP) {
            startPosition = this.configs.axes[AxisPositions.LEFT] ? this.margins.left : 0;
            endPosition = this.configs.axes[AxisPositions.RIGHT] ? width - this.margins.right : width;
        }
        else {
            startPosition = height - this.margins.bottom;
            endPosition = this.margins.top;
        }
        // Grab the scale off of the model, and initialize if it doesn't exist
        var scale = this.createOrGetScale().domain(this.getScaleDomain());
        if (this.scaleType === ScaleTypes.LABELS) {
            scale.rangeRound([startPosition, endPosition]);
        }
        else {
            scale.range([startPosition, endPosition]);
        }
        // Identify the corresponding d3 axis function
        var axisFunction;
        switch (axisPosition) {
            case AxisPositions.LEFT:
                axisFunction = axisLeft;
                break;
            case AxisPositions.BOTTOM:
                axisFunction = axisBottom;
                break;
            case AxisPositions.RIGHT:
                axisFunction = axisRight;
                break;
            case AxisPositions.TOP:
                axisFunction = axisTop;
                break;
        }
        // Set the date/time locale
        if (this.scaleType === ScaleTypes.TIME) {
            var timeLocale = Tools.getProperty(options, "locale", "time");
            if (timeLocale) {
                timeFormatDefaultLocale(timeLocale);
            }
            else {
                timeFormatDefaultLocale(englishLocale);
            }
        }
        // Initialize axis object
        var axis = axisFunction(scale)
            .tickSizeOuter(0)
            .tickFormat(Tools.getProperty(axisOptions, "ticks", "formatter"));
        if (scale.ticks) {
            var numberOfTicks = 7;
            axis.ticks(numberOfTicks);
            if (this.scaleType === ScaleTypes.TIME) {
                var tickValues = scale.ticks(numberOfTicks).concat(scale.domain())
                    .map(function (date) { return +date; }).sort();
                tickValues = Tools.removeArrayDuplicates(tickValues);
                // Remove labels on the edges
                // If there are more than 2 labels to show
                if (Tools.getProperty(options, "timeScale", "addSpaceOnEdges") && tickValues.length > 2) {
                    tickValues.splice(tickValues.length - 1, 1);
                    tickValues.splice(0, 1);
                }
                axis.tickValues(tickValues);
            }
        }
        // Add axis into the parent
        var container = DOMUtils.appendOrSelect(svg, "g.axis." + axisPosition);
        var axisRefExists = !container.select("g.ticks").empty();
        var axisRef = DOMUtils.appendOrSelect(container, "g.ticks");
        // Position and transition the axis
        switch (axisPosition) {
            case AxisPositions.LEFT:
                axisRef.attr("transform", "translate(" + this.margins.left + ", 0)");
                break;
            case AxisPositions.BOTTOM:
                axisRef.attr("transform", "translate(0, " + (height - this.margins.bottom) + ")");
                break;
            case AxisPositions.RIGHT:
                axisRef.attr("transform", "translate(" + (width - this.margins.right) + ", 0)");
                break;
            case AxisPositions.TOP:
                axisRef.attr("transform", "translate(0, " + this.margins.top + ")");
                break;
        }
        // Position the axis title
        if (axisOptions.title) {
            var axisTitleRef = DOMUtils.appendOrSelect(container, "text.axis-title")
                .text(axisOptions.title);
            switch (axisPosition) {
                case AxisPositions.LEFT:
                    axisTitleRef.attr("transform", "rotate(-90)")
                        .attr("y", 0)
                        .attr("x", -(scale.range()[0] / 2))
                        .attr("dy", "1em")
                        .style("text-anchor", "middle");
                    break;
                case AxisPositions.BOTTOM:
                    axisTitleRef.attr("transform", "translate(" + (this.margins.left / 2 + scale.range()[1] / 2) + ", " + height + ")")
                        .style("text-anchor", "middle");
                    break;
                case AxisPositions.RIGHT:
                    axisTitleRef.attr("transform", "rotate(90)")
                        .attr("y", -width)
                        .attr("x", scale.range()[0] / 2)
                        .attr("dy", "1em")
                        .style("text-anchor", "middle");
                    break;
                case AxisPositions.TOP:
                    var titleHeight = DOMUtils.getSVGElementSize(axisTitleRef, { useBBox: true }).height;
                    axisTitleRef.attr("transform", "translate(" + (this.margins.left / 2 + scale.range()[1] / 2) + ", " + titleHeight / 2 + ")")
                        .style("text-anchor", "middle");
                    break;
            }
        }
        // Apply new axis to the axis element
        if (!animate || !axisRefExists) {
            axisRef = axisRef.call(axis);
        }
        else {
            axisRef = axisRef.transition(this.services.transitions.getTransition("axis-update"))
                .call(axis);
        }
        if (axisPosition === AxisPositions.BOTTOM || axisPosition === AxisPositions.TOP) {
            if (scale.step) {
                var textNodes = axisRef.selectAll("g.tick text").nodes();
                // If any ticks are any larger than the scale step size
                if (textNodes.some(function (textNode) { return DOMUtils.getSVGElementSize(textNode, { useBBox: true }).width >= scale.step(); })) {
                    axisRef.selectAll("g.tick text")
                        .attr("transform", "rotate(45)")
                        .style("text-anchor", axisPosition === AxisPositions.TOP ? "end" : "start");
                    return;
                }
            }
            else {
                var estimatedTickSize = width / scale.ticks().length / 2;
                if (estimatedTickSize < 30) {
                    axisRef.selectAll("g.tick text")
                        .attr("transform", "rotate(45)")
                        .style("text-anchor", axisPosition === AxisPositions.TOP ? "end" : "start");
                    return;
                }
            }
            axisRef.selectAll("g.tick text")
                .attr("transform", null)
                .style("text-anchor", null);
        }
    };
    Axis.prototype.getValueFromScale = function (datum, index) {
        var value = isNaN(datum) ? datum.value : datum;
        if (this.scaleType === ScaleTypes.LABELS) {
            var correspondingLabel = this.model.getDisplayData().labels[index];
            return this.scale(correspondingLabel) + this.scale.step() / 2;
        }
        else if (this.scaleType === ScaleTypes.TIME) {
            return this.scale(new Date(datum.date || datum.label));
        }
        return this.scale(value);
    };
    Axis.prototype.getAxisRef = function () {
        var axisPosition = this.configs.position;
        return this.getContainerSVG()
            .select("g.axis." + axisPosition + " g.ticks");
    };
    Axis.prototype.getTitleRef = function () {
        var axisPosition = this.configs.position;
        return this.getContainerSVG()
            .select("g.axis." + axisPosition + " text.axis-title");
    };
    return Axis;
}(Component));
export { Axis };
//# sourceMappingURL=../../../src/components/axes/axis.js.map