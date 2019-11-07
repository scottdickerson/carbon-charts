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
import { DOMUtils } from "../../services";
// Carbon position service
import Position, { PLACEMENTS } from "@carbon/utils-position";
// import the settings for the css prefix
import settings from "carbon-components/src/globals/js/settings";
// D3 Imports
import { select, mouse, event } from "d3-selection";
import { TooltipTypes, ScaleTypes } from "../../interfaces";
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip(model, services, configs) {
        var _this = _super.call(this, model, services, configs) || this;
        _this.type = "tooltip";
        _this.positionService = new Position();
        _this.init();
        return _this;
    }
    Tooltip.prototype.init = function () {
        var _this = this;
        // Grab the tooltip element
        var holder = select(this.services.domUtils.getHolder());
        var chartprefix = Tools.getProperty(this.model.getOptions(), "style", "prefix");
        this.tooltip = DOMUtils.appendOrSelect(holder, "div." + settings.prefix + "--" + chartprefix + "--tooltip");
        // Apply html content to the tooltip
        var tooltipTextContainer = DOMUtils.appendOrSelect(this.tooltip, "div.content-box");
        // listen to show-tooltip Custom Events to render the tooltip
        this.services.events.addEventListener("show-tooltip", function (e) {
            // check the type of tooltip and that it is enabled
            if ((e.detail.type === TooltipTypes.DATAPOINT && Tools.getProperty(_this.model.getOptions(), "tooltip", "datapoint", "enabled"))
                || (e.detail.type === TooltipTypes.GRIDLINE && Tools.getProperty(_this.model.getOptions(), "tooltip", "gridline", "enabled"))) {
                var data = select(event.target).datum();
                // Generate default tooltip
                var defaultHTML = void 0;
                if (e.detail.multidata) {
                    // multi tooltip
                    data = e.detail.multidata;
                    defaultHTML = _this.getMultilineTooltipHTML(data);
                }
                else {
                    defaultHTML = _this.getTooltipHTML(data);
                }
                // if there is a provided tooltip HTML function call it
                if (Tools.getProperty(_this.model.getOptions(), "tooltip", "customHTML")) {
                    tooltipTextContainer.html(_this.model.getOptions().tooltip.customHTML(data, defaultHTML));
                }
                else {
                    // Use default tooltip
                    tooltipTextContainer.html(defaultHTML);
                }
                // Position the tooltip
                _this.positionTooltip();
                // Fade in
                _this.tooltip.classed("hidden", false);
            }
        });
        // listen to hide-tooltip Custom Events to hide the tooltip
        this.services.events.addEventListener("hide-tooltip", function () {
            _this.tooltip.classed("hidden", true);
        });
    };
    Tooltip.prototype.getTooltipHTML = function (data) {
        // this cleans up the data item, pie slices have the data within the data.data but other datapoints are self contained within data
        var dataVal = Tools.getProperty(data, "data") ? data.data : data;
        // format the value if needed
        var formattedValue = Tools.getProperty(this.model.getOptions(), "tooltip", "valueFormatter") ?
            this.model.getOptions().tooltip.valueFormatter(dataVal.value) : dataVal.value.toLocaleString("en");
        // pie charts don't have a dataset label since they only support one dataset
        var label = dataVal.datasetLabel ? dataVal.datasetLabel : dataVal.label;
        return "<div class=\"datapoint-tooltip\">\n\t\t\t\t\t<p class=\"label\">" + label + "</p>\n\t\t\t\t\t<p class=\"value\">" + formattedValue + "</p>\n\t\t\t\t</div>";
    };
    Tooltip.prototype.getMultilineTooltipHTML = function (data) {
        var _this = this;
        var points = data;
        // sort them so they are in the same order as the graph
        points.sort(function (a, b) { return b.value - a.value; });
        // tells us which value to use
        var scaleType = this.services.axes.getMainXAxis().scaleType;
        return "<ul class='multi-tooltip'>" +
            points.map(function (datapoint) {
                // check if the datapoint has multiple values associates (multiple axes)
                var datapointValue = datapoint.value;
                if (datapointValue instanceof Object) {
                    // scale type determines which value we care about since it should align with the scale data
                    datapointValue = scaleType === ScaleTypes.TIME ? datapoint.value.date : datapoint.value.value;
                }
                var formattedValue = Tools.getProperty(_this.model.getOptions(), "tooltip", "valueFormatter") ?
                    _this.model.getOptions().tooltip.valueFormatter(datapointValue) : datapointValue.toLocaleString("en");
                var indicatorColor = _this.model.getStrokeColor(datapoint.datasetLabel, datapoint.label, datapoint.value, datapoint);
                return "\n\t\t\t\t<li>\n\t\t\t\t\t<div class=\"datapoint-tooltip\">\n\t\t\t\t\t\t<a style=\"background-color:" + indicatorColor + "\" class=\"tooltip-color\"></a>\n\t\t\t\t\t\t<p class=\"label\">" + datapoint.datasetLabel + "</p>\n\t\t\t\t\t\t<p class=\"value\">" + formattedValue + "</p>\n\t\t\t\t\t</div>\n\t\t\t\t</li>";
            }).join("") + "</ul>";
    };
    Tooltip.prototype.render = function () {
        this.tooltip.classed("hidden", true);
    };
    Tooltip.prototype.positionTooltip = function () {
        var holder = this.services.domUtils.getHolder();
        var target = this.tooltip.node();
        var mouseRelativePos = mouse(holder);
        // Find out whether tooltip should be shown on the left or right side
        var bestPlacementOption = this.positionService.findBestPlacementAt({
            left: mouseRelativePos[0],
            top: mouseRelativePos[1]
        }, target, [
            PLACEMENTS.RIGHT,
            PLACEMENTS.LEFT,
            PLACEMENTS.TOP,
            PLACEMENTS.BOTTOM
        ], function () { return ({
            width: holder.offsetWidth,
            height: holder.offsetHeight
        }); });
        var horizontalOffset = this.model.getOptions().tooltip.datapoint.horizontalOffset;
        if (bestPlacementOption === PLACEMENTS.LEFT) {
            horizontalOffset *= -1;
        }
        // Get coordinates to where tooltip should be positioned
        var pos = this.positionService.findPositionAt({
            left: mouseRelativePos[0] + horizontalOffset,
            top: mouseRelativePos[1]
        }, target, bestPlacementOption);
        this.positionService.setElement(target, pos);
    };
    return Tooltip;
}(Component));
export { Tooltip };
//# sourceMappingURL=../../../src/components/essentials/tooltip.js.map