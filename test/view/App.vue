<template>
  <div id="app">
    <AtComponent :currentAccountId="currentAccountId" :accountList="accountList"></AtComponent>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      accountList: [
        {
          name: "cloudcare 服务专家",
          identity: "export",
          url: "",
          accountId: "jiagouyun"
        },
        {
          name: "陈同学陈同学陈同学陈同学陈同学",
          identity: "admin",
          accountId: "acnt-vmGfa1MmSjFGJQgJurbgKf1"
        },
        {
          name: "陈同学陈同2",
          remark: "备注备注备注备注备注",
          accountId: "acnt-vmGfa1MmSjFGJQgJurbgKf2"
        },
        {
          name: "陈同学陈同3",
          accountId: "acnt-vmGfa1MmSjFGJQgJurbgKf3"
        },
        {
          name: "陈同学陈同4",
          accountId: "acnt-vmGfa1MmSjFGJQgJurbgKf4"
        }
      ],
      currentAccountId: 'acnt-vmGfa1MmSjFGJQgJurbgKf1'
    };
  }
};
</script>

<style lang="scss" scoped>
</style>