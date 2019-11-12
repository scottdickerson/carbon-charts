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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Chart } from "./chart";
import { LayoutDirection, LayoutGrowth, LegendOrientations, LegendPositions } from "./interfaces/index";
import { LayoutComponent, Legend, Title } from "./components/index";
import { Tools } from "./tools";
import { Axes, Curves } from "./services/index";
var AxisChart = /** @class */ (function (_super) {
    __extends(AxisChart, _super);
    function AxisChart(holder, chartConfigs) {
        var _this = _super.call(this, holder, chartConfigs) || this;
        _this.services = Object.assign(_this.services, {
            axes: Axes,
            curves: Curves
        });
        return _this;
    }
    AxisChart.prototype.getAxisChartComponents = function (graphFrameComponents) {
        var titleComponent = {
            id: "title",
            components: [
                new Title(this.model, this.services)
            ],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED
            }
        };
        var legendComponent = {
            id: "legend",
            components: [
                new Legend(this.model, this.services)
            ],
            growth: {
                x: LayoutGrowth.PREFERRED,
                y: LayoutGrowth.FIXED
            }
        };
        var graphFrameComponent = {
            id: "graph-frame",
            components: graphFrameComponents,
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.FIXED
            }
        };
        // Decide the position of the legend in reference to the chart
        var fullFrameComponentDirection = LayoutDirection.COLUMN;
        var legendPosition = Tools.getProperty(this.model.getOptions(), "legend", "position");
        if (legendPosition === LegendPositions.LEFT) {
            fullFrameComponentDirection = LayoutDirection.ROW;
            if (!this.model.getOptions().legend.orientation) {
                this.model.getOptions().legend.orientation = LegendOrientations.VERTICAL;
            }
        }
        else if (legendPosition === LegendPositions.RIGHT) {
            fullFrameComponentDirection = LayoutDirection.ROW_REVERSE;
            if (!this.model.getOptions().legend.orientation) {
                this.model.getOptions().legend.orientation = LegendOrientations.VERTICAL;
            }
        }
        else if (legendPosition === LegendPositions.BOTTOM) {
            fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
        }
        var fullFrameComponent = {
            id: "full-frame",
            components: [
                new LayoutComponent(this.model, this.services, __spreadArrays(((this.model.getOptions().legend.visible !== false) ? [legendComponent] : []), [
                    graphFrameComponent
                ]), {
                    direction: fullFrameComponentDirection
                })
            ],
            growth: {
                x: LayoutGrowth.STRETCH,
                y: LayoutGrowth.FIXED
            }
        };
        // Add chart title if it exists
        var topLevelLayoutComponents = [];
        if (this.model.getOptions().title) {
            topLevelLayoutComponents.push(titleComponent);
        }
        topLevelLayoutComponents.push(fullFrameComponent);
        return [
            new LayoutComponent(this.model, this.services, topLevelLayoutComponents, {
                direction: LayoutDirection.COLUMN
            })
        ];
    };
    return AxisChart;
}(Chart));
export { AxisChart };
//# sourceMappingURL=../src/axis-chart.js.map