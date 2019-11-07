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
import { Component } from "../component";
import { Tools } from "../../tools";
import { LegendOrientations, LegendPositions } from "../../interfaces";
import { DOMUtils } from "../../services";
// D3 Imports
import { select } from "d3-selection";
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "legend";
        return _this;
    }
    Legend.prototype.render = function () {
        var _this = this;
        var svg = this.getContainerSVG();
        var options = this.model.getOptions();
        var legendItems = svg.selectAll("g.legend-item")
            .data(this.getLegendItemArray());
        var addedLegendItems = legendItems.enter()
            .append("g")
            .classed("legend-item", true);
        // Configs
        var checkboxRadius = options.legend.checkbox.radius;
        addedLegendItems.append("rect")
            .classed("checkbox", true)
            .merge(legendItems.select("rect.checkbox"))
            .attr("width", checkboxRadius * 2)
            .attr("height", checkboxRadius * 2)
            .attr("rx", 1)
            .attr("ry", 1)
            .style("fill", function (d) {
            return d.value === options.legend.items.status.ACTIVE ? _this.model.getStrokeColor(d.key) : null;
        }).classed("active", function (d, i) {
            return d.value === options.legend.items.status.ACTIVE;
        });
        addedLegendItems.append("text")
            .merge(legendItems.select("text"))
            .text(function (d) { return d.key; })
            .attr("alignment-baseline", "middle");
        this.breakItemsIntoLines(addedLegendItems);
        // Remove old elements as needed.
        legendItems.exit()
            .on("mouseover", null)
            .on("click", null)
            .on("mouseout", null)
            .remove();
        var legendClickable = Tools.getProperty(this.model.getOptions(), "legend", "clickable");
        svg.classed("clickable", legendClickable);
        if (legendClickable && addedLegendItems.size() > 0) {
            this.addEventListeners();
        }
        var legendPosition = Tools.getProperty(options, "legend", "position");
        if (legendPosition === LegendPositions.BOTTOM || legendPosition === LegendPositions.TOP) {
            // TODO - Replace with layout component margins
            DOMUtils.appendOrSelect(svg, "rect.spacer")
                .attr("x", 0)
                .attr("y", 10)
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", "none");
        }
    };
    Legend.prototype.breakItemsIntoLines = function (addedLegendItems) {
        var self = this;
        var svg = this.getContainerSVG();
        var options = this.model.getOptions();
        // Configs
        var checkboxRadius = options.legend.checkbox.radius;
        var legendItemsHorizontalSpacing = options.legend.items.horizontalSpace;
        var legendItemsVerticalSpacing = options.legend.items.verticalSpace;
        var legendTextYOffset = options.legend.items.textYOffset;
        var spaceNeededForCheckbox = (checkboxRadius * 2) + options.legend.checkbox.spaceAfter;
        // Check if there are disabled legend items
        var DISABLED = options.legend.items.status.DISABLED;
        var dataLabels = this.model.get("dataLabels");
        var hasDeactivatedItems = Object.keys(dataLabels).some(function (label) { return dataLabels[label] === DISABLED; });
        var legendOrientation = Tools.getProperty(options, "legend", "orientation");
        // Keep track of line numbers and positions
        var startingPoint = 0;
        var lineNumber = 0;
        var itemIndexInLine = 0;
        var lastYPosition;
        addedLegendItems.merge(svg.selectAll("g.legend-item"))
            .each(function (d, i) {
            var legendItem = select(this);
            var previousLegendItem = select(svg.selectAll("g.legend-item").nodes()[i - 1]);
            if (itemIndexInLine === 0 || previousLegendItem.empty() || legendOrientation === LegendOrientations.VERTICAL) {
                if (legendOrientation === LegendOrientations.VERTICAL) {
                    lineNumber++;
                }
            }
            else {
                var svgDimensions = DOMUtils.getSVGElementSize(self.parent, { useAttr: true });
                var legendItemTextDimensions = DOMUtils.getSVGElementSize(select(this).select("text"), { useBBox: true });
                var lastLegendItemTextDimensions = DOMUtils.getSVGElementSize(previousLegendItem.select("text"), { useBBox: true });
                startingPoint = startingPoint + lastLegendItemTextDimensions.width + spaceNeededForCheckbox + legendItemsHorizontalSpacing;
                if (startingPoint + spaceNeededForCheckbox + legendItemTextDimensions.width > svgDimensions.width) {
                    lineNumber++;
                    startingPoint = 0;
                    itemIndexInLine = 0;
                }
            }
            var legendPosition = Tools.getProperty(options, "legend", "position");
            var yOffset = 0;
            if (legendPosition === LegendPositions.BOTTOM) {
                yOffset = 20;
            }
            // Position checkbox
            // TODO - Replace with layout component margins
            legendItem.select("rect.checkbox")
                .attr("x", startingPoint)
                .attr("y", yOffset + lineNumber * legendItemsVerticalSpacing);
            // Position text
            // TODO - Replace with layout component margins
            var yPosition = legendTextYOffset + (lineNumber * legendItemsVerticalSpacing);
            legendItem.select("text")
                .attr("x", startingPoint + spaceNeededForCheckbox)
                .attr("y", yOffset + yPosition);
            lastYPosition = yPosition;
            // Render checkbox check icon
            if (hasDeactivatedItems && legendItem.select("g.check").empty()) {
                legendItem.append("g")
                    .classed("check", true)
                    .html("\n\t\t\t\t\t\t\t<svg focusable=\"false\" preserveAspectRatio=\"xMidYMid meet\"\n\t\t\t\t\t\t\t\txmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\"\n\t\t\t\t\t\t\t\tviewBox=\"0 0 32 32\" aria-hidden=\"true\"\n\t\t\t\t\t\t\t\tstyle=\"will-change: transform;\">\n\t\t\t\t\t\t\t\t<path d=\"M13 21.2l-7.1-7.1-1.4 1.4 7.1 7.1L13 24 27.1 9.9l-1.4-1.5z\"></path>\n\t\t\t\t\t\t\t\t<title>Checkmark</title>\n\t\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t");
                legendItem.select("g.check svg")
                    .attr("width", checkboxRadius * 2 - 1)
                    .attr("height", checkboxRadius * 2 - 1)
                    .attr("x", parseFloat(legendItem.select("rect.checkbox").attr("x")) + 0.5)
                    .attr("y", parseFloat(legendItem.select("rect.checkbox").attr("y")) + 0.5);
            }
            else if (!hasDeactivatedItems && !legendItem.select("g.check").empty()) {
                legendItem.select("g.check").remove();
            }
            itemIndexInLine++;
        });
        // TODO - Replace with layout component margins
        DOMUtils.appendOrSelect(svg, "rect.spacer")
            .attr("x", 0)
            .attr("y", lastYPosition)
            .attr("width", 16)
            .attr("height", 16)
            .attr("fill", "none");
    };
    Legend.prototype.getLegendItemArray = function () {
        var legendItems = this.model.get("dataLabels");
        var legendItemKeys = Object.keys(legendItems);
        return legendItemKeys.map(function (key) { return ({
            key: key,
            value: legendItems[key]
        }); });
    };
    Legend.prototype.addEventListeners = function () {
        var self = this;
        var svg = this.getContainerSVG();
        var options = this.model.getOptions();
        svg.selectAll("g.legend-item")
            .on("mouseover", function () {
            self.services.events.dispatchEvent("legend-item-onhover", {
                hoveredElement: select(this)
            });
            // Configs
            var checkboxRadius = options.legend.checkbox.radius;
            var hoveredItem = select(this);
            hoveredItem.append("rect")
                .classed("hover-stroke", true)
                .attr("x", parseFloat(hoveredItem.select("rect.checkbox").attr("x")) - 2)
                .attr("y", parseFloat(hoveredItem.select("rect.checkbox").attr("y")) - 2)
                .attr("width", checkboxRadius * 2 + 4)
                .attr("height", checkboxRadius * 2 + 4)
                .attr("rx", 3)
                .attr("ry", 3)
                .lower();
        })
            .on("click", function () {
            self.services.events.dispatchEvent("legend-item-onclick", {
                clickedElement: select(this)
            });
            var clickedItem = select(this);
            var clickedItemData = clickedItem.datum();
            self.model.toggleDataLabel(clickedItemData.key);
        })
            .on("mouseout", function () {
            var hoveredItem = select(this);
            hoveredItem.select("rect.hover-stroke").remove();
            self.services.events.dispatchEvent("legend-item-onmouseout", {
                hoveredElement: hoveredItem
            });
        });
    };
    return Legend;
}(Component));
export { Legend };
//# sourceMappingURL=../../../src/components/essentials/legend.js.map