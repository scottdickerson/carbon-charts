export declare namespace Tools {
    const debounce: any;
    const clone: any;
    const merge: any;
    const removeArrayDuplicates: any;
    /**************************************
     *  DOM-related operations            *
     *************************************/
    /**
     * Get width & height of an element
     *
     * @export
     * @param {any} el element to get dimensions from
     * @returns an object containing the width and height of el
     */
    function getDimensions(el: any): {
        width: number;
        height: number;
    };
    /**
     * Returns an elements's x and y translations from attribute transform
     * @param {HTMLElement} element
     * @returns an object containing the x and y translations or null
     */
    function getTranslationValues(elementRef: HTMLElement): {
        tx: string;
        ty: string;
    };
    /**************************************
     *  Formatting & calculations         *
     *************************************/
    /**
     * Gets x and y coordinates from a HTML transform attribute
     *
     * @export
     * @param {any} string the transform attribute string ie. transform(x,y)
     * @returns Returns an object with x and y offsets of the transform
     */
    function getTranformOffsets(string: any): {
        x: number;
        y: number;
    };
    function formatWidthHeightValues(value: any): any;
    /**
     * Capitalizes first letter of a string
     *
     * @export
     * @param {any} string the string whose first letter you'd like to capitalize
     * @returns The input string with its first letter capitalized
     */
    function capitalizeFirstLetter(string: any): any;
    /**
     * Get the percentage of a datapoint compared to the entire data-set.
     * Returns 1 significant digit if percentage is less than 1%.
     * @export
     * @param {any} item
     * @param {any} fullData
     * @returns The percentage in the form of a number
     */
    function convertValueToPercentage(item: any, fullData: any): string | number;
    /**************************************
     *  Object/array related checks       *
     *************************************/
    /**
     * Get the difference between two arrays' items
     *
     * @export
     * @param {any[]} oldArray
     * @param {any[]} newArray
     * @returns The items missing in newArray from oldArray, and items added to newArray compared to oldArray
     */
    function arrayDifferences(oldArray: any[], newArray: any[]): {
        missing: any[];
        added: any[];
    };
    /**
     * Lists out the duplicated keys in an array of data
     *
     * @export
     * @param {*} data - array of data
     * @returns A list of the duplicated keys in data
     */
    function getDuplicateValues(arr: any): any[];
    /**
     * In D3, moves an element to the front of the canvas
     *
     * @export
     * @param {any} element
     * @returns The function to be used by D3 to push element to the top of the canvas
     */
    function moveToFront(element: any): any;
    const getProperty: (object: any, ...propPath: any[]) => any;
}
