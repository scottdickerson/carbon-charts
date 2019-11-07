import { BaseChartOptions, AxisChartOptions, ScatterChartOptions, LineChartOptions, BarChartOptions, StackedBarChartOptions, PieChartOptions, DonutChartOptions, GridOptions, AxesOptions, TimeScaleOptions, TooltipOptions, AxisTooltipOptions, BarTooltipOptions, LegendOptions } from "./interfaces/index";
/**
 * Legend options
 */
export declare const legend: LegendOptions;
/**
 * Grid options
 */
export declare const grid: GridOptions;
/**
 * Tooltip options
 */
export declare const baseTooltip: TooltipOptions;
export declare const axisChartTooltip: AxisTooltipOptions;
export declare const barChartTooltip: BarTooltipOptions;
export declare const axes: AxesOptions;
export declare const timeScale: TimeScaleOptions;
export declare const options: {
    chart: BaseChartOptions;
    axisChart: AxisChartOptions;
    simpleBarChart: BarChartOptions;
    groupedBarChart: BarChartOptions;
    stackedBarChart: StackedBarChartOptions;
    lineChart: LineChartOptions;
    scatterChart: ScatterChartOptions;
    pieChart: PieChartOptions;
    donutChart: DonutChartOptions;
};
/**
 * Options for line behaviour
 */
export declare const lines: {
    opacity: {
        unselected: number;
        selected: number;
    };
};
/**
 * Base transition configuration
 */
export declare const transitions: {
    default: {
        duration: number;
    };
    pie_slice_mouseover: {
        duration: number;
    };
    pie_chart_titles: {
        duration: number;
    };
    graph_element_mouseover_fill_update: {
        duration: number;
    };
    graph_element_mouseout_fill_update: {
        duration: number;
    };
};
