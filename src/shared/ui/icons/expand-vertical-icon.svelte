<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let { ...rest }: SVGAttributes<SVGElement> = $props();
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 14 23"
  fill="none"
  stroke="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}>
  <path
    d="M3 6L7 2M7 2L11 6M7 2V20M3 16L7 20M7 20L11 16"
    stroke-linecap="round"
    stroke-linejoin="round" />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
