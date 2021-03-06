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
//Table Questions
app.factory('QuestionsDataService', function ($cordovaSQLite, $ionicPlatform) {

  return {
    //Retourne un certain nombre (nb_qst) de question de maniere aléatoire + selectionne les reponses associées
    getRandomQuestion: function(nb_qst,callback){
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, 'SELECT * FROM Questions ORDER BY RANDOM() LIMIT "'+nb_qst+'"').then(function (resultsQ) {
          var dataQuestion = [];
          var dataReponse = [];
          for (i = 0, max = resultsQ.rows.length; i < max; i++) {
            dataQuestion.push(resultsQ.rows.item(i))
          }
          for (j = 0 ; j<nb_qst ; j++)
          {
            $cordovaSQLite.execute(db, 'SELECT reponse1,reponse2,reponse3,reponse4 FROM Reponses WHERE id_question = "' + dataQuestion[j].id + '"').then(function (resultsR) {
              //WHERE  id_question = "' + dataQuestion[j].id + '"
              for (i = 0, max = resultsR.rows.length; i < max; i++) {
                dataReponse.push(resultsR.rows.item(i))
              }
              callback(dataQuestion,dataReponse);
            })
          }
        })
      })
    }
  }
})

app.factory('CadeauxDataService', function ($cordovaSQLite, $ionicPlatform) {

  return {
    //On recupere la dotation dont l'heure est passée avec l'obligatoire le plus haut puis l'heure la plus haute
    getCadeau: function(date,date2,callback){
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db,'SELECT id,CodeCadeau,Texte FROM Cadeaux WHERE Quantite > 0 AND ShowTime <= "'+date+'" ORDER BY Obligatoire DESC, ShowTime DESC, Id DESC').then(function (results) {
          var data = []
          if (results.rows.length > 0)
          {
            for (i = 0, max = results.rows.length; i < max; i++) {
              data.push(results.rows.item(i))
            }
            callback(data)
          }
          //On recupere la prochaine dotation disponible du jour
          else
          {
            $cordovaSQLite.execute(db,'SELECT id,CodeCadeau,Texte FROM Cadeaux  WHERE Quantite > 0 AND ShowTime >= "'+date+'" AND ShowTime <="'+date2+'" ORDER BY Obligatoire ASC, ShowTime ASC, Id ASC').then(function (results2) {
              for (i = 0, max = results2.rows.length; i < max; i++) {
                data.push(results2.rows.item(i))
              }
              callback(data)
            })
          }
        })
      })
    },

    //Soustrait de 1 la quantité de la dotation avec l'id égal à Cadeauid
    SubstrQuantite: function(Cadeauid){
      return $cordovaSQLite.execute(db, 'UPDATE Cadeaux SET Quantite=(Quantite-1) WHERE Id = ?', [Cadeauid])
    },

    //Ajoute la date du gain
    AddDateGain: function(Cadeauid,dateGain){
      return $cordovaSQLite.execute(db, 'UPDATE Cadeaux SET DateGain="'+dateGain+'" WHERE Id = ?', [Cadeauid])
    },
  }
})

app.factory('ThemesDataService', function ($cordovaSQLite, $ionicPlatform, $http) {
  return {
    //Retourner le théme dans la bdd
    getAll: function(callback){
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, 'SELECT * FROM Themes').then(function (results) {
          var data = []
          for (i = 0, max = results.rows.length; i < max; i++) {
            data.push(results.rows.item(i))
          }
          callback(data)
        })
      })
    }
  }
})

app.factory('BackOfficeService', function ($cordovaSQLite, $ionicPlatform, $http) {
  return {
    //Retourner le théme dans la bdd
    getWinDotation: function(callback){
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, 'SELECT CodeCadeau,DateGain FROM Cadeaux WHERE DateGain IS NOT NULL ORDER BY DateGain ASC' ).then(function (results) {
          var data = []
          for (i = 0, max = results.rows.length; i < max; i++) {
            data.push(results.rows.item(i))
          }
          callback(data)
        })
      })
    },

    getOtherDotation: function(callback){
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, 'SELECT CodeCadeau,Obligatoire,ShowTime,Quantite,id FROM Cadeaux WHERE DateGain IS NULL ORDER BY ShowTime ASC' ).then(function (results) {
          var data = []
          for (i = 0, max = results.rows.length; i < max; i++) {
            data.push(results.rows.item(i))
          }
          callback(data)
        })
      })
    },
    //Supprimer une dotation
    deleteDotation: function(id){
      return $cordovaSQLite.execute(db, 'DELETE FROM Cadeaux where id = ?', [id])
    }
  }
})
