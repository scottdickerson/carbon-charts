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
import { Bar } from "./bar";
// D3 Imports
import { select } from "d3-selection";
import { color } from "d3-color";
import { scaleBand } from "d3-scale";
import { TooltipTypes } from "../../interfaces";
var GroupedBar = /** @class */ (function (_super) {
    __extends(GroupedBar, _super);
    function GroupedBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "grouped-bar";
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
    GroupedBar.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener("legend-item-onhover", this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener("legend-item-onmouseout", this.handleLegendMouseOut);
    };
    GroupedBar.prototype.getGroupWidth = function () {
        var datasets = this.model.getDisplayData().datasets;
        var padding = 5;
        return datasets.length * this.getBarWidth() + (padding * (datasets.length - 1));
    };
    GroupedBar.prototype.setGroupScale = function () {
        var datasets = this.model.getDisplayData().datasets;
        this.groupScale = scaleBand()
            .domain(datasets.map(function (dataset) { return dataset.label; }))
            .rangeRound([0, this.getGroupWidth()]);
    };
    // Gets the correct width for bars based on options & configurations
    GroupedBar.prototype.getBarWidth = function () {
        var datasets = this.model.getDisplayData().datasets;
        return Math.min(this.services.axes.getMainXAxis().scale.step() / 2 / datasets.length, _super.prototype.getBarWidth.call(this));
    };
    GroupedBar.prototype.render = function (animate) {
        var _this = this;
        // Chart options mixed with the internal configurations
        var displayData = this.model.getDisplayData();
        this.setGroupScale();
        // Grab container SVG
        var svg = this.getContainerSVG();
        // Update data on bar groups
        var barGroups = svg.selectAll("g.bars")
            .data(displayData.labels);
        // Remove dot groups that need to be removed
        barGroups.exit()
            .attr("opacity", 0)
            .remove();
        // Add the bar groups that need to be introduced
        var barGroupsEnter = barGroups.enter()
            .append("g")
            .classed("bars", true);
        // Update data on all bars
        var bars = barGroupsEnter.merge(barGroups)
            .attr("transform", function (d, i) {
            var xValue = _this.services.axes.getXValue(d, i);
            return "translate(" + (xValue - _this.getGroupWidth() / 2) + ", 0)";
        })
            .selectAll("rect.bar")
            .data(function (d, i) { return _this.addLabelsToDataPoints(d, i); });
        // Remove bars that are no longer needed
        bars.exit()
            .attr("opacity", 0)
            .remove();
        // Add the circles that need to be introduced
        var barsEnter = bars.enter()
            .append("rect")
            .attr("opacity", 0);
        barsEnter.merge(bars)
            .classed("bar", true)
            .attr("x", function (d) { return _this.groupScale(d.datasetLabel); })
            .attr("width", this.getBarWidth.bind(this))
            .transition(this.services.transitions.getTransition("bar-update-enter", animate))
            .attr("y", function (d, i) { return _this.services.axes.getYValue(Math.max(0, d.value)); })
            .attr("height", function (d, i) {
            return Math.abs(_this.services.axes.getYValue(d, i) - _this.services.axes.getYValue(0));
        })
            .attr("fill", function (d) { return _this.model.getFillScale()[d.datasetLabel](d.label); })
            .attr("opacity", 1);
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    // TODO - This method could be re-used in more graphs
    GroupedBar.prototype.addLabelsToDataPoints = function (d, index) {
        var datasets = this.model.getDisplayData().datasets;
        return datasets.map(function (dataset) { return ({
            label: d,
            datasetLabel: dataset.label,
            value: dataset.data[index]
        }); });
    };
    GroupedBar.prototype.addEventListeners = function () {
        var self = this;
        this.parent.selectAll("rect.bar")
            .on("mouseover", function () {
            var hoveredElement = select(this);
            hoveredElement.transition(self.services.transitions.getTransition("graph_element_mouseover_fill_update"))
                .attr("fill", color(hoveredElement.attr("fill")).darker(0.7).toString());
            // Show tooltip
            self.services.events.dispatchEvent("show-tooltip", {
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
    GroupedBar.prototype.destroy = function () {
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
    return GroupedBar;
}(Bar));
export { GroupedBar };
//# sourceMappingURL=../../../src/components/graphs/bar-grouped.js.map