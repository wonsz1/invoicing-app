<script>
require('dotenv').config();
import Header from './Header';
import axios from 'axios';
export default {
    name: "SignUp",
    components: {
        Header
    },
    default() {
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
            if(this.model.password != this.model.c_password) {
                return false;
            }
            return true;
        }
    },
    register() {
        let formData = new FormData();
        if(!this.validate()) {
            alert('password don\'t match');
            return false;
        }
            
        formData.append('nip', this.model.nip);
        formData.append('email', this.model.email);
        formData.append('company_name', this.model.company_name);
        formData.append('password', this.model.password);
        this.loading = "Registering, please wait";

            axios.post(process.env.SERVER_ADDR + 'register', formData).then(res => {
                this.loading = '';
                if(res.data.status == true) {
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
        let formData = new FormData();
        formData.append('email', this.model.email);
        formData.append('password', this.model.password);
        this.login = 'Signing in';

        axios.post(process.env.SERVER_ADDR + 'login', formData).then(res => {
            this.loading = '';
            if(res.data.status == true) {
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
</script>