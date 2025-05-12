import { createApp } from 'vue'
import { definePreset } from "@primevue/themes";
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import i18n from './i18n.js'
import router from "../router/index.js";

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import {
    Avatar, Button, Card, Drawer, Image,
    InputText, Menu, Menubar, SelectButton,
    Toolbar, Tooltip
} from 'primevue'
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Paginator from "primevue/paginator";

const CustomTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: 'var(--color-primary-4)',
            100: 'var(--color-primary-3)',
            200: 'var(--color-primary-2)',
            300: 'var(--color-primary-1)',
            400: 'var(--color-primary)',
            500: 'var(--color-primary)',
            600: 'var(--color-primary-8)',
            700: 'var(--color-primary-8)',
            800: 'var(--color-primary-8)',
            900: 'var(--color-primary-8)',
            950: 'var(--color-primary-8)',
        },
        accent: {
            50: 'var(--color-accent-4)',
            100: 'var(--color-accent-3)',
            200: 'var(--color-accent-2)',
            300: 'var(--color-accent-1)',
            400: 'var(--color-accent)',
        },
        info: { 500: 'var(--color-info)' },
        success: { 500: 'var(--color-success)' },
        warning: { 500: 'var(--color-warning)' },
        error: { 500: 'var(--color-error)' },

        colorScheme: {
            light: {
                primary: {
                    color: 'var(--color-primary)',
                    contrastColor: '#ffffff',
                    hoverColor: 'var(--color-primary-1)',
                    activeColor: 'var(--color-primary-2)',
                },
                highlight: {
                    background: 'var(--color-primary-4)',
                    focusBackground: 'var(--color-primary-3)',
                    color: 'var(--color-primary-8)',
                    focusColor: 'var(--color-primary)',
                },
            }
        }
    }
});

const app = createApp(App);
app
    .use(PrimeVue, {
        ripple: true,
        theme: {
            preset: CustomTheme,
            options: {
                prefix: 'p',
                darkModeSelector: 'light'
            }
        }
    })
    .component('pv-button', Button)
    .component('pv-input-text', InputText)
    .component('pv-card', Card)
    .component('pv-select-button', SelectButton)
    .component('pv-drawer', Drawer)
    .component('pv-avatar', Avatar)
    .component('pv-menu', Menu)
    .component('pv-menubar', Menubar)
    .component('pv-toolbar', Toolbar)
    .component('pv-tooltip', Tooltip)
    .component('pv-image', Image)
    .component('pv-dialog', Dialog) //Ingresado
    .component('pv-textarea', Textarea) //Ingresado
    .component('pv-paginator', Paginator) //Ingresado
    .use(i18n)
    .use(router)
    .mount('#app')