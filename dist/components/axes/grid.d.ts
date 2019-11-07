import { Component } from "../component";
export declare class Grid extends Component {
    type: string;
    backdrop: any;
    render(): void;
    drawXGrid(): void;
    drawYGrid(): void;
    /**
     * Returns the threshold for the gridline tooltips based on the mouse location.
     * Calculated based on the mouse position between the two closest gridlines or edges of chart.
     */
    getGridlineThreshold(mousePos: any): number;
    /**
     * Returns the active gridlines based on the gridline threshold and mouse position.
     * @param position mouse positon
     */
    getActiveGridline(position: any): any;
    /**
     * Adds the listener on the X grid to trigger multiple point tooltips along the x axis.
     */
    addGridEventListeners(): void;
    drawBackdrop(): void;
    cleanGrid(g: any): void;
}
