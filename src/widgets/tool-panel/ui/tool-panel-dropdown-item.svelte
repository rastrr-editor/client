<script lang="ts">
  import { DropdownMenuItem } from '~/shared/ui';
  import { position } from '../model/store';

  const positionText = $derived($position === 'bottom' ? 'слева' : 'снизу');

  const onclick = () => {
    position.set($position === 'bottom' ? 'left' : 'bottom');
  };
</script>

<DropdownMenuItem {onclick}>
  Панель инструментов {positionText}
</DropdownMenuItem>
