<template>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>Invoices list</h3>
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
                                <th scope="col">{{$t('name')}}</th>
                                <th scope="col">{{$t('type')}}</th>
                                <th scope="col">{{$t('status')}}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="inv in invoices">
                                <tr :key="inv.id">
                                    <td scope="row">{{ inv.id }}</td>
                                    <td>{{ inv.name }}</td>
                                    <td>{{ inv.sum_net }}</td>
                                    <td>{{ inv.sum_gross }}</td>
                                    <td>{{ inv.client_id }}</td>
                                    <td>{{ inv.sell_date }}</td>
                                    <td>{{ inv.issue_date }}</td>
                                    <td>{{ inv.name }}</td>
                                    <td>{{ inv.type }}</td>
                                    <td v-if="inv.paid == 0">{{$t('unpaid')}}</td>
                                    <td v-else>{{$t('paid')}}</td>
                                    <td><a href="#" class="btn btn-success">{{$t('show')}}</a></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import store from '../services/store';
    const env = require('../config');

    export default {
      name: 'ViewInvoice',
      data() {
        return {
          invoices: [],
          user: store.getters.user
        };
      },
      mounted() {
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.get(env.default.SERVER_ADDR + `invoice/user/${store.getters.user.id}`).then(res => {
          if(res.data.status === true) {
            this.invoices = res.data.invoices;
          }
        })
      }
    }
</script>