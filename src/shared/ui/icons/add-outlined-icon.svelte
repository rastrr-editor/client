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
  <rect
    x="0.5"
    y="0.5"
    width="1.4em"
    height="1.4em"
    rx="1.5"
    stroke-dasharray="2 2"
  />
  <path
    d="M12 9.08334V14.9167"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path d="M9.0835 12H14.9168" stroke-linecap="round" stroke-linejoin="round" />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
