<script>
import store from '../services/store';

export default {
    name: "SideNav",
    data() {
        return {
            active: 'create',
            user: store.getters.user
        };
    },
    methods: {
        openNav() {
            document.getElementById("leftsidenav").style.width = '15%';
            document.getElementById("rightsidenav").style.width = '100%';
        },
        closeNav() {
            document.getElementById('leftsidenav').style.width = '0%';
            document.getElementById("rightsidenav").style.width = '0%';
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
            <p v-if="isLoggedIn" id="company-name">
                <router-link :to="{ name: 'EditUser' }">{{ user.company_name }}</router-link>
                </p>
            <p v-if="isLoggedIn">{{ user.name }}</p>
            <router-link :to="{ name: 'CreateInvoice' }">{{$t('create_inv')}}</router-link>
            <router-link :to="{ name: 'Invoices' }">{{$t('list_inv')}}</router-link>
            <router-link :to="{ name: 'Clients' }">{{$t('client_list')}}</router-link>
            <p class="clickable" v-if="isLoggedIn" v-on:click="logout">{{$t('logout')}}</p>
            <a href="/" v-if="!isLoggedIn" >{{$t('login')}}</a>
        </div>
        <div id="rightsidenav" class="sidenavoverlay" v-on:click="closeNav"></div>
    </div>
</template>
<style>
.sidenavoverlay {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
}
.sidenav {
  height: 100%;
  width: 15%;
  position: fixed;
  z-index: 10;
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
  text-decoration: none;
  color: #818181;
  display: block;
  transition: 0.3s;
  margin-bottom: 1rem;
}
.sidenav a:hover {
  font-weight: bold;
}
.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}
#company-name a {
    color: #2f4ade;;
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