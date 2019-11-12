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
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";
import { CalloutDirections, TooltipTypes } from "../../interfaces/enums";
// D3 Imports
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import { interpolate } from "d3-interpolate";
// Pie slice tween function
function arcTween(a, arcFunc) {
    var _this = this;
    var i = interpolate(this._current, a);
    return function (t) {
        _this._current = i(t);
        return arcFunc(_this._current);
    };
}
var Pie = /** @class */ (function (_super) {
    __extends(Pie, _super);
    function Pie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "pie";
        // Highlight elements that match the hovered legend item
        _this.handleLegendOnHover = function (event) {
            var hoveredElement = event.detail.hoveredElement;
            _this.parent.selectAll("path.slice")
                .transition(_this.services.transitions.getTransition("legend-hover-bar"))
                .attr("opacity", function (d) { return (d.data.label !== hoveredElement.datum()["key"]) ? 0.3 : 1; });
        };
        // Un-highlight all elements
        _this.handleLegendMouseOut = function (event) {
            _this.parent.selectAll("path.slice")
                .transition(_this.services.transitions.getTransition("legend-mouseout-bar"))
                .attr("opacity", 1);
        };
        return _this;
    }
    Pie.prototype.init = function () {
        var eventsFragment = this.services.events;
        // Highlight correct circle on legend item hovers
        eventsFragment.addEventListener("legend-item-onhover", this.handleLegendOnHover);
        // Un-highlight circles on legend item mouseouts
        eventsFragment.addEventListener("legend-item-onmouseout", this.handleLegendMouseOut);
    };
    Pie.prototype.getDataList = function () {
        var displayData = this.model.getDisplayData();
        var dataset = displayData.datasets[0];
        return dataset.data.map(function (datum, i) { return ({
            label: displayData.labels[i],
            value: datum
        }); });
    };
    Pie.prototype.getInnerRadius = function () {
        var options = this.model.getOptions();
        return options.pie.innerRadius;
    };
    Pie.prototype.render = function (animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        var self = this;
        var svg = this.getContainerSVG();
        var options = this.model.getOptions();
        var dataList = this.getDataList();
        // Compute the outer radius needed
        var radius = this.computeRadius();
        this.arc = arc()
            .innerRadius(this.getInnerRadius())
            .outerRadius(radius);
        // Set the hover arc radius
        this.hoverArc = arc()
            .innerRadius(this.getInnerRadius())
            .outerRadius(radius + options.pie.hoverArc.outerRadiusOffset);
        // Setup the pie layout
        var pieLayout = pie()
            .value(function (d) { return d.value; })
            .sort(function (a, b) { return b.value - a.value; })
            .padAngle(options.pie.padAngle);
        // Sort pie layout data based off of the indecies the layout creates
        var pieLayoutData = pieLayout(dataList)
            .sort(function (a, b) { return a.index - b.index; });
        // Update data on all slices
        var paths = DOMUtils.appendOrSelect(svg, "g.slices").selectAll("path.slice")
            .data(pieLayoutData, function (d) { return d.data.label; });
        // Remove slices that need to be exited
        paths.exit()
            .attr("opacity", 0)
            .remove();
        // Add new slices that are being introduced
        var enteringPaths = paths.enter()
            .append("path")
            .classed("slice", true)
            .attr("opacity", 0);
        // Update styles & position on existing and entering slices
        enteringPaths.merge(paths)
            .attr("fill", function (d) { return _this.model.getFillScale()(d.data.label); })
            .attr("d", this.arc)
            .transition(this.services.transitions.getTransition("pie-slice-enter-update", animate))
            .attr("opacity", 1)
            .attrTween("d", function (a) {
            return arcTween.bind(this)(a, self.arc);
        });
        // Draw the slice labels
        var labels = DOMUtils.appendOrSelect(svg, "g.labels")
            .selectAll("text.pie-label")
            .data(pieLayoutData, function (d) { return d.data.label; });
        // Remove labels that are existing
        labels.exit()
            .attr("opacity", 0)
            .remove();
        // Add labels that are being introduced
        var enteringLabels = labels.enter()
            .append("text")
            .classed("pie-label", true);
        // Update styles & position on existing & entering labels
        var calloutData = [];
        enteringLabels.merge(labels)
            .style("text-anchor", "middle")
            .text(function (d) { return Tools.convertValueToPercentage(d.data.value, dataList) + "%"; })
            // Calculate dimensions in order to transform
            .datum(function (d) {
            var textLength = this.getComputedTextLength();
            d.textOffsetX = textLength / 2;
            d.textOffsetY = parseFloat(getComputedStyle(this).fontSize) / 2;
            var marginedRadius = radius + 7;
            var theta = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
            d.xPosition = (d.textOffsetX + marginedRadius) * Math.sin(theta);
            d.yPosition = (d.textOffsetY + marginedRadius) * -Math.cos(theta);
            return d;
        })
            .attr("transform", function (d, i) {
            var totalSlices = dataList.length;
            var sliceAngleDeg = (d.endAngle - d.startAngle) * (180 / Math.PI);
            // check if last 2 slices (or just last) are < the threshold
            if (i >= totalSlices - 2) {
                if (sliceAngleDeg < options.pie.callout.minSliceDegree) {
                    var labelTranslateX = void 0, labelTranslateY = void 0;
                    if (d.index === totalSlices - 1) {
                        labelTranslateX = d.xPosition + options.pie.callout.offsetX + options.pie.callout.textMargin + d.textOffsetX;
                        labelTranslateY = d.yPosition - options.pie.callout.offsetY;
                        // Set direction of callout
                        d.direction = CalloutDirections.RIGHT;
                        calloutData.push(d);
                    }
                    else {
                        labelTranslateX = d.xPosition - options.pie.callout.offsetX - d.textOffsetX - options.pie.callout.textMargin;
                        labelTranslateY = d.yPosition - options.pie.callout.offsetY;
                        // Set direction of callout
                        d.direction = CalloutDirections.LEFT;
                        calloutData.push(d);
                    }
                    return "translate(" + labelTranslateX + ", " + labelTranslateY + ")";
                }
            }
            return "translate(" + d.xPosition + ", " + d.yPosition + ")";
        });
        // Render pie label callouts
        this.renderCallouts(calloutData);
        // Position Pie
        var pieTranslateX = radius + options.pie.xOffset;
        var pieTranslateY = radius + options.pie.yOffset;
        if (calloutData.length > 0) {
            pieTranslateY += options.pie.yOffsetCallout;
        }
        svg.attr("transform", "translate(" + pieTranslateX + ", " + pieTranslateY + ")");
        // Add event listeners
        this.addEventListeners();
    };
    Pie.prototype.renderCallouts = function (calloutData) {
        var svg = DOMUtils.appendOrSelect(this.getContainerSVG(), "g.callouts");
        var options = this.model.getOptions();
        // Update data on callouts
        var callouts = svg.selectAll("g.callout")
            .data(calloutData);
        callouts.exit().remove();
        var enteringCallouts = callouts.enter()
            .append("g")
            .classed("callout", true);
        // Update data values for each callout
        // For the horizontal and vertical lines to use
        enteringCallouts.merge(callouts)
            .datum(function (d) {
            var xPosition = d.xPosition, yPosition = d.yPosition, direction = d.direction;
            if (direction === CalloutDirections.RIGHT) {
                d.startPos = {
                    x: xPosition,
                    y: yPosition + d.textOffsetY
                };
                // end position for the callout line
                d.endPos = {
                    x: xPosition + options.pie.callout.offsetX,
                    y: yPosition - options.pie.callout.offsetY + d.textOffsetY
                };
                // the intersection point of the vertical and horizontal line
                d.intersectPointX = d.endPos.x - options.pie.callout.horizontalLineLength;
            }
            else {
                // start position for the callout line
                d.startPos = {
                    x: xPosition,
                    y: yPosition + d.textOffsetY
                };
                // end position for the callout line should be bottom aligned to the title
                d.endPos = {
                    x: xPosition - options.pie.callout.offsetX,
                    y: yPosition - options.pie.callout.offsetY + d.textOffsetY
                };
                // the intersection point of the vertical and horizontal line
                d.intersectPointX = d.endPos.x + options.pie.callout.horizontalLineLength;
            }
            // Store the necessary data in the DOM element
            return d;
        });
        // draw vertical line
        var enteringVerticalLines = enteringCallouts.append("line")
            .classed("vertical-line", true);
        enteringVerticalLines.merge(svg.selectAll("line.vertical-line"))
            .datum(function (d) {
            return select(this.parentNode).datum();
        })
            .style("stroke-width", "1px")
            .attr("x1", function (d) { return d.startPos.x; })
            .attr("y1", function (d) { return d.startPos.y; })
            .attr("x2", function (d) { return d.intersectPointX; })
            .attr("y2", function (d) { return d.endPos.y; });
        // draw horizontal line
        var enteringHorizontalLines = enteringCallouts.append("line")
            .classed("horizontal-line", true);
        enteringHorizontalLines.merge(callouts.selectAll("line.horizontal-line"))
            .datum(function (d) {
            return select(this.parentNode).datum();
        })
            .style("stroke-width", "1px")
            .attr("x1", function (d) { return d.intersectPointX; })
            .attr("y1", function (d) { return d.endPos.y; })
            .attr("x2", function (d) { return d.endPos.x; })
            .attr("y2", function (d) { return d.endPos.y; });
    };
    Pie.prototype.addEventListeners = function () {
        var self = this;
        this.parent.selectAll("path.slice")
            .on("mousemove", function () {
            var hoveredElement = select(this);
            hoveredElement.classed("hovered", true)
                .transition(self.services.transitions.getTransition("pie_slice_mouseover"))
                .attr("d", self.hoverArc);
            // Dispatch mouse event
            self.services.events.dispatchEvent("pie-slice-mouseover", hoveredElement);
            // Show tooltip
            self.services.events.dispatchEvent("show-tooltip", {
                hoveredElement: hoveredElement,
                type: TooltipTypes.DATAPOINT
            });
        })
            .on("mouseout", function () {
            var hoveredElement = select(this);
            hoveredElement.classed("hovered", false)
                .transition(self.services.transitions.getTransition("pie_slice_mouseover"))
                .attr("d", self.arc);
            // Dispatch mouse event
            self.services.events.dispatchEvent("pie-slice-mouseout", hoveredElement);
            // Hide tooltip
            self.services.events.dispatchEvent("hide-tooltip", { hoveredElement: hoveredElement });
        })
            .on("click", function (d) { return self.services.events.dispatchEvent("pie-slice-click", d); });
    };
    // Helper functions
    Pie.prototype.computeRadius = function () {
        var options = this.model.getOptions();
        var _a = DOMUtils.getSVGElementSize(this.parent, { useAttrs: true }), width = _a.width, height = _a.height;
        var radius = Math.min(width, height) / 2;
        return radius + options.pie.radiusOffset;
    };
    return Pie;
}(Component));
export { Pie };
//# sourceMappingURL=../../../src/components/graphs/pie.js.map