<script lang="ts">
  interface Props {
    [key: string]: any
  }

  let { ...rest }: Props = $props();
  
</script>

<svg
  width="1em"
  height="1em"
  viewBox="0 0 23 22"
  fill="none"
  stroke="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  {...rest}
>
  <path
    d="M7.98943 18.6281C7.77873 18.4337 7.63243 18.1794 7.57018 17.8993L3 2.00037L18.8996 6.57675C19.1794 6.63893 19.4335 6.7853 19.6278 6.99622C19.8221 7.20715 19.9473 7.47253 19.9867 7.75677C20.026 8.04101 19.9777 8.3305 19.848 8.58641C19.7184 8.84232 19.5137 9.05241 19.2614 9.18848L12.9504 11.9643L10.1784 18.2604C10.0426 18.513 9.83286 18.718 9.57737 18.8479C9.32189 18.9778 9.03285 19.0264 8.74902 18.9871C8.46519 18.9478 8.20014 18.8226 7.98943 18.6281Z"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M20.6667 15.6667L22 17M22 17L20.6667 18.3333M22 17H19.3333M15.3333 15.6667L14 17M14 17L15.3333 18.3333M14 17H16.6667M16.6667 19.6667L18 21M18 21L19.3333 19.6667M18 21V18.3333M19.3333 14.3333L18 13M18 13L16.6667 14.3333M18 13V15.6667"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

<style lang="scss">
  svg * {
    transition: all $animation-time;
  }
</style>
