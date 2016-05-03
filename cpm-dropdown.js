// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

;( function($, window, document, undefined) {

    "use strict";

        // undefined is used here as the undefined global variable in ECMAScript 3 is
        // mutable (ie. it can be changed by someone else). undefined isn't really being
        // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
        // can no longer be modified.

        // window and document are passed through as local variables rather than global
        // as this (slightly) quickens the resolution process and can be more efficiently
        // minified (especially when both are regularly referenced in your plugin).

        // Create the defaults once
        var pluginName = "cpmDropdown",
            defaults = {
                data: []
            };

        // The actual plugin constructor
        function Plugin (element, options) {
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
            init: function() {
                var _this = this;
                // Place initialization logic here
                // You already have access to the DOM element and
                // the options via the instance, e.g. this.element
                // and this.settings
                // you can add more functions like the one below and
                // call them like the example below

                $(this.element).webuiPopover({
                    arrow: false,
                    animation:'pop',
                    style: 'custom',
                    offsetTop: 5,
                    padding: 0,
                    width: 250,
                    onShow: function($popoverElement) {
                        _this._isOpen = true;
                        $popoverElement.on("click", ".item", _this.handleClickItem.bind(_this))
                        if (_this.element.value) {
                            var option, index;
                            for (var i = 0; i < _this.settings.data.length; i++) {
                                var opt = _this.settings.data[i];
                                if (opt.text === parseFloat(_this.element.value)) {
                                    index = i;
                                    option = opt;
                                    break;
                                }
                            }

                            if (option) {
                                var $container = $("#optionsContainer");
                                if (index * 42 + 42> 200) {
                                    $container.animate({ scrollTop: index * 42 - 42 }, 0)
                                }
                                $($container.find(".item-selected")).removeClass("item-selected");
                                $("#item-" + option.id).addClass("item-selected");
                            }
                        }
                    },
                    onHide: function($popoverElement) {
                        _this._isOpen = false;
                        $popoverElement.off("click", ".item", _this.handleClickItem.bind(_this))
                    },
                    content: function() {
                        var content = "<div>";
                        content += "<div class='item item-optimal'>"
                        content += "<span class='label-text'>"
                        content += "<span>$5.00</span>"
                        content += "<span class='label-bid'>(Optimal Bid)</span>"
                        content += "</span>"
                        content += "<span class='label-units bg-green'>30</span>"
                        content += "</div>"

                        content += "<div id='optionsContainer' class='container'>"
                        content += _this.settings.data.map(function (item) {
                            var itemContent = "<div data-id='" + item.id + "' id='item-" + item.id + "' class='item'>";
                            itemContent += "<span class='label-text'>";
                            itemContent += "<span>$" + item.text.toFixed(2) + "</span>";
                            if (item.id === 2)
                                itemContent += "<span class='label-bid'>(Low Bid)</span>";

                            itemContent += "</span>"
                            itemContent += "<span class='label-units'>" + item.units + "</span>"
                            itemContent += "</div>"
                            return itemContent
                        }).join('')
                        content += "</div>"
                        content += "</div>"
                        return content;
                    }
                })

                $(this.element).on("keyup", this.handleKeyPresses.bind(this))
            },

            handleClickItem: function(event) {
                var itemElem = this.getItemElem(event.target);
                this._selected = itemElem.data('id')
                this.setValue()
            },

            getItemElem: function(element) {
                var $element = $(element);
                return $element.hasClass("item") ? $element : this.getItemElem($element.parent());
            },

            setValue: function() {
                if (this._selected === undefined)
                    return

                var _this = this;
                var item = this.settings.data.find(function(x) { return x.id === _this._selected })
                $(this.element).val(item.text.toFixed(2))
                $(this.element).webuiPopover('hide');
            },

            handleKeyPresses: function(event) {
                var $container = $("#optionsContainer");

                if ([13, 38, 40].indexOf(event.keyCode) >= 0) {
                    if(event.keyCode === 40) {
                        if (this._selected === undefined)
                            this._selected = 1
                        else if (this._selected < this.settings.data.length)
                            this._selected = this._selected + 1
                    }
                    else if (event.keyCode === 38) {
                        if (this._selected === undefined)
                            this._selected = 1
                        else if (this._selected > 1)
                            this._selected = this._selected - 1
                    }
                    else if (event.keyCode === 13) {
                        if (this._isOpen) {
                            this.setValue()
                        } else {
                            $(this.element).webuiPopover('show');
                        }
                    }

                    var $itemElem = $("#item-" + this._selected);

                    //Remove highlight from old selection
                    $($container.find(".item-selected")).removeClass("item-selected");
                    //Highlight item
                    $itemElem.addClass("item-selected");

                    var containerTop = $container[0].offsetTop;
                    var containerScrollTop = $container[0].scrollTop;

                    var elemTop = $itemElem[0].offsetTop - containerTop;
                    var fitContainer = elemTop + 42 < 200 + containerScrollTop;
                    var posTop = containerTop + containerScrollTop;

                    if (!fitContainer) {
                        $container[0].scrollTop += 42;
                    }
                    else if (posTop > (elemTop + 42)) {
                        $container[0].scrollTop -= 60;
                    }
                } 
                else {
                    var value = parseFloat(this.element.value);
                    var options = this.settings.data.filter(function(x) {
                        return Math.floor(x.text) == Math.floor(value)
                    })
                    var option = this.settings.data.find(function(x) { return parseFloat(x.text) == value })
                    var index = this.settings.data.indexOf(options[0])

                    if (index >= 0 && option) {
                        this._selected = option.id;
                        var elemId = "#item-" + option.id;
                        //Remove highlight from old selection
                        $($container.find(".item-selected")).removeClass("item-selected");

                        $(elemId).addClass("item-selected");
                        $container.animate({scrollTop: index * 42}, 300, "swing")
                    }
                }
            }
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[pluginName] = function(options) {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)){
                    $.data(this, "plugin_" +
                        pluginName, new Plugin(this, options));
                }
            });
        };

})(jQuery, window, document);