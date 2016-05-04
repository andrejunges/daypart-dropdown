// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

; (function ($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "daypartDropdown",
        defaults = {
            
        };

    function renderCustomElement(option) {
        var itemContent = "<div class='custom-option-element' data-key=" + option.key + ">";
        itemContent += "<span>" + option.description + "</span>";
        itemContent += "</div>";

        return itemContent
    }

    function renderDayElement(day) {
        var itemContent = "<div class='day-element'>";
        itemContent += "<div class='checkbox'>";
        itemContent += "<label>";
        itemContent += "<input id='" + day.key + "' type='checkbox'>" + day.description;
        itemContent += "</label>";
        itemContent += "</div>";
        itemContent += "</div>"

        return itemContent
    }

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this._selected = undefined;
        this._isOpen = false;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var _this = this;
            var days = [
                { key: 'Mon', description: 'Monday' },
                { key: 'Tue', description: 'Tuesday' },
                { key: 'Wed', description: 'Wednesday' },
                { key: 'Thu', description: 'Thursday' },
                { key: 'Fri', description: 'Friday' },
                { key: 'Sat', description: 'Saturday' },
                { key: 'Sun', description: 'Sunday' },
            ]
            var customOptions = [
                { key: 1, description: 'Everyday' },
                { key: 2, description: 'Weekdays' },
                { key: 3, description: 'Weekends' },
            ]

            this.clickCustomOption = this.clickCustomOption.bind(this)
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like the example below

            $(this.element).webuiPopover({
                arrow: false,
                animation: 'pop',
                style: 'custom',
                offsetTop: 1,
                offsetLeft: 50,
                dismissible: false,
                padding: 0,
                placement: 'bottom',
                width: 300,
                onShow: function ($popoverElement) {
                    _this._isOpen = true;
                    $(".timepicker").timepicker({
                        selectTime: function(e) { e.stopPropagation() }
                    })

                    $(".custom-option-element").on("click", _this.clickCustomOption)
                },
                onHide: function ($popoverElement) {
                    _this._isOpen = false;
                    $(".custom-option-element").off("click", _this.clickCustomOption)
                    
                },
                content: function () {
                    var content = "<div>";

                        //LeftContainer
                        content += "<div class='daypart-left-container'>";
                            //Custom options
                            content += "<div class='custom-options-container'>"
                            content += customOptions.map(renderCustomElement).join('')
                            content += "</div>"

                            //Days
                            content += "<div class='days-container'>"
                            content += days.map(renderDayElement).join('')
                            content += "</div>"
                        content += "</div>";

                        //Right Container
                        content += "<div class='daypart-right-container'>"
                            content += "<div class='time-pickers-container'>"
                            content += "<input type='text' class='timepicker' />"
                            content += "<span>to</span>"
                            content += "<input type='text' class='timepicker' />"
                            content += "</div>";
                        content += "</div>";

                    content += "</div>"
                    return content;
                }
            })
        },

        clickCustomOption: function(event) {
            var key = $(event.currentTarget).data("key");
            var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            var daysContainer = $(".days-container");
            function toogleCheckbox(checked, day) {
                var elem = $(daysContainer.find("#" + day));
                elem.prop("checked", checked)
            }
            function isWeekDay(x) { return x !== "Sat" && x !== "Sun" }
            function isWeekendDay(x) { return x === "Sat" || x === "Sun" }

            if (key === 1) { //Everyday
                days.forEach(toogleCheckbox.bind(null, true))
            }
            else if (key === 2) { //Weekdays
                days
                    .filter(isWeekDay)
                    .forEach(toogleCheckbox.bind(null, true))

                days
                    .filter(isWeekendDay)
                    .forEach(toogleCheckbox.bind(null, false))
            }
            else { //Weekends
                days
                    .filter(isWeekendDay)
                    .forEach(toogleCheckbox.bind(null, true))

                days
                    .filter(isWeekDay)
                    .forEach(toogleCheckbox.bind(null, false))
            }

        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);