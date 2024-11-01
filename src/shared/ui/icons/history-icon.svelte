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
  stroke-width="1.5"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}>
  <path d="M12 8v4l2 2" />
  <path
    d="M3.05 11.688a8.998 8.998 0 0 1 8.851-8.087 8.995 8.995 0 0 1 9.033 7.883 9.002 9.002 0 0 1-6.815 9.864 8.998 8.998 0 0 1-10.569-5.66m-.5 5v-5h5" />
</svg>
