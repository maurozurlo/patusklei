import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-DP6agYyI.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const mobileMenuOpen = ref(false);
    const currentLang = ref("es");
    computed(() => currentLang.value === "es" ? "ES / EN" : "ES / EN");
    const translations = {
      es: {
        inicio: "Inicio",
        historia: "Historia",
        mision: "Mision",
        credito: "Credito"
      },
      en: {
        inicio: "Home",
        historia: "Story",
        mision: "Mission",
        credito: "Credits"
      }
    };
    const t = (key) => {
      return translations[currentLang.value][key] || key;
    };
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: ["navbar", { active: unref(mobileMenuOpen) }]
      }, _attrs))} data-v-115f77a2><div class="navbar-container" data-v-115f77a2><div class="navbar-logo" data-v-115f77a2>PATUS KLEI</div><button class="navbar-toggle" aria-label="Toggle navigation" data-v-115f77a2><span class="navbar-toggle-bar" data-v-115f77a2></span><span class="navbar-toggle-bar" data-v-115f77a2></span><span class="navbar-toggle-bar" data-v-115f77a2></span></button><ul class="navbar-menu" data-v-115f77a2><li data-v-115f77a2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("inicio"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("inicio")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-115f77a2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/historia",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("historia"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("historia")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-115f77a2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/mision",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("mision"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("mision")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-115f77a2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/credito",
        onClick: closeMobileMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("credito"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("credito")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></nav>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-115f77a2"]]), { __name: "Navbar" });
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(_attrs)} data-v-449d4f92><div class="social-links" data-v-449d4f92><a href="https://urpite.bandcamp.com" target="_blank" data-v-449d4f92>Bandcamp</a></div><p style="${ssrRenderStyle({ "color": "var(--ega-lightgray)" })}" data-v-449d4f92>© 2024 Patus Klei | La Mítica Tierra de Cle</p><p class="easter-egg" data-v-449d4f92>CONSIGA SU BIDET DE CLE IMPRESO EN 3D PROSSIMAMENTE</p></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-449d4f92"]]), { __name: "Footer" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DNo7HBCG.mjs.map
