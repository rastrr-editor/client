<script lang="ts">
  import { Color } from '@rastrr-editor/core';
  import { get, type Writable } from 'svelte/store';
  import { SwapIcon } from '~/shared/ui/icons';
  import { mainColor, secondaryColor } from '../model/store';

  interface Props {
    orientation?: 'vertical' | 'horizontal';
  }

  let { orientation = 'horizontal' }: Props = $props();

  function swapColors() {
    const tmp = get(mainColor);
    mainColor.set(get(secondaryColor));
    secondaryColor.set(tmp);
  }

  const createUpdateColor =
    (color: Writable<Color>): svelte.JSX.FormEventHandler<HTMLInputElement> =>
    (e) => {
      const input = e.target as HTMLInputElement;
      if (input.value) {
        color.set(Color.from(input.value, 'hex'));
      }
    };
</script>

<div
  class="root"
  class:horizontal={orientation === 'horizontal'}
  class:vertical={orientation === 'vertical'}>
  <div style={`background-color: ${$mainColor.toString('hex')};`} class="main">
    <input
      type="color"
      value={$mainColor.toString('hex')}
      oninput={createUpdateColor(mainColor)} />
  </div>
  <button onclick={swapColors}>
    <SwapIcon
      transform={`rotate(${orientation === 'vertical' ? '90' : '0'})`} />
  </button>
  <div style={`background-color: ${$secondaryColor.toString('hex')};`}>
    <input
      type="color"
      value={$secondaryColor.toString('hex')}
      oninput={createUpdateColor(secondaryColor)} />
  </div>
</div>

<style lang="scss">
  button {
    @include reset-button(true);
    @include action-cursor;
    color: #80898f;

    > :global(svg) {
      font-size: 1rem;
    }
  }

  input[type='color'] {
    opacity: 0;
    display: block;
    width: spacing(5);
    height: spacing(5);
    border: none;
    @include action-cursor;
  }

  .root {
    display: grid;
    align-items: center;
    gap: spacing(1);

    &.horizontal {
      grid-template-columns: spacing(5) spacing(4) spacing(5);
    }

    &.vertical {
      grid-template-rows: spacing(5) spacing(4) spacing(5);

      .main {
        margin-bottom: spacing(2);
      }
    }

    > div {
      border-radius: 2px;
      position: relative;

      @include animated-underline('.main') {
        bottom: -3px;
        left: 50%;
        background-color: #fff;
        transform: translateX(-50%);
      }

      &.main::after {
        width: 90%;
      }
    }
  }
</style>
