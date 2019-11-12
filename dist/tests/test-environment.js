import * as Charts from "../index";
import { createChartHolder } from "./tools";
export var data = {
    labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
    datasets: [
        {
            label: "Dataset 1",
            fillColors: [Charts.defaultColors[0]],
            data: [
                2000,
                4200,
                7000,
                4000,
                19000
            ]
        },
        {
            label: "Dataset 2",
            fillColors: [Charts.defaultColors[1]],
            data: [
                0,
                10000,
                20000,
                30000,
                40000
            ]
        },
        {
            label: "Dataset 3",
            fillColors: [Charts.defaultColors[2]],
            data: [
                0,
                20000,
                40000,
                60000,
                80000
            ]
        }
    ]
};
export var options = {
    axes: {
        bottom: {
            title: "2018 Annual Sales Figures",
            type: "labels",
            primary: true
        },
        left: {
            secondary: true
        },
        top: {
            title: "Dollars (CAD)"
        }
    },
    legendClickable: true,
    resizable: true,
    height: 500,
    title: "My chart"
};
var TestEnvironment = /** @class */ (function () {
    function TestEnvironment() {
        this.chartOptions = options;
        this.chartData = data;
    }
    TestEnvironment.prototype.render = function () {
        var holder = createChartHolder("scatter");
        this.chart = new Charts.ScatterChart(holder, {
            data: this.chartData,
            options: this.chartOptions
        });
    };
    TestEnvironment.prototype.destroy = function () {
        this.chart.destroy();
    };
    TestEnvironment.prototype.setChartOptions = function (func) {
        this.chartOptions = func(this.chartOptions);
    };
    TestEnvironment.prototype.getChartReference = function () {
        return this.chart;
    };
    return TestEnvironment;
}());
export { TestEnvironment };
//# sourceMappingURL=../../src/tests/test-environment.js.map