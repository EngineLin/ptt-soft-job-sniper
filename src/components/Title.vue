<script>
export default {
  name: 'Title'
}
</script>

<template lang="pug">
el-row
  el-col
    el-row(type='flex' justify='center')
      el-col( :span='18')
        h1 Ptt Soft_Job Sniper
  el-col.h3_wrapper(:span='24')
    h3 每小時即時爬取 Soft_Job 版的徵才資訊並寄給您。

</template>

<style lang="sass" scoped>
h1
  font-size: 4rem
  text-align: center

h3
  font-size: 2rem
  text-align: center

.h3_wrapper
  padding: 10px
</style>

