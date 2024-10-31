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
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path
    d="M8.99 20.628a1.408 1.408 0 0 1-.42-.729L4 4l15.9 4.576a1.404 1.404 0 0 1 .948 2.01c-.13.256-.334.466-.587.602l-6.31 2.776-2.773 6.296a1.405 1.405 0 0 1-2.189.368Z"
  />
</svg>
