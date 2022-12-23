<script lang="ts">
  import { Color, type ColorRange } from '@rastrr-editor/core';
  import { get, type Writable } from 'svelte/store';
  import { SwapIcon } from '~/shared/ui/icons';
  import { mainColor, secondaryColor } from '../model/store';

  function swapColors() {
    const tmp = get(mainColor);
    mainColor.set(get(secondaryColor));
    secondaryColor.set(tmp);
  }

  // FIXME: add toString method to Color class
  const colorToHex = (color: Color) => {
    return `#${color.r.toString(16).padStart(2, '0')}${color.g
      .toString(16)
      .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
  };
  // FIXME: add static .from method to Color class
  const hexToColor = (hex: string) => {
    return new Color(
      parseInt(hex.substring(1, 3), 16) as ColorRange,
      parseInt(hex.substring(3, 5), 16) as ColorRange,
      parseInt(hex.substring(5, 7), 16) as ColorRange
    );
  };

  const createUpdateColor =
    (color: Writable<Color>): svelte.JSX.FormEventHandler<HTMLInputElement> =>
    (e) => {
      const input = e.target as HTMLInputElement;
      if (input.value) {
        color.set(hexToColor(input.value));
      }
    };
</script>

<div class="root">
  <div style={`background-color: ${colorToHex($mainColor)};`} class="active">
    <input
      type="color"
      value={colorToHex($mainColor)}
      on:input={createUpdateColor(mainColor)}
    />
  </div>
  <button on:click={swapColors}>
    <SwapIcon />
  </button>
  <div style={`background-color: ${colorToHex($secondaryColor)};`}>
    <input
      type="color"
      value={colorToHex($secondaryColor)}
      on:input={createUpdateColor(secondaryColor)}
    />
  </div>
</div>

<style lang="scss">
  button {
    @include reset-button(false);
    @include action-cursor;
    color: #80898f;
    line-height: 1;
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
    grid-template-columns: spacing(5) spacing(4) spacing(5);
    align-items: center;
    gap: spacing(1);

    > div {
      border-radius: 2px;
      position: relative;

      @include animated-underline('.active') {
        bottom: -3px;
        left: 50%;
        background-color: #fff;
        transform: translateX(-50%);
      }

      &.active::after {
        width: 90%;
      }
    }
  }
</style>
