<template>
  <div class="account-avatar-card-block">
    <img :src="avatarUrl" class="account-avatar">
    <span
      v-if="accountIdentity"
      class="account-identity"
      :class="accountIdentity.cls"
    >{{accountIdentity.name}}</span>
  </div>
</template>

<script>
import userDefaultUrl from '../../assets/images/icon_avatar_default.svg'
import staffDefaultUrl from '../../assets/images/icon_experts_avatar.svg'

export default {
  name: 'CommonAvatarCard',
  props: {
    accountInfo: Object
  },
  data() {
    return {}
  },
  computed: {
    avatarUrl() {
      if (this.accountInfo) {
        if (this.accountInfo.url) {
          return this.accountInfo.url
        } else if (this.accountInfo.isSupport) {
          return staffDefaultUrl
        }
      }
      return userDefaultUrl
    },
    accountIdentity() {
      if (this.accountInfo) {
        if (this.accountInfo.isSupport) {
          return {
            cls: 'export',
            name: '专家'
          }
        } else if (this.accountInfo.isAdmin) {
          return {
            cls: 'owner',
            name: '拥有者'
          }
        } else if (this.accountInfo.teamRoles) {
          return {
            cls: 'admin',
            name: '管理员'
          }
        } else if (this.accountInfo.showIdentity) {
          return {
            cls: this.accountInfo.cls,
            name: this.accountInfo.name
          }
        }
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.account-avatar-card-block {
  position: relative;
  text-align: center;
  .account-avatar {
    width: 100%;
    border-radius: 50%;
  }
  .account-identity {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 18px;
    font-size: 12px;
    color: #ffffff;
    border-radius: 3px;
    &.export {
      background-color: #85b5ff;
    }
    &.owner {
      background-color: #ffd3a2;
    }
    &.admin {
      background-color: #2A7AF7;
    }
  }
}
</style>