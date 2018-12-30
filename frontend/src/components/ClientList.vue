<template>
  <div class="container-fluid" style="padding: 0px;">
    <Header/>
    <div class="container">
        <div class="tab-pane fade show active">
            <div class="row">
                <div class="col-md-12">
                    <h3>{{$t('clients')}}</h3>
                    <form @submit.prevent="saveClient">
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
                                <tr>
                                    <td><button class="btn btn-primary ">{{$t('save')}}</button></td>
                                    <td><input type="text" id="client_name" class="form-control" v-model="client.company_name" /></td>
                                    <td><input type="text" id="client_address" class="form-control" placeholder="" v-model="client.address" /></td>
                                    <td><input type="text" id="client_nip" class="form-control" v-model="client.nip" /></td>
                                </tr>
                                
                                <template v-for="client in clients">
                                    <tr :key="client.id">
                                        <td scope="row">{{ client.id }}</td>
                                        <td>{{ client.company_name }}</td>
                                        <td>{{ client.address }}</td>
                                        <td>{{ client.nip }}</td>
                                        <td>
                                            <a href="#" class="btn btn-success" v-on:click="editClient(client.id)">{{$t('edit')}}</a>
                                            <a href="#" class="btn btn-danger" v-on:click="deleteClient(client.id)">{{$t('delete')}}</a>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </form>
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
      name: 'ClientList',
      components: {
        Header
      },
      data() {
        return {
            client: {
                id: 0,
                company_name: "",
                address: "",
                nip: "",
                email: "",
                account_number: "",
                user_id: store.getters.user.id
            },
            clients: [],
            user: store.getters.user
        };
      },
      methods: {
          editClient(id) {
            console.log(id);
            this.$router.push({ name: 'Client', params: { id: id }});
          },
          saveClient() {
            axios.defaults.headers.common['Authorization'] = store.getters.token;
            axios.post(env.default.SERVER_ADDR + 'client', this.client).then(res => {
                console.log(res.data.message);
                this.client.id = res.data.client_id
                this.clients.push(this.client);

                //reset client values
                this.client = {
                    id: 0,
                    company_name: "",
                    address: "",
                    nip: "",
                    email: "",
                    account_number: "",
                    user_id: store.getters.user.id
                }
            });
          },
          deleteClient(id) {
            axios.defaults.headers.common['Authorization'] = store.getters.token;
            axios.delete(env.default.SERVER_ADDR + `client/${id}`).then(res => {
                console.log(res.data.message);
                this.clients = this.clients.filter(obj => {
                    return obj.id !== id;
                });
            });
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