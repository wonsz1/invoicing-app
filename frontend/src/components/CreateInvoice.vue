<template>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>New Invoice</h3>
                    <form @submit.prevent="onSubmit">
                        <div class="form-group">
                            <label for="">Invoice name</label>
                            <input type="text" class="form-control" placeholder="eg FV/1222/10/2044" v-model="invoice.name" />
                        </div>
                        <div class="form-group">
                            <label for="">Price:</label> <span>{{invoice.total_price}} pln</span>
                        </div>

                        <hr/>
                        <button type="button" class="btn btn-primary" data-toogle="modal" data-target="#transactionModal">Add position</button>

                        <div class="modal fade" id="transactionModal" tabindex="-1" role="dialog" aria-labelledby="transactionModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Add</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="fom-group">
                                            <label for="">Name</label>
                                            <input type="text" id="txn_name_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">Quantity</label>
                                            <input type="text" id="txn_quantity_modal" class="form-control" />
                                        </div>
                                        <div class="form-group">
                                            <label for="">Price net</label>
                                            <input type="text" id="txn_price_net_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">VAT</label>
                                            <input type="text" id="txn_vat_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">Value net</label>
                                            <input type="text" id="txn_value_net_modal" class="form-control" />
                                        </div>
                                        <div class="fom-group">
                                            <label for="">Value gross</label>
                                            <input type="text" id="txn_value_gross_modal" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal" data-target="#transactionModal">X</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" data-target="#transactionModal" v-on:click="saveTransaction()">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="col-md-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Price net</th>
                                    <th scope="col">VAT</th>
                                    <th scope="col">Value net</th>
                                    <th scope="col">Value gross</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="txn in transactions">
                                    <tr :key="txn.id">
                                        <td>{{ txn.id }}</td>
                                        <td>{{ txn.name }}</td>
                                        <td>{{ txn.quantity }}</td>
                                        <td>{{ txn.price_net }}</td>
                                        <td>{{ txn.vat }}</td>
                                        <td>{{ txn.value_net }}</td>
                                        <td>{{ txn.value_gross }}</td>
                                        <td><button type="button" class="btn btn-danger" v-on:click="deleteTransaction(txn.id)">X</button></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                </div>
                
                <div class="form-group">
                    <button class="btn btn-primary">Create invoice</button>
                    {{ loading }}
                    {{ status }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
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
            status: "",
            // invoice: {
            //     name: "",
            //     quantity: 0,
            //     price_net: 0,
            //     vat: 0,
            //     value_net: 0,
            //     value_gross: 0,
            // },
        }
    },
    methods: {
        saveTransaction() {
            this.transactions.push({
                name: document.getElementById('txn_name_modal').value,
                quantity: docuemnt.getElementById('txn_quantity_modal').value,
                price_net: docuemnt.getElementById('txn_price_net_modal').value,
                vat: docuemnt.getElementById('txn_vat_modal').value,
                value_net: docuemnt.getElementById('txn_value_net_modal').value,
                value_gross: docuemnt.getElementById('txn_value_gross_modal').value              
            });

            this.nextTxnId++;
            this.calcTotal();

            //clear form fields
            document.getElementById('txn_name_modal').value = "";
            docuemnt.getElementById('txn_quantity_modal').value = "";
            docuemnt.getElementById('txn_price_net_modal').value = "";
            docuemnt.getElementById('txn_vat_modal').value = "";
            docuemnt.getElementById('txn_value_net_modal').value = "";
            docuemnt.getElementById('txn_value_gross_modal').value = ""; 
        },
        deleteTransaction(id) {
            this.transactions = this.transactions.filter(el => {
                return el.id !== id;
            });
            this.nextTxnId--;
            this.calcTotal();
        },
        calcTotal() {
            let sum_net = 0, sum_vat = 0, sum_gross = 0;
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