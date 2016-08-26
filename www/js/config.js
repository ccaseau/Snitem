//Theme
const CREA_WHEEL  = "img/wheel-try.png";
const N_THEME = 1;

//Questions
const NBQUESTIONS = 7;

//Dotations
const NBLOTS = 7;
const ECARTANGLE = 360/NBLOTS;
const TABANGLE = new Array();
TABANGLE["Perche"] = 0;
TABANGLE["Montre_connect"] = 48;
TABANGLE["USB"] = 105;
TABANGLE["Sets"] = 160;
TABANGLE["Montre"] = 205;
TABANGLE["Stylo"] = 255;
TABANGLE["Chargeurs"] = 308;
// Gestion des angles en fonction du précédent
// TABANGLE["Perche"] = 0;
// TABANGLE["Montre"] = TABANGLE["Perche"]+ECARTANGLE;
// TABANGLE["USB"] = TABANGLE["Montre"]+ECARTANGLE;
// TABANGLE["Sets"] = TABANGLE["USB"]+ECARTANGLE;
// TABANGLE["Montre2"] = TABANGLE["Sets"]+ECARTANGLE;;
// TABANGLE["Stylo"] = TABANGLE["Montre2"]+ECARTANGLE;
// TABANGLE["Chargeurs"] = TABANGLE["Stylo"]+ECARTANGLE;

//Admin
const GO_IG = false;
const ADMIN_PASS = 'viraladmin';
