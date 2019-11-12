import { Component } from "../component";
export declare class Legend extends Component {
    type: string;
    render(): void;
    breakItemsIntoLines(addedLegendItems: any): void;
    getLegendItemArray(): {
        key: string;
        value: any;
    }[];
    addEventListeners(): void;
}
