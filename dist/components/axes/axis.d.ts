import { Component } from "../component";
import { ScaleTypes } from "../../interfaces";
import { ChartModel } from "../../model";
export declare class Axis extends Component {
    type: string;
    margins: any;
    scale: any;
    scaleType: ScaleTypes;
    constructor(model: ChartModel, services: any, configs?: any);
    createOrGetScale(): any;
    getScale(): any;
    getScaleDomain(): any;
    render(animate?: boolean): void;
    getValueFromScale(datum: any, index?: number): any;
    getAxisRef(): any;
    getTitleRef(): any;
}
