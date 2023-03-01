/* exported data */

var data = {
  view: 'home-page',
  targetPark: ''
};

window.addEventListener('beforeunload', () => {
  localStorage.setItem('nationalAdventures', JSON.stringify(data));
});

if (localStorage.getItem('nationalAdventures')) {
  data = JSON.parse(localStorage.getItem('nationalAdventures'));
}
