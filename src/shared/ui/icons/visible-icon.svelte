<script lang="ts">
  interface $$Props extends svelte.JSX.SVGProps<SVGSVGElement> {}
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  stroke="currentColor"
  {...$$restProps}
>
  <path
    d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="currentColor"
  />
  <path
    d="M22 12c-2.666 4.666-6 7-10 7s-7.334-2.334-10-7c2.666-4.666 6-7 10-7s7.334 2.334 10 7Z"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
  />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
