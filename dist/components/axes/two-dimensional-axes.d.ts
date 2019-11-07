import { Component } from "../component";
export declare class TwoDimensionalAxes extends Component {
    type: string;
    children: any;
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    render(animate?: boolean): void;
}
