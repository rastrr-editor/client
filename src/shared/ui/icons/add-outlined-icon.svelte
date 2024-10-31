<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let { ...rest }: SVGAttributes<SVGElement> = $props();
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path
    x="0.5"
    y="0.5"
    width="23"
    height="23"
    rx="1.5"
    stroke-dasharray="2 2"
    d="M2 0.5H22A1.5 1.5 0 0 1 23.5 2V22A1.5 1.5 0 0 1 22 23.5H2A1.5 1.5 0 0 1 0.5 22V2A1.5 1.5 0 0 1 2 0.5z"
  />
  <path d="M12 9.083V14.917" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M9.084 12H14.917" stroke-linecap="round" stroke-linejoin="round" />
</svg>
