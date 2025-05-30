# Firebase cli

* **`npm i firebase`:** Nainstaluje **Firebase SDK** (sadu knihoven), které vaše aplikace používá pro interakci s Firebase službami (např. `firebase/app`, `firebase/firestore`, `firebase/auth`). Tento příkaz NEinstaluje nástroje pro správu projektu na úrovni souborového systému nebo pro nasazování.

* **Firebase CLI (`firebase init`, `firebase deploy`, atd.):** Toto je **samostatný nástroj**, který se instaluje globálně (nebo lokálně) a umožňuje vám:
    * **Propojit váš lokální adresář s Firebase projektem.**
    * **Stáhnout a spravovat konfigurační soubory** pro různé Firebase služby (např. `firebase.json` pro hosting, funkce, databáze).
    * **Generovat výchozí soubory** pro Security Rules (Firestore, Realtime Database), Cloud Functions, Hosting.
    * **Nasazovat (deployovat) vaše pravidla, funkce, hosting, atd.** do Firebase.

**Pokud jste dosud spravoval/a Firestore Security Rules přímo přes webovou konzoli, pak jste `firebase init` a Firebase CLI nepotřeboval/a.** Ruční editace pravidel ve webové konzoli je jednoduchá pro malé a jednorázové úpravy, ale stává se nepohodlnou pro komplexní pravidla a jejich verzování.

**Jak začít používat Firebase CLI pro správu pravidel (a výhody rozdělení souborů):**

Abychom mohli využít možnost rozdělit pravidla do více souborů a deployovat je efektivně, musíte mít nainstalované Firebase CLI.

1.  **Globální instalace Firebase CLI (jednorázově):**
    Pokud ho ještě nemáte, nainstalujte ho globálně pomocí npm:
    ```bash
    npm install -g firebase-tools
    ```
    (Možná budete potřebovat `sudo` na macOS/Linux, pokud instalujete globálně).

2.  **Přihlášení do Firebase (jednorázově):**
    ```bash
    firebase login
    ```
    Tento příkaz vás provede procesem ověření přes prohlížeč a propojí CLI s vaším Google účtem.

3.  **Inicializace Firebase projektu v lokálním adresáři:**
    Přejděte do kořenového adresáře vašeho projektu (kde máte např. `package.json`) a spusťte:
    ```bash
    firebase init
    ```
    Tento příkaz vás provede několika otázkami:
    * Zeptá se, které Firebase služby chcete inicializovat (Vyberte **"Firestore"**).
    * Zeptá se, který Firebase projekt chcete propojit s tímto lokálním adresářem (Vyberte existující projekt).
    * Zeptá se na název souboru pro Firestore Security Rules (výchozí je `firestore.rules`). Potvrďte to.
    * Zeptá se, zda chcete nainstalovat závislosti npm pro Cloud Functions (pokud máte v plánu používat funkce, můžete to potvrdit).

    Po dokončení `firebase init` se ve vašem adresáři objeví soubory jako:
    * `firebase.json` (hlavní konfigurační soubor pro Firebase služby)
    * `firestore.rules` (váš hlavní soubor pro Firestore Security Rules)

4.  **Rozdělení pravidel do více souborů (jak jsme si popsali):**
    Teď, když máte `firestore.rules` a `firebase.json`, můžete ručně vytvořit složku `rules/` a rozdělit své `match` bloky do `users.rules`, `posts.rules` atd. a importovat je do `firestore.rules`.

5.  **Nasazení pravidel:**
    Jakmile máte pravidla hotová a uspořádaná, nahrajete je do Firebase pomocí:
    ```bash
    firebase deploy --only firestore:rules
    ```

**Výhody použití Firebase CLI pro pravidla:**

* **Verzování:** Můžete spravovat pravidla v Gitu, sledovat změny a vracet se k předchozím verzím.
* **Rozdělení souborů:** Přehlednost a organizace pro složitá pravidla.
* **Testování lokálně:** Firebase CLI má emulátory, které vám umožní testovat pravidla lokálně před nasazením.
* **Automatizace:** Možnost integrovat deploy pravidel do CI/CD pipeline.
* **Komplexní správa projektu:** CLI je brána k nasazování všech Firebase služeb.

Takže pro efektivní správu a rozdělení Firestore Security Rules je instalace a používání **Firebase CLI s příkazem `firebase init`** klíčová.

# Firebase deploy
`firebase deploy` je **klíčový příkaz v nástroji Firebase CLI (Command Line Interface)**, který slouží k **nasazení (deployment) vašeho lokálního kódu a konfigurací do vašeho Firebase projektu v cloudu.**

Je to jednorázový příkaz, který vezme vše, co jste si připravil/a lokálně pro různé Firebase služby, a nahraje to na servery Firebase, kde se to stane živým a dostupným.

### Co všechno `firebase deploy` může nasadit:

`firebase deploy` je velmi flexibilní a může nasadit různé aspekty vašeho Firebase projektu:

1.  **Firebase Hosting:**
    * Nahraje všechny statické soubory (HTML, CSS, JavaScript, obrázky) z vašeho lokálního `public` adresáře (nebo adresáře, který je určen v `firebase.json`) na servery Firebase Hosting.
    * Zpřístupní vaši webovou aplikaci na Firebase URL (např. `vas-projekt-id.web.app`) a případně i na vaší vlastní doméně.

2.  **Cloud Functions for Firebase:**
    * Nahraje váš kód funkcí (napsaných v Node.js, Pythonu, Go atd.) do Google Cloud Functions.
    * Zpřístupní tyto funkce pro volání z vaší aplikace, z HTTP požadavků nebo jako triggery na události v Firebase/Google Cloud (např. při zápisu do Firestore, při nahrání souboru do Cloud Storage).

3.  **Cloud Firestore Security Rules:**
    * Nahraje vaše definovaná bezpečnostní pravidla (soubory `firestore.rules` a všechny importované soubory) do vašeho Firestore projektu.
    * Tato pravidla pak určují, kdo a jakým způsobem může číst a zapisovat data do vaší databáze.

4.  **Realtime Database Security Rules:**
    * Podobně jako u Firestore, nahraje pravidla pro Realtime Database.

5.  **Cloud Storage Security Rules:**
    * Nahraje pravidla pro přístup k souborům ve vašem Cloud Storage (Firebase Storage).

6.  **Firebase Remote Config:**
    * Nasadí vaše definované parametry pro Remote Config, které pak může vaše aplikace dynamicky načítat a měnit své chování bez nutnosti aktualizace aplikace.

7.  **Firebase Extensions:**
    * Umožňuje nasadit lokální konfiguraci rozšíření.

### Jak `firebase deploy` funguje:

1.  **Autentizace:** Před spuštěním `firebase deploy` musíte být přihlášen/a k Firebase CLI (`firebase login`).
2.  **Konfigurace `firebase.json`:** Příkaz se řídí nastavením ve vašem souboru `firebase.json`. Tento soubor definuje, které části vašeho projektu se mají nasadit, odkud se mají brát soubory, jaké jsou rewrite pravidla pro hosting atd.
3.  **Zkompilování a ověření:** Pro některé služby (jako Security Rules nebo Cloud Functions) se provede kompilace a základní ověření kódu/pravidel.
4.  **Nahrání souborů:** Lokální soubory se nahrají na servery Firebase/Google Cloud.
5.  **Aktivace:** Po úspěšném nahrání a zpracování se nové verze služeb aktivují.

### Příklad použití:

* **Standardní deploy všeho:**
    ```bash
    firebase deploy
    ```
    (Nasazení všeho, co je nakonfigurováno v `firebase.json`)

* **Deploy pouze specifických služeb (doporučeno pro rychlejší deploy a snížení rizika):**
    ```bash
    firebase deploy --only hosting
    ```
    (Nasazení pouze hostingových souborů)

    ```bash
    firebase deploy --only functions
    ```
    (Nasazení pouze Cloud Functions)

    ```bash
    firebase deploy --only firestore:rules
    ```
    (Nasazení pouze Firestore Security Rules)

    ```bash
    firebase deploy --only hosting,functions,firestore:rules
    ```
    (Nasazení hostingu, funkcí a Firestore pravidel najednou)

`firebase deploy` je tedy centrální příkaz pro publikování změn z vašeho lokálního vývojového prostředí do vašeho živého Firebase projektu.
