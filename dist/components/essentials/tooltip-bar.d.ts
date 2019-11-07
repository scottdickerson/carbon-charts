import { Tooltip } from "./tooltip";
import { TooltipPosition } from "./../../interfaces/enums";
export declare class TooltipBar extends Tooltip {
    init(): void;
    /**
     * Get the position of the tooltip relative to the active hovered bar. Tooltip should appear above
     * positive valued data and below negative value data.
     * @param hoveredElement
     */
    getTooltipPosition(hoveredElement: any): {
        placement: TooltipPosition;
        position: {
            left: number;
            top: any;
        };
    };
    /**
     * Returns the html for the bar single point tooltip
     * @param data associated values for the hovered bar
     */
    getTooltipHTML(data: any): string;
    /**
     * Multip tooltips for bar charts include totals for each stack
     * @param data
     */
    getMultilineTooltipHTML(data: any): string;
    positionTooltip(positionOverride?: any): void;
}
