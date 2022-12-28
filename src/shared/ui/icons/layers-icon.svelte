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
    d="M18 4H10c-1.104 0 -1.999 0.896 -1.999 2v8c0 1.104 0.895 1.999 1.999 1.999H18c1.104 0 2 -0.895 2 -1.999V6c0 -1.104 -0.896 -2 -2 -2Z"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M16 16V18a2 2 0 0 1 -1.999 2H6A2 2 0 0 1 4 18V10A2 2 0 0 1 6 8h2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
