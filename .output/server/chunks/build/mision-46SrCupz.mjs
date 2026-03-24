import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-6768fd20><section class="games-section" id="mision" data-v-6768fd20><h2 class="section-title" data-v-6768fd20>JUEGO INTERACTIVO</h2><div class="games-grid" data-v-6768fd20><div class="game-card" data-v-6768fd20><h3 class="game-title" data-v-6768fd20>PATUS KLEI</h3><p class="game-desc" data-v-6768fd20>AYUDE A PATUS A GANAR LA BATALLA DE LA TRIPLE PANERA</p><iframe src="/game.html" width="320" height="200" frameborder="0" data-v-6768fd20></iframe></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mision.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const mision = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6768fd20"]]);

export { mision as default };
//# sourceMappingURL=mision-46SrCupz.mjs.map
