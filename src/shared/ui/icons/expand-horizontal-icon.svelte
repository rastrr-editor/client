<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let { ...rest }: SVGAttributes<SVGElement> = $props();
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 24 14"
  fill="none"
  stroke="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}>
  <path
    d="M17 2L21 6M21 6L17 10M21 6L3 6M7 2L3 6M3 6L7 10"
    stroke-linecap="round"
    stroke-linejoin="round" />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
