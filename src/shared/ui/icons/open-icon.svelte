<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let { ...rest }: SVGAttributes<SVGElement> = $props();
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 8 10"
  fill="none"
  stroke="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path
    d="M5 0.5V2.5C5 2.63261 5.05268 2.75979 5.14645 2.85355C5.24021 2.94732 5.36739 3 5.5 3H7.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M6.5 9.5H1.5C1.23478 9.5 0.98043 9.39464 0.792893 9.20711C0.605357 9.01957 0.5 8.76522 0.5 8.5V1.5C0.5 1.23478 0.605357 0.98043 0.792893 0.792893C0.98043 0.605357 1.23478 0.5 1.5 0.5H5L7.5 3V8.5C7.5 8.76522 7.39464 9.01957 7.20711 9.20711C7.01957 9.39464 6.76522 9.5 6.5 9.5Z"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path d="M2.5 7.5H5.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M2.5 5.5H5.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
