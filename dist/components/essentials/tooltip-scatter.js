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
var TooltipScatter = /** @class */ (function (_super) {
    __extends(TooltipScatter, _super);
    function TooltipScatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TooltipScatter.prototype.getTooltipHTML = function (data) {
        var formattedValue = Tools.getProperty(this.model.getOptions(), "tooltip", "valueFormatter") ?
            this.model.getOptions().tooltip.valueFormatter(data.value) : data.value.toLocaleString("en");
        var indicatorColor = this.model.getStrokeColor(data.datasetLabel, data.label, data.value, data);
        return "\n\t\t\t<div class=\"datapoint-tooltip\">\n\t\t\t\t<a style=\"background-color:" + indicatorColor + "\" class=\"tooltip-color\"></a>\n\t\t\t\t<p class=\"label\">" + data.datasetLabel + "</p>\n\t\t\t\t<p class=\"value\">" + formattedValue + "</p>\n\t\t\t</div>";
    };
    return TooltipScatter;
}(Tooltip));
export { TooltipScatter };
//# sourceMappingURL=../../../src/components/essentials/tooltip-scatter.js.map