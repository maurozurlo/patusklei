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
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-cafccc30><section class="credits-section" id="credito" data-v-cafccc30><h2 class="section-title" data-v-cafccc30>RESUMEN CREDITICIO</h2><div class="credits-grid" data-v-cafccc30><div class="credit-card" data-v-cafccc30><p class="credit-role" data-v-cafccc30>Doble de Chilavert</p><p class="credit-name" data-v-cafccc30>Sorongo Fon Funiculi</p></div><div class="credit-card" data-v-cafccc30><p class="credit-role" data-v-cafccc30>Guardián de la Panera</p><p class="credit-name" data-v-cafccc30>Jhonn Roberto Garotinho</p></div><div class="credit-card" data-v-cafccc30><p class="credit-role" data-v-cafccc30>Arte</p><p class="credit-name" data-v-cafccc30>Vladimir Pánduro</p></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/credito.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const credito = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-cafccc30"]]);

export { credito as default };
//# sourceMappingURL=credito-tjDZyD6R.mjs.map
