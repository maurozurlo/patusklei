// ---------------------------------------------------------------------------
// Lore — all narrative screens in one place, easy to edit.
//
// Each entry: { title, text, image? }. `image` is OPTIONAL — set it to a path
// (e.g. 'images/ending_good.png') and MenuScene auto-loads it and shows it as a
// full-screen backdrop behind the text. Leave it out for text-only screens.
//
// LORE_SEQUENCES groups multi-screen runs (the endings). Edit the order/screens
// here; MenuScene just plays whatever list it's given.
//
// Loaded via <script> like the other data files (effectively the JSON you can
// hand-edit, no build step).
// ---------------------------------------------------------------------------
const LORE = {
    LEVEL_1_LORE: {
        title: 'Los Inicios',
        text: "Apreciado amigo Patus Klei, nacido en agosto de 1907. \nA los 16 años escuchó el llamado de la tierra de Cle. Construyó su bidet y zarpó.\nTraga el atún y los morrones.\nEvita las boyas."
    },
    LEVEL_2_LORE: {
        title: 'Ciudad de Cle',
        text: "Patus Klei ha llegado a la Mítica Tierra de Cle. Debe enfrentarse al terrible planeamiento urbano y recorrer sus turbulentas calles. Evite las palomas y los autos."
    },
    BOSS_LORE: {
        title: 'La Batalla de La Triple Panera',
        text: "Patus finalmente ha llegado a la guarida del perito ventrilocuista Lars Wampiola. Esquive los zarpasos, espere a RMK."
    },

    // --- Victory reveal (shared first screen of both endings) ---
    BOSS_VICTORY: {
        title: 'Derrotado',
        text: "Lars Wampiola se desploma. Tras los hilos, sentado y tranquilo, aguarda Luis Guampiolar. Patus se acerca para batírsela."
    },

    // --- GOOD ending (>= 3 peppers) ---
    GAME_COMPLETED: {
        title: 'Lars Guampiola y Patus Klei',
        text: `PATUS: Uste es Lars Wampiola?\nLARS: Si, pibe, qué queré?\nPATUS: Vengo a firmar la paz, traigo morrone.\nLARS: Viejo, la paz no se puede firmar acá. Pero si quiere podemos ir a China.\nPATUS: Ta bien, llevo unas Fauna.\nLARS/PATUS: Vaffanculo!`
    },
    TRUE_ENDING: {
        title: 'El final final',
        text: "Patus Klei junto a Rodolfa Muschi Klei derrotaron a Lars Wampiola.\nGran juego muchachito, gracias por jugar a PATUS KLEI."
    },

    // --- BAD ending (< 3 peppers) — MOCK copy, replace with your lines ---
    BAD_ENDING_1: {
        title: 'Patu',
        text: `PATUS: Uste es Lars Wampiola?\nLARS: y los morrone?\nPATUS: Eh?\nLARS: No se puede ahora viejo.\nPATUS: Weno, ta bien, seguiremo la batalla.\nLARS/PATUS: Kevaser.`
    },
    BAD_ENDING_2: {
        title: 'Un final',
        text: 'Nadie nunca supo qué fue de Patus Klei. Rodolfa Muschi Klei se retiró a su mansión y Lars Wampiola volvió a su guarida. \\"Gracias\\" por jugar Patus Klei, pongale más esfuerzo la prossima',
    }
};

// Named ending sequences. Both open on the reveal, then diverge.
const LORE_SEQUENCES = {
    good: ['BOSS_VICTORY', 'GAME_COMPLETED', 'TRUE_ENDING'],
    bad: ['BOSS_VICTORY', 'BAD_ENDING_1', 'BAD_ENDING_2']
};
