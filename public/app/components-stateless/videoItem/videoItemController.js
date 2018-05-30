// eslint-disable-next-line
(function() {
  const moduleName = 'videoItem';
  // eslint-disable-next-line
  const templateUrl = `/app/components-stateless/${moduleName}/${moduleName}.html`;
  // templateUrlGenerate(moduleName);
  // '/app/components/head-search/head-search.template.html';
  // START MODULE
  // --------------------------------------------------

  // <video-item image="" href="" time="" title="" views="" like-rate=""></video-item>
  const bindings = {
    videoParams: '<',
    user: '=',
    playlists: '=',
  };

  const injection = [
    '$element',
    '$document',
    '$scope',
    'dataService',
    '$timeout',
    '$q',
  ];
  function controller($element, $document, $scope, dataService, $timeout, $q) {
    console.log(`${moduleName} started`);
    const vm = this;

    // setTimeout(() => console.log(this.videoParams), 4000);

    this.mouseOnVideo = false;
    this.mouseOnPlus = false;
    this.mouseOnPlayLists = false;

    this.hideAll = () => {
      this.mouseOnVideo = false;
      this.mouseOnPlus = false;
      this.mouseOnPlayLists = false;
    };

    this.showOkAdded = false;

    this.clickOnPlus = () => {
      this.mouseOnPlus = !this.mouseOnPlus;
    };

    const handlerFunctions = [];

    this.addToPlaylist = playlistId => {
      this.hideAll();
      const { uuid } = this.videoParams;
      dataService.addVideoToPlaylist({ playlistId, uuid }).then(() => {
        this.showOkAdded = true;
        $timeout(() => {
          this.showOkAdded = false;
        }, 1500);
      });
    };

    this.watchLater = () => {
      this.hideAll();
      const { uuid } = this.videoParams;
      const name = 'Watch later';
      $q
        .resolve()
        .then(() => {
          const data = this.playlists.find(item => item.name === name);
          let playlistId = null;
          if (data) playlistId = data.playlistId;
          if (playlistId) return { data: playlistId };
          return dataService.addPlaylist({ name, visibility: 'private' });
        })
        .then(({ data }) => {
          const playlistId = data;
          return dataService.addVideoToPlaylist({ playlistId, uuid });
        })
        .then(() => {
          vm.showOkAdded = true;
          $timeout(() => {
            vm.showOkAdded = false;
          }, 1700);
          return dataService.getPlaylists(this.user.id);
        })
        .then(({ data }) => {
          this.playlists.length = 0;
          this.playlists.push(...data);
        });
    };

    this.addToNewPlaylist = () => {
      this.hideAll();
      // this.modal.showModal = true;
      const { uuid } = vm.videoParams;

      const input = document.createElement('input');
      input.type = 'text';

      swal({
        title: 'Please type name of new Playlist',
        content: input,
        buttons: {
          private: {
            text: 'private',
            visible: true,
            closeModal: true,
          },
          public: {
            text: 'public',
            visible: true,
            closeModal: true,
          },
          cancel: {
            text: 'cancel',
            visible: true,
            closeModal: true,
          },
        },
        // closeModal: false,
      })
        .then(val => {
          const visibility = val;
          const name = input.value;

          if (name.trim().length === 0 && val !== null) {
            swal({ text: 'Impossible playlist length', icon: 'warning' });
            return { name: null, visibility: null };
          }

          switch (val) {
            case 'private':
              return { name, visibility: 'private' };
            case 'public':
              return { name, visibility: 'public' };
            default:
              return { name: null, visibility: null };
          }
        })
        .then(({ name, visibility }) => {
          if (name)
            dataService
              .addPlaylist({ name, visibility })
              .then(({ data }) => {
                const playlistId = data;
                return dataService.addVideoToPlaylist({ playlistId, uuid });
              })
              .then(() => {
                vm.showOkAdded = true;
                $timeout(() => {
                  vm.showOkAdded = false;
                }, 1700);
                return dataService.getPlaylists(this.user.id);
              })
              .then(({ data }) => {
                this.playlists.length = 0;
                this.playlists.push(...data);
              });
        });
    };

    this.modal = {
      get accept() {
        return this._value;
      },
      set accept(v) {
        if (v === false) {
          this.showModal = false;
          return;
        }
        if (v === true && this.input.trim().length > 0) {
          this.showModal = false;
          const { uuid } = vm.videoParams;
          dataService
            .addPlaylist(this.showInput)
            .then(({ data }) => {
              const playlistId = data;
              return dataService.addVideoToPlaylist({ playlistId, uuid });
            })
            .then(() => {
              vm.showOkAdded = true;
              $timeout(() => {
                vm.showOkAdded = false;
              }, 1700);
            });
        }
      },
      _value: false,
      hideNo: false,
      hideYes: false,
      textYes: 'Yes',
      showModal: false,
      showInput: true,
      input: '',
      text: 'Please type name of new Playlist',
    };

    this.$postLink = () => {
      // this.percent =
      //   100 *
      //   (this.videoParams.likesCount || 0) /
      //   (this.videoParams.likesCount + this.videoParams.dislikesCount || 1);

      const elPlus = Array.from($element.find('div')).find(e =>
        e.matches('.plus'),
      );

      const ulPlayLists = Array.from($element.find('li')).find(
        e => e.attributes.name && e.attributes.name.value === 'playlists',
      );

      const fn = e => {
        const mouseOnVideo = e.path.some(elem => elem === $element[0]);
        const mouseOnPlus = e.path.some(elem => elem === elPlus);
        const mouseOnPlayLists = e.path.some(elem => elem === ulPlayLists);

        if (
          this.mouseOnVideo !== mouseOnVideo ||
          this.mouseOnPlayLists !== mouseOnPlayLists
        ) {
          $scope.$apply(() => {
            this.mouseOnVideo = mouseOnVideo || mouseOnPlayLists || mouseOnPlus;
            this.mouseOnPlus =
              this.mouseOnPlus === true || mouseOnPlus || mouseOnPlayLists;
            this.mouseOnPlayLists = mouseOnPlayLists;
            if (this.mouseOnVideo === false) {
              this.mouseOnPlus = false;
              this.mouseOnPlayLists = false;
            }
          });
        }
      };

      const event = 'mousemove';
      handlerFunctions.push({ event, fn });
      $document.on(event, fn);
    };

    this.$onDestroy = () => {
      handlerFunctions.forEach(({ event, fn }) => $document.on(event, fn));
      console.log(`${moduleName} destroy`);
    };
  }

  // --------------------------------------------------
  // LOAD component
  angular.module('app').component(moduleName, {
    templateUrl,
    controller: [...injection, controller],
    bindings,
  });
  // END module
  // eslint-disable-next-line
})();
