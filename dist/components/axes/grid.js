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
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
// D3 Imports
import { axisBottom, axisLeft } from "d3-axis";
import { mouse, select } from "d3-selection";
import { TooltipTypes } from "../../interfaces";
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "grid";
        return _this;
    }
    Grid.prototype.render = function () {
        // Draw the backdrop
        this.drawBackdrop();
        DOMUtils.appendOrSelect(this.backdrop, "g.x.grid");
        DOMUtils.appendOrSelect(this.backdrop, "g.y.grid");
        this.drawXGrid();
        this.drawYGrid();
        if (Tools.getProperty(this.model.getOptions(), "tooltip", "gridline", "enabled")) {
            this.addGridEventListeners();
        }
    };
    Grid.prototype.drawXGrid = function () {
        var svg = this.parent;
        var height = this.backdrop.attr("height");
        var mainXScale = this.services.axes.getMainXAxis().getScale();
        var xGrid = axisBottom(mainXScale)
            .tickSizeInner(-height)
            .tickSizeOuter(0);
        // Determine number of ticks
        var numberOfTicks = Tools.getProperty(this.model.getOptions(), "grid", "x", "numberOfTicks");
        xGrid.ticks(numberOfTicks);
        var g = svg.select(".x.grid")
            .attr("transform", "translate(" + -this.backdrop.attr("x") + ", " + height + ")")
            .call(xGrid);
        this.cleanGrid(g);
    };
    Grid.prototype.drawYGrid = function () {
        var svg = this.parent;
        var width = this.backdrop.attr("width");
        var mainYScale = this.services.axes.getMainYAxis().getScale();
        var yGrid = axisLeft(mainYScale)
            .tickSizeInner(-width)
            .tickSizeOuter(0);
        // Determine number of ticks
        var numberOfTicks = Tools.getProperty(this.model.getOptions(), "grid", "y", "numberOfTicks");
        yGrid.ticks(numberOfTicks);
        var g = svg.select(".y.grid")
            .attr("transform", "translate(0, " + -this.backdrop.attr("y") + ")")
            .call(yGrid);
        this.cleanGrid(g);
    };
    /**
     * Returns the threshold for the gridline tooltips based on the mouse location.
     * Calculated based on the mouse position between the two closest gridlines or edges of chart.
     */
    Grid.prototype.getGridlineThreshold = function (mousePos) {
        // use the space between axis grid ticks to adjust the threshold for the tooltips
        var svg = this.parent;
        // sort in ascending x translation value order
        var gridlinesX = svg.selectAll(".x.grid .tick").nodes()
            .sort(function (a, b) {
            return Number(Tools.getTranslationValues(a).tx) - Number(Tools.getTranslationValues(b).tx);
        });
        // find the 2 gridlines on either side of the mouse
        var floor = -1;
        var ceiling;
        gridlinesX.forEach(function (line, i) {
            if (mousePos[0] >= +Tools.getTranslationValues(line).tx) {
                floor++;
            }
        });
        ceiling = (floor + 1 < gridlinesX.length) ? floor + 1 : gridlinesX.length;
        // get the 'step' between chart gridlines
        var line1 = gridlinesX[floor];
        var line2 = gridlinesX[ceiling];
        var lineSpacing;
        // if the mouse is on edge of charts (mouseX < first gridline || mouseX > last gridline)
        // we can use the chart edge to determind the threshold for the gridlines
        if (!line1) {
            // we are between the first gridline and the chart edge
            lineSpacing = +Tools.getTranslationValues(line2).tx;
        }
        else if (!line2) {
            // we need to use the chart right bounds in case there isnt a domain axis
            var gridElement = svg.select("rect.chart-grid-backdrop").node();
            var width = DOMUtils.getSVGElementSize(gridElement).width;
            lineSpacing = width - +Tools.getTranslationValues(line1).tx;
        }
        else {
            // there are two gridlines to use
            lineSpacing = +Tools.getTranslationValues(line2).tx - +Tools.getTranslationValues(line1).tx;
        }
        var threshold = this.model.getOptions().tooltip.gridline.threshold;
        // return the threshold
        return lineSpacing * threshold;
    };
    /**
     * Returns the active gridlines based on the gridline threshold and mouse position.
     * @param position mouse positon
     */
    Grid.prototype.getActiveGridline = function (position) {
        var threshold = Tools.getProperty(this.model.getOptions, "tooltip", "gridline", "threshold") ?
            Tools.getProperty(this.model.getOptions, "tooltip", "gridline", "threshold") : this.getGridlineThreshold(position);
        var svg = this.parent;
        var gridlinesX = svg.selectAll(".x.grid .tick")
            .filter(function () {
            var translations = Tools.getTranslationValues(this);
            // threshold for when to display a gridline tooltip
            var bounds = {
                min: Number(translations.tx) - threshold,
                max: Number(translations.tx) + threshold
            };
            return bounds.min <= position[0] && position[0] <= bounds.max;
        });
        return gridlinesX;
    };
    /**
     * Adds the listener on the X grid to trigger multiple point tooltips along the x axis.
     */
    Grid.prototype.addGridEventListeners = function () {
        var self = this;
        var svg = this.parent;
        var grid = DOMUtils.appendOrSelect(svg, "rect.chart-grid-backdrop");
        grid
            .on("mousemove mouseover", function () {
            var chartContainer = self.services.domUtils.getMainSVG();
            var pos = mouse(chartContainer);
            var hoveredElement = select(this);
            // remove the styling on the lines
            var allgridlines = svg.selectAll(".x.grid .tick");
            allgridlines.classed("active", false);
            var activeGridline = self.getActiveGridline(pos);
            if (activeGridline.empty()) {
                self.services.events.dispatchEvent("hide-tooltip", {});
                return;
            }
            // set active class to control dasharray and theme colors
            activeGridline
                .classed("active", true);
            // get the items that should be highlighted
            var highlightItems;
            // use the selected gridline to get the data with associated domain
            activeGridline.each(function (d) {
                highlightItems = self.services.axes.getDataFromDomain(d);
            });
            self.services.events.dispatchEvent("show-tooltip", {
                hoveredElement: hoveredElement,
                multidata: highlightItems,
                type: TooltipTypes.GRIDLINE
            });
        })
            .on("mouseout", function () {
            svg.selectAll(".x.grid .tick")
                .classed("active", false);
            self.services.events.dispatchEvent("hide-tooltip", {});
        });
    };
    Grid.prototype.drawBackdrop = function () {
        var svg = this.parent;
        var mainXScale = this.services.axes.getMainXAxis().getScale();
        var mainYScale = this.services.axes.getMainYAxis().getScale();
        var _a = mainXScale.range(), xScaleStart = _a[0], xScaleEnd = _a[1];
        var _b = mainYScale.range(), yScaleEnd = _b[0], yScaleStart = _b[1];
        // Get height from the grid
        this.backdrop = DOMUtils.appendOrSelect(svg, "svg.chart-grid-backdrop");
        var backdropRect = DOMUtils.appendOrSelect(this.backdrop, "rect.chart-grid-backdrop");
        this.backdrop.merge(backdropRect)
            .attr("x", xScaleStart)
            .attr("y", yScaleStart)
            .attr("width", xScaleEnd - xScaleStart)
            .attr("height", yScaleEnd - yScaleStart)
            .lower();
        backdropRect.attr("width", "100%")
            .attr("height", "100%");
    };
    Grid.prototype.cleanGrid = function (g) {
        var options = this.model.getOptions();
        g.selectAll("line")
            .attr("stroke", options.grid.strokeColor);
        // Remove extra elements
        g.selectAll("text").remove();
        g.select(".domain").remove();
    };
    return Grid;
}(Component));
export { Grid };
//# sourceMappingURL=../../../src/components/axes/grid.js.map