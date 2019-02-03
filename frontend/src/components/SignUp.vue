<script>
import Header from './Header';
import axios from 'axios';
import store from '../services/store'

export default {
    name: "SignUp",
    components: {
        Header
    },
    data() {
        return {
            model: {},
            loading: '',
            status: '',
            errors: {}
        };
    },
    methods: {
        validate() {
            if(!this.model.nip) {
                this.errors.nip = "NIP is required";
            } else {
                var reg = new RegExp('^[0-9]+$');
                if( !reg.test(this.model.nip) ) {
                    this.errors.nip = "Use only numbers";
                }
            }
            if(!this.model.email) {
                this.errors.email = "Email is required";
            } else {
                // //email validate
                // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                // if(re.test(this.model.email)) {
                //     //
                // }
            }
            if(!this.model.company) {
                this.errors.company = "Company name is required";
            }
            if(!this.model.account_number) {
                this.errors.account_number = "Account number is required";
            } else {
                var reg = new RegExp('^[0-9 ]+$');
                if( !reg.test(this.model.account_number) ) {
                    this.errors.account_number = "Wrong account number, you can use numbers and spaces";
                }
            }
            if(!this.model.password) {
                this.errors.password = "Passwords is required";
            }
            if(this.model.password != this.model.c_password) {
                this.errors.password = "Passwords don't match";
            }
            if(Object.keys(this.errors).length) {
                return false;
            }

            return true;
        },

        register() {
            this.errors = {};

            if(!this.validate()) {
                return false;
            }
            
            this.loading = "Registering, please wait";
            $('#registerModal').modal('hide');
            
            let formData = {
                nip: this.model.nip,
                email: this.model.email,
                company_name: this.model.company,
                password: this.model.password,
                account_number: this.model.account_number,
                address: this.model.address
            };

            store.dispatch('register', formData)
            .then(() => {
                this.loading = '';
                this.$router.push({ name: 'Dashboard' });
            })
            .catch(err => this.status = err);
        },

        login() {
            let formData = {
                email: this.model.email,
                password: this.model.password
            };
            this.loading = 'Signing in';

            store.dispatch('login', formData)
            .then(() => {
                this.loading = '';
                this.$router.push({ name: 'Dashboard' });
            })
            .catch(err => this.status = err);
        },

        logout() {
            this.$sotre.dispatch('logout')
            .then(() => this.$route.push({ name: 'SignUp'}))
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
                            
                            <p class="error">{{ status }}</p>

                            <p>Don't have account? </p>
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#registerModal">{{$t('register')}}</button>

                        </div>
                    </form>
                </div>
                <div class="col-md-4"></div>
            </div>
        </div>

        <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{{$t('create_account')}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                <div class="row">
                        <div class="col-md-12">
                            <form @submit.prevent="register">
                                <div class="form-group">
                                    <label for="">Nip:</label>
                                    <input type="text" class="form-control" v-model="model.nip" required/>
                                    <div class="error">{{ errors.nip }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="">Email:</label>
                                    <input type="email" class="form-control" v-model="model.email" required/>
                                    <div class="error">{{ errors.email }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="">Company name:</label>
                                    <input type="text" class="form-control" v-model="model.company" required/>
                                    <div class="error">{{ errors.company }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="">Account number:</label>
                                    <input type="text" class="form-control" v-model="model.account_number" required/>
                                    <div class="error">{{ errors.account_number }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="">Address:</label>
                                    <input type="text" class="form-control" v-model="model.address" required/>
                                    <div class="error">{{ errors.address }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="">Password:</label>
                                    <input type="password" class="form-control" v-model="model.password" required/>
                                    <div class="error">{{ errors.password }}</div>
                                </div>
                                <div class="form-group">
                                    <label for="">Confirm password:</label>
                                    <input type="password" class="form-control" v-model="model.c_password" required/>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-on:click="register()">{{$t('register')}}</button>
                </div>
            </div>
            </div>
        </div>

    </div>
</template>

<style>
    #registerModal {
        text-align: left;
    }
    .error {
        color: red;
        margin: 10px
    }
</style>