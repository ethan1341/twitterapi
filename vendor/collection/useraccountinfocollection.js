var Twit = Twit || {};

Twit.accountInfoCollection = Backbone.Collection.extend({
  model: Twit.accountInfoModel
});

Twit.accountinfocollection = new Twit.accountInfoCollection();

$.ajax({
  dataType: 'json',
  url: '/userinfo',
  success: function(data) {
    var parseddata = JSON.parse(data.body);
    Twit.accountinfocollection.add(parseddata);
    console.log(Twit.accountinfocollection);
    Twit.accountinfoview.render();
  },
  error: function(error) {
    console.log(error);
  }

})
