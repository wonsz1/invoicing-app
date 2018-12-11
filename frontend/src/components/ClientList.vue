<template>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>{{$t('clients')}}</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{{$t('name')}}</th>
                                <th scope="col">{{$t('address')}}</th>
                                <th scope="col">{{$t('nip')}}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="client in clients">
                                <tr :key="client.id">
                                    <td scope="row">{{ client.id }}</td>
                                    <td>{{ client.name }}</td>
                                    <td>{{ client.address }}</td>
                                    <td>{{ client.nip }}</td>
                                    <td><a href="#" class="btn btn-success" v-on:click="editClient(client.id)">{{$t('edit')}}</a></td>
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
      name: 'ClientList',
      data() {
        return {
          clients: [],
          user: store.getters.user
        };
      },
      methods: {
          editClient(id) {
            console.log(id);
            this.$router.push({ name: 'Client', params: { id: id }});
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
      }
    }
</script>