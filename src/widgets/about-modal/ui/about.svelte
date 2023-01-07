<script lang="ts">
  import { push } from 'svelte-spa-router';

  import { Modal } from '~/shared/ui';
  import RastrrIcon from './rastrr-icon.svelte';

  import shiningMindAvatar from '/images/shining-mind.png';
  import dimelioraAvatar from '/images/dimeliora.png';
  import yesDezAvatar from '/images/yes_dez.png';
  import githubLogo from '/icons/logo-github.svg';
  import telegramLogo from '/icons/logo-telegram.svg';

  export let open: boolean = false;

  function onHide(): void {
    push('/');
  }
</script>

<Modal bind:open on:hide={onHide}>
  <div class="header">
    <RastrrIcon class="logo" />
    <p>
      простой и бесплатный графический <br /> редактор для начинающих художников
    </p>
  </div>

  <h2>Над проектом работали</h2>

  <div class="contributors-grid">
    <div class="contributor">
      <img src={shiningMindAvatar} alt="Developer's avatar" />
      <span class="name">Артём</span>
      <span class="role">тимлид</span>
      <a
        href="https://github.com/shining-mind"
        target="_blank"
        rel="noreferrer">
        <img src={githubLogo} alt="Github" />
        @shining-mind
      </a>
    </div>
    <div class="contributor">
      <img src={dimelioraAvatar} alt="Developer's avatar" />
      <span class="name">Дмитрий</span>
      <span class="role">разработка UI</span>
      <a href="https://github.com/dimeliora" target="_blank" rel="noreferrer">
        <img src={githubLogo} alt="Github" />
        @dimeliora
      </a>
    </div>
    <div class="contributor">
      <img src={yesDezAvatar} alt="Developer's avatar" />
      <span class="name">Евгений</span>
      <span class="role">UX/UI дизайн</span>
      <a href="https://t.me/yes_dez" target="_blank" rel="noreferrer">
        <img src={telegramLogo} alt="Telegram" />
        @yes_dez
      </a>
    </div>
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
