<script>
export default {
  name: 'InputBoard',
  data: () => ({
    inputValue: '',
    emaillist: [],
    loading: false,
  }),

  methods: {
    send() {
      const value = this.inputValue;
      if (!value) return;
      if (value.indexOf('@') === -1) {
        this.$message({ type: 'error', message: '請輸入信箱' });
      } else {
        this.$http
          .post('/api/mail', { email: value })
          .then(res =>
            this.$message({
              type: res.data.success ? 'success' : 'warning',
              message: res.data.description,
            })
          )
          .catch(err => this.$message({ type: 'error', message: err }));
      }
      this.inputValue = '';
    },
    querySearch(queryString, cb) {
      const emaillist = this.emaillist;
      const results = queryString
        ? emaillist.filter(this.createFilter(queryString))
        : emaillist;
      cb(results);
    },
    createFilter(queryString) {
      return emaillist =>
        emaillist.value.toLowerCase().indexOf(queryString.toLowerCase() === 0);
    },
    loadAll() {
      return [
        { value: '@gmail.com' },
        { value: '@gmail.com.tw' },
        { value: '@yahoo.com' },
        { value: '@yahoo.com.tw' },
        { value: '@pchome.com' },
        { value: '@pchome.com.tw' },
        { value: '@hotmail.com' },
        { value: '@hotmail.com.com' },
        { value: '@livemail.tw' },
      ];
    },
  },

  mounted() {
    this.emaillist = this.loadAll();
  },
};
</script>

<template lang="pug">
el-row
  el-col#board(:span='20' offset='2')
    el-row
      el-col#board_message(:span='20' offset='2')
        h4 加入我們，立即收到 PTT 軟體求才訊息。
    el-row
      el-col#input-wrapper(:span='20' offset='2')
        el-autocomplete#input(
          type='success'
          v-model='inputValue'
          :fetch-suggestions="querySearch"
          placeholder='輸入您的信箱'
          @keyup.enter='send'
        )
          el-button(
            slot="append"
            icon='el-icon-edit'
            :loading='loading'
            @click='send'
          ) 加入

</template>

<style lang="sass" scoped>
#board
  background-color: #CA82F8
  border-radius: 15px

#board_message
  padding-top: 20px
  min-height: 50px

h4
  text-align: center
  font-size: 1.3rem

#input_wrapper
  min-height: 300px

#input
  padding-top: 30px
  min-height: 130px
  width: 100%

</style>


