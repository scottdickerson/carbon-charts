import { AxisChart } from "../axis-chart";
import { ChartConfig, ScatterChartOptions } from "../interfaces/index";
import { SimpleBarChartModel } from "../model-simple-bar";
export declare class SimpleBarChart extends AxisChart {
    model: SimpleBarChartModel;
    constructor(holder: Element, chartConfigs: ChartConfig<ScatterChartOptions>);
    getComponents(): any[];
}
