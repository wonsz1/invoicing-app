<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>{{$t('invoices')}}</h3>

                    <div v-if="status" class="alert alert-primary" role="alert">
                        {{ status }}
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{{$t('name')}}</th>
                                <th scope="col">{{$t('value_net')}}</th>
                                <th scope="col">{{$t('value_gross')}}</th>
                                <th scope="col">{{$t('client')}}</th>
                                <th scope="col">{{$t('sell_date')}}</th>
                                <th scope="col">{{$t('issue_date')}}</th>
                                <th scope="col">{{$t('status')}}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="inv in invoices">
                                <tr :key="inv.id">
                                    <td scope="row">{{ inv.id }}</td>
                                    <td>{{ inv.name }}</td>
                                    <td>{{ (inv.sum_net / 100).toFixed(2) }}zł</td>
                                    <td>{{ (inv.sum_gross / 100).toFixed(2) }}zł</td>
                                    <td>{{ inv.client }}</td>
                                    <td>{{ new Date(inv.sell_date).toISOString().split("T")[0] }}</td>
                                    <td>{{ new Date(inv.issue_date).toISOString().split("T")[0] }}</td>
                                    <td v-if="inv.paid == 0">{{$t('unpaid')}}</td>
                                    <td v-else>{{$t('paid')}}</td>
                                    <td>
                                        <a href="#" class="btn btn-success" v-on:click="viewInvoice(inv.uuid)">{{$t('show')}}</a>
                                        <a href="#" class="btn btn-danger" v-on:click="deleteInvoice(inv.uuid)">{{$t('delete')}}</a>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
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
      name: 'InvoiceList',
      components: {
        Header
      },
      data() {
        return {
          invoices: [],
          user: store.getters.user,
          status: ""
        };
      },
      methods: {
          viewInvoice(id) {
            console.log(id);
            this.$router.push({ name: 'Invoice', params: { id: id }});
          },
          deleteInvoice(id) {
            axios.defaults.headers.common['Authorization'] = store.getters.token;
            axios.delete(env.default.SERVER_ADDR + `invoice/user/${store.getters.user.uuid}/${id}`).then(res => {
                this.status = res.data.message;
                this.invoices = this.invoices.filter(obj => {
                    return obj.id !== id;
                });
            });
          }
      },
      mounted() {
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.get(env.default.SERVER_ADDR + `invoice/user/${store.getters.user.uuid}`).then(res => {
          this.invoices = res.data.invoices;
        }).catch(err => {
            if(err.response.status == 401) {
                this.$router.push({ name: 'SignUp' })
            }
        })
      }
    }
</script>