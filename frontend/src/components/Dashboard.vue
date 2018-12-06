<script>
  import Header from './Header';
  import CreateInvoice from './CreateInvoice';
  import InvoiceList from './InvoiceList';

  export default {
    name: "Dashboard",
    components: {
      Header,
      CreateInvoice,
      InvoiceList
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
      <template v-if="this.isactive == 'list'">
        <invoice-list/>
      </template>
  </div>
</template>
