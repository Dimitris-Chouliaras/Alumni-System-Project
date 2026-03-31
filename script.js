// η fetch θεωρείται AJAX - Είναι ασύγχρονη και επικοινωνεί με XML και JSON αρχεία.
// Το AJAX (Asynchronous JavaScript and XML) δεν είναι μια συγκεκριμένη εντολή, αλλά μια τεχνική.
// Σημαίνει: «φορτώνω δεδομένα στο παρασκήνιο χωρίς να κάνω ανανέωση της σελίδας».
// Παλαιότερα, ο μόνος τρόπος να το κάνεις ήταν το αντικείμενο XMLHttpRequest (XHR).
// Σήμερα, ο σύγχρονος τρόπος να κάνεις ακριβώς το ίδιο πράγμα είναι η fetch.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Σύνδεση με τα στοιχεία της HTML - δημιουργούμε "γέφυρες" ανάμεσα στα στοιχεία του index.html και στον κώδικα της JavaScript
    const btnXml = document.getElementById('btn-xml');
    const btnJson = document.getElementById('btn-json');
    const btnClear = document.getElementById('btn-clear');
    const displayArea = document.getElementById('display-area');
    const dareIt = document.getElementById('btn-surprise');

    // 2. Συνάρτηση Καθαρισμού του δεξιού div - displayArea.innerHTML είναι η ιδιότητα που ελέγχει το περιεχόμενο μέσα στο δεξί div
    const clearDisplay = () => {
        displayArea.innerHTML = '<p>Η περιοχή καθαρίστηκε. Επιλέξτε μια νέα ενέργεια...</p>'; // "πετάει" ό,τι υπήρχε πριν και βάζει στη θέση τους το νέο μήνυμα
    };

    // 3. Δυναμική συσχέτιση της συνάρτησης με το click (Event Listener) - btnClear: Το κουμπί,  'click': Το γεγονός (event), clearDisplay: Η συνάρτηση που θέλουμε
    btnClear.addEventListener('click', clearDisplay);

    // 4. Φόρτωση XML αρχείου με AJAX
    btnXml.addEventListener('click', () => {
        // Πάντα καθαρίζουμε το δεξί πλαίσιο πριν φέρουμε τα νέα δεδομένα
        clearDisplay(); // Αυτόματος καθαρισμός πριν τη φόρτωση
        
        fetch('alumni.xml') // Στέλνει ένα αίτημα στον server για να φέρει το αρχείο
            .then(response => response.text()) // Επειδή το XML είναι στην ένα μεγάλο κείμενο, λέμε στη JavaScript να το διαβάσει πρώτα ως raw text
            .then(xmlString => { // Η JavaScript δεν μπορεί να καταλάβει το κείμενο XML απευθείας, οπότε
                const parser = new DOMParser(); // Ένα εργαλείο που παίρνει το κείμενο και το μετατρέπει σε XML Document object
                const xmlDoc = parser.parseFromString(xmlString, "text/xml"); // Τώρα που είναι αντικείμενο, μπορούμε να ψάξουμε μέσα του και να βρούμε όλα τα tags
                const alumni = xmlDoc.getElementsByTagName('alumnus'); // Πήγαινε και μάζεψε όλα τα στοιχεία που έχουν το όνομα tag alumnus
                
                let html = "<h2>Δεδομένα Αποφοίτων (XML)</h2>"; // Δημιουργούμε μια μεταβλητή κειμένου που θα "χτίσει" την HTML που θα εμφανίσουμε
                
                // Μετατροπή σε Array για χρήση της forEach
                Array.from(alumni).forEach(alumnus => {
                    // Διάβασμα Attribute (id)
                    const id = alumnus.getAttribute('id'); // Τραβάμε την τιμή που βρίσκεται ΜΕΣΑ στο tag (π.χ. <alumnus id="A001">)
                    
                    // Διάβασμα στοιχείων από διάφορα βάθη - getElementsByTagName: Ψάχνουμε το tag 'firstname'.
                    const fname = alumnus.getElementsByTagName('firstname')[0].textContent; // [0]: Παίρνουμε το πρώτο (και μοναδικό) στοιχείο της λίστας που επιστρέφει.
                    const lname = alumnus.getElementsByTagName('lastname')[0].textContent; // .textContent: Παίρνουμε το καθαρό κείμενο που βρίσκεται ανάμεσα στα tags.
                    
                    // Βάθος: current_address -> city - Εδώ υλοποιούμε την απαίτηση για περαιτέρω βάθος
                    const city = alumnus.getElementsByTagName('current_address')[0] // Πρώτα βρίσκουμε το 'current_address' και 
                                        .getElementsByTagName('city')[0].textContent; // και ΜΕΣΑ σε αυτό ψάχνουμε το 'city'
                    
                    // Πολλαπλότητα: Διάβασμα του πρώτου τηλεφώνου phone - Εδώ υλοποιούμε την απαίτηση για πολλαπλότητα
                    const firstPhone = alumnus.getElementsByTagName('phone')[0].textContent; //Παίρνουμε το 1ο τηλέφωνο από τη λίστα των tags 'phone' που υπάρχουν στον απόφοιτο

                    // Πολλαπλότητα και Βάθος - Παίρνουμε το 2ο social με βαθος 3 συνολικά
                    const linkedin = alumnus.getElementsByTagName('contact')[0]
                                          .getElementsByTagName('social_networks')[0]
                                          .getElementsByTagName('social')[1].textContent;

                    // Template Literals (``): Προσθέτουμε στο κεντρικό κείμενο 'html' ένα block κώδικα HTML για κάθε απόφοιτο
                    html += `
                        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                            <p><strong>ID Αποφοίτου:</strong> ${id}</p>
                            <p><strong>Ονοματεπώνυμο:</strong> ${fname} ${lname}</p>
                            <p><strong>Πόλη Διαμονής:</strong> ${city}</p>
                            <p><strong>Τηλέφωνο Επικοινωνίας:</strong> ${firstPhone}</p>
                            <p><strong>Linkedin:</strong> <a href="${linkedin}" target="_blank" style="color: #3498db;">${"Το προφιλ μου"}</a></p>
                        </div>`;
                });
                displayArea.innerHTML = html; // Εμφάνιση των δεδομένων στο UI
            })
            .catch(err => { // .catch: Αν το αρχείο δεν βρεθεί ή έχει συντακτικό λάθος, εμφανίζουμε ένα μήνυμα σφάλματος στον χρήστη
                displayArea.innerHTML = "<p style='color:red;'>Σφάλμα κατά τη φόρτωση του XML.</p>";
                console.error(err);
            });
    });

    // 5. Φόρτωση JSON αρχείου με AJAX
    btnJson.addEventListener('click', () => {
        // Πάντα καθαρίζουμε το δεξί πλαίσιο πριν φέρουμε τα νέα δεδομένα
        clearDisplay(); // Αυτόματος καθαρισμός πριν τη φόρτωση
        
        fetch('alumni.json') // Στέλνει ένα αίτημα στον server για να φέρει το αρχείο
            .then(response => response.json())// .json(): Αυτή η εντολή μετατρέπει το κείμενο του αρχείου απευθείας σε αντικείμενο JavaScript (Object) χωρίς ανάγκη για Parser.
            .then(data => { // το σημείο όπου τα δεδομένα έχουν φτάσει πλέον στον υπολογιστή του χρήστη και η JavaScript είναι έτοιμη να τα επεξεργαστεί
                let html = "<h2>Δεδομένα Αποφοίτων (JSON)</h2>"; // Δημιουργούμε την επικεφαλίδα για το δεξί div
                
                // Πρόσβαση στη λίστα των αποφοίτων (Array) - Μπαίνουμε στο κεντρικό αντικείμενο 'alumni_system'
                const list = data.alumni_system.alumni_list; // Παίρνουμε τον πίνακα (Array) 'alumni_list'.

                // Για κάθε απόφοιτο (alumnus) μέσα στη λίστα, εκτελούμε τα παρακάτω:
                list.forEach(alumnus => {
                    // Διάβασμα Objects από διάφορα βάθη
                    // Διάβασμα από βάθος: Χρησιμοποιούμε την τελεία (.) για να μπούμε μεσα στα αντικείμενα. Εδώ: alumnus -> personal_info -> firstname.
                    const fullName = `${alumnus.personal_info.firstname} ${alumnus.personal_info.lastname}`;
                    const grade = alumnus.academic_info.degree_grade; // Παίρνουμε τον βαθμό πτυχίου από το αντικείμενο academic_info
                    
                    // Διάβασμα από πίνακα (τελευταίος εργοδότης στο employment_history)
                    const history = alumnus.employment_history;
                    const lastEmployer = history[history.length - 1].employer;

                    //Διαβασμα του 2ου social link δηλαδή το linkedin μιας και είναι πάντα το 2ο
                    // Πηγαίνουμε: alumnus -> contact -> social_networks -> 2ο στοιχείο [1] -> url
                    const linkedin = alumnus.contact.social_networks[1].url;

                    // Χτίζουμε την HTML εμφάνιση για τον συγκεκριμένο απόφοιτο
                    html += `
                        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                            <p><strong>Απόφοιτος:</strong> ${fullName}</p>
                            <p><strong>Βαθμός Πτυχίου:</strong> ${grade}</p>
                            <p><strong>Τρέχουσα/Τελευταία Απασχόληση:</strong> ${lastEmployer}</p>
                            <p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank" style="color: #0077b5;">Το προφίλ μου</a></p>
                        </div>`;
                });
                // Εμφανίζουμε όλο το "πακέτο" των αποφοίτων στο δεξί div
                displayArea.innerHTML = html;
            })
            // .catch: Αν π.χ. ξεχάσεις ένα κόμμα στο JSON και το αρχείο "σπάσει",
            // θα τρέξει αυτός ο κώδικας για να μην "παγώσει" η σελίδα.
            .catch(err => {
                displayArea.innerHTML = "<p style='color:red;'>Σφάλμα κατά τη φόρτωση του JSON.</p>";
                console.error(err);
            });
    });
// 6. Surprise Button Logic - Flash Effect (Fixed Rendering)
dareIt.addEventListener('click', () => {
    const rightPanel = document.getElementById('right-panel');
    const leftPanel = document.getElementById('left-panel');
    const displayArea = document.getElementById('display-area');

    // 1. Αλλάζουμε τα χρώματα ΑΜΕΣΩΣ
    leftPanel.style.backgroundColor = "black";
    rightPanel.style.backgroundColor = "black";
    rightPanel.style.color = "red";
    displayArea.innerHTML = "<h1 style='text-align:center; margin-top:100px;'>SYSTEM 32 DELETING... 0%... 50%... 99%...</h1>";

    // 2. Δίνουμε 100ms στον browser να "βάψει" τη σελίδα πριν πετάξει το alert
    setTimeout(() => {
        alert("Όντως το τολμήσατε; Φανταστείτε να έτρεχα ένα script που διέγραφε το System32! 💀");

        // 3. Επαναφορά ΜΕΤΑ το alert
        leftPanel.style.backgroundColor = "#2c3e50"; 
        rightPanel.style.backgroundColor = "#ecf0f1"; 
        rightPanel.style.color = "black";
        displayArea.innerHTML = "<p>Η περιοχή επανήλθε. Τα αρχεία σας είναι ασφαλή. Επιλέξτε μια νέα ενέργεια.</p>";}, 750); // <-- Εδώ ορίζεις τον χρόνο σε ms
});
});