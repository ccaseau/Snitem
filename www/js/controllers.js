var app = angular.module('Snitem.controllers', [])

app.controller('HomeCtrl', function($scope,$location) {
    console.log("vous êtes sur la page home");
    $scope.next = function()
    {
      $location.path('questions')
    }
  });

app.controller('QstCtrl', function($scope,$location) {
    console.log("vous êtes sur la page des questions");

    $scope.$on('$ionicView.enter', function(e){
        $scope.count = 0;
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
      }
    ];

      $scope.getAnswer = function(chosenAnswer,currentQuest,index) {
        $scope.view_question = false;
        $scope.view_explication = true;
      }

      $scope.getNextQuestion = function() {

        if ($scope.count < $scope.question.length - 1)
        {
            $scope.count = $scope.count + 1;
            $scope.view_question = true;
            $scope.view_explication = false;
        }

        else
        {
          $location.path("home");
        }

      }

  });
