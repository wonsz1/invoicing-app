<script>
  import Header from './Header';
  import CreateInvoice from './CreateInvoice';
  import InvoiceList from './InvoiceList';

  export default {
    name: "Dashboard",
    components: {
      Header,
    },
    data() {
      return {
        title: 'Invoicing App',
      }
    }
  };
</script>
<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
  </div>
</template>
