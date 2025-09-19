<template>
  <IconField>
    <slot :showPassword="showPassword" :toggleShow="toggleShow" />
    <InputIcon
      class="pi clickable"
      :class="[showPassword ? 'pi-eye-slash' : 'pi-eye']"
      @click.stop="toggleShow()"
    />
  </IconField>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import { ref } from 'vue';

const showPassword = ref(false);
const toggleShow = () => (showPassword.value = !showPassword.value);
</script>
