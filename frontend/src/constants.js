const AHRI = ["Ahri", 4]
const AKALI = ["Akali",4]
const AMUMU = ["Amumu",3]
const ANNIE = ["Annie",1]
const APHELIOS = ["Aphelios",2]
const BARD = ["Bard",2]
const BLITZCRANK = ["Blitzcrank",4]
const CAITLYN = ["Caitlyn",4]
const CORKI = ["Corki",1]
const EKKO = ["Ekko",3]
const EVELYNN = ["Evelynn",1]
const EZREAL = ["Ezreal",4]
const GAREN = ["Garen",2]
const GNAR = ["Gnar",2]
const GRAGAS = ["Gragas",2]
const ILLAOI = ["Illaoi",5]
const JAX = ["Jax",2]
const JHIN = ["Jhin",5]
const JINX = ["Jinx",1]
const KSANTE = ["K'Sante",1]
const KAISA = ["Kai'Sa",2]
const KARTHUS = ["Karthus",4]
const KATARINA = ["Katarina",3]
const KAYLE = ["Kayle",2]
const KAYN = ["Kayn",5]
const KENNEN = ["Kennen",1]
const LILLIA = ["Lillia",1]
const LUCIAN = ["Lucian",5]
const LULU = ["Lulu",3]
const LUX = ["Lux",3]
const MISSFORTUNE = ["Miss Fortune",3]
const MORDEKAISER = ["Mordekaiser",3]
const NAMI = ["Nami",1]
const NEEKO = ["Neeko",3]
const OLAF = ["Olaf",1]
const PANTHEON = ["Pantheon",2]
const POPPY = ["Poppy",4]
const QIYANA = ["Qiyana",5]
const RIVEN = ["Riven",3]
const SAMIRA = ["Samira",3]
const SENNA = ["Senna",2]
const SERAPHINE = ["Seraphine",2]
const SETT = ["Sett",3]
const SONA = ["Sona",5]
const TAHMKENCH = ["Tahm Kench",1]
const TARIC = ["Taric",1]
const THRESH = ["Thresh",4]
const TWISTEDFATE = ["Twisted Fate",4]
const TWITCH = ["Twitch",2]
const URGOT = ["Urgot",3]
const VEX = ["Vex",3]
const VI = ["Vi",1]
const VIEGO = ["Viego",4]
const YASUO = ["Yasuo",1]
const YONE = ["Yone",3]
const YORICK = ["Yorick",5]
const ZAC = ["Zac",4]
const ZED = ["Zed",4]
const ZIGGS = ["Ziggs",5]
export const champs = [
  AHRI,AKALI,AMUMU,ANNIE,APHELIOS,BARD,BLITZCRANK,CAITLYN,CORKI,EKKO,EVELYNN,EZREAL,GAREN,GNAR,GRAGAS,ILLAOI,JAX,JHIN,JINX,KSANTE,KAISA,KARTHUS,KATARINA,KAYLE,KAYN,KENNEN,LILLIA,LUCIAN,LULU,LUX,MISSFORTUNE,MORDEKAISER,NAMI,NEEKO,OLAF,PANTHEON,POPPY,QIYANA,RIVEN,SAMIRA,SENNA,SERAPHINE,SETT,SONA,TAHMKENCH,TARIC,THRESH,TWISTEDFATE,TWITCH,URGOT,VEX,VI,VIEGO,YASUO,YONE,YORICK,ZAC,ZED,ZIGGS];
export const synergy = {
  classes: {
    "big shot":{
      "champs":[CORKI,KAISA,MISSFORTUNE,EZREAL,JHIN],
      "activation":[2,4,6]},
    "breakout":{
      "champs":[AKALI],
      "activation":[1]},
    "bruiser":{
      "champs":[OLAF,TAHMKENCH,GRAGAS,SETT,ZAC,ILLAOI],
      "activation":[2,4,6]},
    "crowd diver":{
      "champs":[EVELYNN,KATARINA,YONE,ZED,QIYANA],
      "activation":[2,4,6]},
    "dazzler": {
      "champs":[NAMI, BARD, LUX, TWISTEDFATE, ZIGGS],
      "activation":[2,4,6]},
    "edgelord":{
      "champs":[YASUO,KAYLE,RIVEN,YONE,VIEGO,KAYN],
      "activation":[3,5,7]},
    "executioner": {
      "champs":[TWITCH,SAMIRA,VEX,AKALI,KARTHUS],
      "activation":[2,4,6]},
    "guardian": {
      "champs":[TARIC,KENNEN,PANTHEON,AMUMU,NEEKO,THRESH,YORICK],
      "activation":[2,4,6]},
    "mosher": {
      "champs":[VI,GNAR,JAX,SETT,URGOT,POPPY,YORICK],
      "activation":[2,4,6]},
    "rapidfire":{
      "champs":[JINX,APHELIOS,SENNA,CAITLYN,LUCIAN],
      "activation":[2,4,6]},
    "sentinel":{
      "champs":[KSANTE,LILLIA,GAREN,EKKO,MORDEKAISER,BLITZCRANK],
      "activation":[2,4,6,8]},
    "spellweaver":{
      "champs":[ANNIE,GRAGAS,SERAPHINE,EKKO,LULU,AHRI,SONA],
      "activation":[3,5,7,9]},
    "superfan":{
      "champs":[LILLIA,KENNEN,GNAR,NEEKO],
      "activation":[3,4,5]}
},
  origins: {
    "8-bit":{
      "champs":[CORKI,GAREN,RIVEN,CAITLYN],
      "activation":[2,4,6]},
    "country":{
      "champs":[TAHMKENCH,KATARINA,SAMIRA,URGOT,THRESH],
      "activation":[3,5,7]},
    "disco":{
      "champs":[NAMI,TARIC,GRAGAS,BLITZCRANK,TWISTEDFATE],
      "activation":[3,4,5,6]},
    "EDM":{
      "champs":[JAX,LUX,ZAC,ZED],
      "activation":[2,3,4,5]},
    "emo":{
      "champs":[ANNIE,AMUMU,VEX,POPPY],
      "activation":[2,4,6]},
    "heartsteel":{
      "champs":[KSANTE,APHELIOS,SETT,YONE,EZREAL,KAYN],
      "activation":[3,5,7,10]},
    "hyperpop":{
      "champs":[LULU,ZIGGS],
      "activation":[1,2,3,4]},
    "ILLBEATS":{
      "champs": [ILLAOI],
      "activation":[1]},
    "jazz": {
      "champs":[BARD, MISSFORTUNE, LUCIAN],
      "activation":[2,3,4]},
    "k/da": {
      "champs":[EVELYNN,LILLIA,KAISA,SERAPHINE,NEEKO,AHRI,AKALI],
      "activation":[3,5,7,10]},
    "maestro":{
      "champs":[JHIN],
      "activation":[1]},
    "mixmaster":{
      "champs":[SONA],
      "activation":[1]},
    "pentakill":{
      "champs":[OLAF,GNAR,KAYLE,MORDEKAISER,KARTHUS,VIEGO,YORICK],
      "activation":[3,5,7,10]},
    "punk":{
      "champs":[JINX,VI,PANTHEON,TWITCH],
      "activation":[2,4,6]},
    "true damage": {
      "champs":[YASUO,KENNEN,SENNA,EKKO,AKALI,QIYANA],
      "activation":[2,4,6,9]},
    "wildcard":{
      "champs":[KAYN],
      "activation":[1]},
    },
};
