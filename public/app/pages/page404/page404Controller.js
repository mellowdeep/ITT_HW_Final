// eslint-disable-next-line
(function() {
  const moduleName = 'page404';
  // eslint-disable-next-line
  const templateUrl = `/app/pages/${moduleName}/${moduleName}.html`;
  // templateUrlGenerate(moduleName);
  // '/app/components/head-search/head-search.template.html';
  // START MODULE
  // --------------------------------------------------

  function controller() {
    console.log(`${moduleName} started`);
  }

  // --------------------------------------------------
  // LOAD component
  angular.module('app').component(moduleName, { templateUrl, controller });
  // END module
  // eslint-disable-next-line
})();
