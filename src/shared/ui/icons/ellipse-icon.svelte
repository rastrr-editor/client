<script lang="ts">
  interface Props {
    [key: string]: any
  }

  let { ...rest }: Props = $props();
  
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}>
  <circle cx="12" cy="12" r="8" />
</svg>
