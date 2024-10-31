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
  xmlns="http://www.w3.org/2000/svg"
  {...rest}>
  <path
    d="M3.07722 9.10081L12 2.61803L20.9228 9.10081L17.5146 19.5902H6.48542L3.07722 9.10081Z" />
</svg>
