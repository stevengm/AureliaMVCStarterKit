/* */ 
System.register(["./navigation-plan"], function (_export) {
  var REPLACE, buildNavigationPlan, _toConsumableArray, _prototypeProperties, _classCallCheck, RouteLoader, LoadRouteStep;

  _export("loadNewRoute", loadNewRoute);

  function loadNewRoute(routers, routeLoader, navigationContext) {
    var toLoad = determineWhatToLoad(navigationContext);
    var loadPromises = toLoad.map(function (current) {
      return loadRoute(routers, routeLoader, current.navigationContext, current.viewPortPlan);
    });

    return Promise.all(loadPromises);
  }

  function determineWhatToLoad(navigationContext, toLoad) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;

    toLoad = toLoad || [];

    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];

      if (viewPortPlan.strategy == REPLACE) {
        toLoad.push({
          viewPortPlan: viewPortPlan,
          navigationContext: navigationContext
        });

        if (viewPortPlan.childNavigationContext) {
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      } else {
        var viewPortInstruction = next.addViewPortInstruction(viewPortName, viewPortPlan.strategy, viewPortPlan.prevModuleId, viewPortPlan.prevComponent);

        if (viewPortPlan.childNavigationContext) {
          viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      }
    }

    return toLoad;
  }

  function loadRoute(routers, routeLoader, navigationContext, viewPortPlan) {
    var moduleId = viewPortPlan.config.moduleId;
    var next = navigationContext.nextInstruction;

    routers.push(navigationContext.router);

    return loadComponent(routeLoader, navigationContext, viewPortPlan.config).then(function (component) {
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);

      var controller = component.executionContext;

      if (controller.router && controller.router.isConfigured && routers.indexOf(controller.router) === -1) {
        var path = next.getWildcardPath();

        return controller.router.createNavigationInstruction(path, next).then(function (childInstruction) {
          viewPortPlan.childNavigationContext = controller.router.createNavigationContext(childInstruction);

          return buildNavigationPlan(viewPortPlan.childNavigationContext).then(function (childPlan) {
            viewPortPlan.childNavigationContext.plan = childPlan;
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;

            return loadNewRoute(routers, routeLoader, viewPortPlan.childNavigationContext);
          });
        });
      }
    });
  }

  function loadComponent(routeLoader, navigationContext, config) {
    var router = navigationContext.router,
        lifecycleArgs = navigationContext.nextInstruction.lifecycleArgs;
    return routeLoader.loadRoute(router, config).then(function (component) {
      if ("configureRouter" in component.executionContext) {
        var _component$executionContext;

        var result = (_component$executionContext = component.executionContext).configureRouter.apply(_component$executionContext, _toConsumableArray(lifecycleArgs)) || Promise.resolve();
        return result.then(function () {
          return component;
        });
      }

      component.router = router;
      component.config = config;
      return component;
    });
  }
  return {
    setters: [function (_navigationPlan) {
      REPLACE = _navigationPlan.REPLACE;
      buildNavigationPlan = _navigationPlan.buildNavigationPlan;
    }],
    execute: function () {
      "use strict";

      _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      RouteLoader = _export("RouteLoader", (function () {
        function RouteLoader() {
          _classCallCheck(this, RouteLoader);
        }

        _prototypeProperties(RouteLoader, null, {
          loadRoute: {
            value: function loadRoute(router, config) {
              throw Error("Route loaders must implment \"loadRoute(router, config)\".");
            },
            writable: true,
            configurable: true
          }
        });

        return RouteLoader;
      })());
      LoadRouteStep = _export("LoadRouteStep", (function () {
        function LoadRouteStep(routeLoader) {
          _classCallCheck(this, LoadRouteStep);

          this.routeLoader = routeLoader;
        }

        _prototypeProperties(LoadRouteStep, {
          inject: {
            value: function inject() {
              return [RouteLoader];
            },
            writable: true,
            configurable: true
          }
        }, {
          run: {
            value: function run(navigationContext, next) {
              return loadNewRoute([], this.routeLoader, navigationContext).then(next)["catch"](next.cancel);
            },
            writable: true,
            configurable: true
          }
        });

        return LoadRouteStep;
      })());
    }
  };
});