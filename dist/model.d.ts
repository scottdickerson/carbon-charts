/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export declare class ChartModel {
    /**
     * Function to be called when data or options update within the model
     * @type Function
     */
    protected updateCallback: Function;
    protected services: any;
    protected state: any;
    /**
     * A list of all the labels that have existed within the lifetime of the chart
     * @type string[]
     */
    protected allDataLabels: string[];
    protected patternScale: {};
    protected colorScale: any;
    constructor(services: any);
    getDisplayData(): any;
    getData(): any;
    /**
     *
     * @param newData The new raw data to be set
     */
    setData(newData: any): any;
    generateDataLabels(newData: any): {};
    /**
     * @return {Object} The chart's options
     */
    getOptions(): any;
    set(newState: any, skipUpdate?: boolean): void;
    get(property?: string): any;
    /**
     *
     * @param newOptions New options to be set
     */
    setOptions(newOptions: any): void;
    /**
     *
     * Updates miscellanous information within the model
     * such as the color scales, or the legend data labels
     */
    update(): void;
    setUpdateCallback(cb: Function): void;
    toggleDataLabel(changedLabel: string): void;
    setColorScale(): void;
    /**
     * Should the data point be filled?
     * @param datasetLabel
     * @param label
     * @param value
     * @param defaultFilled the default for this chart
     */
    getIsFilled(datasetLabel: any, label?: any, value?: any, data?: any, defaultFilled?: boolean): any;
    getFillColor(datasetLabel: any, label?: any, value?: any, data?: any): any;
    getStrokeColor(datasetLabel: any, label?: any, value?: any, data?: any): any;
    getFillScale(): any;
    protected updateAllDataLabels(): void;
}
