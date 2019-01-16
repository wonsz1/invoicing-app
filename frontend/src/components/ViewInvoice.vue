<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <button class="btn btn-primary" v-on:click="print()">{{$t('print')}}</button>

                <div class="col-md-12">                        
                    <div id="printIt" class="invoice-preview inv col-md-12">
                        <div class="inv-header">
                            <p><b>{{$t('invoice_name')}}</b> {{ invoice.name }}</p>
                            <br/>
                            <p><b>{{$t('issue_date')}}</b> {{ new Date(invoice.issue_date).toLocaleDateString("pl-PL") }}</p>
                            <p><b>{{$t('sell_date')}}</b> {{ new Date(invoice.sell_date).toLocaleDateString("pl-PL") }}</p>
                        </div>
                        <hr/>
                        <div class="inv-seller-buyer">
                            <table class="clean split_half">
                                <thead>
                                    <tr>
                                        <th>{{$t('seller')}}</th>
                                        <th>{{$t('buyer')}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ user.company_name }}</td>
                                        <td id="buyer">{{ buyer.company_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ user.address }}</td>
                                        <td id="buyer">{{ buyer.address }}</td>
                                    </tr>
                                    <tr>
                                        <td>NIP {{ user.nip }}</td>
                                        <td id="buyer">NIP {{ buyer.nip }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ user.account_number }}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="inv-transactions">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Lp.</th>
                                        <th scope="col">{{$t('name')}}</th>
                                        <th scope="col">{{$t('quantity')}}</th>
                                        <th scope="col">{{$t('value_net')}}</th>
                                        <th scope="col">{{$t('vat')}} %</th>
                                        <th scope="col">{{$t('value_vat')}}</th>
                                        <th scope="col">{{$t('value_gross')}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="(trans, index) in transactions">
                                        <tr :key="trans.id">
                                            <td scope="row">{{ index + 1 }}</td>
                                            <td>{{ trans.name }}</td>
                                            <td>{{ trans.quantity }}</td>
                                            <td>{{ trans.price_net.toFixed(2) }}</td>
                                            <td>{{ trans.vat }}</td>
                                            <td>{{ (trans.price_net * trans.vat / 100).toFixed(2) }}</td>
                                            <td>{{ trans.value_gross.toFixed(2) }}</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>

                            <table class="summary_table">
                                <tr>
                                    <td><b>{{$t('value_net')}}</b></td>
                                    <td class="summary_number">{{ (invoice.sum_net / 100).toFixed(2) }} PLN</td>
                                </tr>
                                <tr>
                                    <td><b>{{$t('vat')}}</b></td>
                                    <td class="summary_number">{{ (invoice.sum_vat / 100).toFixed(2) }} PLN</td>
                                </tr>
                                <tr>
                                    <td><b>{{$t('value_gross')}}</b></td>
                                    <td class="summary_number">{{ (invoice.sum_gross / 100).toFixed(2) }} PLN</td>
                                </tr>
                            </table>

                            <hr>
                            <table id="to_pay">
                                <tbody>
                                    <tr>
                                        <th>{{$t('to_pay')}}</th>
                                        <td>
                                            {{ sum }} PLN 
                                                <br> 
                                                {{$t('in_words')}}: 
                                                
                                                {{ sumInWords}}
                                        </td>
                                    </tr>
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
    import Vue from 'vue'
    import VueHtmlToPaper from 'vue-html-to-paper';
    import { currentLocale } from '../services/i18n';
    const PriceToPolishWords = require('price-to-polish-words');
    
    const env = require('../config');
    const options = {
        name: '_blank',
        specs: [
            'fullscreen=no',
            'titlebar=no',
            'scrollbars=no'
        ],
        styles: [
            '/static/css/invoice.css'
        ]
    }

Vue.use(VueHtmlToPaper, options);

    export default {
      name: 'ViewInvoice',
      components: {
        Header,
      },
      data() {
        return {
          invoice: [],
          transactions: [],
          buyer: [],
          user: store.getters.user,
          sum: "",
          sumInWords: ""
        };
      },
      methods: {
          getInvoice() {
            return  axios.get(env.default.SERVER_ADDR + `invoice/user/${store.getters.user.id}/${this.$route.params.id}`)
          },
          getInvoiceTransactions() {
            return  axios.get(env.default.SERVER_ADDR + `invoice/transactions/${this.$route.params.id}`)
          },
          print() {
              this.$htmlToPaper('printIt');
          }
      },
      mounted() {
        var self = this;
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.all([this.getInvoice(), this.getInvoiceTransactions()]).then(axios.spread(function(inv, trans) {
          self.buyer = inv.data.buyer;
          self.invoice = inv.data.invoice;
          self.transactions = trans.data.transactions;
          self.sum = (inv.data.invoice.sum_gross / 100).toFixed(2);
          if(currentLocale() == 'pl') {
            self.sumInWords = (new PriceToPolishWords(self.sum)).getPrice('zl-words zl gr-words gr');
          } else {
              self.sumInWords = "[TODO] price in englih"
          }
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
        margin: 0 auto;
        box-shadow: 1px 3px 5px 0px rgba(0,0,0,0.75);
        font-size: 110%;
        border: 1px solid #ddd;
        text-align: left;
        padding: 20px;
        font-family: helvetica,"lucida grande","lucida sans unicode";   
        font-size: 14px;
        max-width: 800px;
    }
    .invoice-preview table {
        text-align: right;
    }

    p {
        margin-bottom: 0.5em;
        line-height: 1.4em;
    }
    .right {
        text-align: right;
    }
    .split_half {
        width: 100%;
    }
    .split_half td, .split_half th{
        text-align: left;
    }

    .inv-transactions table th {
        font-weight: bold;
        background-color: #f1f1f1;
        border: 1px solid #bbbbbb;        
        font-size: 12px;
    }
    table th, table td, .table th, .table td {
        margin: 0;
        padding: 5px;
    }
    .summary_number {
        width: 15%;
    }
    .summary_table {
        width: 100%;
    }
    .row {
        position: relative;
    }
    .btn {
        position: absolute;
        top: 30px;
        right: 50px;
        z-index: 10;
    }
    #printIt {
        margin-top: 30px;
    }
    #to_pay {
        text-align: left;
    }
    #to_pay th {
        background-color: #fff;
        border: none;
        width: 120px;
    }
    .to_pay td, .to_pay th {
        padding: 10px 5px;
        vertical-align: top;
    }
    table tr {
        vertical-align: top;
    }
</style>