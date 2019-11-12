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
var Bar = /** @class */ (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Gets the correct width for bars based on options & configurations
    Bar.prototype.getBarWidth = function () {
        var mainXAxis = this.services.axes.getMainXAxis();
        var options = this.model.getOptions();
        if (!mainXAxis.scale.step) {
            return Math.min(options.bars.maxWidth, (5 / mainXAxis.scale.ticks().length) * options.bars.maxWidth);
        }
        return Math.min(options.bars.maxWidth, mainXAxis.scale.step() / 2);
    };
    return Bar;
}(Component));
export { Bar };
//# sourceMappingURL=../../../src/components/graphs/bar.js.map