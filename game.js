// RIDES
// TODO: I don't think this is a good way to store the information. I'll think of something better.
var carousel = {
  // How much it costs to buy the first. Subsequent purchases are always X% more expensive.
  initial_cost: 50,
  // How much attraction this ride generates. Visitors will tend towards this number.
  base_attraction: 5,
  // How much more attraction this ride generates if you put an employee on it.
  employed_bonus: 2
}

// STORES
// TODO: I don't think this is a good way to store the information. I'll think of something better.
var hotdogs = {
  // How much it costs to buy the first. Subsequent purchases are always X% more expensive.
  initial_cost: 50,
  // This is how much money per tick per visitor you get.
  base_income: 1,
  // This is how much more money per tick per visitor you get if you man this concession.
  employed_bonus: 1
}

var theme_park = {
  // How much people want to go to your park.
  attraction: 0,
  fractional_visitors: 0,
  visitors: 0,
  // How many people can enter your park at a time.
  visitor_dx: 1,
  // The chance per tick that new visitors arrive.
  visitor_chance: 0.1,
  money: 100,
  rides: [],
  stores: [],
  init: function(){
    window.timer = setInterval(function(){theme_park.tick()},1000);
    this.addItemType('Haunted House', 'hauntedhouse', 'rides');
    this.addItemType('Burger Joint', 'burger', 'stores');
  },
  tick: function(){
    this.visitorStep();
    this.visitors = Math.floor(this.fractional_visitors);
    $('#visitors').html(this.visitors);
    $('#money').html(this.money);
  },
  addItemType: function(name, dom_id, type){
    // TODO: Improve this to match the first two hard-coded ones, and to look up appropriate costs/descriptions.
    var box = $('<div/>', {id: dom_id + 's', 'class': 'item-box'});
    box.append($('<div/>', {'class': 'item-name', text: name}));
    box.append($('<button/>', {id: 'buy-' + dom_id, 'class': 'purchase', text: 'Buy'}));
    $('#' + type).append(box);
  },
  visitorStep: function(){
    if(Math.random() < this.visitor_chance){
      if(this.fractional_visitors > this.attraction){
        this.fractional_visitors -= this.visitor_dx;
      }else{
        this.fractional_visitors += this.visitor_dx;
      }
    }
  }
};
$(document).ready(function(){
  theme_park.init()
});