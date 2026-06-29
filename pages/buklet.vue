<template>
  <div>
    <section class="buklet-section" id="buklet">
      <h2 class="section-title">BUKLET</h2>
      <p class="buklet-hint">Arrastrá las esquinas o usá los botones para hojear el buklet</p>

      <ClientOnly>
        <div
          class="book-stage"
          :class="{ 'is-ready': ready, 'cover-closed': closed && landscape }"
          style="max-width: 960px; margin: 0 auto;"
        >
          <!-- No reactive bindings on .flipbook: StPageFlip mutates this
               element's class/style at runtime, and a Vue :class/:style here
               would reconcile and wipe the library's own classes. -->
          <div ref="bookEl" class="flipbook">
            <!-- Front cover: a single hard page. -->
            <div class="page page--hard" data-density="hard">
              <div class="page-img page-img--contain" :style="coverStyle"></div>
            </div>

            <!-- Inner pages: each spread JPG is split into a left and right
                 leaf via background-position, so the book reassembles the
                 original spread when open. -->
            <div v-for="pg in pages" :key="pg.key" class="page">
              <div class="page-img" :style="pg.style"></div>
            </div>
          </div>
        </div>

        <div class="book-controls">
          <button class="cta-button book-btn" aria-label="Página anterior" @click="prev">◄</button>
          <span class="page-indicator">{{ indicator }}</span>
          <button class="cta-button book-btn" aria-label="Página siguiente" @click="next">►</button>
          <button class="cta-button book-btn zoom-open" aria-label="Ampliar" @click="openZoom">🔍</button>
        </div>

        <template #fallback>
          <p class="buklet-loading">Cargando el buklet…</p>
        </template>
      </ClientOnly>
    </section>

    <!-- Zoom lightbox, rendered at the body root so it overlays everything. -->
    <Teleport to="body">
      <div v-if="zoomOpen" class="zoom-overlay" @click.self="closeZoom">
        <button class="zoom-ctl zoom-close" aria-label="Cerrar" @click="closeZoom">✕</button>
        <button
          class="zoom-ctl zoom-prev"
          aria-label="Hoja anterior"
          :disabled="zoomIndex === 0"
          @click="zoomPrev"
        >◄</button>

        <div class="zoom-imgwrap" @click.self="closeZoom">
          <img
            :src="zoomSrc"
            class="zoom-img"
            :class="{ zoomed: imgZoom }"
            alt="Página del buklet"
            @click="imgZoom = !imgZoom"
          >
        </div>

        <button
          class="zoom-ctl zoom-next"
          aria-label="Hoja siguiente"
          :disabled="zoomIndex === zoomTotal - 1"
          @click="zoomNext"
        >►</button>

        <div class="zoom-caption">{{ zoomCaption }} · click para {{ imgZoom ? 'alejar' : 'acercar' }} · Esc para cerrar</div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useSeoMeta, useRequestURL } from '#imports'

const cover = new URL('/booklet/cover.jpg', useRequestURL({ xForwardedHost: true }).origin).href

useSeoMeta({
  title: 'Buklet · El librito sagrado de Patus Klei',
  description:
    'Hojeá el buklet del disco de Patus Klei como un grimorio de cumbia esotérica. Arte, letras y misterios de la Mítica Tierra de Cle, página por página.',
  ogTitle: 'El Buklet de Patus Klei',
  ogDescription: 'Pasá las hojas del buklet sagrado. Arte y letras del disco, página por página.',
  ogType: 'website',
  ogImage: cover,
  twitterCard: 'summary_large_image',
  twitterImage: cover,
})

const route = useRoute()

const bookEl = ref<HTMLElement | null>(null)
const ready = ref(false)
const current = ref(0)
const total = ref(0)
// Drives the centered-cover shift. Kept separate from `current` so the slide
// can begin the instant a flip starts, rather than when it finishes.
const closed = ref(true)
// In portrait (mobile) mode StPageFlip already centers the single page, so the
// shift only applies in landscape/two-page mode.
const landscape = ref(true)
let pageFlip: any = null

// One JPG per open spread; left/right halves become individual leaves.
const spreads = ['hoja0-1', 'hoja2-3', 'hoja4-5', 'hoja6-7', 'hoja8-9', 'hoja10-11']

const half = (name: string, posX: string) => ({
  backgroundImage: `url(/booklet/${name}.jpg)`,
  backgroundSize: '200% 100%',
  backgroundPosition: `${posX} 0%`,
})

const pages = spreads.flatMap((s) => [
  { key: `${s}-l`, style: half(s, '0%') },
  { key: `${s}-r`, style: half(s, '100%') },
])

const coverStyle = {
  backgroundImage: 'url(/booklet/cover.jpg)',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}

const indicator = computed(() =>
  total.value ? `${Math.min(current.value + 1, total.value)} / ${total.value}` : '…',
)

// Set the centering intent before triggering the flip, so the slide and the
// page-turn animate together (no snap after the turn completes).
const next = () => {
  if (current.value === 0) closed.value = false
  pageFlip?.flipNext()
}
const prev = () => {
  if (current.value === 1) closed.value = true
  pageFlip?.flipPrev()
}

// --- Zoom lightbox ---------------------------------------------------------
// Full-resolution view of a single sheet (the cover or a whole spread JPG).
const zoomImages = ['cover', ...spreads]
const zoomTotal = zoomImages.length
const zoomOpen = ref(false)
const imgZoom = ref(false) // false = fit to screen, true = enlarged + pannable
const zoomIndex = ref(0)

const zoomSrc = computed(() => `/booklet/${zoomImages[zoomIndex.value]}.jpg`)
const zoomCaption = computed(() =>
  zoomIndex.value === 0 ? 'Tapa' : `Hoja ${zoomIndex.value} de ${zoomTotal - 1}`,
)

// Map the book's current page to its sheet (cover, or a 2-page spread).
const sheetForPage = (p: number) => (p === 0 ? 0 : Math.floor((p - 1) / 2) + 1)

const openZoom = () => {
  zoomIndex.value = sheetForPage(current.value)
  imgZoom.value = false
  zoomOpen.value = true
}
const closeZoom = () => {
  zoomOpen.value = false
}
const zoomPrev = () => {
  if (zoomIndex.value > 0) {
    zoomIndex.value--
    imgZoom.value = false
  }
}
const zoomNext = () => {
  if (zoomIndex.value < zoomTotal - 1) {
    zoomIndex.value++
    imgZoom.value = false
  }
}

const onKey = (e: KeyboardEvent) => {
  if (!zoomOpen.value) return
  if (e.key === 'Escape') closeZoom()
  else if (e.key === 'ArrowLeft') zoomPrev()
  else if (e.key === 'ArrowRight') zoomNext()
}

// Lock background scroll while the overlay is open.
watch(zoomOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onMounted(async () => {
  const mod: any = await import('page-flip')
  const PageFlip = mod.PageFlip || mod.default?.PageFlip || mod.default

  pageFlip = new PageFlip(bookEl.value, {
    width: 460,
    height: 468,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 480,
    minHeight: 285,
    maxHeight: 489,
    showCover: true,
    usePortrait: true,
    drawShadow: true,
    maxShadowOpacity: 0.5,
    flippingTime: 700,
    mobileScrollSupport: true,
  })

  pageFlip.loadFromHTML(bookEl.value!.querySelectorAll('.page'))
  total.value = pageFlip.getPageCount()
  landscape.value = pageFlip.getOrientation() === 'landscape'

  pageFlip.on('changeOrientation', (e: any) => {
    landscape.value = e.data === 'landscape'
  })
  pageFlip.on('flip', (e: any) => {
    current.value = e.data
    closed.value = e.data === 0
  })
  pageFlip.on('changeState', (e: any) => {
    // Begin opening as soon as a drag/flip starts from the cover, and
    // re-sync once the book settles (handles a drag that snaps back).
    if (e.data === 'flipping' && current.value === 0) closed.value = false
    else if (e.data === 'read') closed.value = current.value === 0
  })
  ready.value = true
  window.addEventListener('keydown', onKey)

  // Dev-mode CSS can inject after init; re-fit once layout settles so the
  // book matches its (now-constrained) container.
  await nextTick()
  pageFlip.update()

  // Optional deep-link: /buklet?p=4 opens straight to that page.
  const target = Number(route.query.p)
  if (Number.isInteger(target) && target > 0) {
    pageFlip.turnToPage(Math.min(target, total.value - 1))
    current.value = pageFlip.getCurrentPageIndex()
    closed.value = current.value === 0
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  pageFlip?.destroy()
})
</script>

<style scoped>
@import '~/css/pages.css';

.buklet-section {
  min-height: 100vh;
  padding: 100px 20px 80px;
  background: linear-gradient(to bottom, var(--ega-darkblue), var(--ega-black));
  text-align: center;
}

.buklet-hint {
  color: var(--ega-teal);
  font-size: 14px;
  margin-top: -20px;
  margin-bottom: 36px;
}

.book-stage {
  max-width: 960px;
  margin: 0 auto;
}

/* position: relative guarantees the library's absolutely-positioned
   .stf__block resolves against this element (not the viewport), even if the
   .stf__parent class were ever lost. */
.flipbook {
  margin: 0 auto;
  position: relative;
  /* Slides between the centered closed cover and the open spread. Matches
     the library's flippingTime (700ms) so the book opens as one motion. */
  transition: transform 0.7s ease-in-out;
}

/* When closed on the cover, StPageFlip parks the single cover page on the
   right half; shift left by half a page so it reads as a centered book. */
.book-stage.cover-closed .flipbook {
  transform: translateX(-25%);
}

/* Hide the raw stacked pages until the flipbook is initialised, so there is
   no flash of un-flipped images. Toggled on the stage (a Vue-owned wrapper),
   never on .flipbook itself. */
.book-stage .flipbook {
  opacity: 0;
  transition: opacity 0.35s ease-out;
}

.book-stage.is-ready .flipbook {
  opacity: 1;
}

.page {
  background: var(--ega-black);
  overflow: hidden;
}

.page-img {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
}

/* Hard covers get a frame to feel like book boards. */
.page--hard {
  background: var(--ega-black);
  border: 3px solid var(--ega-orange);
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
}

.book-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 30px;
}

.book-btn {
  padding: 8px 24px;
  font-size: 22px;
  line-height: 1;
}

.page-indicator {
  color: var(--ega-yellow);
  font-size: 16px;
  min-width: 90px;
  letter-spacing: 1px;
}

.buklet-loading {
  color: var(--ega-teal);
  padding: 60px 0;
}

.zoom-open {
  font-size: 18px;
}

/* --- Zoom lightbox -------------------------------------------------------- */
.zoom-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.93);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.zoom-imgwrap {
  max-width: 92vw;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-img {
  max-width: 92vw;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  border: 3px solid var(--ega-orange);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
  cursor: zoom-in;
}

/* Enlarged: drop the fit caps so the image overflows the wrapper and can be
   scrolled/panned to read fine print. */
.zoom-img.zoomed {
  max-width: none;
  max-height: none;
  width: 1800px;
  height: auto;
  cursor: zoom-out;
}

.zoom-ctl {
  position: fixed;
  background: var(--ega-black);
  color: var(--ega-orange);
  border: 3px solid var(--ega-orange);
  font-family: 'Courier New', monospace;
  font-size: 22px;
  line-height: 1;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2001;
}

.zoom-ctl:hover:not(:disabled) {
  background: var(--ega-orange);
  color: var(--ega-black);
  box-shadow: 0 0 16px rgba(255, 136, 0, 0.6);
}

.zoom-ctl:disabled {
  opacity: 0.3;
  cursor: default;
}

.zoom-close {
  top: 16px;
  right: 16px;
}

.zoom-prev {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.zoom-next {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.zoom-caption {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--ega-teal);
  font-size: 13px;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 14px;
  white-space: nowrap;
  z-index: 2001;
}

@media (max-width: 768px) {
  .buklet-hint {
    font-size: 12px;
    margin-bottom: 28px;
  }

  .book-btn {
    padding: 8px 18px;
  }

  .zoom-ctl {
    font-size: 18px;
    padding: 8px 12px;
  }

  .zoom-caption {
    font-size: 11px;
  }
}
</style>
