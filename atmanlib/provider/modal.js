define('atmanlib-provider/modal',['at_app'], function (app) {
    app.lazy.provider('$ATModal', function() {
        var defaults = this.defaults = {
            animation: 'am-fade',
            backdropAnimation: 'am-fade',
            prefixClass: 'modal',
            prefixEvent: 'modal',
            placement: 'center',
            template: '/atmanlib/provider/template/modal.tpl.html',
            contentTemplate: false,
            container: false,
            element: null,
            backdrop: "static",
            keyboard: true,
            html: false,
            show: false
        };
        this.$get = ["$window", "$rootScope", "$compile", "$q", "$templateCache", "$http", "$animate", "$timeout", "$sce", function($window, $rootScope, $compile, $q, $templateCache, $http, $animate, $timeout, $sce) {
            var forEach = angular.forEach;
            var trim = String.prototype.trim;
            var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
            var bodyElement = angular.element($window.document.body);
            var htmlReplaceRegExp = /ng-bind="/ig;
            function ModalFactory(config) {

                var $ATModal = {};

                // Common vars
                var options = $ATModal.$options = angular.extend({}, defaults, config);
                $ATModal.$promise = fetchTemplate(options.template);
                var scope = $ATModal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
                if(!options.element && !options.container) {
                    options.container = 'body';
                }

                // Support scope as string options
                forEach(['title', 'content'], function(key) {
                    if(options[key]) scope[key] = $sce.trustAsHtml(options[key]);
                });

                // Provide scope helpers
                scope.$hide = function() {
                    scope.$$postDigest(function() {
                        $ATModal.hide();
                    });
                };
                scope.$show = function() {
                    scope.$$postDigest(function() {
                        $ATModal.show();
                    });
                };
                scope.$toggle = function() {
                    scope.$$postDigest(function() {
                        $ATModal.toggle();
                    });
                };

                // Support contentTemplate option
                if(options.contentTemplate) {
                    $ATModal.$promise = $ATModal.$promise.then(function(template) {
                        var templateEl = angular.element(template);
                        return fetchTemplate(options.contentTemplate)
                            .then(function(contentTemplate) {
                                var contentEl = findElement('[ng-bind="content"]', templateEl[0]).removeAttr('ng-bind').html(contentTemplate);
                                // Drop the default footer as you probably don't want it if you use a custom contentTemplate
                                if(!config.template) contentEl.next().remove();
                                return templateEl[0].outerHTML;
                            });
                    });
                }

                // Fetch, compile then initialize modal
                var modalLinker, modalElement;
                var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
                $ATModal.$promise.then(function(template) {
                    if(angular.isObject(template)) template = template.data;
                    if(options.html) template = template.replace(htmlReplaceRegExp, 'ng-bind-html="');
                    //template = trim.apply(template);
                    modalLinker = $compile(template);
                    $ATModal.init();
                });

                $ATModal.init = function() {

                    // Options: show
                    if(options.show) {
                        scope.$$postDigest(function() {
                            $ATModal.show();
                        });
                    }

                };

                $ATModal.destroy = function() {

                    // Remove element
                    if(modalElement) {
                        modalElement.remove();
                        modalElement = null;
                    }
                    if(backdropElement) {
                        backdropElement.remove();
                        backdropElement = null;
                    }

                    // Destroy scope
                    scope.$destroy();

                };

                $ATModal.show = function() {

                    scope.$emit(options.prefixEvent + '.show.before', $ATModal);
                    var parent = options.container ? findElement(options.container) : null;
                    var after = options.container ? null : options.element;

                    // Fetch a cloned element linked from template
                    modalElement = $ATModal.$element = modalLinker(scope, function(clonedElement, scope) {});

                    // Set the initial positioning.
                    modalElement.css({display: 'block'}).addClass(options.placement);

                    // Options: animation
                    if(options.animation) {
                        if(options.backdrop) {
                            backdropElement.addClass(options.backdropAnimation);
                        }
                        modalElement.addClass(options.animation);
                    }

                    if(options.backdrop) {
                        $animate.enter(backdropElement, bodyElement, null, function() {});
                    }
                    $animate.enter(modalElement, parent, after, function() {
                        scope.$emit(options.prefixEvent + '.show', $ATModal);
                    });
                    scope.$isShown = true;
                    scope.$$phase || scope.$root.$$phase || scope.$digest();
                    // Focus once the enter-animation has started
                    // Weird PhantomJS bug hack
                    var el = modalElement[0];
                    requestAnimationFrame(function() {
                        el.focus();
                    });

                    if(options.placement == "center"){
                        var dialogElement = modalElement.children(".modal-dialog");
                        var dialogWidth = dialogElement.prop('offsetWidth'),
                            dialogHeight = dialogElement.prop('offsetHeight');
                        dialogElement.css({"margin-left": (0-dialogWidth/2) + "px", "margin-top": (0-dialogHeight/2) + "px"});
                    }

                    bodyElement.addClass(options.prefixClass + '-open');

                    if(options.animation) {
                        bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
                    }

                    // Bind events
                    if(options.backdrop) {
                        modalElement.on('click', hideOnBackdropClick);
                        backdropElement.on('click', hideOnBackdropClick);
                    }
                    if(options.keyboard) {
                        modalElement.on('keyup', $ATModal.$onKeyUp);
                    }
                };

                $ATModal.hide = function() {

                    scope.$emit(options.prefixEvent + '.hide.before', $ATModal);
                    $animate.leave(modalElement, function() {
                        scope.$emit(options.prefixEvent + '.hide', $ATModal);
                        bodyElement.removeClass(options.prefixClass + '-open');
                        if(options.animation) {
                            bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
                        }
                    });
                    if(options.backdrop) {
                        $animate.leave(backdropElement, function() {});
                    }
                    scope.$isShown = false;
                    scope.$$phase || scope.$root.$$phase || scope.$digest();

                    // Unbind events
                    if(options.backdrop) {
                        modalElement.off('click', hideOnBackdropClick);
                        backdropElement.off('click', hideOnBackdropClick);
                    }
                    if(options.keyboard) {
                        modalElement.off('keyup', $ATModal.$onKeyUp);
                    }
                };

                $ATModal.toggle = function() {

                    scope.$isShown ? $ATModal.hide() : $ATModal.show();

                };

                $ATModal.focus = function() {
                    modalElement[0].focus();
                };

                // Protected methods

                $ATModal.$onKeyUp = function(evt) {

                    evt.which === 27 && $ATModal.hide();

                };

                // Private methods

                function hideOnBackdropClick(evt) {
                    if(evt.target !== evt.currentTarget) return;
                    options.backdrop === 'static' ? $ATModal.focus() : $ATModal.hide();
                }

                return $ATModal;

            }
            // Helper functions
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
            return ModalFactory;

        }];

    });
});