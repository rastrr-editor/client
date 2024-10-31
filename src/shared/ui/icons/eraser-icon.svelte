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
    d="M19.0001 20L8.50006 20L4.29006 15.7C4.10381 15.5126 3.99927 15.2592 3.99927 14.995C3.99927 14.7308 4.10381 14.4774 4.29006 14.29L14.2901 4.29C14.4774 4.10375 14.7309 3.99921 14.9951 3.99921C15.2592 3.99921 15.5127 4.10375 15.7001 4.29L20.7001 9.29C20.8863 9.47736 20.9909 9.73081 20.9909 9.995C20.9909 10.2592 20.8863 10.5126 20.7001 10.7L11.5001 20"
  />
  <path d="M18 13.3L11.7 7" />
</svg>
