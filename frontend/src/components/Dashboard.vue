<script>
  import Header from './Header';
  import CreateInvoice from './CreateInvoice';
  import ViewInvoice from './ViewInvoice';

  export default {
    name: "Dashboard",
    components: {
      Header,
      CreateInvoice,
      ViewInvoice
    },
    data() {
      return {
        isactive: 'create',
        title: 'Invoicing App',
      }
    }
  };
</script>
<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
      <template v-if="this.isactive == 'create'">
        <create-invoice/>
      </template>
      <template v-else>
        <view-invoice/>
      </template>
  </div>
</template>
