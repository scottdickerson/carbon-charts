import { Service } from "../service";
import { Selection } from "d3-selection";
export declare class DOMUtils extends Service {
    static getSVGElementSize(svgSelector: Selection<any, any, any, any>, options?: any): any;
    static appendOrSelect(parent: any, query: any): any;
    protected svg: Element;
    init(): void;
    styleHolderElement(): void;
    getHolder(): any;
    addSVGElement(): void;
    getMainSVG(): Element;
    addResizeListener(): void;
}
