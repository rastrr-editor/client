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
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" fill="currentColor" />
  <path
    d="M22 12c-2.666 4.666-6 7-10 7s-7.334-2.334-10-7c2.666-4.666 6-7 10-7s7.334 2.334 10 7Z"
    stroke-width="1.5"
  />
</svg>
