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

  $scope.next = function()
  {
    if(GO_IG)
    {
      $timeout(function() {
        $state.go('ig');
      }, 200);
    }
    else {
      $timeout(function() {
        $state.go('questions');
      }, 200);
    }
  }
});

app.controller('LoginCtrl', function($scope,$state,$timeout) {
  $scope.data =[];
  $scope.wrong = false;
  $scope.login = function()
  {
    if($scope.data.mdp == ADMIN_PASS)
    {
      $state.go('data')
      $scope.data.mdp = '';
      $scope.loginForm.$setPristine();
      $scope.wrong = false;
    }
    else {
      $scope.wrong = true;
    }
  }
});

//DataCtrl => Controlleur de la page Data
app.controller('DataCtrl', function($scope,$state,$timeout,BackOfficeService) {
  console.log("vous êtes dans le backoffice");

  $scope.$on('$ionicView.enter', function(e){
    BackOfficeService.getOtherDotation(function(data){
      $scope.data2 = data;
    })
    BackOfficeService.getWinDotation(function(data){
      $scope.data = data;
    })
  })

  $scope.DelDotation = function(id)
  {
    BackOfficeService.deleteDotation(id).then(onDelSuccess);
  }

  function onDelSuccess()
  {
    $state.go($state.current, {}, {reload: true});//Re load la vue pour ne plus voir les éléments supprimés
  }

  $scope.back = function()
  {
    $timeout(function() {
      $state.go('home');
    }, 200);
  }

  $scope.removeDB = function()
  {
    window.sqlitePlugin.deleteDatabase({name: 'my.db', location: 'default'}, removesuccess, removeerror);//on supprime la bdd
  }

  function removesuccess()
  {
    console.log('la base a été supprimée');
    document.location.href = 'index.html'//en forçant la redirection vers index.html c'est comme si on faisait un restart de l'application (app.js sera re executé et donc la base re remplie);
  }
  function removeerror(e)
  {
    console.log(e.toString());
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
      console.log($scope.texteLot);
      CadeauxDataService.SubstrQuantite(data[0].id);//SubstrQuantite(id) permet de soustraire d'1 la quantité de la dotation
      CadeauxDataService.AddDateGain(data[0].id,date);
    })
  })

  //Mise en place des differents angles d'arrêts sur une base de 6 lots :
  //Montres analogiques, stylos lumiere, clé USB, perches à selfie, chargeurs et sets de recharge
  $scope.wheel_time = true;

  //On utilise le plugin winwheel.js pour mettre en place une roue
  //On charge l'image de la roue qui sera utilisée
  var loadedImg = new Image();
  loadedImg.onload = function()
  {
    $scope.wheel.wheelImage = loadedImg;
    $scope.wheel.draw();//dés que l'image est disponible on peut la dessiner
  }
  loadedImg.src = CREA_WHEEL;
  $scope.wheel = new Winwheel({
    //L'image utilisée doit mesurer 350*350, être en .png avec fond transparent
    'drawMode' : 'image',
    'animation' :
    {
      'type'     : 'spinToStop',
      'duration' : 3, //durée de l'animation =>3s
      'spins'    : 5, //Nombre de tours que va faire la roue => parametre la vitesse de la rotation
    }
  });

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
      }, 6000);

      //La ligne ci dessous va nous permettre de definir ou doit s'arreter la roue => l'angle d'arret de l'animation
      //Dans $scope.cadeau on a stocké le nom de la dotation disponible et dans TablAngle[$scope.cadeau] l'angle associé
      $scope.wheel.animation.stopAngle = TABANGLE[$scope.cadeau];
      $scope.wheel.startAnimation();
      $scope.canspin = false;//Tant que la roue tourne on ne peut pas la re faire tourner
    }
  }
});

//QstCtrl => Controlleur de la page question.html. Logique question/reponse, enchainement, explications, calcul du score...
app.controller('QstCtrl', function($scope,$location,$timeout,ManageScore,QuestionsDataService) {
  $scope.$on('$ionicView.enter', function(e){
    $scope.count = 0;//Stocke la question à laquelle on en est
    $scope.score = ManageScore.reset();//On met le score à 0
    $scope.view_explication = false;//Le explications ne sont pas affichées
    $scope.view_question = true;//la question est affichée
    $scope.question = [];
    $scope.question.reponse = [];

    //On récupere les questions de notre bdd en utilisant le service QuestionsDataService
    //getRandomQuestion pioche 7 questions en random dans notre pool
    QuestionsDataService.getRandomQuestion(NBQUESTIONS,function(dataQ,dataR){
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
