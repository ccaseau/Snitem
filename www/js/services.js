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

app.factory('ManageCustomisation', function(){

  var couleur_texte = 'black';
  var couleur_1 = '#F9A61A';
  var couleur_2 = '#00ACCE';
  var police = 'Exo';
  var background_img = 'img/background2.png'

  return {

    init_couleur_texte: function()
    {
      return couleur_texte;
    },

    create_couleur_texte: function(couleur)
    {
      couleur_texte = couleur;
    },

    init_couleur_1: function()
    {
      return couleur_1;
    },

    create_couleur_1: function(couleur)
    {
      couleur_1 = couleur;
    },

    init_couleur_2: function()
    {
      return couleur_2;
    },

    create_couleur_2: function(couleur)
    {
      couleur_2 = couleur;
    },

    init_background_img: function()
    {
      return background_img;
    },

    create_background_img: function(img)
    {
      background_img = img;
    },

    init_police: function()
    {
      return police;
    },

    create_police: function(font)
    {
      police = font;
    },

  }
})
