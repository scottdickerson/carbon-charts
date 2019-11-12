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
import { Service } from "../service";
import { ChartTheme } from "../../interfaces";
import { Tools } from "../../tools";
import { select } from "d3-selection";
var Themes = /** @class */ (function (_super) {
    __extends(Themes, _super);
    function Themes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Themes.prototype.init = function () {
        this.setTheme();
    };
    Themes.prototype.update = function () {
        this.setTheme();
    };
    Themes.prototype.setTheme = function () {
        var holderElement = this.services.domUtils.getHolder();
        var theme = Tools.getProperty(this.model.getOptions(), "theme");
        if (theme !== ChartTheme.DEFAULT) {
            select(holderElement).classed("carbon--theme--" + theme, true);
        }
    };
    return Themes;
}(Service));
export { Themes };
//# sourceMappingURL=../../../src/services/essentials/themes.js.map