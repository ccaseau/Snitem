var app = angular.module('Snitem.controllers', [])

app.controller('HomeCtrl', function($scope,$state,$timeout) {
    console.log("vous êtes sur la page home");
    $scope.next = function()
    {
      $timeout(function() {
        $state.go('questions');
      }, 100);
    }
  });

  app.controller('ScoreCtrl', function($scope,$state,$timeout,ManageScore) {

    $scope.$on('$ionicView.enter', function(e){
      $scope.score = ManageScore.init();
    })
    
      $scope.next = function()
      {
        $timeout(function() {
          $state.go('home');
        }, 100);
      }
    });

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
        }, 500);

        $timeout(function() {
          $scope.view_explication = true;
        }, 930);

        console.log($scope.score);
      }

      $scope.getNextQuestion = function() {

        if ($scope.count < $scope.question.length - 1)
        {
            $timeout(function() {
              $scope.view_explication = false;
            }, 500);

            $timeout(function() {
              $scope.count = $scope.count + 1;
            }, 520);

            $timeout(function() {
              $scope.view_question = true;
            }, 540)
        }

        else
        {
          $location.path("score");
        }
      }

  });
