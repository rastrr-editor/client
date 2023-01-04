<script lang="ts">
  import { Dropdown, DropdownMenu, DropdownMenuItem } from '~/shared/ui';
  import type { ProjectPaginateFilter } from '../model/repository/project-repository';

  let className: string;

  export let sort: Exclude<ProjectPaginateFilter['sort'], undefined> =
    'createdAt';
  export { className as class };

  const sortToText: Record<
    Exclude<ProjectPaginateFilter['sort'], undefined>,
    string
  > = {
    createdAt: 'По дате создания',
    name: 'По названию',
    updatedAt: 'Последнее изменение',
  };

  let open = false;
</script>

<div class={className}>
  <span>Сортировка</span>
  <Dropdown bind:open>
    <button on:click={() => (open = true)}>
      {sortToText[sort]}
    </button>
    <DropdownMenu slot="menu">
      <DropdownMenuItem on:click={() => (sort = 'createdAt')}
        >{sortToText.createdAt}</DropdownMenuItem
      >
      <DropdownMenuItem on:click={() => (sort = 'name')}
        >{sortToText.name}</DropdownMenuItem
      >
      <DropdownMenuItem on:click={() => (sort = 'updatedAt')}
        >{sortToText.updatedAt}</DropdownMenuItem
      >
    </DropdownMenu>
  </Dropdown>
  <div class:arrowUp={open} class:arrowDown={!open} />
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
