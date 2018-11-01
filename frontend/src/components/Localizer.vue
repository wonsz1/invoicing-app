<template>
    <!-- wraps other components that are rendered into its <slot>. 
        Before it does so, it checks to see if we’ve loaded the current UI translations and initialized i18next. 
        It completely removes its its root container <div> while UI translations are loading, 
        and adds it back in when translations have finished loading -->
    <!-- This ensures that Localizer’s child components will re-render when we load a new locale. 
        Otherwise, since our components’ templates will use the t function and not data state to get their translations, 
        they won’t see the locale change and won’t react and re-render. -->
    <div v-if="uiTranslationsLoaded">
        <slot/>
    </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { locales } from '../config/i18n'
import { switchDocumentLocale } from '../services/util/'
import { setUiLocale, t, currentLocale } from '../services/i18n'

export default {
    name: 'Localizer',
    data() {
        return {
            uiTranslationsLoaded: false
        }
    },
    methods: {
        set(locale) {
            this.uiTranslationsLoaded = false
            setUiLocale(locale).then(() => {
                Vue.prototype.$t = t
                this.uiTranslationsLoaded = true
                //Our current locale’s direction (right-to-left or left-to-right) is retrieved from the configured locales array. 
                //We need that direction to pass to switchDocumentLocale. 
                const dir = _.find(locales, l => l.code === locale).dir

                //This utility function takes care of setting the lang and dir attributes on the <html> document element. 
                //switchDocumentLocale also injects stylesheets that are loaded if we pass it a right-to-left locale, 
                //and removed when the current locale’s direction is left-to-right.
                switchDocumentLocale(
                    locale,
                    dir,
                    {
                        withRTL: [
                            '/static/styles/vendor/GhalamborM/bootstrap4-rtl.css',
                            '/static/styles/rtl.css',
                        ]
                    }
                )
            }).catch(() => console.log('error when seting locale'))//.catch(err => console.error(err))
        }
    },
    //set initial locale
    mounted() {
        console.log(this.$route)
        this.set(this.$route.params.locale)
    },
    //Whenever the locale parameter in the current URI is different than the previous one, we re-set our current locale. 
    //This check is important because otherwise we’d unnecessarily slow down our app by re-rendering 
    //our Localizer‘s children on every URI change, whether the change is within the same locale or not.
    watch: {
        '$route'(to) {
            if(to.params.locale !== currentLocale()) {
                this.set(to.params.locale)
            }
        }
    }
}
</script>

