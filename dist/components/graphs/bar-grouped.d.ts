import { Bar } from "./bar";
import { ScaleBand } from "d3-scale";
export declare class GroupedBar extends Bar {
    type: string;
    groupScale: ScaleBand<any>;
    init(): void;
    getGroupWidth(): number;
    setGroupScale(): void;
    getBarWidth(): number;
    render(animate: boolean): void;
    addLabelsToDataPoints(d: any, index: any): any;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addEventListeners(): void;
    destroy(): void;
}
