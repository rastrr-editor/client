<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { openProjects } from '../model/store';
  import Dropdown from '~/shared/ui/dropdown/dropdown.svelte';
  import DropdownMenu from '~/shared/ui/dropdown/dropdown-menu.svelte';
  import DropdownMenuItem from '~/shared/ui/dropdown/dropdown-menu-item.svelte';
  import { toolPanelStore } from '~/widgets/tool-panel';

  const { position: toolPanelPosition } = toolPanelStore;

  type NavigationEvents = {
    createNewProject: void;
  };

  const dispatch = createEventDispatcher<NavigationEvents>();

  let openFileMenu: boolean = false;
  let openViewMenu: boolean = false;
</script>

<header>
  <div class="logo">
    <svg viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.59714 14.1979C5.59045 14.2581 5.57708 14.3182 5.55703 14.3784C5.54366 14.4319 5.50022 14.4753 5.42669 14.5087C5.39996 14.5221 5.26628 14.5722 5.02565 14.6591C4.79171 14.7393 4.51767 14.8362 4.20352 14.9499C3.89605 15.0568 3.58859 15.1638 3.28112 15.2707C2.98034 15.3843 2.74974 15.4712 2.58932 15.5314C2.50911 15.5648 2.40885 15.5982 2.28854 15.6316C2.17491 15.6717 2.06128 15.6918 1.94766 15.6918C1.85408 15.6918 1.77053 15.6684 1.69701 15.6216C1.63017 15.5748 1.59674 15.4879 1.59674 15.3609C1.59674 15.0668 1.60343 14.7995 1.6168 14.5589C1.63685 14.3115 1.66024 14.0542 1.68698 13.7868C1.71372 13.5195 1.74045 13.2254 1.76719 12.9046C1.80061 12.577 1.83069 12.1894 1.85742 11.7415C1.89084 11.1533 1.9276 10.5885 1.96771 10.0471C2.00781 9.49904 2.04792 8.9309 2.08802 8.34271L2.22839 6.62825C2.24844 6.34753 2.26849 6.06345 2.28854 5.77604C2.30859 5.48194 2.32865 5.18116 2.3487 4.8737L2.45898 3.65052C2.45898 3.63715 2.43893 3.63047 2.39883 3.63047C2.34536 3.63047 2.25512 3.64384 2.12813 3.67057C2.00113 3.69062 1.85074 3.71736 1.67695 3.75078C1.50317 3.7842 1.30933 3.82096 1.09544 3.86107C0.888238 3.89449 0.674349 3.92791 0.453776 3.96133C0.400304 3.96133 0.346832 3.9513 0.293359 3.93125C0.246571 3.90451 0.223177 3.87444 0.223177 3.84101C0.223177 3.81428 0.229861 3.79423 0.243229 3.78086L1.86745 0.943489C2.23507 0.86328 2.62943 0.783072 3.05052 0.702864C3.4783 0.615971 3.93615 0.539105 4.42409 0.472265C4.91202 0.405424 5.43004 0.351952 5.97813 0.311848C6.52622 0.26506 7.10773 0.241666 7.72266 0.241666C8.4178 0.255034 9.09288 0.325216 9.74792 0.452213C10.4096 0.572525 10.9945 0.77973 11.5025 1.07383C12.0171 1.36124 12.4282 1.7556 12.7357 2.2569C13.0498 2.75152 13.2069 3.37982 13.2069 4.1418C13.2069 4.56289 13.1334 4.95056 12.9863 5.30482C12.846 5.65907 12.6622 5.9799 12.4349 6.26732C12.2143 6.54805 11.9704 6.7987 11.703 7.01927C11.4356 7.23316 11.1783 7.41697 10.931 7.5707C10.6904 7.72444 10.4765 7.84809 10.2893 7.94167C10.1022 8.02856 9.97517 8.08537 9.90833 8.11211C9.90833 8.12548 9.91168 8.14219 9.91836 8.16224C9.93173 8.18229 9.95512 8.2224 9.98854 8.28255C10.022 8.33602 10.0688 8.41623 10.1289 8.52318C10.1957 8.62344 10.2793 8.7638 10.3796 8.94427C10.4865 9.10469 10.6135 9.31858 10.7605 9.58594C10.9076 9.8533 11.0814 10.1708 11.2819 10.5384C11.4891 10.8993 11.7264 11.3037 11.9938 11.7516C12.2611 12.1994 12.5686 12.6806 12.9161 13.1953C13.0298 13.2956 13.1601 13.3591 13.3072 13.3858C13.4542 13.4059 13.5912 13.4192 13.7182 13.4259C13.8452 13.4259 13.9522 13.4326 14.0391 13.446C14.126 13.4526 14.1694 13.4928 14.1694 13.5663C14.1694 13.6197 14.1126 13.6832 13.999 13.7568C13.892 13.8236 13.765 13.8938 13.618 13.9673C13.4709 14.0408 13.3205 14.111 13.1668 14.1779C13.0197 14.2447 12.9061 14.2982 12.8259 14.3383C12.6655 14.4185 12.4984 14.4954 12.3246 14.5689C12.1508 14.6424 11.9637 14.726 11.7632 14.8195C11.5626 14.9064 11.3387 15.01 11.0914 15.1303C10.8508 15.2507 10.5767 15.3944 10.2693 15.5615C10.1891 15.6082 10.1122 15.6383 10.0387 15.6517C9.97183 15.6717 9.90833 15.6818 9.84818 15.6818C9.72787 15.6818 9.62426 15.6517 9.53737 15.5915C9.45048 15.5381 9.37695 15.4712 9.3168 15.391C9.25664 15.3108 9.20651 15.2273 9.16641 15.1404C9.13299 15.0602 9.10291 14.9933 9.07617 14.9398L6.08841 8.64349L5.59714 14.1979ZM6.20872 7.41029C6.54961 7.41029 6.90386 7.32339 7.27148 7.14961C7.63911 6.97582 7.97331 6.75191 8.27409 6.47786C8.57487 6.20382 8.82218 5.89301 9.01602 5.54544C9.20985 5.19787 9.30677 4.84696 9.30677 4.49271C9.30677 3.52352 8.72526 3.03893 7.56224 3.03893C7.34167 3.03893 7.15786 3.05564 7.01081 3.08906C6.86376 3.1158 6.73008 3.13585 6.60977 3.14922L6.20872 7.41029Z"
        fill="#3F4D55"
      />
    </svg>
  </div>
  <nav>
    <ul>
      <li>
        <Dropdown bind:open={openFileMenu}>
          <button
            class="menu-item dropdown"
            class:active={openFileMenu}
            on:click={() => (openFileMenu = true)}>Файл</button
          >
          <DropdownMenu slot="menu">
            <DropdownMenuItem on:click={() => dispatch('createNewProject')}>
              Создать новый файл
            </DropdownMenuItem>

            <!-- <DropdownMenuItem on:click={() => console.log('Save...')}>
              Сохранить проект
            </DropdownMenuItem>

            <Dropdown nested hover>
              <DropdownMenuItem nested>Сохранить как</DropdownMenuItem>

              <DropdownMenu slot="menu" nested>
                <DropdownMenuItem>JPEG</DropdownMenuItem>
                <DropdownMenuItem>PNG</DropdownMenuItem>
              </DropdownMenu>
            </Dropdown> -->
          </DropdownMenu>
        </Dropdown>
      </li>

      <li>
        <Dropdown bind:open={openViewMenu}>
          <button
            class="menu-item dropdown"
            class:active={openViewMenu}
            on:click={() => (openViewMenu = true)}>Вид</button
          >
          <DropdownMenu slot="menu">
            <!-- <DropdownMenuItem on:click={() => console.log('Hide rulers...')}>
              Скрыть линейки
            </DropdownMenuItem> -->
            <DropdownMenuItem
              on:click={() =>
                toolPanelStore.position.set(
                  $toolPanelPosition === 'bottom' ? 'left' : 'bottom'
                )}
            >
              Панель инструметов {$toolPanelPosition === 'bottom'
                ? 'слева'
                : 'снизу'}
            </DropdownMenuItem>
          </DropdownMenu>
        </Dropdown>
      </li>
      <li>
        <button class="menu-item" on:click={() => openProjects.set(true)}
          >Проекты</button
        >
      </li>
      <!-- <li>
        <button class="menu-item">О программе</button>
      </li> -->
    </ul>
  </nav>
</header>

<style lang="scss">
  header {
    background-color: $bg-main;
    display: grid;
    grid-template-columns: 1.875rem 1fr;
    gap: spacing(4);
    align-items: center;
  }

  .logo {
    background-color: $border-color;
    height: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 0.9375rem;
      height: 1rem;
    }
  }

  nav {
    font-size: 0.875rem;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      gap: spacing(6);
    }
  }

  button {
    @include reset-button(false);
    @include action-cursor;
  }

  .menu-item {
    padding: spacing(1);
    border-radius: $border-radius;
    transition: background-color $animation-time;

    &.active,
    &:hover,
    &:focus-visible {
      background-color: $bg-extra;
    }

    &:focus {
      outline: none;
    }
  }

  .dropdown {
    position: relative;
    padding-right: spacing(3);
    @include triangle;
  }
</style>
