import { DOMUtils } from "../services";
import { Tools } from "../tools";
// D3 Imports
import { select } from "d3-selection";
// import the settings for the css prefix
import settings from "carbon-components/src/globals/js/settings";
var Component = /** @class */ (function () {
    function Component(model, services, configs) {
        this.configs = {};
        this.model = model;
        this.services = services;
        if (configs) {
            this.configs = configs;
        }
        // Set parent element to shell SVG if no parent exists for component
        if (!this.parent) {
            this.setParent(select(this.services.domUtils.getMainSVG()));
        }
    }
    Component.prototype.init = function () {
    };
    Component.prototype.render = function (animate) {
        if (animate === void 0) { animate = true; }
        console.error("render() method is not implemented");
    };
    Component.prototype.destroy = function () {
    };
    // Used to pass down information to the components
    Component.prototype.setModel = function (newObj) {
        this.model = newObj;
    };
    // Used to pass down information to the components
    Component.prototype.setServices = function (newObj) {
        this.services = newObj;
    };
    Component.prototype.setParent = function (parent) {
        var oldParent = this.parent;
        this.parent = parent;
        if (oldParent && oldParent.node() === parent.node()) {
            return;
        }
        if (this.type) {
            var chartprefix = Tools.getProperty(this.model.getOptions(), "style", "prefix");
            this.parent.classed(settings.prefix + "--" + chartprefix + "--" + this.type, true);
            if (oldParent) {
                oldParent.classed(settings.prefix + "--" + chartprefix + "--" + this.type, false);
            }
        }
    };
    Component.prototype.getParent = function () {
        return this.parent;
    };
    Component.prototype.getContainerSVG = function () {
        if (this.type) {
            var chartprefix = Tools.getProperty(this.model.getOptions(), "style", "prefix");
            return DOMUtils.appendOrSelect(this.parent, "g." + settings.prefix + "--" + chartprefix + "--" + this.type);
        }
        return this.parent;
    };
    return Component;
}());
export { Component };
//# sourceMappingURL=../../src/components/component.js.map