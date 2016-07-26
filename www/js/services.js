var app = angular.module('Snitem.services', [])
app.factory('ManageScore', function(){

  var myScore = 0;
  return {

    init: function()
    {
      return myScore;
    },

    reset: function()
    {
      myScore = 0;
      return myScore;
    },
    
    add: function()
    {
      myScore = myScore + 1;
      return myScore;
    },
  }
})
