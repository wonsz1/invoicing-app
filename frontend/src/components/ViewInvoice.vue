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
                                <th scope="col">Name</th>
                                <th scope="col">Value net</th>
                                <th scope="col">Value gross</th>
                                <th scope="col">Client</th>
                                <th scope="col">Sell date</th>
                                <th scope="col">Issue date</th>
                                <th scope="col">Type</th>
                                <th scope="col">Status</th>
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
                                    <td v-if="inv.paid == 0">Unpaid</td>
                                    <td v-else>Paid</td>
                                    <td><a href="#" class="btn btn-success">Show</a></td>
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
    export default {
      name: 'ViewInvoice',
      data() {
        return {
          invoices: [],
          user: this.$route.params.user
        };
      },
      mounted() {
        axios.get(env.default.SERVER_ADDR + `invoice/user/${this.user.id}`).then(res => {
          if(res.data.status === true) {
            this.invoices = res.data.invoices;
          }
        })
      }
    }
</script>