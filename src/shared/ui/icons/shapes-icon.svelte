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
  stroke-width="1.2"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}>
  <path
    x="11.5"
    y="4.5"
    width="5"
    height="5"
    d="M13.8 5.4H19.8V11.4H13.8V5.4z" />
  <path
    cx="4"
    cy="8"
    r="3.5"
    d="M9 9.6A4.2 4.2 0 0 1 4.8 13.8A4.2 4.2 0 0 1 0.6 9.6A4.2 4.2 0 0 1 9 9.6z" />
  <path d="M6.723 21.3L11.4 13.2L16.077 21.3H6.723Z" />
</svg>
