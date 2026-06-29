<template>
  <div>
    <section class="buklet-section" id="buklet">
      <h2 class="section-title">BUKLET</h2>
      <p class="buklet-hint">Arrastrá las esquinas o usá los botones para hojear el buklet</p>

      <ClientOnly>
        <div class="book-stage" :class="{ 'is-ready': ready }" style="max-width: 960px; margin: 0 auto;">
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
        </div>

        <template #fallback>
          <p class="buklet-loading">Cargando el buklet…</p>
        </template>
      </ClientOnly>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const bookEl = ref<HTMLElement | null>(null)
const ready = ref(false)
const current = ref(0)
const total = ref(0)
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

const next = () => pageFlip?.flipNext()
const prev = () => pageFlip?.flipPrev()

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
  pageFlip.on('flip', (e: any) => {
    current.value = e.data
  })
  ready.value = true

  // Dev-mode CSS can inject after init; re-fit once layout settles so the
  // book matches its (now-constrained) container.
  await nextTick()
  pageFlip.update()

  // Optional deep-link: /buklet?p=4 opens straight to that page.
  const target = Number(route.query.p)
  if (Number.isInteger(target) && target > 0) {
    pageFlip.turnToPage(Math.min(target, total.value - 1))
    current.value = pageFlip.getCurrentPageIndex()
  }
})

onBeforeUnmount(() => {
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

@media (max-width: 768px) {
  .buklet-hint {
    font-size: 12px;
    margin-bottom: 28px;
  }

  .book-btn {
    padding: 8px 18px;
  }
}
</style>
