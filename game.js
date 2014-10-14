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
  },
  tick: function(){
    this.money += 1;
    $('#visitors').html(this.visitors);
	$('#money').html(this.money);
  }
};
$(document).ready(theme_park.init());