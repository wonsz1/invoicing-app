<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
    <div class="container">
        <div class="tab-pane fade show active text-left">
                    <form @submit.prevent="onSubmit">
                        <div class="row">
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label for="">{{$t('type')}}</label>
                                    <select class="form-control">
                                        <option value="1">{{$t('fv')}}</option>
                                        <option value="2">{{$t('fv_proforma')}}</option>
                                        <option value="3">{{$t('fv_correcting')}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label for="">{{$t('number')}}</label>
                                    <input type="text" class="form-control" placeholder="eg FV/1222/10/2044" v-model="invoice.name" />
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label for="">{{$t('issue_date')}}</label>
                                    <input type="text" class="form-control" v-model="invoice.issue_date" />
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label for="">{{$t('sell_date')}}</label>
                                    <input type="text" class="form-control" v-model="invoice.sell_date" />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <h4>{{$t('seller')}}</h4>
                            </div>
                            <div class="col-md-6">
                                <h4>{{$t('buyer')}}</h4>
                                <div class="form-group">
                                    <select class="form-control" v-model="clientSelected" v-on:change="selectClient()">
                                        <option selected="selected">{{$t('select')}}</option>
                                        <option v-for="client in clients" v-bind:key="client.id" v-bind:value="client">
                                            {{ client.company_name }}
                                        </option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="">{{$t('company_name')}}</label>
                                    <input type="text" class="form-control" v-model="client.company_name" />
                                </div>
                                <div class="form-group">
                                    <label for="">{{$t('nip')}}</label>
                                    <input type="text" class="form-control" v-model="client.nip" />
                                </div>
                                <div class="form-group">
                                    <label for="">{{$t('address')}}</label>
                                    <textarea class="form-control" v-model="client.address"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{{$t('name')}}</th>
                                            <th scope="col">{{$t('quantity')}}</th>
                                            <th scope="col">{{$t('price_net')}}</th>
                                            <th scope="col">{{$t('vat')}}</th>
                                            <th scope="col">{{$t('value_net')}}</th>
                                            <th scope="col">{{$t('value_gross')}}</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template>
                                            <tr>
                                                <td>
                                                    <input type="text" id="txn_name_modal" class="form-control" v-model="transaction.name" /> 
                                                    <div class="error">{{ errors.name }}</div>
                                                </td>
                                                <td>
                                                    <input type="text" id="txn_quantity_modal" class="form-control" value="1" v-model="transaction.quantity" v-on:blur="calculateValues()" />
                                    
                                                    <div class="error">{{ errors.quantity }}</div>
                                                </td>
                                                <td>
                                                    <input type="text" id="txn_price_net_modal" class="form-control"  v-model="transaction.price_net" v-on:blur="calculateValues()" />
                                                    <div class="error">{{ errors.price_net }}</div>
                                                </td>
                                                <td>
                                                    <input type="text" id="txn_vat_modal" class="form-control"  v-model="transaction.vat" v-on:blur="calculateValues()" />
                                                    <div class="error">{{ errors.vat }}</div>
                                                </td>
                                                <td><input type="text" id="txn_value_net_modal" class="form-control" v-model="transaction.value_net" /></td>
                                                <td><input type="text" id="txn_value_gross_modal" class="form-control" v-model="transaction.value_gross" /></td>
                                                <td>
                                                    <button type="button" class="btn btn-secondary" v-on:click="clearTransaction()">X</button>
                                                    <button type="button" class="btn btn-success" v-on:click="saveTransaction()">+</button>
                                                </td>
                                            </tr>
                                        </template>
                                        <template v-for="txn in transactions">
                                            <tr :key="txn.id">
                                                <!-- <td>{{ txn.id }}</td> -->
                                                <td>{{ txn.name }}</td>
                                                <td>{{ txn.quantity }}</td>
                                                <td>{{ txn.price_net }}</td>
                                                <td>{{ txn.vat }}</td>
                                                <td>{{ txn.value_net }}</td>
                                                <td>{{ txn.value_gross }}</td>
                                                <td><button type="button" class="btn btn-danger" v-on:click="deleteTransaction(txn.id)">X</button></td>
                                            </tr>
                                        </template>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{{$t('sum')}}:</td>
                                            <td>{{ invoice.sum_gross / 100 }}</td>
                                            <td>pln</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div class="form-group">
                                    <button class="btn btn-primary ">{{$t('create_invoice')}}</button>
                                    {{ loading }}
                                    <p></p>
                                    <div v-if="status" class="alert alert-primary" role="alert">
                                        {{ status }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
               

                <div class="modal fade" id="transactionModal" tabindex="-1" role="dialog" aria-labelledby="transactionModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                                    
                        </div>
                    </div>
                </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue'
import store from '../services/store';
import Header from './Header';
const env = require('../config');
import { setUiLocale, t, currentLocale } from '../services/i18n'
Vue.prototype.$t = t

export default {
    name: 'CreateInvoice',
    components: {
        Header
    },
    data() {
        return {
            invoice: {
                name: "",
                type: 1,
                sell_date: new Date().toISOString().slice(0,10),
                issue_date: new Date().toISOString().slice(0,10),
                sum_net: 0,
                sum_vat: 0,
                sum_gross: 0,
                paid: 0,
            },
            transaction: {
                name: "",
                quantity: 1,
                price_net: "",
                vat: "",
                value_net: "",
                value_gross: ""            
            },
            transactions: [],
            clients: [],
            client: {},
            clientSelected: {},
            nextTxnId: 1,
            loading: "",
            status: "",
            errors: {}
        }
    },
    mounted() {
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.get(env.default.SERVER_ADDR + `client/user/${store.getters.user.id}`).then(res => {
          this.clients = res.data.clients;
        }).catch(err => {
            console.log(err);
            if(err.response.status == 401) {
                this.$router.push({ name: 'SignUp' })
            }
        })
    },
    methods: {
        saveTransaction() {
            this.errors = {};

            if(!this.transaction.name) {
                this.errors.name = "Required";
            }
            if(!this.transaction.quantity) {
                this.errors.quantity = "Required";
            }
            if(!this.transaction.price_net) {
                this.errors.price_net = "Required";
            }
            if(!this.transaction.vat) {
                this.errors.vat = "Required";
            }

            if(Object.keys(this.errors).length) {
                return false;
            }

            this.transactions.push({
                id: this.nextTxnId,
                name: this.transaction.name,
                quantity: this.transaction.quantity,
                price_net: this.transaction.price_net,
                vat: this.transaction.vat,
                value_net: this.transaction.value_net,
                value_gross: this.transaction.value_gross              
            });

            this.nextTxnId++;
            this.calcTotal();

            //clear form fields
            this.transaction = {
                name: "",
                quantity: 1,
                price_net: "",
                vat: "",
            };
        },
        calculateValues() {
            const vat = this.transaction.vat ? this.transaction.vat : 0;
            const value_net = this.transaction.value_net = this.transaction.quantity * this.transaction.price_net;
            this.transaction.value_gross = (value_net * (1 + vat / 100)).toFixed(2);
        },
        deleteTransaction(id) {
            this.transactions = this.transactions.filter(el => {
                return el.id !== id;
            });
            this.nextTxnId--;
            this.calcTotal();
        },
        calcTotal() {
            let sum_net = 0, sum_vat = 0, sum_gross = 0, quantity = 0;
            this.transactions.forEach(element => {
                sum_net += element.value_net * 100;
                sum_vat += element.vat * 100;
                sum_gross += element.value_gross * 100;
            });

            this.invoice.sum_net = sum_net;
            this.invoice.sum_vat = sum_vat;
            this.invoice.sum_gross = sum_gross;
        },
        selectClient() {
            this.client.company_name = this.clientSelected.company_name;
            this.client.nip = this.clientSelected.nip;
            this.client.address = this.clientSelected.address;
        },
        onSubmit() {
            let txn_name = [];
            let txn_quantity = [];
            let txn_price_net = [];
            let txn_vat = [];
            let txn_value_net = [];
            let txn_value_gross = [];

            this.transactions.forEach(element => {
                txn_name.push(element.name);
                txn_quantity.push(element.quantity);
                txn_price_net.push(element.price_net);
                txn_vat.push(element.vat);
                txn_value_net.push(element.value_net);
                txn_value_gross.push(element.value_gross);
            });

            let formData = {
                seller_id: store.getters.user.id,
                buyer_id: 8,
                name: this.invoice.name,
                type: this.invoice.type,
                sell_date: this.invoice.sell_date,
                issue_date: this.invoice.issue_date,
                sum_net: this.invoice.sum_net,
                sum_vat: this.invoice.sum_vat,
                sum_gross: this.invoice.sum_gross,
                paid: this.invoice.paid,
                //transactions: transactions,
                txn_name: txn_name,
                txn_quantity: txn_quantity,
                txn_price_net: txn_price_net,
                txn_vat: txn_vat,
                txn_value_net: txn_value_net,
                txn_value_gross: txn_value_gross
            }; 

            axios.defaults.headers.common['Authorization'] = store.getters.token;
            axios.post(env.default.SERVER_ADDR + 'invoice', formData).then(res => {
                this.loading = "";
                this.status = res.data.message;
            });
        }
    }
}
</script>

<style>
.error {
    color: red;
}
</style>