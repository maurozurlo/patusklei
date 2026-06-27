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
        text: "Apreciado amigo Patus Klei, nacido en agosto de 1907. A los 16 años escuchó el llamado de la tierra de Cle. Construyó su bidet y zarpó. Traga el atún y los morrones. Evita las boyas."
    },
    LEVEL_2_LORE: {
        title: 'Ciudad de Cle',
        text: "Patus Klei ha llegado a la mitica ciudad de Cle. Debe enfrentarse al terrible planeamiento urbano y recorrer sus turbulentas calles."
    },
    BOSS_LORE: {
        title: 'la Triple Panera',
        text: "Patus finalmente ha llegado a la guarida del perito ventrilocuista Lars Wampiola. Esquiva los proyectiles, usa la mandarina."
    },

    // --- Victory reveal (shared first screen of both endings) ---
    BOSS_VICTORY: {
        title: 'El Titiritero',
        text: "La marioneta se desploma entre chispas. Tras los hilos, sentado y tranquilo, aguarda Lars Wampiola — el verdadero titiritero. Patus se acerca para encararlo."
    },

    // --- GOOD ending (>= 3 peppers) ---
    GAME_COMPLETED: {
        title: 'Victoria: Patus Klei',
        text: "Patus Klei derrotó a Lars Wampiola, perdió un ojo, una uvula, una vesícula y tres dedos del pie que reemplazó heróicamente con corchos. Bien jugado"
    },
    TRUE_ENDING: {
        title: 'El final de verdad',
        text: "Patus Klei encontró a Rodolfa Muschi Klei, su fiel mascota y amiga, Patus vivirá feliz y firmará la paz con Lars Wampiola en china. Gran juego muchachito, gracias por jugar a PATUS KLEI."
    },

    // --- BAD ending (< 3 peppers) — MOCK copy, replace with your lines ---
    BAD_ENDING_1: {
        title: 'Sin Morrones',
        text: "Patus venció a Lars, pero sin suficientes morrones su bidet quedó sin fuerzas en mitad del regreso. (MOCK — texto pendiente)"
    },
    BAD_ENDING_2: {
        title: 'Un final agridulce',
        text: "Cle lo recuerda como un héroe cansado. Quizás con más morrones la próxima vez. Gracias por jugar a PATUS KLEI. (MOCK — texto pendiente)"
    }
};

// Named ending sequences. Both open on the reveal, then diverge.
const LORE_SEQUENCES = {
    good: ['BOSS_VICTORY', 'GAME_COMPLETED', 'TRUE_ENDING'],
    bad:  ['BOSS_VICTORY', 'BAD_ENDING_1', 'BAD_ENDING_2']
};
