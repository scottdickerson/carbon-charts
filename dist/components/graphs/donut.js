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
import { Pie } from "./pie";
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";
// D3 Imports
import { select } from "d3-selection";
import { interpolateNumber } from "d3-interpolate";
var donutCenterNumberTween = function (d3Ref, newNumber) {
    // Remove commas from the current value string, and convert to an int
    var currentValue = parseInt(d3Ref.text().replace(/[, ]+/g, ""), 10) || 0;
    var i = interpolateNumber(currentValue, newNumber);
    var formatInterpolatedValue = function (number) { return Math.floor(number).toLocaleString(); };
    return function (t) { return d3Ref.text(formatInterpolatedValue(i(t))); };
};
var Donut = /** @class */ (function (_super) {
    __extends(Donut, _super);
    function Donut() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "donut";
        return _this;
    }
    Donut.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        // Call render() from Pie
        _super.prototype.render.call(this, animate);
        var svg = DOMUtils.appendOrSelect(this.getContainerSVG(), "g.center");
        var options = this.model.getOptions();
        // Compute the outer radius needed
        var radius = this.computeRadius();
        var donutCenterFigure = Tools.getProperty(options, "center", "number");
        if (!donutCenterFigure) {
            donutCenterFigure = this.getDataList().reduce(function (accumulator, d) {
                return accumulator + d.value;
            }, 0);
        }
        // Add the number shown in the center of the donut
        DOMUtils.appendOrSelect(svg, "text.donut-figure")
            .attr("text-anchor", "middle")
            .style("font-size", function () { return options.donut.center.numberFontSize(radius); })
            .transition(this.services.transitions.getTransition("donut-figure-enter-update", animate))
            .tween("text", function () {
            return donutCenterNumberTween(select(this), donutCenterFigure);
        });
        // Add the label below the number in the center of the donut
        DOMUtils.appendOrSelect(svg, "text.donut-title")
            .attr("text-anchor", "middle")
            .style("font-size", function () { return options.donut.center.titleFontSize(radius); })
            .attr("y", options.donut.center.titleYPosition(radius))
            .text(options.donut.center.label);
    };
    Donut.prototype.getInnerRadius = function () {
        // Compute the outer radius needed
        var radius = this.computeRadius();
        return radius * (3 / 4);
    };
    return Donut;
}(Pie));
export { Donut };
//# sourceMappingURL=../../../src/components/graphs/donut.js.map