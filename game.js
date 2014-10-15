var carousel = {
  cost: 5
}

var theme_park = {
  visitors: 0,
  money: 100,
  rides: [],
  stores: [],
  init: function(){
    window.timer = setInterval(function(){theme_park.tick()},1000);
    this.addItemType('Haunted House', 'hauntedhouses', 'rides');
    this.addItemType('Burger Joint', 'burgers', 'stores');
  },
  tick: function(){
    this.money += 1;
    $('#visitors').html(this.visitors);
    $('#money').html(this.money);
  },
  addItemType: function(name, dom_id, type){
    // TODO: Look up info rather than hard-code.
    var box = $('<div/>', {id: dom_id, 'class': 'item-box'});
    box.append($('<div/>', {'class': 'item-name', text: name}));
    $('#' + type).append(box);
  }
};
$(document).ready(function(){
  theme_park.init()
});