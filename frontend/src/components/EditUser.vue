<script>
import Header from './Header';
import axios from 'axios';
import store from '../services/store'
const env = require('../config');

export default {
    name: "EditUser",
    components: {
        Header
    },
    data() {
        return {
            user: {},
            loading: '',
            status: '',
        };
    },
    methods: {
        update() {
            this.loading = "Updating, please wait";
            let formData = this.user;
            
            axios.defaults.headers.common['Authorization'] = store.getters.token;
            axios.post(env.default.SERVER_ADDR + 'user', formData).then(res => {
                this.loading = "";
                this.status = res.data.message;
                store.state.user = JSON.stringify(this.user);
            })
        },
    },
    mounted() {
        var self = this;
        axios.defaults.headers.common['Authorization'] = store.getters.token;
        axios.get(env.default.SERVER_ADDR + `user/${store.getters.user.uuid}`).then(res => {
          this.user = res.data.user;
          this.user.user_id = store.getters.user.id;
        }).catch(err => {
            if(err.response.status == 401) {
                this.$router.push({ name: 'SignUp' })
            }
        })
    }
}
</script>

<template>
    <div class="container">
        <Header/>
        <div class="tab-pane" id="pills-update" role="tabpanel">
            <div class="row">
                <div class="col-md-6">
                    <form @submit.prevent="update">
                        <div class="form-group">
                            <label for="">Nip:</label>
                            <input class="form-control" v-model="user.nip" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" class="form-control" v-model="user.email" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Company name:</label>
                            <input class="form-control" v-model="user.company_name" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Address:</label>
                            <input type="text" class="form-control" v-model="user.address" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Account number:</label>
                            <input type="text" class="form-control" v-model="user.account_number" required/>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary">Update</button>
                            <p>{{ loading }}</p>
                            <p>{{ status }}</p>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>