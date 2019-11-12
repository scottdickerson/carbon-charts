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
var Title = /** @class */ (function (_super) {
    __extends(Title, _super);
    function Title() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "title";
        return _this;
    }
    Title.prototype.render = function () {
        var svg = this.getContainerSVG();
        var text = DOMUtils.appendOrSelect(svg, "text.title");
        text.attr("x", 0)
            .attr("y", 20)
            .text(this.model.getOptions().title);
        // TODO - Replace with layout component margins
        DOMUtils.appendOrSelect(svg, "rect.spacer")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "none");
    };
    return Title;
}(Component));
export { Title };
//# sourceMappingURL=../../../src/components/essentials/title.js.map