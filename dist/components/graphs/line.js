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
import * as Configuration from "../../configuration";
// D3 Imports
import { select } from "d3-selection";
import { line } from "d3-shape";
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "line";
        return _this;
    }
    // TODORF - Remove these listeners in destroy()
    Line.prototype.init = function () {
        var _this = this;
        // Highlight correct scatter on legend item hovers
        this.services.events.addEventListener("legend-item-onhover", function (e) {
            var hoveredElement = e.detail.hoveredElement;
            _this.parent.selectAll("g.lines")
                .transition(_this.services.transitions.getTransition("legend-hover-line"))
                .attr("opacity", function (d) {
                if (d.label !== hoveredElement.datum()["key"]) {
                    return Configuration.lines.opacity.unselected;
                }
                return Configuration.lines.opacity.selected;
            });
        });
        // Un-highlight lines on legend item mouseouts
        this.services.events.addEventListener("legend-item-onmouseout", function (e) {
            _this.parent.selectAll("g.lines")
                .transition(_this.services.transitions.getTransition("legend-mouseout-line"))
                .attr("opacity", Configuration.lines.opacity.selected);
        });
    };
    Line.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var svg = this.getContainerSVG();
        // D3 line generator function
        this.lineGenerator = line()
            .x(function (d, i) { return _this.services.axes.getXValue(d, i); })
            .y(function (d, i) { return _this.services.axes.getYValue(d, i); })
            .curve(this.services.curves.getD3Curve());
        // Update the bound data on line groups
        var lineGroups = svg.selectAll("g.lines")
            .data(this.model.getDisplayData().datasets, function (dataset) { return dataset.label; });
        // Remove elements that need to be exited
        // We need exit at the top here to make sure that
        // Data filters are processed before entering new elements
        // Or updating existing ones
        lineGroups.exit()
            .attr("opacity", 0)
            .remove();
        // Add line groups that need to be introduced
        var enteringLineGroups = lineGroups.enter()
            .append("g")
            .classed("lines", true);
        var self = this;
        // Enter paths that need to be introduced
        var enteringPaths = enteringLineGroups.append("path")
            .attr("opacity", 0);
        // Apply styles and datum
        enteringPaths.merge(svg.selectAll("g.lines path"))
            .attr("stroke", function (d) {
            var parentDatum = select(this.parentNode).datum();
            return self.model.getStrokeColor(parentDatum.label);
        })
            .datum(function (d) {
            var parentDatum = select(this.parentNode).datum();
            this._datasetLabel = parentDatum.label;
            return parentDatum.data;
        })
            .transition(this.services.transitions.getTransition("line-update-enter", animate))
            .attr("opacity", 1)
            .attr("class", "line")
            .attr("d", this.lineGenerator);
    };
    return Line;
}(Component));
export { Line };
//# sourceMappingURL=../../../src/components/graphs/line.js.map