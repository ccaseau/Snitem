var app = angular.module('Snitem.controllers', [])

app.controller('FirstCtrl', function ($scope, $ionicModal,$state) {
  //Avant de renvoyer vers la page home il faut laisser quelques ms à l'application pour charger la base de donnée
  //si on ouvre directement la page home il y aura des bugs
  console.log("Chargement de la base de donnée");
  setTimeout(function()
  {
      $state.go('home');
  },8000);
})
//SnitemCtrl => Controlleur général de l'application, les traitements generaux s'y font
//comme par exemple la customisation visuelle
app.controller('SnitemCtrl', function($scope,$state,$timeout,ThemesDataService) {
    $scope.$on('$ionicView.enter', function(e){
      ThemesDataService.getAll(function(data){
        //Dans angular avec ng-style on peut dynamiquement changer le style d'un élément ex: dans l'html ng-style="bouton_principal"
        $scope.bouton_principal = {"background-color": data[0].color1}; //Couleur des boutons principaux en héxadecimal
        $scope.bouton_reponse = {"background-color":  data[0].color2}; //Couleur des boutons secondaires en héxadecimal
        $scope.question_color = {"color":  data[0].color2}; //Couleur de texte des questions
        $scope.texte_color = {"color": data[0].textColor}; //Couleur general des autres textes
        $scope.message_color = {"color": data[0].color1}; //Couleur secondaire des textes
        $scope.background_img = {"background-image": "url("+data[0].background+")"} //Image de fond (lien vers la créa)
        $scope.police = {"font-family" :data[0].font};//Nom de la police d'ecriture utilisée /!\ elle doit être présente dans le dossier /font et chargée dans le css
      })
    })

//Fonction qui va permettre de donner plusieurs ng-style a un même élément
    $scope.margeStyleObj = function(objectList) {
      var obj = {};
        objectList.forEach(function(x) {
          angular.extend(obj,x);
        });
      return obj;
    }

  });

//HomeCtrl => Controlleur de la page home.html
app.controller('HomeCtrl', function($scope,$state,$timeout) {
    console.log("vous êtes sur la page home");

    $scope.next = function()
    {
      $timeout(function() {
        $state.go('questions');
      }, 200);
    }

  });

  //IGCtrl => Controlleur de la page ig.html. Gere notamment l'instant gagnant : roue et lots
  app.controller('IGCtrl', function($scope,$state,$timeout,ManageScore,CadeauxDataService) {

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

      $scope.score = ManageScore.init();

      $scope.canspin = true;

      //On utilise le service CadeauxData pour gerer les données des dotations
      //avec getCadeau() on récupere les dotations disponible
      CadeauxDataService.getCadeau(date,date2,function(data){

        //C'est la premiere dotation disponible qui nous interesse donc data[0]!
        $scope.cadeau = data[0].CodeCadeau;//Code cadeau nous donne le cadrau sur lequel doit s'arreter la roue
        $scope.texteLot = data[0].Texte;//Texte nous donne le texte lié au cadeau

        CadeauxDataService.SubstrQuantite(data[0].id);//SubstrQuantite(id) permet de soustraire d'1 la quantité de la dotation
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

    //On utilise le plugin winwheel.js pour mettre en place une roue
    $scope.wheel = new Winwheel({
        //On peut choisir d'utiliser directement un image en .png au lieu de tracer une roue
        //L'image devra mesurer 350*350, être en .png avec fond transparent
        //Si on souhaite utiliser l'image il suffit de décommenter la ligne juste en dessous :
            //'drawMode' : 'image'
            'numSegments'    : nbLots, //Nombre de lots
            'lineWidth'   : 0.00001,
            'textFillStyle' : 'white',//couleur du texte
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
          }, 3500);//3500 = > Une fois que la roue à finit de tourner

          //La ligne ci dessous va nous permettre de definir ou doit s'arreter la roue => l'angle d'arret de l'animation
          //Dans $scope.cadeau on a stocké le nom de la dotation disponible et dans TablAngle[$scope.cadeau] l'angle associé
          $scope.wheel.animation.stopAngle = TabAngle[$scope.cadeau];
          $scope.wheel.startAnimation();
          $scope.canspin = false;//Tant que la roue tourne on ne peut pas la re faire tourner
        }
      }
    });

//QstCtrl => Controlleur de la page question.html. Logique question/reponse, enchainement, explications, calcul du score...
app.controller('QstCtrl', function($scope,$location,$timeout,ManageScore,QuestionsDataService) {
    console.log("vous êtes sur la page des questions");

    $scope.$on('$ionicView.enter', function(e){

        $scope.count = 0;//Stocke la question à laquelle on en est
        $scope.score = ManageScore.reset();//On met le score à 0
        $scope.view_explication = false;//Le explications ne sont pas affichées
        $scope.view_question = true;//la question est affichée
        $scope.question = [];
        $scope.question.reponse = [];

        var nbQst = 7;

        //On récupere les questions de notre bdd en utilisant le service QuestionsDataService
        //getRandomQuestion pioche 7 questions en random dans notre pool
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
            $scope.score =  ManageScore.add();//on ajoute 1 au socre
          }
        }
        //si la réponse est fausse
        else {
            $scope.message = "Mauvaise réponse..." ;
        }
        //dans tt les cas une fois qu'on a répondu on affiche l'explication et on cache la question
        $timeout(function() {
          $scope.view_question = false;
        },530);

        $timeout(function() {
          $scope.view_explication = true;
        }, 600);

      }

      $scope.getNextQuestion = function() {
        if ($scope.count < $scope.question.length - 1)
        {
            //On masque en premier l'explication (on doit faire ça en premier parce-que si on incrément d'abord la question on voit s'afficher brievement la prochaine explication)
            $timeout(function() {
              $scope.view_explication = false;
            }, 530);

            //On incrémente de 1 pour charger la prochaine question
            $timeout(function() {
              $scope.count = $scope.count + 1;
            }, 550);

            //Puis on affiche la question
            $timeout(function() {
              $scope.view_question = true;
            }, 600)
        }

        else
        {
          $location.path("ig");//Quand il y a plus de question on va à l'IG
        }
      }

  });
