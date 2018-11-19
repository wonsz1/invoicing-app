<template>
    <nav class="navbar navbar-light bg-light navbar-expand-md">
        <template>
            <SideNav/>
        </template>
        
        <span class="navbar-brand mb-0 h1 ml-auto">
            <img width="36" height="36" src="../assets/logo.png" class="d-line-block allign-top" />
            {{ title }}
        </span>

        <ul class="navbar-nav ml-auto">
            <locale-switcher />
        </ul>
    </nav>
</template>
<script>
import SideNav from './SideNav';
import LocaleSwitcher from './LocaleSwitcher'

export default {
    name: "Header",
    components: {
        SideNav, LocaleSwitcher
    },
    data() {
        return {
            title: "Invoicing App"
        };
    },
    methods: {
        currentLocale() {
            return this.$route.params.locale
        }
    },
}
</script>
