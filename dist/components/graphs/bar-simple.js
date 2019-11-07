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
import { TooltipTypes } from "../../interfaces";
var SimpleBar = /** @class */ (function (_super) {
    __extends(SimpleBar, _super);
    function SimpleBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "simple-bar";
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent.selectAll("rect.bar")
                .transition(_this.services.transitions.getTransition("legend-hover-simple-bar"))
                .attr("opacity", function (d) { return (d.label !== hoveredElement.datum()["key"]) ? 0.3 : 1; });
        };
        _this.handleLegendMouseOut = function (event) {
            _this.parent.selectAll("rect.bar")
                .transition(_this.services.transitions.getTransition("legend-mouseout-simple-bar"))
                .attr("opacity", 1);
        };
        return _this;
    }
    SimpleBar.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener("legend-item-onhover", this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener("legend-item-onmouseout", this.handleLegendMouseOut);
    };
    SimpleBar.prototype.render = function (animate) {
        var _this = this;
        // Grab container SVG
        var svg = this.getContainerSVG();
        // Update data on bar groups
        var barGroups = svg.selectAll("g.bars")
            .data(this.model.getDisplayData().datasets, function (dataset) { return dataset.label; });
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
            .selectAll("rect.bar")
            .data(function (d, i) { return _this.addLabelsToDataPoints(d, i); }, function (d) { return d.label; });
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
            .attr("x", function (d, i) {
            var barWidth = _this.getBarWidth();
            return _this.services.axes.getXValue(d, i) - barWidth / 2;
        })
            .attr("width", this.getBarWidth.bind(this))
            .transition(this.services.transitions.getTransition("bar-update-enter", animate))
            .attr("y", function (d, i) { return _this.services.axes.getYValue(Math.max(0, d.value)); })
            .attr("fill", function (d) { return _this.model.getFillScale()(d.label); })
            .attr("height", function (d, i) {
            return Math.abs(_this.services.axes.getYValue(d, i) - _this.services.axes.getYValue(0));
        })
            .attr("opacity", 1);
        // Add event listeners to elements drawn
        this.addEventListeners();
    };
    // TODO - This method could be re-used in more graphs
    SimpleBar.prototype.addLabelsToDataPoints = function (d, index) {
        var labels = this.model.getDisplayData().labels;
        return d.data.map(function (datum, i) { return ({
            date: datum.date,
            label: labels[i],
            datasetLabel: d.label,
            value: isNaN(datum) ? datum.value : datum
        }); });
    };
    SimpleBar.prototype.addEventListeners = function () {
        var self = this;
        this.parent.selectAll("rect.bar")
            .on("mouseover", function () {
            var hoveredElement = select(this);
            hoveredElement.classed("hovered", true);
            hoveredElement.transition(self.services.transitions.getTransition("graph_element_mouseover_fill_update"))
                .attr("fill", color(hoveredElement.attr("fill")).darker(0.7).toString());
            self.services.events.dispatchEvent("show-tooltip", {
                hoveredElement: hoveredElement,
                type: TooltipTypes.DATAPOINT
            });
        })
            .on("mouseout", function () {
            var hoveredElement = select(this);
            hoveredElement.classed("hovered", false);
            hoveredElement.transition(self.services.transitions.getTransition("graph_element_mouseout_fill_update"))
                .attr("fill", function (d) { return self.model.getFillScale()(d.label); });
            // Hide tooltip
            self.services.events.dispatchEvent("hide-tooltip", { hoveredElement: hoveredElement });
        });
    };
    SimpleBar.prototype.destroy = function () {
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
    return SimpleBar;
}(Bar));
export { SimpleBar };
//# sourceMappingURL=../../../src/components/graphs/bar-simple.js.map