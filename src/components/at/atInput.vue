<template>
  <div class="special-input-block" v-click-outside="closeSpecialAccountList">
    <ul
      class="special-account-container"
      ref="accountList"
      v-if="showAccountList && filterAccountList.length"
    >
      <li class="special-account-list" v-for="(item, index) in filterAccountList" :key="index">
        <accountAvatarCard
          :class="{'active': currentSelectAccountIndex === index}"
          :accountInfo="item"
          @click.native="callOutAccount(item)"
        ></accountAvatarCard>
      </li>
    </ul>
    <Input
      class="special-input"
      v-model="content"
      type="textarea"
      ref="atInput"
      :autosize="true"
      @on-keydown="specialKeyEvent"
      @on-change="changeInputContent"
      @click.native="clickInputContent"
      :placeholder="$t('home.home_nav.issue.input_here')"
    />
  </div>
</template>

<script>
// const accountList = [
//   {
//     name: 'cloudcare 服务专家',
//     identity: 'export',
//     url: '',
//     accountId: 'jiagouyun'
//   },
//   {
//     name: '陈同学陈同学陈同学陈同学陈同学',
//     identity: 'admin',
//     accountId: 'acnt-vmGfa1MmSjFGJQgJurbgKf1'
//   },
//   {
//     name: '陈同学陈同2',
//     remark: '备注备注备注备注备注',
//     accountId: 'acnt-vmGfa1MmSjFGJQgJurbgKf2'
//   },
//   {
//     name: '陈同学陈同3',
//     accountId: 'acnt-vmGfa1MmSjFGJQgJurbgKf3'
//   },
//   {
//     name: '陈同学陈同4',
//     accountId: 'acnt-vmGfa1MmSjFGJQgJurbgKf4'
//   }
// ]
import Diff from 'fast-diff'
import Caret from '../utils/cursor-position'
import ClickOutside from '../directive/Clickoutside'
import accountAvatarCard from './accountAvatarCard.vue'

export default {
  name: 'AtInput',
  props: {
    currentAccountId: String,
    accountList: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      content: '',
      showAccountList: false,
      currentSelectAccountIndex: 0,
      currentCallOutAccountList: [],
      currentCursorPos: 0,
      contentLog: '',
      filterInfo: {
        filterKey: '',
        startIndex: null,
        step: 0
      },
      currentInputEl: '',
      chatData: {}
    }
  },
  mounted() {
    this.currentInputEl = this.$refs['atInput'].$refs['textarea']
  },
  computed: {
    filterAccountList() {
      if (
        this.filterInfo &&
        (this.filterInfo.filterKey || this.filterInfo.filterKey !== '') &&
        this.showAccountList
      ) {
        return this.accountList.filter(item => {
          return item.name.indexOf(this.filterInfo.filterKey) > -1
        })
      }
      return this.accountList
    }
  },
  methods: {
    judgeIsHaveAtOption () {
      let diff = Diff(this.contentLog, this.content)
      if (diff && ~diff.findIndex(item => item[0] === 1 && item[1] && item[1].trimLeft(' ') === '@')) {
        this.specialMarkEvent()
      }
    },
    preventDefautl(e) {
      if (e && e.preventDefault) e.preventDefault()
      else window.event.returnValue = false
    },
    getCurrentCursorPos() {
      return Caret.getCursorPosition(this.currentInputEl)
    },
    setCursorCursorPos(pos) {
      Caret.setCursorPosition(this.currentInputEl, pos)
    },
    openSpecialAccountList() {
      this.showAccountList = true
    },
    closeSpecialAccountList() {
      this.showAccountList = false
      this.currentSelectAccountIndex = 0
    },
    specialMarkEvent(e) {
      this.resetFilterInfo()
      this.openSpecialAccountList()
      setTimeout(() => {
        this.saveCurrentCursorPos()
        this.saveCurrentFilterInfo('', this.currentCursorPos)
      }, 100)
    },
    saveCurrentCursorPos(e) {
      this.currentCursorPos = this.getCurrentCursorPos()
    },
    saveCurrentFilterInfo(key, pos) {
      this.filterInfo = {
        filterKey: key,
        startIndex: pos,
        step: 0
      }
    },
    resetFilterInfo() {
      this.saveCurrentFilterInfo(null, null)
    },
    callOutAccount(data) {
      this.closeSpecialAccountList()
      if (this.filterInfo.filterKey) {
        this.currentCursorPos = this.filterInfo.startIndex
        this.content =
          this.content.slice(0, this.currentCursorPos) +
          data.name +
          ' ' +
          this.content.slice(
            this.currentCursorPos + this.filterInfo.filterKey.length
          )
      } else {
        this.content =
          this.content.slice(0, this.currentCursorPos) +
          data.name +
          ' ' +
          this.content.slice(this.currentCursorPos)
      }
      this.updateCallOutAccountList(data.name.length + 1, this.currentCursorPos)
      this.contentLog = this.content
      this.currentCallOutAccountList.push({
        index: this.currentCursorPos - 1,
        ...data
      })
      this.$refs['atInput'].focus()
      this.currentCursorPos = this.currentCursorPos + data.name.length + 1
      setTimeout(() => {
        this.setCursorCursorPos(this.currentCursorPos)
      }, 0)
      this.resetFilterInfo()
    },
    specialKeyEvent(e) {
      if (e.keyCode === 8) {
        this.changeCursorPos(e, 'delete')
      } else if (e.keyCode === 37) {
        if (this.filterInfo.filterKey) {
          this.filterInfo.step++
        }
        this.changeCursorPos(e, 'left')
      } else if (e.keyCode === 39) {
        if (this.filterInfo.filterKey) {
          this.filterInfo.step--
        }
        this.changeCursorPos(e, 'right')
      } else if (e.keyCode === 38) {
        if (this.showAccountList) {
          this.preventDefautl(e)
          this.changeAccountListActived('up')
        } else {
          setTimeout(() => {
            this.changeCursorPos(e, 'up')
          }, 0)
        }
      } else if (e.keyCode === 40) {
        if (this.showAccountList) {
          this.preventDefautl(e)
          this.changeAccountListActived('down')
        } else {
          setTimeout(() => {
            this.changeCursorPos(e, 'down')
          }, 0)
        }
      } else if (e.keyCode === 13) {
        if (e.shiftKey) return
        this.preventDefautl(e)
        if (this.showAccountList && this.filterAccountList.length) {
          this.callOutAccount(
            this.filterAccountList[this.currentSelectAccountIndex]
          )
        } else {
          this.sendChatData()
        }
      } else if (e.keyCode === 32) {
        if (this.showAccountList) {
          this.closeSpecialAccountList()
          this.resetFilterInfo()
        }
      }
    },
    matchCallOutAccountList(pos, option) {
      return this.currentCallOutAccountList.findIndex(item => {
        let start = item.index
        let end = item.index + item.name.length + 1
        if (option === 'right') {
          start -= 1
          end -= 1
        }
        return pos >= start && end >= pos
      })
    },
    deleteInputContent(e, matchIndex) {
      let matchData = {}
      let matchDataLength = 0
      let contentArr = this.content.split('')
      if (matchIndex > -1) {
        this.preventDefautl(e)
        matchData = this.currentCallOutAccountList.splice(matchIndex, 1)[0]
        matchDataLength =
          (matchData.name && matchData.name.split('').length + 2) || 2
        matchDataLength =
          matchDataLength <= contentArr.length
            ? matchDataLength
            : contentArr.length
        contentArr.splice(matchData.index, matchDataLength)
        this.content = contentArr.join('')
        this.changeInputContent()
        // this.contentLog = this.content
      }
    },
    changeInputContent() {
      this.judgeIsHaveAtOption()
      this.updateCallOutAccountList(
        this.content.length - this.contentLog.length
      )
      this.updateAccoutListFilterKey()
      this.contentLog = this.content
    },
    changeCursorPos(e, option = 'click') {
      let matchData = {}
      let cursorPosIndex = this.getCurrentCursorPos() - 1
      let cursorEndPos = cursorPosIndex
      let matchIndex = this.matchCallOutAccountList(cursorPosIndex, option)
      if (matchIndex > -1) {
        matchData = this.currentCallOutAccountList.slice(
          matchIndex,
          matchIndex + 1
        )[0]
        if (option === 'click') {
          cursorEndPos = matchData.index + matchData.name.length + 2
        } else if (option === 'left') {
          cursorEndPos = matchData.index
        } else if (option === 'right') {
          cursorEndPos = matchData.index + matchData.name.length + 2
        } else if (option === 'up') {
          cursorEndPos = matchData.index
        } else if (option === 'down') {
          cursorEndPos = matchData.index + matchData.name.length + 2
        } else if (option === 'delete') {
          cursorEndPos = matchData.index
          this.deleteInputContent(e, matchIndex)
        }
        setTimeout(() => {
          this.setCursorCursorPos(cursorEndPos)
          this.currentCursorPos = cursorEndPos
        }, 0)
      } else {
        this.currentCursorPos = cursorPosIndex + 1
        if (this.showAccountList && this.filterInfo.filterKey) {
          if (option === 'click') {
            this.filterInfo.step =
              this.filterInfo.filterCursorPos - this.currentCursorPos
          }
        }
      }
    },
    changeAccountListActived(direction = 'down') {
      if (direction === 'down') {
        if (
          this.currentSelectAccountIndex <
          this.filterAccountList.length - 1
        ) {
          this.currentSelectAccountIndex++
          if (this.currentSelectAccountIndex > 3) {
            this.$refs['accountList'].scrollTop =
              (this.currentSelectAccountIndex - 3) * 67
          }
        }
      } else {
        if (this.currentSelectAccountIndex) {
          this.currentSelectAccountIndex--
          if (
            this.currentSelectAccountIndex <
            this.filterAccountList.length - 4
          ) {
            this.$refs['accountList'].scrollTop =
              (this.currentSelectAccountIndex - 3) * 67
          }
        }
      }
    },
    updateCallOutAccountList(step, pos) {
      let cursorPosIndex = pos || this.getCurrentCursorPos()
      this.currentCallOutAccountList.forEach((item, index) => {
        let end = item.index + item.name.length + 1
        if (cursorPosIndex <= end) {
          this.currentCallOutAccountList[index].index =
            this.currentCallOutAccountList[index].index + step
        }
      })
    },
    clickInputContent(e) {
      if (this.showAccountList) this.closeSpecialAccountList()
      this.changeCursorPos(e, 'click')
    },
    updateAccoutListFilterKey() {
      let currentCursorPos = this.getCurrentCursorPos()
      let startIndex = this.filterInfo.startIndex
      if (startIndex || startIndex === 0) {
        if (currentCursorPos >= startIndex) {
          let endIndex = currentCursorPos + this.filterInfo.step
          let val = this.content.slice(startIndex - 1, endIndex) + ' '
          if (val.trim() && val.trim()[0] === '@') {
            this.filterInfo.filterKey =
              val.match(/@([^@\s]*)\s/) && val.match(/@([^@\s]*)(\s)?/)[1]
            this.filterInfo.filterCursorPos = currentCursorPos
            this.$nextTick(() => {
              if (this.filterAccountList.length) {
                if (
                  this.filterAccountList.length <=
                  this.currentSelectAccountIndex
                ) {
                  this.currentSelectAccountIndex =
                    this.filterAccountList.length - 1
                }
              } else {
                this.currentSelectAccountIndex = 0
              }
            })
          } else {
            this.closeSpecialAccountList()
            this.resetFilterInfo()
          }
        } else {
          this.closeSpecialAccountList()
          this.resetFilterInfo()
        }
      }
    },
    sendChatData() {
      if (!this.content) return
      let data = {}
      let callList = this.currentCallOutAccountList || []
      if (callList.length) {
        data = {
          content: '',
          atInfoJSON: {}
        }
        callList.sort((a, b) => {
          return a.index - b.index
        })
        callList.forEach((item, index) => {
          if (index) {
            data.content +=
              this.content.slice(
                callList[index - 1].index + callList[index - 1].name.length + 1,
                item.index
              ) +
              '@' +
              item.accountId +
              ' '
          } else {
            data.content +=
              this.content.slice(0, item.index) + '@' + item.accountId + ' '
          }
          if (item.identity === 'export') {
            if (data.atInfoJSON.serviceMap) {
              data.atInfoJSON.serviceMap[item.accountId] = item.name
            } else {
              data.atInfoJSON.serviceMap = {}
              data.atInfoJSON.serviceMap[item.accountId] = item.name
            }
          } else {
            if (data.atInfoJSON.accountIdMap) {
              data.atInfoJSON.accountIdMap[item.accountId] = item.name
            } else {
              data.atInfoJSON.accountIdMap = {}
              data.atInfoJSON.accountIdMap[item.accountId] = item.name
            }
          }
        })
        data.content += this.content.slice(
          callList[callList.length - 1].index +
            callList[callList.length - 1].name.length +
            1
        )
      } else {
        data = { content: this.content }
      }
      this.$emit('sendChatMsg', data)
      this.closeSpecialAccountList()
      // this.contentLog = ''
      this.clearContent()
      this.currentCallOutAccountList = []
      this.changeInputContent()
    },
    autoFocus () {
      this.$refs['atInput'].focus()
    },
    clearContent () {
      this.content = ''
    }
  },
  components: {
    accountAvatarCard
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
.special-input-block {
  position: relative;
  .special-account-container {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    padding: 16px 0;
    width: 310px;
    max-height: 288px;
    z-index: 100;
    overflow: hidden;
    overflow-y: auto;
    border-radius: 3px;
    background-color: #ffffff;
    box-shadow: 0 6px 15px 0 rgba(0, 0, 0, 0.1);
    .special-account-list {
      height: 67px;
    }
    .account-list-block {
      padding: 0 16px;
    }
  }
  .special-input {
    width: 100%;
    /deep/ .ivu-input {
      line-height: 26px;
    }
  }
}
</style>