const AHRI = "Ahri"
const AKALI = "Akali"
const AMUMU = "Amumu"
const ANNIE = "Annie"
const APHELIOS = "Aphelios"
const BARD = "Bard"
const BLITZCRANK = "Blitzcrank"
const CAITLYN = "Caitlyn"
const CORKI = "Corki"
const EKKO = "Ekko"
const EVELYNN = "Evelynn"
const EZREAL = "Ezreal"
const GAREN = "Garen"
const GNAR = "Gnar"
const GRAGAS = "Gragas"
const ILLAOI = "Illaoi"
const JAX = "Jax"
const JHIN = "Jhin"
const JINX = "Jinx"
const KSANTE = "K'Sante"
const KAISA = "Kai'Sa"
const KARTHUS = "Karthus"
const KATARINA = "Katarina"
const KAYLE = "Kayle"
const KAYN = "Kayn"
const KENNEN = "Kennen"
const LILLIA = "Lillia"
const LUCIAN = "Lucian"
const LULU = "Lulu"
const LUX = "Lux"
const MISSFORTUNE = "Miss Fortune"
const MORDEKAISER = "Mordekaiser"
const NAMI = "Nami"
const NEEKO = "Neeko"
const OLAF = "Olaf"
const PANTHEON = "Pantheon"
const POPPY = "Poppy"
const QIYANA = "Qiyana"
const RIVEN = "Riven"
const SAMIRA = "Samira"
const SENNA = "Senna"
const SERAPHINE = "Seraphine"
const SETT = "Sett"
const SONA = "Sona"
const TAHMKENCH = "Tahm Kench"
const TARIC = "Taric"
const THRESH = "Thresh"
const TWISTEDFATE = "Twisted Fate"
const TWITCH = "Twitch"
const URGOT = "Urgot"
const VEX = "Vex"
const VI = "Vi"
const VIEGO = "Viego"
const YASUO = "Yasuo"
const YONE = "Yone"
const YORICK = "Yorick"
const ZAC = "Zac"
const ZED = "Zed"
const ZIGGS = "Ziggs"
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
      "champs":[KENNEN,TARIC,PANTHEON,AMUMU,NEEKO,THRESH,YORICK],
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
      "champs":[KENNEN,LILLIA,GNAR,NEEKO],
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
      "champs":[ILLAOI],
      "activation":[1]},
    "jazz": {
      "champs":[BARD, MISSFORTUNE, LUCIAN],
      "activation":[2,3,4]},
    "kda": {
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
    "trueDamage": {
      "champs":[KENNEN,YASUO,SENNA,EKKO,AKALI,QIYANA],
      "activation":[2,4,6,9]},
    "wildcard":{
      "champs":[KAYN],
      "activation":[1]},
    },
};
