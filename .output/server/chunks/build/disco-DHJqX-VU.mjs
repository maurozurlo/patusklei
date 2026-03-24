import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "disco",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-f521e84b><section class="music-section" id="music-section" data-v-f521e84b><h2 class="section-title" data-v-f521e84b>ESCUCHE EL DISCO</h2><div class="music-player" data-v-f521e84b><p style="${ssrRenderStyle({ "margin-bottom": "20px", "color": "var(--ega-teal)" })}" data-v-f521e84b>Disponible en Bandcamp EL 25 DEL 04 DE 2026</p><div data-v-f521e84b><h2 id="countdown-container" style="${ssrRenderStyle({ "color": "var(--ega-orange)" })}" data-v-f521e84b><span id="countdown" data-v-f521e84b></span></h2></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/disco.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const disco = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f521e84b"]]);

export { disco as default };
//# sourceMappingURL=disco-DHJqX-VU.mjs.map
