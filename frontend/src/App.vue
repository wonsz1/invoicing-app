<template>
  <div id="app">
    <!-- wrap Localizer around all our app’s components so we can be sure that i18next’s locale, our HTML document 
    and our i18n-ized components will always stay in sync with the locale in the current URI. -->
    <localizer>
      <main class="container" role="main">
        <router-view/>
      </main>
    </localizer>
  </div>
</template>

<script>
import Localizer from './components/Localizer'

export default {
  name: 'App',
  components: {
    Localizer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
