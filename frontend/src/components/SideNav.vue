<script>
import store from '../services/store';

console.log(store.getters.token);
console.log(store.getters.user.company_name);

export default {
    name: "SideNav",
    data() {
        return {
            active: 'create',
            user: store.getters.user
        };
    },
    methods: {
        setActive(option) {
            console.log(option);
            this.active = option;
            this.$parent.$parent.isactive = option;
        },
        openNav() {
            document.getElementById("leftsidenav").style.width = '20%';
        },
        closeNav() {
            document.getElementById('leftsidenav').style.width = '0%';
        },
        logout() {
            store.dispatch('logout');
        },
        login() {
            store.dispatch('login');
        }
    },
    computed: {
        isLoggedIn() {
            return store.getters.isLoggedIn
        }
    }
}
</script>

<template>
    <div>
        <span style="font-size:30px; cursor:pointer" v-on:click="openNav">&#9776;</span>
        <div id="leftsidenav" class="sidenav">
            <p style="cursor:pointer" v-on:click="closeNav">Close Nav</p>
            <p v-if="isLoggedIn">Company: {{ user.company_name }}</p>
            <p v-if="isLoggedIn">User: {{ user.email }}</p>
            <p class="clickable" v-on:click="setActive('create')">Create invoice</p>
            <p class="clickable" v-on:click="setActive('view')">View invoices</p>
            <p class="clickable" v-if="isLoggedIn" v-on:click="logout">Logout</p>
            <a href="/" v-if="!isLoggedIn" >Login</a>
        </div>
    </div>
</template>
<style>
.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #fafafa;
  color: #818181;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  text-align: center;
}
.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}
.sidenav a:hover {
  color: #f1f1f1;
}
.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}
@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
  .sidenav a {
    font-size: 18px;
  }
}
.clickable {
  cursor: pointer;
}
</style>