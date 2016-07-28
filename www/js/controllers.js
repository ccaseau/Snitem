var app = angular.module('Snitem.controllers', [])

//SnitemCtrl => Controlleur général de l'application, les traitements generaux s'y font
//comme par exemple la customisation visuelle
app.controller('SnitemCtrl', function($scope,$state,$timeout,ManageCustomisation) {
    $scope.$on('$ionicView.enter', function(e){
      console.log("Snitem controller fonctionne");
    })

    $scope.margeStyleObj = function(objectList) {
      var obj = {};
        objectList.forEach(function(x) {
          angular.extend(obj,x);
        });
      return obj;
    }

      $scope.bouton_principal = {"background-color": '#F9A61A'};
      $scope.bouton_reponse = {"background-color": '#00ACCE'};
      $scope.question_color = {"color": '#00ACCE'};
      $scope.texte_color = {"color": 'black'};
      $scope.message_color = {"color": '#F9A61A'};
      $scope.background_img = {"background-image": "url('img/background2.png')"}
      $scope.police = {"font-family" :"Exo"};

  });

  //CustomCtrl => Ce controlleur gére le formulaire de la page custom.html
  app.controller('CustomCtrl', function($scope,$state,$timeout,ManageCustomisation) {

    $scope.createTheme = function()
    {
      $state.go('home')
      ManageCustomisation.create($scope.couleur);
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
  app.controller('ScoreCtrl', function($scope,$state,$timeout,ManageScore) {
    $scope.$on('$ionicView.enter', function(e){
      $scope.score = ManageScore.init();
      $scope.canspin = true;
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

    $scope.lot ="une montre connectée"
    $scope.wheel_time = true;

    $scope.wheel = new Winwheel({
        'drawMode' : 'image',
        'numSegments'    : 6, //Nombre de lots + 1 pour le quartier "perdu"
        'lineWidth'   : 0.00001,
        'textFillStyle' : 'white',
        'textFontSize' : 20,
        'innerRadius'     : 0,
        'textAlignment' : 'center',
        'segments'       :
        [
            {'fillStyle' : '#00ACCE', 'text' : 'Montre'}, // On indique à chaque fois la couleur du quartier et le texte qui s'affichera
            {'fillStyle' : '#F9A517', 'text' : 'Stylo'},
            {'fillStyle' : '#00ACCE', 'text' : 'USB'},
            {'fillStyle' : '#F9A517', 'text' : 'Perche'},
            {'fillStyle' : '#00ACCE', 'text' : 'Chargeurs'},
            {'fillStyle' : '#F9A517', 'text' : 'Sets'},
        ],
        'animation' :
        {
            'type'     : 'spinToStop',
            'duration' : 3, // durée de l'animation => parametre la vitesse de la roue
            'spins'    : 6, //Nombre de tours que va faire la roue
        }
  });

  // Create new image object in memory.
var loadedImg = new Image();

// Create callback to execute once the image has finished loading.
loadedImg.onload = function()
{
    $scope.wheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
    $scope.wheel.draw();                    // Also call draw function to render the wheel.
}

// Set the image source, once complete this will trigger the onLoad callback (above).
loadedImg.src = "img/wheel-try.png";

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

          $scope.wheel.animation.stopAngle = TabAngle["Montre"];
          $scope.wheel.startAnimation();
          $scope.canspin = false;
        }
      }

    });

//QstCtrl => Controlleur de la page question.html. Logique question/reponse, enchainement, explications, calcul du score...
app.controller('QstCtrl', function($scope,$location, $timeout,ManageScore) {
    console.log("vous êtes sur la page des questions");

    $scope.$on('$ionicView.enter', function(e){

        $scope.count = 0;
        $scope.score = ManageScore.reset();
        $scope.view_explication = false;
        $scope.view_question = true;
    })

    $scope.question = [
      {
        "intitule" : "Combien de références existe t-il pour le dispositif médical ?",
        "bonneRep" : "de 800 000 à 2 000 000",
        "explication" : "Il existe de 800 000 à 2 millions de références pour le dispositif médical (Source : rapport IGAS)"
      },

      {
        "intitule" :"Comment se caractérise le rôle structurant du DM dans l'organisation des soins ?",
        "bonneRep" : "",
        "explication" : "Les 4 réponses sont exactes ! le DM permet aussi le développement de la prise en charge de patients en ambulatoire"
      },

      {
        "intitule" : "L'industrie de la santé (médicaments humain et vétérinaires, dispositifs & technologies médicales et diagnostic in Vitro) rassemble 175 000 salariés. Le secteur du dispositif & technologies médicales emploie à lui seul 37% de cette masse salariale, soit 65 000 personnes.",
        "bonneRep": "Vrai",
        "explication": "C'est vrai"
      },

      {
        "intitule" : "Le SNITEM a accueilli un nouveau secteur industriel en mai 2016. De quel secteur s'agit-il?",
        "bonneRep": "SYFFOC",
        "explication": "Le SNITEM a accueilli en mai dernier les adhérents du SYFFOC"
      },

      {
        "intitule" : "Le délai d'attente moyen pour passer un IRM en France est de 20 jours",
        "bonneRep": "Faux",
        "explication": "C'est faux ! Le délai moyen d'accès à l'IRM en France est de 30.3 jours en 2015, soit 7 jours de plus qu'en 2014. Ce délai est de 10 jours plus élevé au délai moyen recommandé par le troisième plan Cancer 2014-2019 (source ISA)"
      },

      {
        "intitule" : "Le cycle moyen d'innovation d'un dispositif médical est de 10 ans.",
        "bonneRep": "Faux",
        "explication": "Faux! Les cycles d'innovation d'un produit donné se situent en moyenne entre 2 et 5 ans. Dans nombre cas, il s'agit d'évolutions technologiques graduelles qui, sur la durée, au bout d'une dizaine d'années apportent des changements majeurs en termes de prise en charge diagnostique, médico-chirurgicale ou de compensation d'un handicap. L'industrie des dispositifs médicaux bénéficie en France d'un potentiel collaboratif de R&D important constitué de laboratoires au sein d'universités, de CHU, et de grands organismes de recherche (CEA,CNRS,INRIA,INSERM,ect.)"
      },

      {
        "intitule" : "Combien de titres compte la LPPR ?",
        "bonneRep": "5",
        "explication": "La LPPR compte 5 titres depuis décembre 2015 ! "
      }
    ];

    $scope.question.reponse = [
      {
        "reponse1" : "de 50 000 à 100 000",
        "reponse2" : "de 100 000 à 300 000",
        "reponse3" : "de 300 000 à 500 000",
        "reponse4" : "de 800 000 à 2 000 000"
      },

      {
        "reponse1" : "Baisse de la durée d'hospitalisation",
        "reponse2" : "Réduction de la durée d'intervention chirurgicale",
        "reponse3" : "Développement du maintien à domicile des patients",
        "reponse4" : "Diagnostics de plus en plus précoses permettant de nouveaux modes de prises en charge"
      },

      {
        "reponse1" : "Vrai",
        "reponse2" : "Faux"
      },

      {
        "reponse1" : "La dermatologie",
        "reponse2" : "La sophrologie",
        "reponse3" : "La contactologie",
        "reponse4" : "Le médicament"
      },

      {
        "reponse1" : "Vrai",
        "reponse2" : "Faux"
      },

      {
        "reponse1" : "Vrai",
        "reponse2" : "Faux"
      },

      {
        "reponse1" : "1",
        "reponse2" : "2",
        "reponse3" : "4",
        "reponse4" : "5"
      }

    ];

    $scope.message = ""

      $scope.getAnswer = function(chosenAnswer,currentQuest) {

        // si la réponse est juste
        if((chosenAnswer == currentQuest.bonneRep) || (currentQuest.bonneRep == ""))
        {
          $scope.message = "Bravo, bonne réponse !" ;
          if($scope.score < $scope.question.length)
          {
            $scope.score =  ManageScore.add();
          }
        }
        // si la réponse est fausse
        else {
            $scope.message = "Mauvaise réponse..." ;
        }
        // dans tt les cas
        $timeout(function() {
          $scope.view_question = false;
        }, 530);

        $timeout(function() {
          $scope.view_explication = true;
        }, 600);

        console.log($scope.score);
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
