import { Service } from "./service";
export declare class Axes extends Service {
    getMainXAxis(): any;
    getMainYAxis(): any;
    getXValue(d: any, i: any): any;
    getYValue(d: any, i: any): any;
    /** Uses the primary Y Axis to get data items associated with that value.  */
    getDataFromDomain(domainValue: any): any[];
}
