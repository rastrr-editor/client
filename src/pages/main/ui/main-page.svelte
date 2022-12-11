<script lang="ts">
  export let name: string = 'Rastrr';
</script>

<h1>Hello this is {name}!</h1>

<style lang="scss">
  h1 {
    @include typography(h1);
  }
</style>
