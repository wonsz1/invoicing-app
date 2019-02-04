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
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label for="">{{$t('number')}}</label>
                            <input type="text" class="form-control" placeholder="eg FV/1222/10/2044" v-model="invoice.name" />
                            <div class="error">{{ errors.invoice }}</div>
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
                        <p>{{ seller.company_name }}</p>
                        <p>NIP {{ seller.nip }}</p>
                        <p>{{ seller.address }}</p>
                        <p>{{ sellerBank.name }}</p>
                        <p>{{ seller.account_number }}</p>
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
                                            <input type="text" class="form-control" v-model="transaction.name" /> 
                                            <div class="error">{{ errors.name }}</div>
                                        </td>
                                        <td>
                                            <input type="text" class="form-control" value="1" v-model="transaction.quantity" v-on:blur="calculateValues()" />
                            
                                            <div class="error">{{ errors.quantity }}</div>
                                        </td>
                                        <td>
                                            <input type="text" class="form-control"  v-model="transaction.price_net" v-on:input="calculateValues()" />
                                            <div class="error">{{ errors.price_net }}</div>
                                        </td>
                                        <td>
                                            <input type="text" class="form-control"  v-model="transaction.vat" v-on:input="calculateValues()" />
                                            <div class="error">{{ errors.vat }}</div>
                                        </td>
                                        <td><input type="text" class="form-control" v-model="transaction.value_net" /></td>
                                        <td><input type="text" class="form-control" v-model="transaction.value_gross" /></td>
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
                                        <td>{{ (txn.price_net/1).toFixed(2) }}</td>
                                        <td>{{ txn.vat }}</td>
                                        <td>{{ (txn.value_net/1).toFixed(2) }}</td>
                                        <td>{{ (txn.value_gross/1).toFixed(2) }}</td>
                                        <td><button type="button" class="btn btn-danger" v-on:click="deleteTransaction(txn.id)">X</button></td>
                                    </tr>
                                </template>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{$t('sum')}}:</td>
                                    <td>{{ (invoice.sum_gross / 100).toFixed(2) }}</td>
                                    <td>pln</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="form-group">
                            <div class="error">{{ errors.transactions }}</div>
                            <div class="error">{{ errors.invoice }}</div>

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
                quantity: 1
            },
            transactions: [],
            clients: [],
            client: {},
            clientSelected: {},
            seller: store.getters.user,
            sellerBank: "",
            nextTxnId: 1,
            loading: "",
            status: "",
            errors: {}
        }
    },
    mounted() {
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.get(env.default.SERVER_ADDR + `client/user/${store.getters.user.uuid}`).then(res => {
          this.clients = res.data.clients;
        }).catch(err => {
            console.log(err);
            if(err.response.status == 401) {
                this.$router.push({ name: 'SignUp' })
            }
        })
        axios.get(env.default.SERVER_ADDR + `bank/${store.getters.user.bank_id}`).then(res => {
          this.sellerBank = res.data.bank;
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

            this.transaction.id = this.nextTxnId;
            this.transactions.push(this.transaction);

            this.nextTxnId++;
            this.calcTotal();

            //clear form fields
            this.clearTransaction();
        },
        calculateValues() {
            const vat = this.transaction.vat ? this.transaction.vat : 0;
            const value_net = this.transaction.value_net = this.transaction.quantity * this.transaction.price_net;
            this.transaction.value_gross = (value_net * (1 + vat / 100)).toFixed(2);
            this.$forceUpdate();
        },
        deleteTransaction(id) {
            this.transactions = this.transactions.filter(el => {
                return el.id !== id;
            });
            this.nextTxnId--;
            this.calcTotal();
        },
        clearTransaction() {
            this.transaction = {
                quantity: 1,
            };
        },
        calcTotal() {
            let sum_net = 0, sum_vat = 0, sum_gross = 0, quantity = 0;
            this.transactions.forEach(element => {
                sum_net += element.value_net * 100;
                sum_vat += (element.value_gross - element.value_net) * 100;
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
            this.errors = {};

            if(this.transactions.length < 1) {
                this.errors.transactions = "You need to add at least one transaction";
            }
            if(!this.invoice.name) {
                this.errors.invoice = "Invoice name is required";
            }
            if(Object.keys(this.errors).length) {
                return false;
            }

            let formData = {
                seller_id: store.getters.user.uuid,
                buyer_id: this.clientSelected.id,
                buyer: this.clientSelected, //use when client is not selected
                invoice: this.invoice,
                transactions: this.transactions
            }; 

            axios.defaults.headers.common['Authorization'] = store.getters.token;
            axios.post(env.default.SERVER_ADDR + 'invoice', formData).then(res => {
                this.loading = "";
                this.status = res.data.message;
                this.transactions = {};
                this.invoice = {
                    sell_date: new Date().toISOString().slice(0,10),
                    issue_date: new Date().toISOString().slice(0,10),
                };
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