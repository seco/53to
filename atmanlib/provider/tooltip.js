
define('atmanlib-provider/tooltip',['at_app', 'atmanlib-provider/helper'], function(app) {
    app.lazy.provider('$ATTooltip', function() {
        var defaults = this.defaults = {
            animation: 'am-fade',
            prefixClass: 'tooltip',
            prefixEvent: 'tooltip',
            container: false,
            placement: 'top',
            template: '/atmanlib/provider/template/tooltip.tpl.html',
            contentTemplate: false,
            trigger: 'hover focus',
            keyboard: false,
            html: false,
            show: false,
            title: '',
            type: '',
            delay: 0
        };
        this.$get = ["$window", "$rootScope", "$compile", "$q", "$templateCache", "$http", "$animate", "$timeout", "dimensions", function($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $timeout, dimensions) {

            var trim = String.prototype.trim;
            var isTouch = 'createTouch' in $window.document;
            var htmlReplaceRegExp = /ng-bind="/ig;

            function TooltipFactory(element, config) {

                var $ATTooltip = {};

                // Common vars
                var nodeName = element[0].nodeName.toLowerCase();
                var options = $ATTooltip.$options = angular.extend({}, defaults, config);
                $ATTooltip.$promise = fetchTemplate(options.template);
                var scope = $ATTooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();
                if(options.delay && angular.isString(options.delay)) {
                    options.delay = parseFloat(options.delay);
                }

                // Support scope as string options
                if(options.title) {
                    $ATTooltip.$scope.title = options.title;
                }

                // Provide scope helpers
                scope.$hide = function() {
                    scope.$$postDigest(function() {
                        $ATTooltip.hide();
                    });
                };
                scope.$show = function() {
                    scope.$$postDigest(function() {
                        $ATTooltip.show();
                    });
                };
                scope.$toggle = function() {
                    scope.$$postDigest(function() {
                        $ATTooltip.toggle();
                    });
                };
                $ATTooltip.$isShown = scope.$isShown = false;

                // Private vars
                var timeout, hoverState;

                // Support contentTemplate option
                if(options.contentTemplate) {
                    $ATTooltip.$promise = $ATTooltip.$promise.then(function(template) {
                        var templateEl = angular.element(template);
                        return fetchTemplate(options.contentTemplate)
                            .then(function(contentTemplate) {
                                var contentEl = findElement('[ng-bind="content"]', templateEl[0]);
                                if(!contentEl.length) contentEl = findElement('[ng-bind="title"]', templateEl[0]);
                                contentEl.removeAttr('ng-bind').html(contentTemplate);
                                return templateEl[0].outerHTML;
                            });
                    });
                }

                // Fetch, compile then initialize tooltip
                var tipLinker, tipElement, tipTemplate, tipContainer;
                $ATTooltip.$promise.then(function(template) {
                    if(angular.isObject(template)) template = template.data;
                    if(options.html) template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
                    trim && (function(){
                        template = trim.apply(template);
                    })();
                    tipTemplate = template;
                    tipLinker = $compile(template);
                    $ATTooltip.init();
                });

                $ATTooltip.init = function() {

                    // Options: delay
                    if (options.delay && angular.isNumber(options.delay)) {
                        options.delay = {
                            show: options.delay,
                            hide: options.delay
                        };
                    }

                    // Replace trigger on touch devices ?
                    // if(isTouch && options.trigger === defaults.trigger) {
                    //   options.trigger.replace(/hover/g, 'click');
                    // }

                    // Options : container
                    if(options.container === 'self') {
                        tipContainer = element;
                    } else if(options.container) {
                        tipContainer = findElement(options.container);
                    }

                    // Options: trigger
                    var triggers = options.trigger.split(' ');
                    angular.forEach(triggers, function(trigger) {
                        if(trigger === 'click') {
                            element.on('click', $ATTooltip.toggle);
                        } else if(trigger !== 'manual') {
                            element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $ATTooltip.enter);
                            element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $ATTooltip.leave);
                            nodeName === 'button' && trigger !== 'hover' && element.on(isTouch ? 'touchstart' : 'mousedown', $ATTooltip.$onFocusElementMouseDown);
                        }
                    });

                    // Options: show
                    if(options.show) {
                        scope.$$postDigest(function() {
                            options.trigger === 'focus' ? element[0].focus() : $ATTooltip.show();
                        });
                    }

                };

                $ATTooltip.destroy = function() {

                    // Unbind events
                    var triggers = options.trigger.split(' ');
                    for (var i = triggers.length; i--;) {
                        var trigger = triggers[i];
                        if(trigger === 'click') {
                            element.off('click', $ATTooltip.toggle);
                        }
                        else if(trigger !== 'manual') {
                            element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $ATTooltip.enter);
                            element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $ATTooltip.leave);
                            nodeName === 'button' && trigger !== 'hover' && element.off(isTouch ? 'touchstart' : 'mousedown', $ATTooltip.$onFocusElementMouseDown);
                        }
                    }

                    // Remove element
                    if(tipElement) {
                        tipElement.remove();
                        tipElement = null;
                    }

                    // Destroy scope
                    scope.$destroy();

                };

                $ATTooltip.enter = function() {

                    clearTimeout(timeout);
                    hoverState = 'in';
                    if (!options.delay || !options.delay.show) {
                        return $ATTooltip.show();
                    }

                    timeout = setTimeout(function() {
                        if (hoverState ==='in') $ATTooltip.show();
                    }, options.delay.show);

                };

                $ATTooltip.show = function() {
                    scope.$emit(options.prefixEvent + '.show.before', $ATTooltip);
                    var parent = options.container ? tipContainer : null;
                    var after = options.container ? null : element;

                    // Hide any existing tipElement
                    if(tipElement) tipElement.remove();
                    // Fetch a cloned element linked from template
                    tipElement = $ATTooltip.$element = tipLinker(scope, function(clonedElement, scope) {});

                    // Set the initial positioning.
                    tipElement.css({top: '0px', left: '0px', display: 'block'}).addClass(options.placement);

                    // Options: animation
                    if(options.animation) tipElement.addClass(options.animation);
                    // Options: type
                    if(options.type) tipElement.addClass(options.prefixClass + '-' + options.type);

                    tipElement.on("mouseenter", function(){
                        if(options.trigger == "hover"){
                            hoverState = "in";
                        }
                    });
                    tipElement.on("mouseleave", function(){
                        if(options.trigger == "hover"){
                            hoverState = "out";
                            $ATTooltip.leave();
                        }
                    });

                    $animate.enter(tipElement, parent, after, function() {
                        scope.$emit(options.prefixEvent + '.show', $ATTooltip);
                    });
                    $ATTooltip.$isShown = scope.$isShown = true;
                    scope.$$phase || scope.$root.$$phase || scope.$digest();
                    //$$rAF($ATTooltip.$applyPlacement); // var a = bodyEl.offsetWidth + 1; ?
                    $ATTooltip.$applyPlacement();

                    // Bind events
                    if(options.keyboard) {
                        if(options.trigger !== 'focus') {
                            $ATTooltip.focus();
                            tipElement.on('keyup', $ATTooltip.$onKeyUp);
                        } else {
                            element.on('keyup', $ATTooltip.$onFocusKeyUp);
                        }
                    }

                };

                $ATTooltip.leave = function() {
                    clearTimeout(timeout);
                    hoverState = 'out';
                    if (!options.delay || !options.delay.hide) {
                        return $ATTooltip.hide();
                    }
                    timeout = setTimeout(function () {
                        if (hoverState === 'out') {
                            $ATTooltip.hide();
                        }
                    }, options.delay.hide);
                };

                $ATTooltip.hide = function(blur) {

                    if(!$ATTooltip.$isShown) return;
                    scope.$emit(options.prefixEvent + '.hide.before', $ATTooltip);

                    $animate.leave(tipElement, function() {
                        scope.$emit(options.prefixEvent + '.hide', $ATTooltip);
                    });

                    $ATTooltip.$isShown = scope.$isShown = false;
                    scope.$$phase || scope.$root.$$phase || scope.$digest();

                    // Unbind events
                    if(options.keyboard && tipElement !== null) {
                        tipElement.off('keyup', $ATTooltip.$onKeyUp);
                    }

                    // Allow to blur the input when hidden, like when pressing enter key
                    if(blur && options.trigger === 'focus') {
                        return element[0].blur();
                    }

                };

                $ATTooltip.toggle = function() {
                    $ATTooltip.$isShown ? $ATTooltip.leave() : $ATTooltip.enter();
                };

                $ATTooltip.focus = function() {
                    tipElement[0].focus();
                };

                // Protected methods

                $ATTooltip.$applyPlacement = function() {
                    if(!tipElement) return;
                    // Get the position of the tooltip element.
                    var elementPosition = getPosition();

                    // Get the height and width of the tooltip so we can center it.
                    var tipWidth = tipElement.prop('offsetWidth'),
                        tipHeight = tipElement.prop('offsetHeight');

                    // Get the tooltip's top and left coordinates to center it with this directive.
                    var tipPosition = getCalculatedOffset(options.placement, elementPosition, tipWidth, tipHeight);

                    // Now set the calculated positioning.
                    tipPosition.top += 'px';
                    tipPosition.left += 'px';
                    tipElement.css(tipPosition);

                };

                $ATTooltip.$onKeyUp = function(evt) {
                    evt.which === 27 && $ATTooltip.hide();
                };

                $ATTooltip.$onFocusKeyUp = function(evt) {
                    evt.which === 27 && element[0].blur();
                };

                $ATTooltip.$onFocusElementMouseDown = function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    // Some browsers do not auto-focus buttons (eg. Safari)
                    $ATTooltip.$isShown ? element[0].blur() : element[0].focus();
                };

                // Private methods

                function getPosition() {
                    if(options.container === 'body') {
                        return dimensions.offset(element[0]);
                    } else {
                        return dimensions.position(element[0]);
                    }
                }

                function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
                    var offset;
                    var split = placement.split('-');

                    switch (split[0]) {
                        case 'right':
                            offset = {
                                top: position.top + position.height / 2 - actualHeight / 2,
                                left: position.left + position.width
                            };
                            break;
                        case 'bottom':
                            offset = {
                                top: position.top + position.height,
                                left: position.left + position.width / 2 - actualWidth / 2
                            };
                            break;
                        case 'left':
                            offset = {
                                top: position.top + position.height / 2 - actualHeight / 2,
                                left: position.left - actualWidth
                            };
                            break;
                        default:
                            offset = {
                                top: position.top - actualHeight,
                                left: position.left + position.width / 2 - actualWidth / 2
                            };
                            break;
                    }

                    if(!split[1]) {
                        return offset;
                    }

                    // Add support for corners @todo css
                    if(split[0] === 'top' || split[0] === 'bottom') {
                        switch (split[1]) {
                            case 'left':
                                offset.left = position.left;
                                break;
                            case 'right':
                                offset.left =  position.left + position.width - actualWidth;
                        }
                    } else if(split[0] === 'left' || split[0] === 'right') {
                        switch (split[1]) {
                            case 'top':
                                offset.top = position.top - actualHeight;
                                break;
                            case 'bottom':
                                offset.top = position.top + position.height;
                        }
                    }

                    return offset;
                }

                return $ATTooltip;

            }

            function findElement(query, element) {
                return angular.element((element || document).querySelectorAll(query));
            }

            function fetchTemplate(template) {
                return $q.when($templateCache.get(template) || $http.get(template)).then(function(res) {
                    if(angular.isObject(res)) {
                        $templateCache.put(template, res.data);
                        return res.data;
                    }
                    return res;
                });
            }
            return TooltipFactory;

        }];

    });
});