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
var HorizontalZeroLine = /** @class */ (function (_super) {
    __extends(HorizontalZeroLine, _super);
    function HorizontalZeroLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "horizontal-zero-line";
        return _this;
    }
    HorizontalZeroLine.prototype.render = function (animate) {
        // Grab container SVG
        var svg = this.getContainerSVG();
        // Get x & y position of the line
        var _a = this.services.axes.getMainXAxis().scale.range(), x1 = _a[0], x2 = _a[1];
        var yPosition = this.services.axes.getYValue(0) + 0.5;
        var horizontalLine = DOMUtils.appendOrSelect(svg, "line.domain");
        horizontalLine
            .transition(this.services.transitions.getTransition("horizontal-line-update", animate))
            .attr("y1", yPosition)
            .attr("y2", yPosition)
            .attr("x1", x1)
            .attr("x2", x2);
    };
    return HorizontalZeroLine;
}(Component));
export { HorizontalZeroLine };
//# sourceMappingURL=../../../src/components/axes/horizontal-zero-line.js.map