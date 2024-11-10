<script lang="ts">
  import { Dropdown, DropdownMenu, DropdownMenuItem } from '~/shared/ui';
  import type { ProjectPaginateFilter } from '~/entities/project';
  import { sortBy } from '../model/store.svelte';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  const sortToText: Record<
    Exclude<ProjectPaginateFilter['sort'], undefined>,
    string
  > = {
    createdAt: 'По дате создания',
    name: 'По названию',
    updatedAt: 'Последнее изменение',
  };

  let open = $state(false);
</script>

<div class={className}>
  <span>Сортировка</span>
  <Dropdown bind:open>
    <button onclick={() => (open = true)}>
      {sortToText[$sortBy]}
    </button>
    {#snippet menu()}
      <DropdownMenu>
        <DropdownMenuItem onclick={() => ($sortBy = 'createdAt')}
          >{sortToText.createdAt}</DropdownMenuItem>
        <DropdownMenuItem onclick={() => ($sortBy = 'name')}
          >{sortToText.name}</DropdownMenuItem>
        <DropdownMenuItem onclick={() => ($sortBy = 'updatedAt')}
          >{sortToText.updatedAt}</DropdownMenuItem>
      </DropdownMenu>
    {/snippet}
  </Dropdown>
  <div class:arrowUp={open} class:arrowDown={!open}></div>
</div>

<style lang="scss">
  div {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
  }

  span {
    opacity: 0.5;
  }

  button {
    @include reset-button(false);
    @include action-cursor;
    margin-left: spacing(2);
    margin-right: spacing(1);
  }

  .arrowUp {
    @include arrow(up);
  }

  .arrowDown {
    margin-top: 3px;
    @include arrow(down);
  }
</style>
