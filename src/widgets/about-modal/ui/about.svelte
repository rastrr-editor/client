<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { Modal } from '~/shared/ui';
  import Contributor from './contributor.svelte';
  import RastrrIcon from './rastrr-icon.svelte';

  interface Props {
    open?: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  function onHide(): void {
    // TODO: fix route if project is selected
    push('/');
  }
</script>

<Modal bind:open onhide={onHide}>
  <div class="header">
    <RastrrIcon class="logo" />
    <p>
      простой и бесплатный графический <br /> редактор для начинающих художников
    </p>
  </div>

  <h2>Над проектом работали</h2>

  <div class="contributors-grid">
    <Contributor
      image="/images/shining-mind.png"
      name="Артём"
      role="тимлид, разработка движка и клиента"
      linkHref="https://github.com/shining-mind"
      linkImage="/icons/logo-github.svg"
      linkImageAlt="Github"
      linkTitle="@shining-mind" />
    <Contributor
      image="/images/dimeliora.png"
      name="Дмитрий"
      role="разработка UI и инструментов"
      linkHref="https://github.com/dimeliora"
      linkImage="/icons/logo-github.svg"
      linkImageAlt="Github"
      linkTitle="@dimeliora" />
    <Contributor
      image="/images/hunteraf87.png"
      name="Альберт"
      role="разработка движка"
      linkHref="https://github.com/hunteraf87"
      linkImage="/icons/logo-github.svg"
      linkImageAlt="Github"
      linkTitle="@hunteraf87" />
    <Contributor
      image="/images/yes_dez.png"
      name="Евгений"
      role="UX/UI дизайн"
      linkHref="https://t.me/yes_dez"
      linkImage="/icons/logo-telegram.svg"
      linkImageAlt="Telegram"
      linkTitle="@yes_dez" />
  </div>
</Modal>

<style lang="scss">
  .header {
    display: flex;
    align-items: center;

    > :global(.logo) {
      margin-right: spacing(6);
    }

    > p {
      position: relative;
      margin: 0;
      padding-left: spacing(4);
      line-height: 1.1875;

      &::before {
        content: '';
        position: absolute;
        top: 6px;
        left: 0;
        width: 1px;
        height: spacing(8);
        background-color: $border-color;
      }
    }
  }

  h2 {
    margin: spacing(9) 0 spacing(6);
  }

  .contributors-grid {
    display: flex;
    flex-wrap: wrap;
    gap: spacing(6);
  }
</style>
