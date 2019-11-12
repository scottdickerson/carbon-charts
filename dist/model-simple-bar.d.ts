import { ChartModel } from "./model";
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export declare class SimpleBarChartModel extends ChartModel {
    constructor(services: any);
    generateDataLabels(newData: any): {};
    getDisplayData(): any;
    setColorScale(): void;
    getFillColor(label: string): any;
    getStrokeColor(label: string): any;
}
