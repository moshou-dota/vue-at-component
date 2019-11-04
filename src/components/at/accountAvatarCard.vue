<template>
  <div class="account-list-block flex-start-center">
    <CommonAvatarCard class="account-avatar-container" :accountInfo="accountInfo"></CommonAvatarCard>
    <div class="account-content flex-center-center">
      <LineHidden
        class="account-name"
        :container-content="accountInfo.name"
        :container-style="containerStyle"
      ></LineHidden>
      <p v-show="accountInfo.remark" class="account-remark text-overflow">{{accountInfo.remark}}</p>
    </div>
  </div>
</template>

<script>
import LineHidden from '../line-hidden'
import CommonAvatarCard from '../avatar-card'
export default {
  name: 'accountAvatarCard',
  props: {
    accountInfo: {
      type: Object
    },
    rows: {
      type: Number,
      default: 1
    },
    lineHeight: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {
      containerStyle: {
        rows: 1,
        lineHeight: 20,
        className: 'content'
      }
    }
  },
  components: {
    LineHidden,
    CommonAvatarCard
  }
}
</script>

<style lang="scss" scoped>
.account-list-block {
  display: flex;
  align-items: center;
  height: 100%;
  &:hover,
  &.active {
    background-color: #f4f5f7;
     .account-content /deep/ .content::after {
      background: linear-gradient(to right, transparent, #f4f5f7 50%);
    }
  }
  .account-avatar-container {
    width: 48px;
    height: 50px;
    cursor: pointer;
    /deep/ .account-avatar {
      width: 42px;
      height: 42px;
    }
  }
  .account-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    flex-direction: column;
    margin-left: 12px;
    height: 100%;
    .account-name {
      margin: 0;
      width: 100%;
      color: #333333;
      line-height: 18px;
      max-height: 18px;
    }
    /deep/ .content::after {
      background: linear-gradient(to right, transparent, #fff 50%);
    }
    .account-remark {
      width: 100%;
      margin-top: 2px;
      font-size: 12px;
      color: #8f939f;
      line-height: 18px;
    }
  }
}
</style>