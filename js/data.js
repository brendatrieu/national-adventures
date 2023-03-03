/* exported data */

var data = {
  view: 'home-page',
  pageNum: 1,
  targetPark: '',
  favorites: [],
  reloaded: false,
  firstLoad: false
};

window.addEventListener('beforeunload', () => {
  localStorage.setItem('nationalAdventures', JSON.stringify({ ...data, reloaded: false }));
  sessionStorage.setItem('nationalAdventuresSession', JSON.stringify({ ...data, reloaded: true }));
});

if (localStorage.getItem('nationalAdventures')) {
  data = JSON.parse(localStorage.getItem('nationalAdventures'));
}

if (sessionStorage.getItem('nationalAdventuresSession')) {
  data = JSON.parse(sessionStorage.getItem('nationalAdventuresSession'));
}
