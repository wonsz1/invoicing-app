<script>
export default {
    name: "SideNav",
    props: ['email', 'company_name'],
    data() {
        return {
            active: 'create'
        };
    },
    methods: {
        setActive(option) {
            this.active = option;
            this.$parent.inactive = option;
        },
        openNav() {
            document.getElementById("leftsidenav").style.width = '20%';
        },
        closeNav() {
            document.getElementById('leftsidenav').style.width = '0%';
        }
    }
}
</script>

<template>
    <div>
        <span style="font-size:30px; cursor:pointer" v-on:click="openNav">&#9776;</span>
        <div id="leftsidenav" class="sidenav">
            <p style="cursor:pointer" v-on:click="closeNav">Close Nav</p>
            <p>Company: {{ company_name }}</p>
            <h3>User: {{ email }}</h3>
            <p class="clickable" v-on:click="setActive('create')">Create invoice</p>
            <p class="clickable" v-on:click="setActive('view')">View invoices</p>
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