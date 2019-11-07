import { Component } from "../component";
export declare class Scatter extends Component {
    type: string;
    init(): void;
    render(animate: boolean): void;
    handleLegendOnHover: (event: CustomEvent<any>) => void;
    handleLegendMouseOut: (event: CustomEvent<any>) => void;
    addLabelsToDataPoints(d: any, index: any): any;
    addEventListeners(): void;
    destroy(): void;
}
