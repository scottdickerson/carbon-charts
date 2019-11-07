import { ChartModel } from "./model";
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export declare class PieChartModel extends ChartModel {
    constructor(services: any);
    generateDataLabels(newData: any): {};
    getDisplayData(): any;
    toggleDataLabel(changedLabel: string): void;
    setColorScale(): void;
    getFillColor(label: string): any;
    getStrokeColor(label: string): any;
}
