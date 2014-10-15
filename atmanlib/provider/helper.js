define('atmanlib-provider/helper',['at_app'], function(app) {
    app.lazy.provider('$dateParser', function() {

        var proto = Date.prototype;

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        var defaults = this.defaults = {
            format: 'shortDate',
            strict: false
        };

        this.$get = ["$locale", function($locale) {

            return function(config) {

                var options = angular.extend({}, defaults, config);

                var $dateParser = {};

                var regExpMap = {
                    'sss'   : '[0-9]{3}',
                    'ss'    : '[0-5][0-9]',
                    's'     : options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
                    'mm'    : '[0-5][0-9]',
                    'm'     : options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
                    'HH'    : '[01][0-9]|2[0-3]',
                    'H'     : options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
                    'hh'    : '[0][1-9]|[1][012]',
                    'h'     : options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
                    'a'     : 'AM|PM',
                    'EEEE'  : $locale.DATETIME_FORMATS.DAY.join('|'),
                    'EEE'   : $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
                    'dd'    : '0[1-9]|[12][0-9]|3[01]',
                    'd'     : options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
                    'MMMM'  : $locale.DATETIME_FORMATS.MONTH.join('|'),
                    'MMM'   : $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                    'MM'    : '0[1-9]|1[012]',
                    'M'     : options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
                    'yyyy'  : '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
                    'yy'    : '[0-9]{2}',
                    'y'     : options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}',
                };

                var setFnMap = {
                    'sss'   : proto.setMilliseconds,
                    'ss'    : proto.setSeconds,
                    's'     : proto.setSeconds,
                    'mm'    : proto.setMinutes,
                    'm'     : proto.setMinutes,
                    'HH'    : proto.setHours,
                    'H'     : proto.setHours,
                    'hh'    : proto.setHours,
                    'h'     : proto.setHours,
                    'dd'    : proto.setDate,
                    'd'     : proto.setDate,
                    'a'     : function(value) { var hours = this.getHours(); return this.setHours(value.match(/pm/i) ? hours + 12 : hours); },
                    'MMMM'  : function(value) { return this.setMonth($locale.DATETIME_FORMATS.MONTH.indexOf(value)); },
                    'MMM'   : function(value) { return this.setMonth($locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value)); },
                    'MM'    : function(value) { return this.setMonth(1 * value - 1); },
                    'M'     : function(value) { return this.setMonth(1 * value - 1); },
                    'yyyy'  : proto.setFullYear,
                    'yy'    : function(value) { return this.setFullYear(2000 + 1 * value); },
                    'y'    : proto.setFullYear
                };

                var regex, setMap;

                $dateParser.init = function() {
                    $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
                    regex = regExpForFormat($dateParser.$format);
                    setMap = setMapForFormat($dateParser.$format);
                };

                $dateParser.isValid = function(date) {
                    if(angular.isDate(date)) return !isNaN(date.getTime());
                    return regex.test(date);
                };

                $dateParser.parse = function(value, baseDate) {
                    if(angular.isDate(value)) return value;
                    var matches = regex.exec(value);
                    if(!matches) return false;
                    var date = baseDate || new Date(0, 0, 1);
                    for(var i = 0; i < matches.length - 1; i++) {
                        setMap[i] && setMap[i].call(date, matches[i+1]);
                    }
                    return date;
                };

                // Private functions

                function setMapForFormat(format) {
                    var keys = Object.keys(setFnMap), i;
                    var map = [], sortedMap = [];
                    // Map to setFn
                    var clonedFormat = format;
                    for(i = 0; i < keys.length; i++) {
                        if(format.split(keys[i]).length > 1) {
                            var index = clonedFormat.search(keys[i]);
                            format = format.split(keys[i]).join('');
                            if(setFnMap[keys[i]]) map[index] = setFnMap[keys[i]];
                        }
                    }
                    // Sort result map
                    angular.forEach(map, function(v) {
                        sortedMap.push(v);
                    });
                    return sortedMap;
                }

                function escapeReservedSymbols(text) {
                    return text.replace(/\//g, '[\\/]').replace('/-/g', '[-]').replace(/\./g, '[.]').replace(/\\s/g, '[\\s]');
                }

                function regExpForFormat(format) {
                    var keys = Object.keys(regExpMap), i;

                    var re = format;
                    // Abstract replaces to avoid collisions
                    for(i = 0; i < keys.length; i++) {
                        re = re.split(keys[i]).join('${' + i + '}');
                    }
                    // Replace abstracted values
                    for(i = 0; i < keys.length; i++) {
                        re = re.split('${' + i + '}').join('(' + regExpMap[keys[i]] + ')');
                    }
                    format = escapeReservedSymbols(format);

                    return new RegExp('^' + re + '$', ['i']);
                }

                $dateParser.init();
                return $dateParser;

            };

        }];

    });

    // @source jashkenas/underscore
    // @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
    app.lazy.constant('debounce', function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function() {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) result = func.apply(context, args);
            return result;
        };
    });

    // @source jashkenas/underscore
    // @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L661
    app.lazy.constant('throttle', function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
            previous = options.leading === false ? 0 : new Date();
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = new Date();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    });

    app.lazy.factory('dimensions', ["$document", "$window", function($document, $window) {

        var jqLite = angular.element;
        var fn = {};

        /**
         * Test the element nodeName
         * @param element
         * @param name
         */
        var nodeName = fn.nodeName = function(element, name) {
            return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
        };

        /**
         * Returns the element computed style
         * @param element
         * @param prop
         * @param extra
         */
        fn.css = function(element, prop, extra) {
            var value;
            if (element.currentStyle) { //IE
                value = element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                value = window.getComputedStyle(element)[prop];
            } else {
                value = element.style[prop];
            }
            return extra === true ? parseFloat(value) || 0 : value;
        };

        /**
         * Provides read-only equivalent of jQuery's offset function:
         * @required-by bootstrap-tooltip, bootstrap-affix
         * @url http://api.jquery.com/offset/
         * @param element
         */
        fn.offset = function(element) {
            var boxRect = element.getBoundingClientRect();
            var docElement = element.ownerDocument;
            return {
                width: element.offsetWidth,
                height: element.offsetHeight,
                top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
                left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
            };
        };

        /**
         * Provides read-only equivalent of jQuery's position function
         * @required-by bootstrap-tooltip, bootstrap-affix
         * @url http://api.jquery.com/offset/
         * @param element
         */
        fn.position = function(element) {

            var offsetParentRect = {top: 0, left: 0},
                offsetParentElement,
                offset;

            // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if (fn.css(element, 'position') === 'fixed') {

                // We assume that getBoundingClientRect is available when computed position is fixed
                offset = element.getBoundingClientRect();

            } else {

                // Get *real* offsetParentElement
                offsetParentElement = offsetParent(element);
                offset = fn.offset(element);

                // Get correct offsets
                offset = fn.offset(element);
                if (!nodeName(offsetParentElement, 'html')) {
                    offsetParentRect = fn.offset(offsetParentElement);
                }

                // Add offsetParent borders
                offsetParentRect.top += fn.css(offsetParentElement, 'borderTopWidth', true);
                offsetParentRect.left += fn.css(offsetParentElement, 'borderLeftWidth', true);
            }

            // Subtract parent offsets and element margins
            return {
                width: element.offsetWidth,
                height: element.offsetHeight,
                top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
                left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
            };

        };

        /**
         * Returns the closest, non-statically positioned offsetParent of a given element
         * @required-by fn.position
         * @param element
         */
        var offsetParent = function offsetParentElement(element) {
            var docElement = element.ownerDocument;
            var offsetParent = element.offsetParent || docElement;
            if(nodeName(offsetParent, '#document')) return docElement.documentElement;
            while(offsetParent && !nodeName(offsetParent, 'html') && fn.css(offsetParent, 'position') === 'static') {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docElement.documentElement;
        };

        /**
         * Provides equivalent of jQuery's height function
         * @required-by bootstrap-affix
         * @url http://api.jquery.com/height/
         * @param element
         * @param outer
         */
        fn.height = function(element, outer) {
            var value = element.offsetHeight;
            if(outer) {
                value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
            } else {
                value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
            }
            return value;
        };

        /**
         * Provides equivalent of jQuery's height function
         * @required-by bootstrap-affix
         * @url http://api.jquery.com/width/
         * @param element
         * @param outer
         */
        fn.width = function(element, outer) {
            var value = element.offsetWidth;
            if(outer) {
                value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
            } else {
                value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
            }
            return value;
        };

        return fn;

    }]);

    app.lazy.provider('$parseOptions', function() {

        var defaults = this.defaults = {
            regexp: /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/
        };

        this.$get = function($parse, $q) {

            function ParseOptionsFactory(attr, config) {

                var $parseOptions = {};

                // Common vars
                var options = angular.extend({}, defaults, config);
                $parseOptions.$values = [];

                // Private vars
                var match, displayFn, valueName, keyName, groupByFn, valueFn, valuesFn;

                $parseOptions.init = function() {
                    $parseOptions.$match = match = attr.match(options.regexp);
                    displayFn = $parse(match[2] || match[1]),
                        valueName = match[4] || match[6],
                        keyName = match[5],
                        groupByFn = $parse(match[3] || ''),
                        valueFn = $parse(match[2] ? match[1] : valueName),
                        valuesFn = $parse(match[7]);
                };

                $parseOptions.valuesFn = function(scope, controller) {
                    return $q.when(valuesFn(scope, controller))
                        .then(function(values) {
                            $parseOptions.$values = values ? parseValues(values, scope) : {};
                            return $parseOptions.$values;
                        });
                };

                // Private functions

                function parseValues(values, scope) {
                    return values.map(function(match, index) {
                        var locals = {}, label, value;
                        locals[valueName] = match;
                        label = displayFn(scope, locals);
                        value = valueFn(scope, locals) || index;
                        return {label: label, value: value};
                    });
                }

                $parseOptions.init();
                return $parseOptions;

            }

            return ParseOptionsFactory;

        };

    });

    app.lazy.factory('$$rAF', ["$window", "$timeout", function($window, $timeout) {

        var requestAnimationFrame = $window.requestAnimationFrame ||
            $window.webkitRequestAnimationFrame ||
            $window.mozRequestAnimationFrame;

        var cancelAnimationFrame = $window.cancelAnimationFrame ||
            $window.webkitCancelAnimationFrame ||
            $window.mozCancelAnimationFrame ||
            $window.webkitCancelRequestAnimationFrame;

        var rafSupported = !!requestAnimationFrame;
        var raf = rafSupported ?
            function(fn) {
                var id = requestAnimationFrame(fn);
                return function() {
                    cancelAnimationFrame(id);
                };
            } :
            function(fn) {
                var timer = $timeout(fn, 16.66, false); // 1000 / 60 = 16.666
                return function() {
                    $timeout.cancel(timer);
                };
            };

        raf.supported = rafSupported;

        return raf;

    }]);
});