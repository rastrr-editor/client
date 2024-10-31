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
  stroke-width="1.5"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path
    d="M12 21a9 9 0 1 1 0-18c4.97 0 9 3.582 9 8 0 1.06-.474 2.078-1.318 2.828-.844.75-1.989 1.172-3.182 1.172H14a2.002 2.002 0 0 0-1.872 2.783c.174.411.481.751.872.967a1.296 1.296 0 0 1 .306 1.483A1.295 1.295 0 0 1 12 21"
  />
  <path
    d="M9 10.8a.6.6 0 1 1 .001-1.201A.6.6 0 0 1 9 10.8Zm3.1-3.1a.6.6 0 1 0-.001-1.201A.6.6 0 0 0 12.1 7.7Zm4 3a.6.6 0 1 0-.001-1.201.6.6 0 0 0 .001 1.201Z"
  />
</svg>
