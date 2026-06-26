# Boss Fight PRD — Patus vs. Lars Wampiola (Level 3)

> Status: **spec, not yet implemented.** Source of truth for the level-3 boss
> fight. Companion to the original idea in `boss_fight.md`. The static boss scene
> (background, floor, assembled puppet) is already baked in — see
> `public/game/managers/BossManager.js`.

---

## 1. Concept

The final fight. Lars Wampiola, a **puppet master**, controls a giant puppet
(the assembled monster). Patus stands his ground (no running) and uses the two
skills the game taught him — **jump** and **crouch** — to dodge the puppet's
hands, then baits each hand into a bomb to destroy it. With the puppet dead,
Patus runs right to confront Lars (who has been sitting there the whole time),
and the game ends with lore screens.

---

## 2. Player (Patus)

- **Idle**, not running, on the left side of the arena.
- Abilities: **jump** (avoid low attacks) and **crouch** (avoid high attacks).
- Standing is never safe — every hand attack hits a standing Patus.
- Hearts (health) — see §4.

---

## 3. The Puppet — hands & attacks

Two hands, each with one fixed attack and one safe response. The monster faces
the camera, so **filename L/R is the monster's own side, mirrored on screen** —
always map hands by behavior/position, not by the `_l`/`_r` suffix:

| Role | Asset (current static) | Screen pos (bake) | Attack hits | Safe response |
|---|---|---|---|---|
| **HIGH hand** | `boss_hand_l` | x≈222 (far from Patus) | standing **or** jumping | **CROUCH** |
| **LOW hand** | `boss_hand_r` | x≈89 (near Patus) | standing **or** crouching | **JUMP** |

Attack rules:
- **Twitch telegraph** before every attack (a short "wind-up" animation on the
  hand) so the player can read which dodge to make.
- **Strictly alternating / one at a time.** Never both hands at once. Leave a
  recovery gap after each attack long enough for Patus to **land from a jump
  before the next telegraph** (otherwise a jump-dodge gets caught by the next
  attack). This spacing is the #1 fairness/tuning knob.

---

## 4. Damage & hearts

- **Base hearts: 3.**
- **+1 heart per bell pepper (morrón) collected** across levels 1–2.
  - Requires **persisting the bell-pepper count across levels** (today
    `CoinManager` stats reset every level via `GameScene.init`). Store a running
    total somewhere persistent (localStorage or a small global game-state
    object) and read it at boss start.
- **Hand hit (failed dodge): −1 heart.**
- **Bomb blast hits Patus: −2 hearts.**
- **Invincibility frames** after taking damage (brief blink + no further damage)
  so a single hit/blast can't chain-drain multiple hearts.
- Hearts reach 0 → death → restart (see §7).

---

## 5. Bomb / Rodolfa mechanic (destroying the hands)

A hand is destroyed by baiting its own attack into a bomb. **Rodolfa the Mole**
(Patus's sidekick) delivers the bomb from a **shelf in the background** (new
background prop + Rodolfa drop animation — user to create).

Why the shelf: a ground bomb can't catch the HIGH hand (it never reaches the
floor). So:
- **LOW hand →** bomb on the **ground**. The low hand slams down into it; Patus
  **jumps** to avoid the slam (and the blast). Hand destroyed.
- **HIGH hand →** bomb on the **shelf**, at the high hand's sweep height. The
  high hand sweeps into it; Patus **crouches** under it. Hand destroyed.

Cadence:
1. **Phase 1** — both hands alternate. Patus survives **10 attacks**. Then a
   **counter to Rodolfa** ticks down, she appears at the shelf and drops the
   first bomb → first hand destroyed.
2. **Phase 2** — only the remaining hand attacks. Patus survives **5 attacks**
   (all from the same hand). Second bomb → second hand destroyed.
3. Puppet dies → victory sequence (§6).

- Bomb has a **visible timer**; if Patus is caught in the blast he takes −2
  hearts (so he must be doing the correct dodge when it goes off).
- **Counter-to-Rodolfa** should be shown on screen (anticipation/goal).

**Open / assumed:**
- Which hand falls first? Proposed: **LOW (ground) first, HIGH (shelf) second**.
  Confirm or set explicitly.
- Exact bomb blast hitbox vs. Patus (esp. the shelf bomb, which is in the
  background) — treat as tuning; confirm whether the shelf bomb can even hurt
  Patus or only the hand.

---

## 6. Victory sequence

- Both hands gone → puppet collapses/dies.
- Patus's **run animation re-enables**; he runs to the right toward
  `boss_sitting` (Lars). **No fight** there.
- **3 lore screens** (artwork optional/desired) then the game ends.
  - Likely reuse/expand existing `GAME_COMPLETED` + `TRUE_ENDING` lore in
    `MenuScene.getLoreText`; a 3rd screen's copy is TBD.

---

## 7. Death / restart

- 0 hearts → quick **fade out → restart the boss fight directly** (reload level
  3, **skip** the BOSS_LORE screen so retries aren't tedious).

---

## 8. Level 2 prerequisite — flying obstacle + crouch hint

The boss tests **crouch**, but crouch is currently never required anywhere
(level 2 only has cars you jump). Players can reach the finale never having
crouched, making the HIGH hand unreadable. Therefore, as part of this feature:

- Add a **flying obstacle** in level 2 that **must be crouched under** (needs a
  flying-obstacle sprite).
- Show a **one-time on-screen hint** the first time it appears (e.g. "↓ AGÁCHATE"
  / "↓ to duck").

---

## 9. UI

- **Hearts** display (top corner).
- **Counter to Rodolfa** (the 10 / 5 attack countdown) during each phase.
- **Remove the old `bossHealth` "HP:" text** in `UIManager` — the boss no longer
  has an HP counter; defeat is via the two hand destructions.

---

## 10. Scene layout (current static bake)

Bottom-center origin (0.5, 1) unless noted. Single source of truth:
`public/game/data/BossLayout.js` (shared by `BossManager`, `DebugScene`, and
`GameScene.preload`).

| Element | x | y | depth | notes |
|---|---|---|---|---|
| `bg_boss` | 160 | 100 | -100 | origin 0.5,0.5 |
| `boss_floor` | 160 | 200 | 1.5 | above body/sitting, below player |
| `boss_hand_l_twitch` (HIGH) | 233 | 196 | 0 | behind body; animated idle twitch |
| `boss_hand_r_twitch` (LOW) | 70 | 196 | 0 | behind body; animated idle twitch |
| `boss_body` | 154 | 200 | 1 | bobs (−3px, 1300ms) |
| `boss_head` | 154 | 94 | 2 | bobs (−4px, 1600ms, +400ms delay) |
| `boss_sitting` (Lars) | 275 | 193 | 2 | hidden until victory in the real fight |
| Patus | ~24–39 | ~184 | 10 | player start x is 24 today |
| shelf (NEW) | TBD | TBD | TBD | Rodolfa bomb-drop point (high-hand bomb) |

---

## 11. Required assets

### Images
| Asset | Status | Notes |
|---|---|---|
| `bg_boss`, `boss_floor` | ✅ exist | background + floor |
| `boss_body`, `boss_head`, `boss_sitting` | ✅ exist | static |
| `boss_hand_l` / `boss_hand_r` | ⚠️ exist as **static** | need **twitch + attack** spritesheets |
| `patus_walk` / `patus_jump` / `patus_crouch` | ✅ exist | reuse |
| **`patus_idle`** | ❌ needed | idle stance for the fight (can stub w/ a stand frame) |
| **`rodolfa`** (the mole) + drop anim | ❌ needed | delivers bombs from the shelf |
| **`shelf`** | ❌ needed | background prop for high-hand bomb |
| **`bomb`** (lit/timer + explosion) | ❌ needed | spritesheet |
| **`heart`** (full/empty) | ❌ needed | or start with simple shapes/text |
| **flying obstacle** (level 2) | ❌ needed | must be duck-able |
| end lore artwork ×3 | ❌ optional | for victory screens |

### Audio
| Asset | Status |
|---|---|
| `bgm_lvl1`, `sfx_crash`, `sfx_jump`, `sfx_tuna`, `sfx_pepper`, `sfx_gameover`, `sfx_endlvl1` | ✅ exist |
| `sfx_explosion` | ❌ needed |
| `sfx_hand_attack` / whoosh | ❌ needed |
| `sfx_hurt` (lose heart) | ❌ needed |
| `sfx_boss_death` | ❌ needed |
| `sfx_win` / fanfare | ❌ needed |
| `bgm_boss` (optional) | ❌ optional (reuses `bgm_lvl1` today) |

---

## 12. Code touch points

- **`BossManager`** — extend from static scene into the fight: hand state
  machine (idle → twitch → attack → recover), bomb/Rodolfa sequence, victory,
  hide `boss_sitting` until win.
- **`PlayerManager`** — idle animation for level 3; expose crouch/jump state for
  hit checks.
- **New health system** — hearts + i-frames (only used in the boss fight today).
- **Persistent bell-pepper total** — accumulate across levels; read at boss start.
- **`UIManager`** — hearts + Rodolfa counter; remove old `bossHealth` HP text.
- **Replace legacy boss code** — `GameScene.triggerDynamite` / `winGame` /
  `bossHealth`, and `ObstacleManager.spawnBossProjectile` /
  `spawnDynamiteControl` are the *previous* boss idea and will be superseded.
  `LevelManager.setupLevel3` is currently a no-op placeholder.
- **Level 2** — flying obstacle + one-time crouch hint.
- **Death/restart** — boss death restarts level 3 directly (skip lore).

---

## 13. Decisions locked (from review)

1. High-hand trap solved with a **background shelf** + Rodolfa drop.
2. Hand hit = **−1 heart**.
3. Attacks **strictly alternate**, one telegraph at a time, with land-from-jump
   recovery spacing.
4. Hearts = **3 base + 1 per bell pepper** collected.
5. Death → **quick fade + restart** the boss fight (skip lore).
6. Cadence: **survive 10 attacks → bomb 1**, then **survive 5 attacks → bomb 2**.

## 14. Open questions

- Which hand is destroyed first (proposed: low/ground first)?
- Can the shelf bomb damage Patus, or only the hand?
- Cap on bonus hearts from peppers (could get large)?
- 3rd victory lore screen copy.

---

## 15. Suggested build order (each step testable)

1. **Dodge core** — idle Patus, hearts UI, alternating hands with *placeholder
   tween* twitch/attack (no new art), −1 on hit, death→restart.
2. **Bomb phase** — Rodolfa counter, shelf, bomb drop, bait-the-attack →
   destroy hand (×2, with the 10/5 cadence).
3. **Victory** — run to Lars, 3 lore screens, end.
4. **Art swap** — replace placeholder hand tweens with real twitch/attack
   spritesheets as they're delivered.
5. **Level-2 flying obstacle + crouch hint** (parallelizable anytime).
