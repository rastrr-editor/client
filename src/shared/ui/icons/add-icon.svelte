<script lang="ts">
  interface $$Props extends svelte.JSX.SVGProps<SVGSVGElement> {}
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
>
  <path
    d="M12 5v14m-7-7h14"
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
