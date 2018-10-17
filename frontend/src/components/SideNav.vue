<script>
export default {
    name: "SideNav",
    props: ['email', 'company_name'],
    methods: {
        setActive(option) {
            this.$parent.$parent.inactive = option;
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
