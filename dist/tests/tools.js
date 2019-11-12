// import the settings for the css prefix
import settings from "carbon-components/src/globals/js/settings";
// Functions
export var makeChartID = function (chartType) { return chartType + "-chart-holder"; };
export var createChartHolder = function (chartType) {
    var chartHolder = document.createElement("div");
    chartHolder.id = makeChartID(chartType);
    chartHolder.classList.add(settings.prefix + "--chart-holder");
    document.body.appendChild(chartHolder);
    return chartHolder;
};
export var getChartHolder = function (chartType) { return document.getElementById(makeChartID(chartType)); };
//# sourceMappingURL=../../src/tests/tools.js.map