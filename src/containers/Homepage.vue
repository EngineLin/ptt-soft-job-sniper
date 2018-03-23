<script>
// import Navigator from '@/components/Navigator';
import Title from '@/components/Title'
import InputBoard from '@/components/InputBoard';
import Footer from '@/components/Footer'

export default {
  name: 'Homepage',
  components: {
    'navigator': Navigator,
    'input-board': InputBoard,
    'title-component': Title,
    'footer-component': Footer,
  },
};
</script>

<template lang="pug">
el-container
  //- el-header
  //-   navigator

  el-main
    title-component
    input-board

  el-footer#footer(type='flex' align='center' height='25px')
    footer-component

</template>

<style lang='sass'>

</style>

