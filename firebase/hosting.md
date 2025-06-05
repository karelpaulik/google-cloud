## Instalace
- npm install -g firebase-tools

## Základní příkazy
- firebase login
- firebase logout

-firebase init

- firebase deploy (deploy všeho)
- firebase deploy --only hosting
- --only hosting: Doporučuje se použít tento příznak, pokud chcete nasadit pouze Hosting. Tím se vyhnete nechtěnému nasazení změn v jiných částech vašeho Firebase projektu (např. Cloud Functions, pokud je máte, ale nechcete je aktualizovat).
- --only firestore
- --only storage

Neexistuje:
- --only authentication


firebase hosting:disable
firebase hosting:enable - NEEXISTUJE
Pro povolení nutno nový deploy, nebo obnovení některého předchozího

Další:
firebase deploy --only hosting:aaaabbbb-pokus
firebase target:apply hosting aaaabbbb-asdf aaaabbbb-asdf

firebase use 
firebase --version

firebase help
firebase help <příkaz>: firebase help deploy
--------
Důležité soubory projektu:
firebase.json: Hlavní konfigurace pro nasazení a chování služeb. Klíčové pro Hosting.
.firebaserc: Určuje, ke kterému projektu se připojujete.

Pravidlové soubory
.................
firestore.rules
storage.rules

firestore.indexes.json (Soubor pro definování indexů pro vaši databázi Cloud Firestore.)

Pozn:
(CLI) npm install -g firebase-tools,	Pro správu a nasazení Firebase projektu z vašeho terminálu.
(SDK) npm install firebase				Pro integraci Firebase služeb do kódu vaší aplikace
