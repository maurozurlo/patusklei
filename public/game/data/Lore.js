// ---------------------------------------------------------------------------
// Lore — all narrative screens in one place, easy to edit.
//
// Each entry: { title, text, image?, next? }. `image` is OPTIONAL — set it to
// a path (e.g. 'images/ending_good.png') and MenuScene auto-loads it and shows
// it as a full-screen backdrop behind the text. Leave it out for text-only
// screens. `next` is where CONTINUAR goes: { scene, data } passed straight to
// scene.start() — only single-screen lore (played via showLoreScreen) needs it.
//
// LORE_SEQUENCES groups multi-screen runs (the endings). Edit the order/screens
// here; MenuScene just plays whatever list it's given. Their own screens don't
// need `next` — showLoreSequence walks the array itself and hands the credits
// roll off at the end.
//
// Loaded via <script> like the other data files (effectively the JSON you can
// hand-edit, no build step).
// ---------------------------------------------------------------------------
const LORE = {
    LEVEL_1_LORE: {
        title: 'Los Inicios',
        text: "Apreciado amigo Patus Klei, nacido en agosto de 1907. \nA los 16 años escuchó el llamado de la tierra de Cle. Construyó su bidet y zarpó.\nTraga el atún y los morrones.\nEvita las boyas.",
        next: { scene: 'GameScene', data: { level: 1 } }
    },
    LEVEL_2_LORE: {
        title: 'Tierra de Cle',
        text: "Patus Klei ha llegado a la Mítica Tierra de Cle. Debe enfrentarse al terrible planeamiento urbano y recorrer sus turbulentas calles. Evite las palomas y los autos.",
        next: { scene: 'GameScene', data: { level: 2 } }
    },
    BOSS_LORE: {
        title: 'La Batalla',
        text: "Patus finalmente ha llegado a la guarida del perito ventrilocuista Lars Wampiola. Esquive los zarpasos, espere a RMK.",
        next: { scene: 'GameScene', data: { level: 3 } }
    },

    // --- Victory reveal (shared first screen of both endings) ---
    BOSS_VICTORY: {
        title: 'Derrotado',
        text: "Lars Wampiola se desploma. Tras los hilos, sentado y tranquilo, aguarda Luis Guampiolar. Patus se acerca para batírsela."
    },

    // --- GOOD ending (>= 3 peppers) ---
    GOOD_ENDING_1: {
        image: 'images/good_ending_1.png',
        dialogue: [
            {
                speaker: 'PATUS',
                text: 'Uste es Lars Wampiola?'
            },
            {
                speaker: 'LARS',
                text: 'Si, pibe, qué queré?'
            },
            {
                speaker: 'PATUS',
                text: 'Vengo a firmar la paz, traigo morrone.'
            },
            {
                speaker: 'LARS',
                text: 'La paz no se puede firmar acá.\nPero podemos ir a China.'
            },
            {
                speaker: 'PATUS',
                text: 'Ta bien, llevo unas Fauna.'
            },
        ]
    },
    GOOD_ENDING_2: {
        image: 'images/good_ending_2.png',
        dialogue: [
            {
                speaker: 'LARS/PATUS',
                text: 'Vaffanculo!'
            }
        ]
    },
    GOOD_ENDING_3: {
        title: 'El final final',
        text: "Patus Klei junto a Rodolfa Muschi Klei derrotaron a Lars Wampiola.\nGran juego muchachito, gracias por jugar a PATUS KLEI."
    },

    // --- BAD ending (< 3 peppers) — MOCK copy, replace with your lines ---
    BAD_ENDING_1: {
        image: 'images/bad_ending_1.png',
        dialogue: [
            {
                speaker: 'PATUS',
                text: 'Uste es Lars Wampiola?'
            },
            {
                speaker: 'LARS',
                text: 'Y los morrone?'
            },
            {
                speaker: 'PATUS',
                text: 'Eh?'
            },
            {
                speaker: 'LARS',
                text: 'No se puede ahora viejo.'
            },
            {
                speaker: 'PATUS',
                text: 'Weno, ta bien, seguiremo la batalla.'
            },

        ]
    },
    BAD_ENDING_2: {
        image: 'images/bad_ending_2.png',
        dialogue: [
            {
                speaker: 'LARS/PATUS',
                text: 'Kevaser.'
            }
        ]
    },
    BAD_ENDING_3: {
        title: 'Un final',
        text: 'Nadie nunca supo qué fue de Patus Klei.\nRodolfa Muschi Klei se retiró a su mansión y Lars Wampiola volvió a su guarida.\n"Gracias" por jugar Patus Klei, pongale más guevo la prossima.',
    }
};

const PORTRAITS = {
    PATUS: 'images/portrait_patus.png',
    LARS: 'images/portrait_lars.png',
    'LARS/PATUS': 'images/portrait_lars_patus.png'
};

// Named ending sequences. Both open on the reveal, then diverge.
const LORE_SEQUENCES = {
    good: ['BOSS_VICTORY', 'GOOD_ENDING_1', 'GOOD_ENDING_2', 'GOOD_ENDING_3'],
    bad: ['BOSS_VICTORY', 'BAD_ENDING_1', 'BAD_ENDING_2', 'BAD_ENDING_3']
};
