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
  stroke-width="1.5"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path d="M16.95 7.05L7.05 16.95" />
  <path d="M7.05 7.05L16.95 16.95" />
</svg>
