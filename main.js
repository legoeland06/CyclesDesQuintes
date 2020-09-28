// Déclaration principale des variables
var cv, ctx, ctx_centre, tmr,
    mSizeNew, mSize, mSizeInt, mSize_centre, rect, rect_centre,
    k, a, ap, av, x, y, e,
    whitch, monEvent, chordEvent, cadre,
    list_buttons,

    byWhat = 'tones',
    actualisable = true,
    lesDegresByTons = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
    lesDegresByQuintes = ['IV', 'I', 'V', 'II', 'VI', 'III', 'VII'],
    gammeMajeur = ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    gammeMajeurByTon = ['C', 'Db', 'D', 'Eb', 'E', 'F',
        'F#', 'G', 'Ab', 'A', 'Bb', 'B'
    ],
    cycleQuintes = [
        'F', 'C', 'G', 'D', 'A', 'E', 'B',
        'F#', 'Db', 'Ab', 'Eb', 'Bb'
    ],
    lesModes = ['ionien', 'dorien', 'phrygien', 'lydien', 'mixolydien', 'aeolien', 'locrien'],
    ngCycleQuintes = [
        'G', 'C', 'F', 'Bb', 'Eb', 'Ab',
        'Bb', 'F#', 'B', 'E', 'A', 'D'
    ],
    chordScaleMajByQuintes = [
        'Maj7', 'Maj7', '7', 'min7',
        'min7', 'min7', 'min7/b5'
    ],
    chordScaleMajByTones = [
        'Maj7', 'min7', 'min7', 'Maj7',
        '7', 'min7', 'min7/b5'
    ],
    ngAccordGammeMajeur = [
        'min', 'min', 'm6', '6',
        '6', '6', '7'
    ];

const n = 12,
    zeAngle = Math.PI / (n * 24),
    ima = new Image(),
    ima_centre = new Image();

renvoisGamMajur = () => {
    let myRetour = [];
    for (let i = 0; i <= 2; i++) myRetour.push(gammeMajeurByTon[i * 2]);
    myRetour.push(gammeMajeurByTon[+5]);
    myRetour.push(gammeMajeurByTon[+7]);
    myRetour.push(gammeMajeurByTon[+9]);
    myRetour.push(gammeMajeurByTon[+11]);

    return myRetour;
}

quelleSuite = () => {
    switch (byWhat) {
        case 'quintes':
            sophia.innerText = "Gamme : | " + gammeMajeurByTon[0] + chordScaleMajByTones[0] + " |";
            afficheGamme(gammeMajeurByTon[0]);
            return ([gammeMajeurByTon, lesDegresByTons, chordScaleMajByTones]);
            break;
        case 'tones':
            sophia.innerText = "Ordre des Quintes, Tonalité : | " + cycleQuintes[1] + " Majeur |";
            return ([cycleQuintes, lesDegresByQuintes, chordScaleMajByQuintes]);
            break;
        default:
            break;
    }
}
sophia = document.getElementById('pulse');
sophia.onclick = () => {
    if (byWhat == 'tones') byWhat = 'quintes';
    else if (byWhat = 'quintes') byWhat = 'tones';
    actualise_accords(...quelleSuite());
    afficheGamme(gammeMajeurByTon[0], 1, 0);
}

// fonction qui détermine laquelle des longueur est supérieure à l'autre et renvoie la plus petite
lequel = () => {
    if (window.innerWidth > window.innerHeight) return window.innerHeight;
    else return window.innerWidth;
}

// Fonction qui fait tourner les disques 'g' Grand(circonférence) ou 'p' Petit(central)
Dwr = () => {
    actualisable = true;
    console.log('Dwr_début() : ' + actualisable);

    switch (whitch) {
        case 'g':
            context = ctx;
            clearGrandDisque();
            context.rotate(a * 4);
            dessineDisque(context);
            if (++k >= n + 1) {
                k = 1;
                clearInterval(tmr);
                if (x - cadre.width / 2.0 >= 0) decale_droite();
                else decale_gauche();
                // actualise les accords avec le nouveau cycleQuintes décalé
                //actualise_accords(cycleQuintes);
                console.log(actualisable);
                if (actualisable) {
                    actualise_accords(...quelleSuite());
                    afficheGamme(gammeMajeurByTon[0], 1, 0);
                    console.log('Dwr : actualisable');
                    actualisable = false;
                }
            }
            cv.removeEventListener('click', monEvent);
            break;
        case 'p':
            context = ctx_centre;
            context.rotate(a * 4);
            dessineDisque(context);
            if (++k >= n + 1) {
                k = 1;
                clearInterval(tmr);
                if (x - cadre.width / 2.0 <= 0) decale_droite();
                else decale_gauche();
                // actualise les accords avec le nouveau cycleQuintes décalé
                //actualise_accords(cycleQuintes);
                console.log(actualisable);
                if (actualisable) {
                    actualise_accords(...quelleSuite());
                    afficheGamme(gammeMajeurByTon[0], 1, 0);
                    console.log('Dwr : actualisable');
                    actualisable = false;
                }
            }
            cv_centre.removeEventListener('click', monEvent);
            break;
        default:
            break;
    }
}

// Fonction qui affiche les accords en dessous des disques pour plus de lisibilité
actualise_accords = (notes, deg, scale) => {
    accords = document.getElementById('accords'),
        accords.style.marginTop = (mSizeInt + 30) + 'px';
    const buttons = document.getElementById('btn-tirroir');
    list_buttons = buttons.children;
    if (notes == gammeMajeurByTon) {
        notes = renvoisGamMajur();
    }

    for (let i = 0; i <= 6; i++) {
        // Propriétés d'un seul boutons, répétée aux 7 boutons de position i
        list_buttons[i].style.padding = "1rem",
            list_buttons[i].style.marginRight = "1rem",
            list_buttons[i].style.width = "8rem",
            list_buttons[i].style.maxWidth = "15rem",
            list_buttons[i].innerText = deg[i] + '\n' + notes[i] + scale[i],
            list_buttons[i].addEventListener('click', buttClic => {
                afficheGamme(notes[i], parseInt(list_buttons[i].id), i);
            });
    }
    actualisable = false;
}

afficheGamme = (tonale, id, num) => {
    var sue, modes,
        caty = document.getElementById('infos-scale');
    switch (byWhat) {
        case 'tones':
            sue = aGaucheQuintes(id - 1, renvoisGamMajur()).slice(0, 7);
            modes = lesModes[id - 1];
            break;
        case 'quintes':
            sue = aGaucheQuintes(num, renvoisGamMajur()).slice(0, 7);
            modes = lesModes[num];
            break;
        default:
            break;
    }
    caty.innerText = 'Mode : ' + modes + ', Tonale ' + tonale + ' : ' + sue.join('  ,  ');
}

// fonction qui met en évidence l'harmonie négative ( à implémenter )
ngHarmony = () => {
    ctx.beginPath(),
        // lignes mirroirs
        ctx.moveTo(0, -mSize_centre / 2.0),
        ctx.lineTo(0, mSize_centre / 2.0),

        ctx.moveTo(-mSize_centre / 2.0, 0),
        ctx.lineTo(mSize_centre / 2.0, 0),
        // fin de lignes mirroirs

        ctx.lineWidth = 36,
        ctx.strokeStyle = '#fff',
        ctx.stroke();
}

// Fonction de gestion des différents clics sur les disques
gestionClics = () => {
    //Observateurs d 'événements click sur le grand disque
    cv.addEventListener('click', monEvent => {
        whitch = 'g';
        animeTourne(monEvent, rect);
    }, true);
    //Observateurs d 'événements click sur le petit disque
    cv_centre.addEventListener('click', monEvent => {
        whitch = 'p';
        animeTourne(monEvent, rect);
    }, true);
    console.log("Gestionclics(): " + actualisable);
}

transfDisques = () => {
    cv.style.transform = cv_centre.style.transform = 'scale(' + (mSizeNew * 1.00 / mSize) + ',' + (mSizeNew * 1.00 / mSize) + ')';
    cv.style.transform = cv_centre.style.transform = 'translate(' + (mSizeNew - mSize) + ',' + (mSizeNew - mSize) + ');';
}

longOuLarge = () => {
    if (mSize > lequel() * .80) {
        mSizeNew = lequel() - lequel() * .10;
    }
}

// fonction qui gère les resizing et replace autant que faire ce peut les disques au centre de l'écran
window.onresize = () => {
    longOuLarge();
    transfDisques();
}

window.ondeviceorientation = window.ondeviceorientationabsolute = () => ini();
// Fonction d'entréé du programme à l'actualisation
Ini = () => {
    mSize = lequel();
    mSizeInt = mSize - 50, mSize_centre = mSizeInt / 1.75,
        k = 1,
        ap = "Cliquez pour tourner les disques", av = ap;

    // positionnement du corps principal
    const rec_cv = document.getElementById('rec_cv');
    rec_cv.style.position = 'absolute';
    rec_cv.style.left = '20px';

    /* Sélection du canvas correspondant au grand disque */
    cv = document.getElementById('cv'),
        cv.width = cv.height = mSizeInt, cv.title = ap,
        cv.style.position = "inherit",
        rect = cv.getBoundingClientRect(),
        ctx = cv.getContext('2d');

    // translation du grand disque par rapport à l'écran
    ctx.translate(mSizeInt / 2.0, mSizeInt / 2.0),
        ima.src = 'Cycle_de_quintes_fond.png',
        // Au chargement de l'image, on l'affiche à l'écran
        ima.onload = () => {
            dessineDisque(ctx);
        }

    /* Sélection du canvas correspondant au disque central  */
    cv_centre = document.getElementById('centre'),
        cv_centre.width = cv_centre.height = mSize_centre,
        cv_centre.title = ap,

        cv_centre.style.position = "inherit",
        cv_centre.style.width = "auto",
        // ajustement précis pour être au centre du grand disque
        cv_centre.style.left = (mSizeInt * 16.00 / 75) + 'px',
        cv_centre.style.top = (mSizeInt * 16.00 / 75) + 'px',

        cv_centre.style.opacity = ".8",

        rect_centre = cv_centre.getBoundingClientRect(),
        ctx_centre = cv_centre.getContext('2d');

    ctx_centre.translate(mSize_centre / 2, mSize_centre / 2),
        ima_centre.src = 'Cycle_de_quintes_centre1.png',
        // Au chargement de l'image, on l'affiche à l'écran
        ima_centre.onload = () => {
            dessineDisque(ctx_centre);
            ngHarmony(); // affichage des ligne d'harmonie négative
        }

    actualise_accords(...quelleSuite());
    afficheGamme(gammeMajeurByTon[0], 1, 1);
    gestionClics();
    console.log('ini(): ' + actualisable);
}

// Fonctions qui Travaillent sur les accords : décallage à droite ou à gauche
decale_droite = () => {
    cycleQuintes = aGaucheQuintes(1, cycleQuintes);
    gammeMajeurByTon = aDroiteQuintes(5, gammeMajeurByTon);
}
decale_gauche = () => {
    CycleQuintes = aDroiteQuintes(1, cycleQuintes);
    gammeMajeurByTon = aGaucheQuintes(5, gammeMajeurByTon);

}

droiteOuGauche = (monEvent, cad) => {
    cadre = cad,
        x = monEvent.clientX - cadre.left,
        y = monEvent.clientY - cadre.top;
    if (x - cadre.width / 2.0 >= 0) return 'clicD';
    else return 'clicG';
}

animeTourne = (monEvent, cad) => {
    actualisable = true;
    switch (droiteOuGauche(monEvent, cad)) {
        case 'clicD':
            a = zeAngle;
            break;
        case 'clicG':
            a = -zeAngle;
            break;
        default:
            break;
    }
    k = 1;
    clearInterval(tmr);
    tmr = setInterval('Dwr();ngHarmony();', 5);
    //actualisable = false;
}

// Efface le grand disque pour le redessinner
clearGrandDisque = () => {
    context.clearRect(-mSizeInt / 2.0, -mSizeInt / 2.0, mSizeInt, mSizeInt);
}

// Redessine les disques ctx ou ctx_centre
dessineDisque = (lecontext) => {
    switch (lecontext) {
        case ctx:
            lecontext.drawImage(ima, -mSizeInt / 2.0, -mSizeInt / 2.0, mSizeInt, mSizeInt);
            break;
        case ctx_centre:
            lecontext.drawImage(ima_centre, -mSize_centre / 2.0, -mSize_centre / 2.0, mSize_centre, mSize_centre);
            break;
        default:
            break;
    }
}

aGaucheQuintes = (position, tableau) => {
    var sue = tableau.slice(position);
    var aud = tableau.slice(0, position);
    var result = sue.concat(aud);
    return result;
}

aDroiteQuintes = (position, tableau) => {
    for (let i = 0; i < position; i++) {
        tableau.unshift(tableau[tableau.length - 1]);
        tableau.pop();
    }
    return tableau;
}