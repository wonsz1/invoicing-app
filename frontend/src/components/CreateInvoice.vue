<template>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>New Invoice</h3>
                    <form @submit.prevent="onSubmit">
                        <div class="row">
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label for="">{{$t('type')}}</label>
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
                                            <td><input type="text" id="txn_name_modal" class="form-control" /></td>
                                            <td><input type="text" id="txn_quantity_modal" class="form-control" value="1"  v-on:blur="calculateValues()" /></td>
                                            <td><input type="text" id="txn_price_net_modal" class="form-control" v-on:blur="calculateValues()" /></td>
                                            <td><input type="text" id="txn_vat_modal" class="form-control" v-on:blur="calculateValues()" /></td>
                                            <td><input type="text" id="txn_value_net_modal" class="form-control" /></td>
                                            <td><input type="text" id="txn_value_gross_modal" class="form-control" /></td>
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
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary">{{$t('create_invoice')}}</button>
                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>

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
import { setUiLocale, t, currentLocale } from '../services/i18n'
Vue.prototype.$t = t

export default {
    name: 'CreateInvoice',
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
            transactions: [],
            nextTxnId: 1,
            loading: "",
            status: ""
        }
    },
    methods: {
        saveTransaction() {
            this.transactions.push({
                id: this.nextTxnId,
                name: document.getElementById('txn_name_modal').value,
                quantity: document.getElementById('txn_quantity_modal').value,
                price_net: document.getElementById('txn_price_net_modal').value,
                vat: document.getElementById('txn_vat_modal').value,
                value_net: document.getElementById('txn_value_net_modal').value,
                value_gross: document.getElementById('txn_value_gross_modal').value              
            });

            this.nextTxnId++;
            this.calcTotal();

            //clear form fields
            this.clearTransaction();
        },
        calculateValues() {
            const quantity = document.getElementById('txn_quantity_modal').value;
            const price_net = document.getElementById('txn_price_net_modal').value;
            const vat = document.getElementById('txn_vat_modal').value ? document.getElementById('txn_vat_modal').value : 0;
            const value_net = document.getElementById('txn_value_net_modal').value = quantity * price_net;
            document.getElementById('txn_value_gross_modal').value = (value_net * (1 + vat / 100)).toFixed(2);
        },
        clearTransaction() {
            document.getElementById('txn_name_modal').value = "";
            document.getElementById('txn_quantity_modal').value = "";
            document.getElementById('txn_price_net_modal').value = "";
            document.getElementById('txn_vat_modal').value = "";
            document.getElementById('txn_value_net_modal').value = "";
            document.getElementById('txn_value_gross_modal').value = "";
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
        onSubmit() {
            let txn_names = [];
            let txn_quantity = [];
            let txn_price_net = [];
            let txn_vat = [];
            let txn_value_net = [];
            let txn_value_gross = [];

            this.transactions.forEach(element => {
                txn_names.push(element.name);
                txn_quantity.push(element.quantity);
                txn_price_net.push(element.price_net);
                txn_vat.push(element.vat);
                txn_value_net.push(element.value_net);
                txn_value_gross.push(element.value_gross);
            });

            let formData = {
                client_id: this.$route.params.user.id,
                name: this.invoice.name,
                type: this.invoice.type,
                sell_date: this.invoice.sell_date,
                issue_date: this.invoice.issue_date,
                sum_net: this.invoice.sum_net,
                sum_vat: this.invoice.sum_vat,
                sum_gross: this.invoice.sum_gross,
                paid: this.invoice.paid,
                //transactions: transactions,
                txn_names: txn_names,
                txn_quantity: txn_quantity,
                txn_price_net: txn_price_net,
                txn_vat: txn_vat,
                txn_value_net: txn_value_net,
                txn_value_gross: txn_value_gross
            }; 

            axios.post(env.default.SERVER_ADDR + 'invoice', formData).then(res => {
                this.loading = "";
                this.status = res.data.message;
            });
        }
    }
}
</script>