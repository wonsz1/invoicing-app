<template>
    <li class="nav-item dropdown">
        <a 
            href="#" 
            role="button" 
            id="navbarDropdown" 
            aria-haspopup="true" 
            aria-expanded="flase" 
            data-toggle="dropdown" 
            class="nav-link dropdown-toggle"
        >
            <img :src="icons[currentLocale]" class="country-icon as-toggle" />
        </a>

        <div aria-labelledby="navbarDropdown" class="dropdown-menu dropdown-menu-right">
            <router-link v-for="locale in locales" :key="locale.code" :to="`/${locale.code}/${pathWithoutLocale}`" class="dropdown-item">
                <img :src="icons[locale.code]" class="country-icon" />
                <span class="locale-name">{{ locale.name }}</span>
            </router-link>
        </div>
    </li>
</template>

<script>
import { locales } from '../config/i18n'

require('../assets/en_flag.jpg')
import enIcon from '../assets/en_flag.jpg'
import plIcon from '../assets/pl_flag.jpg'

export default {
    data() {
        return {
            icons: {
                en: enIcon,
                pl: plIcon,
            },
            locales
        }
    },
    computed: {
        currentLocale() {
            return this.$route.params.locale
        },
        pathWithoutLocale() {
            return this.$route.path.substring(4)
        }
    }
}
</script>

<style>
    .country-icon {
        width: 20px;
        height: auto;
        display: inline-block;
        vertical-align: baseline;
        border: 1px solid #dee2e6;
        box-shadow: 0px 1px 3px rgba(24, 29, 38, 0.1);
    }
 
    .country-icon.as-toggle {
        margin-top: 5px;
    }
 
    .locale-name {
        display: inline-block;
        vertical-align: baseline;
    }
</style>