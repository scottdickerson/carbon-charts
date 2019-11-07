import { Tools } from "./tools";
import { ChartTheme, LegendPositions, } from "./interfaces/index";
/*
 *****************************
 * User configurable options *
 *****************************
 */
/**
 * Legend options
 */
export var legend = {
    position: LegendPositions.BOTTOM,
    clickable: true,
    items: {
        status: {
            ACTIVE: 1,
            DISABLED: 0
        },
        horizontalSpace: 12,
        verticalSpace: 24,
        textYOffset: 8
    },
    checkbox: {
        radius: 6.5,
        spaceAfter: 4
    }
};
/**
 * Grid options
 */
export var grid = {
    x: {
        numberOfTicks: 5
    },
    y: {
        numberOfTicks: 5
    }
};
/**
 * Tooltip options
 */
export var baseTooltip = {
    datapoint: {
        horizontalOffset: 10,
        enabled: true,
    },
};
export var axisChartTooltip = Tools.merge({}, baseTooltip, {
    gridline: {
        enabled: true,
        threshold: 0.25
    }
});
export var barChartTooltip = Tools.merge({}, axisChartTooltip, {
    datapoint: {
        verticalOffset: 4
    },
    gridline: {
        enabled: false
    }
});
// We setup no axes by default, the TwoDimensionalAxes component
// Will setup axes options based on what user provides
export var axes = {};
export var timeScale = {
    addSpaceOnEdges: true
};
/**
 * Base chart options common to any chart
 */
var chart = {
    width: "100%",
    height: "100%",
    resizable: true,
    theme: ChartTheme.DEFAULT,
    tooltip: baseTooltip,
    legend: legend,
    style: {
        prefix: "cc"
    }
};
/**
 * Options common to any chart with an axis
 */
var axisChart = Tools.merge({}, chart, {
    axes: axes,
    timeScale: timeScale,
    grid: grid,
    tooltip: axisChartTooltip
});
/**
 * options specific to simple bar charts
 */
var baseBarChart = Tools.merge({}, axisChart, {
    bars: {
        maxWidth: 16
    },
    timeScale: Tools.merge(timeScale, {
        addSpaceOnEdges: true
    }),
    tooltip: barChartTooltip
});
/**
 * options specific to simple bar charts
 */
var simpleBarChart = Tools.merge({}, baseBarChart, {});
/**
 * options specific to simple bar charts
 */
var groupedBarChart = Tools.merge({}, baseBarChart, {});
/**
 * options specific to stacked bar charts
 */
var stackedBarChart = Tools.merge({}, baseBarChart, {
    bars: Tools.merge({}, baseBarChart.bars, {
        dividerSize: 1.5
    })
});
/**
 * options specific to line charts
 */
var lineChart = Tools.merge({}, axisChart, {
    points: {
        // default point radius to 3
        radius: 3,
        filled: false
    }
});
/**
 * options specific to scatter charts
 */
var scatterChart = Tools.merge({}, axisChart, {
    points: {
        // default point radius to 4
        radius: 4,
        fillOpacity: 0.3,
        filled: true
    }
});
/**
 * options specific to pie charts
 */
var pieChart = Tools.merge({}, chart, {
    pie: {
        radiusOffset: -15,
        innerRadius: 2,
        padAngle: 0.007,
        hoverArc: {
            outerRadiusOffset: 3
        },
        xOffset: 30,
        yOffset: 20,
        yOffsetCallout: 10,
        callout: {
            minSliceDegree: 5,
            offsetX: 15,
            offsetY: 12,
            horizontalLineLength: 8,
            textMargin: 2
        }
    }
});
/**
 * options specific to donut charts
 */
var donutChart = Tools.merge({}, pieChart, {
    donut: {
        center: {
            numberFontSize: function (radius) { return Math.min((radius / 100) * 24, 24) + "px"; },
            titleFontSize: function (radius) { return Math.min((radius / 100) * 15, 15) + "px"; },
            titleYPosition: function (radius) { return Math.min((radius / 80) * 20, 20); }
        }
    }
});
export var options = {
    chart: chart,
    axisChart: axisChart,
    simpleBarChart: simpleBarChart,
    groupedBarChart: groupedBarChart,
    stackedBarChart: stackedBarChart,
    lineChart: lineChart,
    scatterChart: scatterChart,
    pieChart: pieChart,
    donutChart: donutChart
};
/**
 * Options for line behaviour
 */
export var lines = {
    opacity: {
        unselected: 0.3,
        selected: 1
    }
};
/**
 * Base transition configuration
 */
export var transitions = {
    default: {
        duration: 300
    },
    pie_slice_mouseover: {
        duration: 100
    },
    pie_chart_titles: {
        duration: 375
    },
    graph_element_mouseover_fill_update: {
        duration: 100
    },
    graph_element_mouseout_fill_update: {
        duration: 100
    }
};
//# sourceMappingURL=../src/configuration.js.map