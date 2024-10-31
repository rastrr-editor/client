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
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path
    d="M10 17C13.866 17 17 13.866 17 10C17 6.134 13.866 3 10 3C6.134 3 3 6.134 3 10C3 13.866 6.134 17 10 17Z"
  />
  <path d="M21 21L15 15" />
</svg>
