/**
 * enum of all supported chart themes
 */
export var ChartTheme;
(function (ChartTheme) {
    ChartTheme["DEFAULT"] = "default";
    ChartTheme["G100"] = "g100";
    ChartTheme["G90"] = "g90";
    ChartTheme["G10"] = "g10";
})(ChartTheme || (ChartTheme = {}));
/**
 * enum of all possible axis positions
 */
export var AxisPositions;
(function (AxisPositions) {
    AxisPositions["LEFT"] = "left";
    AxisPositions["RIGHT"] = "right";
    AxisPositions["TOP"] = "top";
    AxisPositions["BOTTOM"] = "bottom";
})(AxisPositions || (AxisPositions = {}));
export var AxisTypes;
(function (AxisTypes) {
    AxisTypes["PRIMARY"] = "primary";
    AxisTypes["SECONDARY"] = "secondary";
})(AxisTypes || (AxisTypes = {}));
/**
 * enum of all possible scale types
 */
export var ScaleTypes;
(function (ScaleTypes) {
    ScaleTypes["TIME"] = "time";
    ScaleTypes["LINEAR"] = "linear";
    ScaleTypes["LOG"] = "log";
    ScaleTypes["LABELS"] = "labels";
})(ScaleTypes || (ScaleTypes = {}));
/**
 * enum of supported tooltip position relative to
 */
export var TooltipPosition;
(function (TooltipPosition) {
    TooltipPosition["MOUSE"] = "mouse";
    TooltipPosition["TOP"] = "top";
    TooltipPosition["BOTTOM"] = "bottom";
})(TooltipPosition || (TooltipPosition = {}));
/**
 * enum of tooltip types for custom tooltip event
 */
export var TooltipTypes;
(function (TooltipTypes) {
    TooltipTypes["DATAPOINT"] = "datapoint";
    TooltipTypes["GRIDLINE"] = "gridline";
})(TooltipTypes || (TooltipTypes = {}));
/**
 * enum of all possible legend positions
 */
export var LegendPositions;
(function (LegendPositions) {
    LegendPositions["RIGHT"] = "right";
    LegendPositions["LEFT"] = "left";
    LegendPositions["TOP"] = "top";
    LegendPositions["BOTTOM"] = "bottom";
})(LegendPositions || (LegendPositions = {}));
/**
 * enum of all possible legend orientations
 */
export var LegendOrientations;
(function (LegendOrientations) {
    LegendOrientations["HORIZONTAL"] = "horizontal";
    LegendOrientations["VERTICAL"] = "vertical";
})(LegendOrientations || (LegendOrientations = {}));
/**
 * enum of all possible layout directions
 */
export var LayoutDirection;
(function (LayoutDirection) {
    LayoutDirection["ROW"] = "row";
    LayoutDirection["COLUMN"] = "column";
    LayoutDirection["ROW_REVERSE"] = "row-reverse";
    LayoutDirection["COLUMN_REVERSE"] = "column-reverse";
})(LayoutDirection || (LayoutDirection = {}));
/**
 * enum of all possible layout growth values
 */
export var LayoutGrowth;
(function (LayoutGrowth) {
    LayoutGrowth["FIXED"] = "fixed";
    LayoutGrowth["PREFERRED"] = "preferred";
    LayoutGrowth["STRETCH"] = "stretch";
})(LayoutGrowth || (LayoutGrowth = {}));
/**
 * enum of all possible callout directions
 */
export var CalloutDirections;
(function (CalloutDirections) {
    CalloutDirections["LEFT"] = "left";
    CalloutDirections["RIGHT"] = "right";
})(CalloutDirections || (CalloutDirections = {}));
//# sourceMappingURL=../../src/interfaces/enums.js.map