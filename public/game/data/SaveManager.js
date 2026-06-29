// ---------------------------------------------------------------------------
// SaveManager — tiny localStorage savegame (single JSON blob).
//
// {
//   timesPlayed:     total runs started (INICIAR JUEGO)
//   peppersPickedUp: bell peppers collected in the CURRENT run. Resets when a
//                    new game starts. Drives boss hearts (3 + peppers) and the
//                    good/bad ending (>= GOOD_ENDING_PEPPERS = good). It HAS to
//                    be per-run, else it would max out after a few plays.
//   levelsUnlocked:  levels reached so far, e.g. [1,2,3] (for a future select)
//   endingsUnlocked: ['good'|'bad'] endings seen
// }
//
// `Save` caches the blob in memory (so it survives scene transitions) and writes
// through to localStorage on every change. All access is fault-tolerant — if
// storage is unavailable the game just runs with in-memory defaults.
// ---------------------------------------------------------------------------
const SAVE_KEY = 'patusklei_save';
const GOOD_ENDING_PEPPERS = 3; // >= this (in the current run) = good ending

const Save = {
    defaults() {
        return { timesPlayed: 0, peppersPickedUp: 0, levelsUnlocked: [1], endingsUnlocked: [] };
    },

    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return this.defaults();
            // Merge over defaults so older/partial saves gain new fields.
            return Object.assign(this.defaults(), JSON.parse(raw));
        } catch (e) {
            return this.defaults();
        }
    },

    get() {
        if (!this._data) this._data = this.load();
        return this._data;
    },

    persist() {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.get())); } catch (e) { /* ignore */ }
        return this._data;
    },

    // --- Run lifecycle -------------------------------------------------------
    startNewGame() {
        const d = this.get();
        d.timesPlayed += 1;
        d.peppersPickedUp = 0; // fresh run
        this.persist();
    },

    addPepper() {
        this.get().peppersPickedUp += 1;
        this.persist();
    },

    getPeppers() { return this.get().peppersPickedUp; },

    isGoodEnding() { return this.getPeppers() >= GOOD_ENDING_PEPPERS; },

    unlockLevel(n) {
        const d = this.get();
        if (!d.levelsUnlocked.includes(n)) {
            d.levelsUnlocked.push(n);
            d.levelsUnlocked.sort((a, b) => a - b);
            this.persist();
        }
    },

    unlockEnding(name) {
        const d = this.get();
        if (!d.endingsUnlocked.includes(name)) {
            d.endingsUnlocked.push(name);
            this.persist();
        }
    },

    // The game has been beaten at least once if any ending has been reached
    // (unlockEnding fires when the boss is defeated). Gates the menu level-select.
    isGameCompleted() { return this.get().endingsUnlocked.length > 0; },
};
