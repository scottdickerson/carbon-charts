import { debounce as lodashDebounce, merge as lodashMerge, cloneDeep as lodashCloneDeep, uniq as lodashUnique } from "lodash-es";
// Functions
export var Tools;
(function (Tools) {
    // Export these functions from lodash
    Tools.debounce = lodashDebounce;
    Tools.clone = lodashCloneDeep;
    Tools.merge = lodashMerge;
    Tools.removeArrayDuplicates = lodashUnique;
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
    function getDimensions(el) {
        return {
            width: parseFloat(el.style.width.replace("px", "") || el.offsetWidth),
            height: parseFloat(el.style.height.replace("px", "") || el.offsetHeight)
        };
    }
    Tools.getDimensions = getDimensions;
    /**
     * Returns an elements's x and y translations from attribute transform
     * @param {HTMLElement} element
     * @returns an object containing the x and y translations or null
     */
    function getTranslationValues(elementRef) {
        // regex to ONLY get values for translate (instead of all rotate, translate, skew, etc)
        var translateRegex = /translate\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*\)/;
        var transformStr = elementRef.getAttribute("transform").match(translateRegex);
        // check for the match
        if (transformStr[0]) {
            var transforms = transformStr[0].replace(/translate\(/, "").replace(/\)/, "").split(",");
            return {
                tx: transforms[0],
                ty: transforms[1]
            };
        }
        return null;
    }
    Tools.getTranslationValues = getTranslationValues;
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
    function getTranformOffsets(string) {
        var regExp = /\(([^)]+)\)/;
        var match = regExp.exec(string)[1];
        var xyString = match.split(",");
        return {
            x: parseFloat(xyString[0]),
            y: parseFloat(xyString[1])
        };
    }
    Tools.getTranformOffsets = getTranformOffsets;
    function formatWidthHeightValues(value) {
        var stringValue = value.toString();
        // If the value provided contains any letters
        // Return it the same way
        if (stringValue.match(/[a-z]/i)) {
            return stringValue;
        }
        return stringValue + "px";
    }
    Tools.formatWidthHeightValues = formatWidthHeightValues;
    /**
     * Capitalizes first letter of a string
     *
     * @export
     * @param {any} string the string whose first letter you'd like to capitalize
     * @returns The input string with its first letter capitalized
     */
    function capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    Tools.capitalizeFirstLetter = capitalizeFirstLetter;
    /**
     * Get the percentage of a datapoint compared to the entire data-set.
     * Returns 1 significant digit if percentage is less than 1%.
     * @export
     * @param {any} item
     * @param {any} fullData
     * @returns The percentage in the form of a number
     */
    function convertValueToPercentage(item, fullData) {
        var percentage = item / fullData.reduce(function (accum, val) { return accum + val.value; }, 0) * 100;
        return percentage < 1 ? percentage.toPrecision(1) : Math.floor(percentage);
    }
    Tools.convertValueToPercentage = convertValueToPercentage;
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
    function arrayDifferences(oldArray, newArray) {
        var difference = {
            missing: [],
            added: []
        };
        oldArray.forEach(function (element) {
            if (newArray.indexOf(element) === -1) {
                difference.missing.push(element);
            }
        });
        newArray.forEach(function (element) {
            if (oldArray.indexOf(element) === -1) {
                difference.added.push(element);
            }
        });
        return difference;
    }
    Tools.arrayDifferences = arrayDifferences;
    /**
     * Lists out the duplicated keys in an array of data
     *
     * @export
     * @param {*} data - array of data
     * @returns A list of the duplicated keys in data
     */
    function getDuplicateValues(arr) {
        var values = [];
        var duplicateValues = [];
        arr.forEach(function (value) {
            if (values.indexOf(value) !== -1 && duplicateValues.indexOf(value) === -1) {
                duplicateValues.push(value);
            }
            values.push(value);
        });
        return duplicateValues;
    }
    Tools.getDuplicateValues = getDuplicateValues;
    // ================================================================================
    // D3 Extensions
    // ================================================================================
    /**
     * In D3, moves an element to the front of the canvas
     *
     * @export
     * @param {any} element
     * @returns The function to be used by D3 to push element to the top of the canvas
     */
    function moveToFront(element) {
        return element.each(function () {
            this.parentNode.appendChild(this);
        });
    }
    Tools.moveToFront = moveToFront;
    // ================================================================================
    // Style Helpers
    // ================================================================================
    Tools.getProperty = function (object) {
        var propPath = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            propPath[_i - 1] = arguments[_i];
        }
        var position = object;
        if (position) {
            for (var _a = 0, propPath_1 = propPath; _a < propPath_1.length; _a++) {
                var prop = propPath_1[_a];
                if (position[prop]) {
                    position = position[prop];
                }
                else {
                    return null;
                }
            }
            return position;
        }
        return null;
    };
})(Tools || (Tools = {}));
//# sourceMappingURL=../src/tools.js.map