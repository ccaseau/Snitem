//INITIALISATION DE L'APPLICATION, CREATION BASE DE DONNEE + INJECTION .CSV//
var app = angular.module('Snitem', ['ionic', 'Snitem.controllers', 'Snitem.services','ionMDRipple','ngCordova'])

app.run(function($ionicPlatform,$cordovaSQLite,$http) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //On ouvre la base de donnée locale
    db = window.sqlitePlugin.openDatabase({name: "my.db", iosDatabaseLocation: 'default'});

    //On verifie si elle existe déja
    localDBCheckExist()
    function localDBCheckExist() {
      db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Questions');
      },function(error) {
        console.log("database pas encore remplie");
        localDBcreate();
      }, function() {
        console.log("database deja remplie" );
      })
    }

    function localDBcreate()
    {
      //On effectue les requêtes pour construire la structure de notre base => les differentes tables & attributs
      db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Questions (id INTEGER PRIMARY KEY AUTOINCREMENT,intitule,bonneRep,explication)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Reponses (id_question,reponse1,reponse2,reponse3,reponse4)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Cadeaux (id INTEGER PRIMARY KEY AUTOINCREMENT,Texte,Quantite,CodeCadeau,ShowTime,Obligatoire,DateGain)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Themes (id,background,font,color1,color2,textColor)');
        //On gere les cas d'erreurs
      }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
        //Si nos requêtes fonctionnent on peut alors remplir nos tables
      }, function() {
        console.log('Remplissage database OK');
        //On appelle les fonctions pour injecter les données des fichiers CSV
        injecterThemes()
        injecterDotations();
        injecterQuestions();
      });
    }
    function injecterThemes(tx)
    {
      //Traitement du fichier themes.csv
      $http.get('data/themes.csv').success(function(data){
        //On récupere les données de theme.csv et on utilise le plugin papa-parse pour convertir en format js
        //Le resultat de papa.parse nous renvoi 3 objets : data, errors et meta => dans notre cas c'est data qui nous interesse : c'est la ou on retrouve nos données parsées. Dans errors on retrouve un tableau d'erreurs s'il y en a et dans meta des info suplémentaires sur le parsing
        var resultsT = Papa.parse(data);
        var ThemeData = resultsT.data; //On veut juste récuperer la partie "data" du parse
        //On execute alors une requête INSERT pour entrer notre Theme en base. => ex. ThemeData[1][0] fait reference à la deuxieme ligne et à la premiere colonne de notre fichier CSV.
        db.executeSql('INSERT OR IGNORE INTO Themes VALUES (?,?,?,?,?,?)', ['1',ThemeData[1][0],ThemeData[1][1],ThemeData[1][2],ThemeData[1][3],ThemeData[1][4]]);
      })
    }
    function injecterQuestions(tx)
    {
      $http.get('data/questions.csv').success(function(data){
        var resultsQ = Papa.parse(data);
        var QuestionData = resultsQ.data;
        //On effectue une boucle pour entrer l'ensemble des lignes du fichier CSV dans la base
        // /!\ On s'arrette à QuestionData.length (qui renvoi le nombre de ligne) - 1 (!) car une ligne vide se rajoute à la fin de chaque .csv
        for (i = 1; i < QuestionData.length-1; i++ )
        {
          var question = ''+i; //On doit entrer l'id comme un string et non un int car autrement pour les requêtes select : ex.Where id = ... ça ne fonctionnait pas
          db.executeSql('INSERT OR IGNORE INTO Questions VALUES (?,?,?,?)', [question,QuestionData[i][0],QuestionData[i][5],QuestionData[i][6]]);
          //On insere également les données dans la table réponses (les 4 choix possibles et l'id de la question) => on associera ensuite les deux avec une requête select where id_question = id
          db.executeSql('INSERT OR IGNORE INTO Reponses VALUES (?,?,?,?,?)', [question,QuestionData[i][1],QuestionData[i][2],QuestionData[i][3],QuestionData[i][4]]);
        }
      })
    }
    //Traitement du fichier dotations.csv
    function injecterDotations()
    {
      $http.get('data/dotations.csv').success(function(data){
        var resultsD = Papa.parse(data);
        var DotationData = resultsD.data;

        for (j = 1; j <= DotationData.length-2; j++)
        {
          var dotation = ''+j;
          db.executeSql('INSERT OR IGNORE INTO Cadeaux VALUES (?,?,?,?,?,?,?)', [dotation,DotationData[j][0],DotationData[j][1],DotationData[j][2],DotationData[j][5],DotationData[j][4]],'NULL');
        }
      })
    }
  });
})

//Ici on gére les routes
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })

  .state('index', {
    url: '/index',
    templateUrl: 'index.html',
    controller: 'FirstCtrl'
  })

  .state('questions', {
    url: '/questions',
    templateUrl: 'templates/questions.html',
    controller: 'QstCtrl'
  })

  .state('data', {
    url: '/data',
    templateUrl: 'templates/data.html',
    controller: 'DataCtrl'
  })

  .state('ig', {
    url: '/ig',
    templateUrl: 'templates/ig.html',
    controller: 'IGCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  //La route par defaut est l'index
  $urlRouterProvider.otherwise('/index');
});
