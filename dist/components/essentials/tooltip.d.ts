import { Component } from "../component";
import { ChartModel } from "../../model";
import Position from "@carbon/utils-position";
export declare class Tooltip extends Component {
    type: string;
    tooltip: any;
    positionService: Position;
    constructor(model: ChartModel, services: any, configs?: any);
    init(): void;
    getTooltipHTML(data: any): string;
    getMultilineTooltipHTML(data: any): string;
    render(): void;
    positionTooltip(): void;
}
