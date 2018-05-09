const app = angular
  .module('app', ['ngRoute'])
  .component('testInfo1', {
    templateUrl: '/app/components/test/test1.template.html',
    controller() {
      this.value = 1;
    },
  })
  .component('testInfo2', {
    templateUrl: '/app/components/test/test2.template.html',
    controller() {
      this.value = 2;
    },
  });