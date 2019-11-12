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
import { ScaleTypes, TooltipTypes } from "../../interfaces/enums";
import { Tools } from "../../tools";
import { Bar } from "./bar";
// D3 Imports
import { select } from "d3-selection";
import { stack } from "d3-shape";
import { color } from "d3-color";
// Add datasetLabel to each piece of data
// To be used to get the fill color
var addLabelsAndValueToData = function (d) {
    Object.keys(d).map(function (key) {
        if (typeof d[key] === "object") {
            d[key]["datasetLabel"] = d.key;
            d[key]["label"] = d[key].data["label"];
            d[key]["value"] = d[key].data[d.key];
        }
    });
    return d;
};
var StackedBar = /** @class */ (function (_super) {
    __extends(StackedBar, _super);
    function StackedBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "stacked-bar";
        // Highlight elements that match the hovered legend item
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent.selectAll("rect.bar")
                .transition(_this.services.transitions.getTransition("legend-hover-bar"))
                .attr("opacity", function (d) { return (d.datasetLabel !== hoveredElement.datum()["key"]) ? 0.3 : 1; });
        };
        // Un-highlight all elements
        _this.handleLegendMouseOut = function (event) {
            _this.parent.selectAll("rect.bar")
                .transition(_this.services.transitions.getTransition("legend-mouseout-bar"))
                .attr("opacity", 1);
        };
        return _this;
    }
    StackedBar.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener("legend-item-onhover", this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener("legend-item-onmouseout", this.handleLegendMouseOut);
    };
    StackedBar.prototype.getStackData = function () {
        var stackDataArray;
        var displayData = this.model.getDisplayData();
        var timeSeries = this.services.axes.getMainXAxis().scaleType === ScaleTypes.TIME;
        if (timeSeries) {
            // Get all date values provided in data
            // TODO - Could be re-used through the model
            var allDates_1 = [];
            displayData.datasets.forEach(function (dataset) {
                allDates_1 = allDates_1.concat(dataset.data.map(function (datum) { return Number(datum.date); }));
            });
            allDates_1 = Tools.removeArrayDuplicates(allDates_1).sort();
            // Go through all date values
            // And get corresponding data from each dataset
            stackDataArray = allDates_1.map(function (date, i) {
                var correspondingData = {};
                displayData.datasets.forEach(function (dataset) {
                    var correspondingDatum = dataset.data.find(function (datum) { return Number(datum.date) === Number(date); });
                    if (correspondingDatum) {
                        correspondingData[dataset.label] = correspondingDatum.value;
                    }
                    else {
                        correspondingData[dataset.label] = 0;
                    }
                });
                correspondingData["label"] = date;
                return correspondingData;
            });
        }
        else {
            // Create the stack datalist
            stackDataArray = displayData.labels.map(function (label, i) {
                var correspondingData = {};
                displayData.datasets.forEach(function (dataset) {
                    correspondingData[dataset.label] = !isNaN(dataset.data[i]) ? dataset.data[i] : dataset.data[i].value;
                });
                correspondingData["label"] = label;
                return correspondingData;
            });
        }
        return stackDataArray;
    };
    StackedBar.prototype.render = function (animate) {
        var _this = this;
        // Chart options mixed with the internal configurations
        var options = this.model.getOptions();
        // Grab container SVG
        var svg = this.getContainerSVG();
        // Create the data and keys that'll be used by the stack layout
        var displayData = this.model.getDisplayData();
        var stackDataArray = this.getStackData();
        var stackKeys = displayData.datasets.map(function (dataset) { return dataset.label; });
        // Update data on all bar groups
        var barGroups = svg.selectAll("g.bars")
            .data(stack().keys(stackKeys)(stackDataArray), function (d) { return d.key; });
        // Remove elements that need to be exited
        // We need exit at the top here to make sure that
        // Data filters are processed before entering new elements
        // Or updating existing ones
        barGroups.exit()
            .attr("opacity", 0)
            .remove();
        // Add bar groups that need to be introduced
        barGroups.enter()
            .append("g")
            .classed("bars", true);
        // Update data on all bars
        var bars = svg.selectAll("g.bars").selectAll("rect.bar")
            .data(function (d) { return addLabelsAndValueToData(d); }, function (d) { return d.label; });
        // Remove bars that need to be removed
        bars.exit()
            .remove();
        // Update styling and position on existing bars
        // As well as bars that were just added
        bars.enter()
            .append("rect")
            .merge(bars)
            .classed("bar", true)
            .attr("x", function (d, i) {
            var barWidth = _this.getBarWidth();
            return _this.services.axes.getXValue(d, i) - (barWidth / 2);
        })
            .attr("width", this.getBarWidth.bind(this))
            .transition(this.services.transitions.getTransition("bar-update-enter", animate))
            .attr("y", function (d, i) { return _this.services.axes.getYValue(d[1], i); })
            .attr("fill", function (d) { return _this.model.getFillScale()[d.datasetLabel](d.label); })
            .attr("height", function (d, i) {
            var datasetLabel = d.datasetLabel;
            var datasetLabelIndex = stackKeys.indexOf(datasetLabel);
            var height = _this.services.axes.getYValue(d[0]) - _this.services.axes.getYValue(d[1]);
            if (datasetLabelIndex > 0 && height >= options.bars.dividerSize) {
                return height - options.bars.dividerSize;
            }
            return height;
        })
            .attr("opacity", 1);
        // Add event listeners for the above elements
        this.addEventListeners();
    };
    StackedBar.prototype.addEventListeners = function () {
        var self = this;
        this.parent.selectAll("rect.bar")
            .on("mouseover", function () {
            var hoveredElement = select(this);
            hoveredElement.transition(self.services.transitions.getTransition("graph_element_mouseover_fill_update"))
                .attr("fill", color(hoveredElement.attr("fill")).darker(0.7).toString());
        })
            .on("mousemove", function () {
            var hoveredElement = select(this);
            var itemData = select(this).datum();
            hoveredElement.classed("hovered", true);
            var stackedData = itemData["data"];
            var sharedLabel = stackedData["label"];
            // Remove the label field
            delete stackedData["label"];
            // filter out the label from the datasets' and associated values
            var activePoints = Object.keys(stackedData)
                .map(function (key) { return ({
                datasetLabel: key,
                value: stackedData[key],
                label: sharedLabel
            }); });
            // Show tooltip
            self.services.events.dispatchEvent("show-tooltip", {
                multidata: activePoints,
                hoveredElement: hoveredElement,
                type: TooltipTypes.DATAPOINT
            });
        })
            .on("mouseout", function () {
            var hoveredElement = select(this);
            hoveredElement.classed("hovered", false);
            hoveredElement.transition(self.services.transitions.getTransition("graph_element_mouseout_fill_update"))
                .attr("fill", function (d) { return self.model.getFillScale()[d.datasetLabel](d.label); });
            // Hide tooltip
            self.services.events.dispatchEvent("hide-tooltip", { hoveredElement: hoveredElement });
        });
    };
    StackedBar.prototype.destroy = function () {
        // Remove event listeners
        this.parent.selectAll("rect.bar")
            .on("mouseover", null)
            .on("mousemove", null)
            .on("mouseout", null);
        // Remove legend listeners
        var eventsFragment = this.services.events;
        eventsFragment.removeEventListener("legend-item-onhover", this.handleLegendOnHover);
        eventsFragment.removeEventListener("legend-item-onmouseout", this.handleLegendMouseOut);
    };
    return StackedBar;
}(Bar));
export { StackedBar };
//# sourceMappingURL=../../../src/components/graphs/bar-stacked.js.map