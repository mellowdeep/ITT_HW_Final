// eslint-disable-next-line
(function() {
  const moduleName = 'login';
  // eslint-disable-next-line
  const templateUrl = `/app/pages/${moduleName}/${moduleName}.html`;
  // START MODULE
  // --------------------------------------------------

  const injection = ['helperService'];
  function controller(helperService) {
    helperService.log(`${moduleName} started`);
  }

  // --------------------------------------------------
  // LOAD component
  angular.module('app').component(moduleName, {
    templateUrl,
    controller: [...injection, controller],
  });
  // END module
  // eslint-disable-next-line
})();
