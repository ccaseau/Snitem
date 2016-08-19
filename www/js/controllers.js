var app = angular.module('Snitem.controllers', [])

app.controller('FirstCtrl', function ($scope, $ionicModal,$state) {
  //Avant de renvoyer vers la page home il faut laisser quelques ms à l'application pour charger la base de donnée
  //si on ouvre directement la page home il y aura des bugs
  console.log("Chargement de la base de donnée");
  setTimeout(function()
  {
      $state.go('home');
  },3000);
})
//SnitemCtrl => Controlleur général de l'application, les traitements generaux s'y font
//comme par exemple la customisation visuelle
app.controller('SnitemCtrl', function($scope,$state,$timeout,ManageCustomisation,ThemesDataService) {
    $scope.$on('$ionicView.enter', function(e){
      ThemesDataService.getAll(function(data){
        $scope.bouton_principal = {"background-color": data[0].color1}; //Couleur des boutons principaux en héxadecimal
        $scope.bouton_reponse = {"background-color":  data[0].color2}; //Couleur des boutons secondaires en héxadecimal
        $scope.question_color = {"color":  data[0].color2}; //Couleur de texte des questions
        $scope.texte_color = {"color": data[0].textColor}; //Couleur general des autres textes
        $scope.message_color = {"color": data[0].color1}; //Couleur secondaire des textes
        $scope.background_img = {"background-image": "url("+data[0].background+")"} //Image de fond (lien vers la créa)
        $scope.police = {"font-family" :data[0].font};//Nom de la police d'ecriture utilisée /!\ elle doit être présente dans le dossier /font et chargée dans le css
      })
    })

    $scope.margeStyleObj = function(objectList) {
      var obj = {};
        objectList.forEach(function(x) {
          angular.extend(obj,x);
        });
      return obj;
    }

  });

  //CustomCtrl => Ce controlleur gére le formulaire de la page custom.html
  app.controller('CustomCtrl', function($scope,$state,$timeout,ManageCustomisation) {

    $scope.theme = {};
    $scope.createTheme = function()
    {
      //Image de fond
      ManageCustomisation.create_background_img($scope.theme.background);
      //Couleur du texte
      ManageCustomisation.create_couleur_texte($scope.theme.couleurTexte);
      //Couleur principale
      ManageCustomisation.create_couleur_1($scope.theme.couleur1);
      //Couleur secondaire
      ManageCustomisation.create_couleur_2($scope.theme.couleur2);
      //Police d'ecriture
      ManageCustomisation.create_police($scope.theme.police);

      $state.go('home');
    }

      })

//HomeCtrl => Controlleur de la page home.html
app.controller('HomeCtrl', function($scope,$state,$timeout) {
    console.log("vous êtes sur la page home");

    $scope.next = function()
    {
      $timeout(function() {
        $state.go('questions');
      }, 200);
    }

    $scope.custom = function() {
      $state.go('custom');
    }
  });

  //ScoreCtrl => Controlleur de la page score.html. Gere notamment l'instant gagnant : roue et lots
  app.controller('ScoreCtrl', function($scope,$state,$timeout,ManageScore,CadeauxDataService) {

    $scope.$on('$ionicView.enter', function(e){

      var now = new Date();
      var annee   = now.getFullYear();
      var mois    = ('0'+(now.getMonth()+1)).slice(-2);
      var jour    = ('0'+now.getDate()   ).slice(-2);
      var heure   = ('0'+now.getHours()  ).slice(-2);
      var minute  = ('0'+now.getMinutes()).slice(-2);
      var seconde = ('0'+now.getSeconds()).slice(-2);
      var date = annee+"-"+mois+"-"+jour+" "+heure+":"+minute+":"+seconde;
      var date2 = annee+"-"+mois+"-"+jour+" 23:59:59";

      console.log(date)

      $scope.score = ManageScore.init();
      $scope.canspin = true;
      CadeauxDataService.getCadeau(date,date2,function(data){
        console.log(data);
        $scope.cadeau = data[0].CodeCadeau;
        $scope.texteLot = data[0].Texte;
        CadeauxDataService.SubstrQuantite(data[0].id);
      })
    })

    //Mise en place des differents angles d'arrêts sur une base de 6 lots :
    //Montres analogiques, stylos lumiere, clé USB, perches à selfie, chargeurs et sets de recharge

    var nbLots = 6;
    var EcartAngle = 360/nbLots;
    var TabAngle = new Array();
    TabAngle["Montre"] = EcartAngle/2;
    TabAngle["Stylo"] = TabAngle["Montre"]+EcartAngle;
    TabAngle["USB"] = TabAngle["Stylo"]+EcartAngle;
    TabAngle["Perche"] = TabAngle["USB"]+EcartAngle;
    TabAngle["Chargeurs"] = TabAngle["Perche"]+EcartAngle;
    TabAngle["Sets"] = TabAngle["Chargeurs"]+EcartAngle;

    $scope.wheel_time = true;

    $scope.wheel = new Winwheel({
        //On peut choisir d'utiliser directement un image en .png au lieu de tracer une roue
        //L'image devra mesurer 350*350, être en .png avec fond transparent
        //Si on souhaite ne pas utiliser l'image il suffit de commenter la ligne juste en dessous : 'drawMode' : 'image'
            'numSegments'    : nbLots, //Nombre de lots "
            'lineWidth'   : 0.00001,
            'textFillStyle' : 'white',
            'textFontSize' : 20,
            'innerRadius'     : 10,
            'textAlignment' : 'center',
            'segments'       :
            [
                {'fillStyle' : '#F9A61A', 'text' : 'Montre'}, // On indique à chaque fois la couleur du quartier et le texte qui s'affichera
                {'fillStyle' : '#00ACCE', 'text' : 'Stylo'},
                {'fillStyle' : '#F9A61A', 'text' : 'USB'},
                {'fillStyle' : '#00ACCE', 'text' : 'Perche'},
                {'fillStyle' : '#F9A61A', 'text' : 'Chargeur'},
                {'fillStyle' : '#00ACCE', 'text' : 'Set'},
            ],
            'animation' :
            {
                'type'     : 'spinToStop',
                'duration' : 3, // durée de l'animation =>3s
                'spins'    : 5, //Nombre de tours que va faire la roue => parametre la vitesse de la rotation
            }
          });

// var loadedImg = new Image();
// loadedImg.onload = function()
// {
//     $scope.wheel.wheelImage = loadedImg;
//     $scope.wheel.draw();
// }
// loadedImg.src = "img/wheel-try.png";

  $scope.resetWheel = function()
    {
      $scope.wheel.stopAnimation(false);
    }

      $scope.quit = function()
      {
        $timeout(function() {
          $state.go('home');
        }, 500);

        $timeout(function() {
          $scope.wheel_time = true;
        }, 600);
      }

      $scope.spin = function()
      {
        if($scope.canspin = true)
        {
          $timeout(function() {
                $scope.wheel.stopAnimation(false);
                $scope.wheel.rotationAngle = 0;
                $scope.canspin = true;
                $scope.wheel_time = false;
          }, 3500);

          $scope.wheel.animation.stopAngle = TabAngle[$scope.cadeau];
          $scope.wheel.startAnimation();
          $scope.canspin = false;
        }
      }

    });

//QstCtrl => Controlleur de la page question.html. Logique question/reponse, enchainement, explications, calcul du score...
app.controller('QstCtrl', function($scope,$location,$timeout,ManageScore,QuestionsDataService) {
    console.log("vous êtes sur la page des questions");

    $scope.$on('$ionicView.enter', function(e){

        $scope.count = 0;
        $scope.score = ManageScore.reset();
        $scope.view_explication = false;
        $scope.view_question = true;
        $scope.question = [];
        $scope.question.reponse = [];

        var nbQst = 7;

        //On récupere les questions de notre bdd en utilisant le service QuestionsDataService
        //On pioche 7 questions parmis notre pool
        QuestionsDataService.getRandomQuestion(nbQst,function(dataQ,dataR){
          //On rempli nos variables locales avec les questions de la base de donnée
          $scope.question = dataQ;
          $scope.question.reponse = dataR;
        })
    })

    $scope.message = ""

      $scope.getAnswer = function(chosenAnswer,currentQuest) {

        //si la réponse est juste
        if((chosenAnswer == currentQuest.bonneRep) || (currentQuest.bonneRep == ""))
        {
          $scope.message = "Bravo, bonne réponse !" ;
          if($scope.score < $scope.question.length)
          {
            $scope.score =  ManageScore.add();
          }
        }
        //si la réponse est fausse
        else {
            $scope.message = "Mauvaise réponse..." ;
        }
        //dans tt les cas
        $timeout(function() {
          $scope.view_question = false;
        }, 530);

        $timeout(function() {
          $scope.view_explication = true;
        }, 600);

      }

      $scope.getNextQuestion = function() {

        if ($scope.count < $scope.question.length - 1)
        {
            $timeout(function() {
              $scope.view_explication = false;
            }, 530);

            $timeout(function() {
              $scope.count = $scope.count + 1;
            }, 550);

            $timeout(function() {
              $scope.view_question = true;
            }, 600)
        }

        else
        {
          $location.path("score");
        }
      }

  });
