<script lang="ts">
  interface Props {
    image: string;
    name: string;
    role: string;
    linkHref: string;
    linkImage: string;
    linkImageAlt: string;
    linkTitle: string;
  }

  let {
    image,
    name,
    role,
    linkHref,
    linkImage,
    linkImageAlt,
    linkTitle
  }: Props = $props();
</script>

<div class="contributor">
  <img src={image} alt={name} />
  <span class="name">{name}</span>
  <span class="role">{role}</span>
  <a href={linkHref} target="_blank" rel="noreferrer">
    <img src={linkImage} alt={linkImageAlt} />
    {linkTitle}
  </a>
</div>

<style lang="scss">
  .contributor {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: spacing(28.5);

    > img {
      width: spacing(28.5);
      height: spacing(34.5);
      object-fit: cover;
      border: 1px solid $border-color;
      border-radius: $border-radius;
    }

    .name {
      margin-top: spacing(3);
      font-weight: 500;
    }

    .role {
      @include typography(body3);

      flex: 1;
      margin-top: spacing(2);
      color: $placeholder-color;
    }

    > a {
      @include typography(body3);

      display: flex;
      margin-top: spacing(3);
      padding: spacing(1);
      padding-left: 0;
      color: $link-color;
      text-decoration: none;

      > img {
        width: spacing(4);
        height: spacing(4);
        margin-right: spacing(1);
        object-fit: cover;
      }

      &:hover,
      &:focus {
        text-decoration: underline;
      }

      &:focus {
        outline: none;
      }
    }
  }
</style>
