<script>
import Header from './Header';
import axios from 'axios';

const env = require('../config');

export default {
    name: "SignUp",
    components: {
        Header
    },
    data() {
        return {
            model: {
                nip: '',
                email: '',
                password: '',
                c_password: '',
                company_name: '',
            },
            loading: '',
            status: '',
        };
    },
    methods: {
        validate() {
            return this.model.password === this.model.c_password
        },

        register() {
            if(!this.validate()) {
                alert('password don\'t match');
                return false;
            }
            
            let formData = {
                nip: this.model.nip,
                email: this.model.email,
                company_name: this.model.company_name,
                password: this.model.password
            };
            this.loading = "Registering, please wait";

            axios.post(env.default.SERVER_ADDR + 'register', formData).then(res => {
                this.loading = '';
                if(res.data.status === true) {
                    this.$router.push({
                        name: 'Dashboard',
                        params: { user: res.data.user }
                    });
                } else {
                    this.status = res.data.message;
                }
            });
        },

        login() {
            let formData = {
                email: this.model.email,
                password: this.model.password
            };
            this.loading = 'Signing in';
           
            axios.post(env.default.SERVER_ADDR + 'login', formData).then(res => {
                this.loading = '';
                if(res.data.status === true) {
                    this.$router.push({
                        name: 'Dashboard',
                        params: { user: res.data.user }
                    });
                } else {
                    this.status = res.data.message;
                }
            });
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="tab-pane active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
            <div class="row">
                <div class="col-md-4"></div>
                <div class="col-md-4">
                    <h3>Login</h3>
                    <form @submit.prevent="login">
                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" class="form-control" v-model="model.email" required/>
                        </div>

                        <div class="form-group">
                            <label for="">Password</label>
                            <input type="password" class="form-control" v-model="model.password" required/>
                        </div>

                        <div class="form-group">
                            <button class="btn btn-primary">Login</button>

                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>
                <div class="col-md-4"></div>
            </div>
        </div>


        <div class="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="pills-register-tab">
            <div class="row">
                <div class="col-md-12">
                    <form @submit.prevent="register">
                        <div class="form-group">
                            <label for="">Nip:</label>
                            <input class="form-control" v-model="model.nip" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Email:</label>
                            <input type="email" class="form-control" v-model="model.email" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Company name:</label>
                            <input class="form-control" v-model="model.company_name" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Password:</label>
                            <input type="password" class="form-control" v-model="model.password" required/>
                        </div>
                        <div class="form-group">
                            <label for="">Confirm password:</label>
                            <input type="password" class="form-control" v-model="model.c_password" required/>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary">Register</button>

                            {{ loading }}
                            {{ status }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>