// RIDES
var rides = [
  {
    name: 'Carousel',
    id: 'carousel',
    initial_cost: 20,
    base_attraction: 2
  },
  {
    name: 'Haunted House',
    id: 'hauntedhouse',
    initial_cost: 12000,
    base_attraction: 6
  },
  {
    name: 'Teacups!',
    id: 'teacups',
    initial_cost: 485000,
    base_attraction: 15
  },
  {
    name: 'Ferris Wheel',
    id: 'ferriswheel',
    initial_cost: 3250000,
    base_attraction: 25
  },
  {
    name: 'Spinning Swing',
    id: 'swing',
    initial_cost: 15000000,
    base_attraction: 60
  },
  {
    name: 'Wooden Roller Coaster',
    id: 'wood-coaster',
    initial_cost: 125000000,
    base_attraction: 100
  },
  {
    name: 'Bumper Cars',
    id: 'bumpers',
    initial_cost: 1000000000,
    base_attraction: 180
  }
]

var stores = [
  {
    name: 'Hot Dog Stand',
    id: 'hotdog',
    initial_cost: 20,
    base_income: 1
  },
  {
    name: 'Burger Joint',
    id: 'burger',
    initial_cost: 1000,
    base_income: 4
  },
  {
    name: 'Maps',
    id: 'maps',
    initial_cost: 25000,
    base_income: 12
  },
  {
    name: 'T-Shirts',
    id: 'shirts',
    initial_cost: 400000,
    base_income: 22
  },
  {
    name: 'Soda',
    id: 'soda',
    initial_cost: 3000000,
    base_income: 35
  },
  {
    name: 'Ice Cream',
    id: 'ice-cream',
    initial_cost: 12000000,
    base_income: 50
  },
  {
    name: 'Lemonade',
    id: 'lemonade',
    initial_cost: 100000000,
    base_income: 75
  },
  {
    name: 'Stuffed Animals',
    id: 'animals',
    initial_cost: 750000000,
    base_income: 110
  }
]

var theme_park = {
  // How much people want to go to your park.
  attraction: 0,
  // TODO: Is this necessary?
  fractional_visitors: 0,
  visitors: 0,
  // How many people can enter your park at a time.
  visitor_dx: 0.25,
  // The chance per tick that new visitors arrive.
  visitor_chance: 1,
  money: 40,
  ride_count: {},
  rides_rendered: 1,
  store_count: {},
  stores_rendered: 1,
  init: function(){
    window.timer = setInterval(function(){theme_park.tick()},1000);
  },
  tick: function(){
    this.visitorStep();
    this.visitors = Math.floor(this.fractional_visitors);
    this.money += this.calculateIncome() * this.visitors;
    $('#visitors').text(this.visitors);
    $('#money').text(this.money);
    this.renderNewRides();
    this.renderNewStores();
  },
  recalculateAttraction: function(){
    var attr = 0;
    for(x = 0; x < rides.length; x++){
      if(this.ride_count.hasOwnProperty(rides[x].id)){
        attr += this.ride_count[rides[x].id] * rides[x].base_attraction;
      }
    }
    this.attraction = attr;
    $('#attraction').text(this.attraction);
  },
  calculateIncome: function(){
    var income = 0;
    for(x = 0; x < stores.length; x++){
      if(this.store_count.hasOwnProperty(stores[x].id)){
        income += this.store_count[stores[x].id] * stores[x].base_income;
      }
    }
    return income;
  },
  addRide: function(ride_number){
    var ride_info = rides[ride_number];
    var box = $('<div/>', {'class': 'item-box'});
    box.append($('<div/>', {'class': 'item-name', html: ride_info.name + ' (<span id="' + ride_info.id + '-level" class="level">Unowned</span>)'}));
    box.append($('<button/>', {id: 'buy-' + ride_info.id, 'class': 'purchase', html: '$<span id="' + ride_info.id + '-cost">' + ride_info.initial_cost + '</span>', onClick: 'theme_park.buyRide(' + ride_number + ')'}));
    box.append($('<div/>', {'class': 'details', html: 'Gives <span id="' + ride_info.id + '-attr">' + ride_info.base_attraction + '</span> attraction.'}));
    $('#rides').append(box);
  },
  addStore: function(store_number){
    var store_info = stores[store_number];
    var box = $('<div/>', {'class': 'item-box'});
    box.append($('<div/>', {'class': 'item-name', html: store_info.name + ' (<span id="' + store_info.id + '-level" class="level">Unowned</span>)'}));
    box.append($('<button/>', {id: 'buy-' + store_info.id, 'class': 'purchase', html: '$<span id="' + store_info.id + '-cost">' + store_info.initial_cost + '</span>', onClick: 'theme_park.buyStore(' + store_number + ')'}));
    box.append($('<div/>', {'class': 'details', html: 'Gives $<span id="' + store_info.id + '-inc">' + store_info.base_income + '</span> per visitor per second.'}));
    $('#stores').append(box);
  },
  visitorStep: function(){
    // If we're pretty much in the right spot, don't bother.
    if(this.attraction != this.visitors){
      if(Math.random() < this.visitor_chance){
        if(this.fractional_visitors > this.attraction){
          this.fractional_visitors -= this.visitor_dx;
        }else{
          this.fractional_visitors += this.visitor_dx;
        }
      }
    }
  },
  getCostForRide: function(ride_info){
    var level = this.ride_count[ride_info.id];
    return Math.ceil(ride_info.initial_cost * Math.pow(1.5, level));
  },
  getCostForStore: function(store_info){
    var level = this.store_count[store_info.id];
    return Math.ceil(store_info.initial_cost * Math.pow(1.5, level));
  },
  buyRide: function(ride_number){
    var ride_info = rides[ride_number];
    if(!this.ride_count.hasOwnProperty(ride_info.id)){
      this.ride_count[ride_info.id] = 0;
    }
    cost = this.getCostForRide(ride_info);
    if(cost <= this.money){
      this.incMoney(-cost);
      this.ride_count[ride_info.id] += 1;
      this.recalculateAttraction();
      $('#' + ride_info.id + '-cost').text(this.getCostForRide(ride_info));
      $('#' + ride_info.id + '-attr').text(this.ride_count[ride_info.id] * ride_info.base_attraction);
      $('#' + ride_info.id + '-level').text('Level ' + this.ride_count[ride_info.id]);
    }
  },
  buyStore: function(store_number){
    var store_info = stores[store_number];
    if(!this.store_count.hasOwnProperty(store_info.id)){
      this.store_count[store_info.id] = 0;
    }
    cost = this.getCostForStore(store_info);
    if(cost <= this.money){
      this.incMoney(-cost);
      this.store_count[store_info.id] += 1;
      $('#' + store_info.id + '-cost').text(this.getCostForStore(store_info));
      $('#' + store_info.id + '-inc').text(this.store_count[store_info.id] * store_info.base_income);
      $('#' + store_info.id + '-level').text('Level ' + this.store_count[store_info.id]);
    }
  },
  incMoney: function(amount){
    this.money += amount;
    $('#money').text(this.money);
  },
  renderNewRides: function(){
    if(this.rides_rendered >= rides.length) return;
    if(this.money >= rides[this.rides_rendered].initial_cost / 2){
      this.addRide(this.rides_rendered);
      this.rides_rendered++;
    }
  },
  renderNewStores: function(){
    if(this.stores_rendered >= stores.length) return;
    if(this.money >= stores[this.stores_rendered].initial_cost / 2){
      this.addStore(this.stores_rendered);
      this.stores_rendered++;
    }
  }
};
$(document).ready(function(){
  theme_park.init()
});