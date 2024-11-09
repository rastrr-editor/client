<script lang="ts">
  import { push } from 'svelte-spa-router';
  import { Button, Checkbox, NumberInput, TextInput, Modal } from '~/shared/ui';

  import createProject from '../model/create-project';

  interface Props {
    open?: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  let disabled = $state(false);

  function onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    disabled = true;

    createProject(formData)
      .then((project) => {
        open = false;
        // TODO: check if current active project is saved and perform necessary actions
        push(`/projects/${project.id!}`).catch(() => {});
      })
      .catch((error) => {
        // TODO: show custom alert
        alert(error.message);
      })
      .finally(() => {
        disabled = false;
      });
  }
</script>

<Modal size="small" bind:open>
  <div class="content">
    <h1>Новый проект</h1>
    <form onsubmit={onSubmit}>
      <TextInput name="name" label="Название" required />
      <div class="dimensions">
        <NumberInput name="width" label="Ширина" units="px" required />
        <NumberInput name="height" label="Высота" units="px" required />
      </div>
      <Checkbox name="transparent" value="1">Прозрачный холст</Checkbox>
      <Button type="submit" {disabled}>Создать</Button>
    </form>
  </div>
</Modal>

<style lang="scss">
  .content {
    padding: spacing(0) spacing(6) spacing(1);
  }

  h1 {
    margin: 0;
    margin-bottom: spacing(6);
  }

  form {
    :global(.wrapper) {
      width: 100% !important;
    }

    > :global(*) {
      margin-top: spacing(4);
    }

    > :global(button) {
      margin-top: spacing(8);
      width: 100%;
    }
  }

  .dimensions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: spacing(4);
    margin-bottom: spacing(6);
  }
</style>
