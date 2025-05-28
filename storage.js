// npm install firebase

// Klientské SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Node.js modul pro práci se souborovým systémem
import { readFileSync } from 'fs';
import { join, dirname } from 'path'; // Přidejte 'dirname'
import { fileURLToPath } from 'url'; // Nový import!

// --- Získání __dirname ekvivalentu pro ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Váš stávající Firebase konfigurační objekt
const firebaseConfig = {
};

// Inicializace Firebase služeb
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "firestore-in-fb-pa1");
const auth = getAuth(app);
const storage = getStorage(app);

// --- Funkce pro nahrávání souboru ---
async function uploadFileToFirebaseStorage(filePath, destinationPathInStorage) {
    try {
        // 1. Přečtení souboru z disku Node.js serveru
        // readFileSync čte soubor synchronně. Pro větší soubory zvažte createReadStream a streamování.
        const fileBuffer = readFileSync(filePath);
        console.log(`Soubor ${filePath} načten o velikosti ${fileBuffer.length} bytů.`);

        // 2. Vytvoření reference na místo v Firebase Storage
        const storageRef = ref(storage, destinationPathInStorage);
        console.log(`Cílová cesta v Firebase Storage: ${destinationPathInStorage}`);

        // 3. Nahrání souboru
        // uploadBytes očekává Buffer, Blob nebo Uint8Array. readFileSync vrací Buffer.
        const snapshot = await uploadBytes(storageRef, fileBuffer);
        console.log('Soubor úspěšně nahrán do Firebase Storage!');
        console.log('Metadata nahrávání:', snapshot.metadata);

        // 4. Získání URL pro stažení souboru
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('URL pro stažení souboru:', downloadURL);

        return downloadURL;

    } catch (error) {
        console.error("Chyba při nahrávání souboru do Firebase Storage:", error);
        if (error.code === 'STORAGE/UNAUTHORIZED') {
            console.error("Zkontrolujte bezpečnostní pravidla Firebase Storage! Pravděpodobně nemáte oprávnění k zápisu.");
            console.error("Pro testování můžete dočasně nastavit pravidla na: allow read, write: if true;");
        } else if (error.code === 'ENOENT') {
             console.error("Chyba: Soubor nebyl nalezen na zadané cestě. Zkontrolujte cestu k souboru.");
        }
        return null;
    }
}

// --- Příklad použití pro testování ---
async function testFileUpload() {
    // Definujte cestu k souboru na vašem Node.js serveru
    // Ujistěte se, že soubor 'test-image.jpg' existuje ve stejné složce jako index.js
    // nebo zadejte absolutní cestu.
    //const localFilePath = join(__dirname, 'stavova_slovesa.pdf'); // Použijte __dirname pro relativní cesty
    const localFilePath = join('d:/aws.png');

    // Definujte cílovou cestu a název souboru v Firebase Storage
    const storageDestinationPath = 'uploads/aws.png'; // Složka 'uploads' a název 'stavova_slovesa.pdf'

    console.log("Spouštím test nahrávání souboru...");
    const uploadedUrl = await uploadFileToFirebaseStorage(localFilePath, storageDestinationPath);

    if (uploadedUrl) {
        console.log("Nahrání dokončeno. Soubor dostupný na:", uploadedUrl);
    } else {
        console.log("Nahrání selhalo.");
    }

    // Pro účely testování, můžete také zkusit přihlásit uživatele,
    // pokud vaše Storage pravidla vyžadují autentizaci.
    // Příklad:
    // try {
    //     await signInWithEmailAndPassword(auth, "test@example.com", "password123");
    //     console.log("Uživatel přihlášen.");
    //     const uploadedUrlAfterAuth = await uploadFileToFirebaseStorage(localFilePath, storageDestinationPath);
    //     if (uploadedUrlAfterAuth) {
    //         console.log("Nahráno po přihlášení:", uploadedUrlAfterAuth);
    //     }
    // } catch (e) {
    //     console.error("Chyba při přihlášení:", e.message);
    // } finally {
    //     await signOut(auth);
    //     console.log("Uživatel odhlášen.");
    // }
}

// Spustit testovací funkci
testFileUpload();
