<script lang="ts">
  import { Button } from '~/shared/ui/button';
  import { Checkbox } from '~/shared/ui/checkbox';
  import { NumberInput, TextInput } from '~/shared/ui/input';
  import { Modal } from '~/shared/ui/modal';
  import createProject from '../model/create-project';

  export let open: boolean = false;

  let disabled = false;

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    disabled = true;
    createProject(formData)
      .then(() => {
        open = false;
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
    <form on:submit={onSubmit}>
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
