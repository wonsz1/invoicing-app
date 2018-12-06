<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>{{$t('invoice_detail')}}</h3>
                    <div class="invoice-preview inv col-md-12">
                        <div class="inv-header"></div>
                        <div class="inv-seller-buyer">
                            <table class="clean split_half">
                                <thead>
                                    <tr>
                                        <th>
                                            <span class="seller">Sprzedawca</span>
                                        </th>
                                        <th>
                                            <span class="buyer">Nabywca</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td id="buyer"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="inv-transactions">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Lp.#</th>
                                        <th scope="col">{{$t('name')}}</th>
                                        <th scope="col">{{$t('quantity')}}</th>
                                        <th scope="col">{{$t('value_net')}}</th>
                                        <th scope="col">{{$t('value_gross')}}</th>
                                        <th scope="col">{{$t('vat')}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="trans in transactions">
                                        <tr :key="trans.id">
                                            <td scope="row">{{ trans.id }}</td>
                                            <td>{{ trans.name }}</td>
                                            <td>{{ trans.quantity }}</td>
                                            <td>{{ trans.price_net }}zł</td>
                                            <td>{{ trans.value_gross }}zł</td>
                                            <td>{{ trans.vat }}</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    import store from '../services/store';
    import Header from './Header';
    const env = require('../config');

    export default {
      name: 'ViewInvoice',
      components: {
        Header,
      },
      data() {
        return {
          invoice: [],
          transactions: [],
          user: store.getters.user
        };
      },
      methods: {
          getInvoice() {
            return  axios.get(env.default.SERVER_ADDR + `invoice/user/${store.getters.user.id}/${this.$route.params.id}`)
          },
          getInvoiceTransactions() {
            return  axios.get(env.default.SERVER_ADDR + `invoice/transactions/${this.$route.params.id}`)
          }
      },
      mounted() {
        var self = this;
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.all([this.getInvoice(), this.getInvoiceTransactions()]).then(axios.spread(function(inv, trans) {
          self.invoice = inv.data.invoice;
          self.transactions = trans.data.transactions;
          console.log(inv.data.invoice);
          console.log(trans.data);
        })).catch(err => {
            console.log(err);
            if(err.response.status == 401) {
                this.$router.push({ name: 'SignUp' })
            }
        })
      }
    }
</script>
<style>
    .invoice-preview {
        box-shadow: 1px 3px 5px 0px rgba(0,0,0,0.75);
        font-size: 110%;
        border: 1px solid #ddd;
    }
</style>