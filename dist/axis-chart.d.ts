import { Chart } from "./chart";
import { ChartConfig, AxisChartOptions } from "./interfaces/index";
import { LayoutComponent } from "./components/index";
export declare class AxisChart extends Chart {
    services: any;
    constructor(holder: Element, chartConfigs: ChartConfig<AxisChartOptions>);
    protected getAxisChartComponents(graphFrameComponents: any[]): LayoutComponent[];
}
