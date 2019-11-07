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
import { Tooltip } from "./tooltip";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
import { TooltipPosition, TooltipTypes } from "./../../interfaces/enums";
// Carbon position service
import { PLACEMENTS } from "@carbon/utils-position";
// import the settings for the css prefix
import settings from "carbon-components/src/globals/js/settings";
// D3 Imports
import { mouse, select } from "d3-selection";
var TooltipBar = /** @class */ (function (_super) {
    __extends(TooltipBar, _super);
    function TooltipBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TooltipBar.prototype.init = function () {
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
                var hoveredElement = e.detail.hoveredElement.node();
                var defaultHTML = void 0;
                if (e.detail.multidata) {
                    // multi tooltip
                    defaultHTML = _this.getMultilineTooltipHTML(e.detail.multidata);
                }
                else {
                    defaultHTML = _this.getTooltipHTML(e.detail.hoveredElement.datum());
                }
                // if there is a provided tooltip HTML function call it and pass the defaultHTML
                if (Tools.getProperty(_this.model.getOptions(), "tooltip", "customHTML")) {
                    tooltipTextContainer.html(_this.model.getOptions().tooltip.customHTML(hoveredElement, defaultHTML));
                }
                else {
                    // default tooltip
                    tooltipTextContainer.html(defaultHTML);
                }
                var position = _this.getTooltipPosition(hoveredElement);
                // Position the tooltip relative to the bars
                _this.positionTooltip(e.detail.multidata ? undefined : position);
                // Fade in
                _this.tooltip.classed("hidden", false);
            }
        });
        // listen to hide-tooltip Custom Events to hide the tooltip
        this.services.events.addEventListener("hide-tooltip", function () {
            _this.tooltip.classed("hidden", true);
        });
    };
    /**
     * Get the position of the tooltip relative to the active hovered bar. Tooltip should appear above
     * positive valued data and below negative value data.
     * @param hoveredElement
     */
    TooltipBar.prototype.getTooltipPosition = function (hoveredElement) {
        var data = select(hoveredElement).datum();
        var holderPosition = select(this.services.domUtils.getHolder()).node().getBoundingClientRect();
        var barPosition = hoveredElement.getBoundingClientRect();
        var verticalOffset = this.model.getOptions().tooltip.datapoint.verticalOffset;
        // if there is a negative value bar chart, need to place the tooltip below the bar
        if (data.value <= 0) {
            // negative bars
            var tooltipPos = {
                left: (barPosition.left - holderPosition.left) + barPosition.width / 2,
                top: (barPosition.bottom - holderPosition.top) + verticalOffset
            };
            return { placement: TooltipPosition.BOTTOM, position: tooltipPos };
        }
        else {
            // positive bars
            var tooltipPos = {
                left: (barPosition.left - holderPosition.left) + barPosition.width / 2,
                top: (barPosition.top - holderPosition.top) - verticalOffset
            };
            return { placement: TooltipPosition.TOP, position: tooltipPos };
        }
    };
    /**
     * Returns the html for the bar single point tooltip
     * @param data associated values for the hovered bar
     */
    TooltipBar.prototype.getTooltipHTML = function (data) {
        var formattedValue = Tools.getProperty(this.model.getOptions(), "tooltip", "valueFormatter") ?
            this.model.getOptions().tooltip.valueFormatter(data.value) : data.value.toLocaleString("en");
        return "<div class=\"datapoint-tooltip\"><p class=\"value\">" + formattedValue + "</p></div>";
    };
    /**
     * Multip tooltips for bar charts include totals for each stack
     * @param data
     */
    TooltipBar.prototype.getMultilineTooltipHTML = function (data) {
        var _this = this;
        var points = data;
        points.reverse();
        // get the total for the stacked tooltip
        var total = points.reduce(function (sum, item) { return sum + item.value; }, 0);
        // format the total value
        total = Tools.getProperty(this.model.getOptions(), "tooltip", "valueFormatter") ?
            this.model.getOptions().tooltip.valueFormatter(total) : total.toLocaleString("en");
        return "<ul class='multi-tooltip'>" +
            points.map(function (datapoint) {
                var formattedValue = Tools.getProperty(_this.model.getOptions(), "tooltip", "valueFormatter") ?
                    _this.model.getOptions().tooltip.valueFormatter(datapoint.value) : datapoint.value.toLocaleString("en");
                var indicatorColor = _this.model.getStrokeColor(datapoint.datasetLabel, datapoint.label, datapoint.value, datapoint);
                return "\n\t\t\t\t<li>\n\t\t\t\t\t<div class=\"datapoint-tooltip\">\n\t\t\t\t\t\t<a style=\"background-color:" + indicatorColor + "\" class=\"tooltip-color\"></a>\n\t\t\t\t\t\t<p class=\"label\">" + datapoint.datasetLabel + "</p>\n\t\t\t\t\t\t<p class=\"value\">" + formattedValue + "</p>\n\t\t\t\t\t</div>\n\t\t\t\t</li>";
            }).join("") +
            ("<li>\n\t\t\t\t\t<div class='total-val'>\n\t\t\t\t\t\t<p class='label'>Total</p>\n\t\t\t\t\t\t<p class='value'>" + total + "</p>\n\t\t\t\t\t</div>\n\t\t\t\t</li>\n\t\t\t</ul>");
    };
    TooltipBar.prototype.positionTooltip = function (positionOverride) {
        var holder = this.services.domUtils.getHolder();
        var target = this.tooltip.node();
        var mouseRelativePos = mouse(holder);
        var pos;
        // override position to place tooltip at {placement:.., position:{top:.. , left:..}}
        if (positionOverride) {
            // placement determines whether the tooltip is centered above or below the position provided
            var placement = positionOverride.placement === TooltipPosition.TOP ? PLACEMENTS.TOP : PLACEMENTS.BOTTOM;
            pos = this.positionService.findPositionAt(positionOverride.position, target, placement);
        }
        else {
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
            pos = this.positionService.findPositionAt({
                left: mouseRelativePos[0] + horizontalOffset,
                top: mouseRelativePos[1]
            }, target, bestPlacementOption);
        }
        this.positionService.setElement(target, pos);
    };
    return TooltipBar;
}(Tooltip));
export { TooltipBar };
//# sourceMappingURL=../../../src/components/essentials/tooltip-bar.js.map