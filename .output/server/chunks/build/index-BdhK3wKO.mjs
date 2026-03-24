import { _ as __nuxt_component_0 } from './nuxt-link-DP6agYyI.mjs';
import { withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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

const _imports_0 = "" + __buildAssetsURL("patushero.BJjmHTR1.png");
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-ad18bdae><section class="hero" id="inicio" data-v-ad18bdae><div class="text-overlay" data-v-ad18bdae><div class="diagonal-text" data-v-ad18bdae>PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div><div class="diagonal-text" data-v-ad18bdae>PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div><div class="diagonal-text" data-v-ad18bdae>PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div><div class="diagonal-text" data-v-ad18bdae>PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div><div class="diagonal-text" data-v-ad18bdae>PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div><div class="diagonal-text" data-v-ad18bdae>PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI PATUS KLEI</div></div><div class="beach-scene" data-v-ad18bdae><img${ssrRenderAttr("src", _imports_0)} alt="PATUS KLEI" width="800" height="600" data-v-ad18bdae></div><div class="title-box" data-v-ad18bdae><h1 data-v-ad18bdae>PATUS KLEI</h1><p class="tagline" data-v-ad18bdae>LA VIDA DE PATUS KLEI</p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/disco",
    class: "cta-button"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Escuche el Disco`);
      } else {
        return [
          createTextVNode("Escuche el Disco")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-ad18bdae"]]);

export { index as default };
//# sourceMappingURL=index-BdhK3wKO.mjs.map
