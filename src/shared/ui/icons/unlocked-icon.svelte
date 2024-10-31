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
    d="M17 11H7C5.895 11 5 11.895 5 13V19C5 20.105 5.895 21 7 21H17C18.105 21 19 20.105 19 19V13C19 11.895 18.105 11 17 11Z"
  />
  <path
    d="M8 11V6C8 4.939 8.421 3.922 9.172 3.172C9.922 2.421 10.939 2 12 2C13.061 2 14.078 2.421 14.828 3.172C15.579 3.922 16 4.939 16 6"
  />
</svg>
