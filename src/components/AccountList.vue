<template>
  <div class="wrapper">
    <header class="header">
      <h1>Учетные записи</h1>
      <Button @click="addEmptyAccount" style="padding: 1.2em">
        <i class="pi pi-plus" />
      </Button>
    </header>

    <aside>
      <span>
        <i class="pi pi-question-circle" style="font-size: 24px" />
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель ;
      </span>
    </aside>

    <div class="grid">
      <h5>Метки</h5>
      <h5>Тип записи</h5>
      <h5>Логин</h5>
      <h5>Пароль</h5>
      <h5></h5>

      <template v-for="(account, index) in fullAccountList" :key="index">
        <InputText
          type="text"
          :model-value="
            getCorrectAccount(account, index)
              .marks.map((m) => m.text)
              .join(accountMarkSeparator)
          "
          @update:modelValue="
            (value) =>
              (getCorrectAccount(account, index).marks = value
                ? value.split(accountMarkSeparator).map((m) => ({ text: m }))
                : [])
          "
          maxlength="50"
          @focusin="setEditAccount(account, index)"
          @focusout="validateEditAccount"
        />

        <Select
          :model-value="
            recordTypeOptions.find(
              (el) => el.value === getCorrectAccount(account, index).recordType,
            )
          "
          @update:modelValue="
            (v) => {
              setRecordType(getCorrectAccount(account, index), v);
              validateEditAccount();
            }
          "
          :options="recordTypeOptions"
          optionLabel="name"
          style="width: 100%"
          @focusin="setEditAccount(account, index)"
        />

        <InputText
          type="text"
          :invalid="!getCorrectAccount(account, index).login"
          v-model="getCorrectAccount(account, index).login"
          :style="{
            'grid-column':
              getCorrectAccount(account, index).recordType === 'LDAP'
                ? 'span 2'
                : 'span 1',
          }"
          maxlength="100"
          @focusin="setEditAccount(account, index)"
          @focusout="validateEditAccount"
        />

        <IconField
          style="width: fit-content"
          v-if="getCorrectAccount(account, index).recordType !== 'LDAP'"
        >
          <InputText
            :type="togglePasswordList[index] ? 'text' : 'password'"
            :invalid="!getCorrectAccount(account, index).password"
            v-model="getCorrectAccount(account, index).password"
            maxlength="100"
            @focusin="setEditAccount(account, index)"
            @focusout="validateEditAccount"
          />
          <InputIcon
            class="pi clickable"
            :class="[togglePasswordList[index] ? 'pi-eye-slash' : 'pi-eye']"
            @click.stop="togglePasswordVisible(index)"
          />
        </IconField>

        <i
          class="pi pi-trash clickable delete"
          @click.stop="removeAccount(index)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  min-width: 50rem;
  display: grid;
  grid-template-columns: repeat(4, auto) 40px;
  gap: 12px;
  align-items: center;
  justify-content: stretch;

  h5 {
    margin: 8px 0;
    text-align: left;
  }

  :deep(.p-select-label) {
    text-align: left;
  }
}

.header {
  display: flex;
  align-items: center;
  gap: 2em;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 3rem;
}

aside {
  > span {
    display: inline-flex;
    align-items: center;
    gap: 1em;
  }
}
</style>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Select from 'primevue/select';
import { useAccountStore } from '../stores/account.ts';
import { storeToRefs } from 'pinia';
import {
  type Account,
  type RecordType,
  accountMarkSeparator,
} from '../types/account.ts';
import { computed, ref } from 'vue';

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const newAccounts = ref<Account[]>([]);

const fullAccountList = computed(() => [
  ...accounts.value,
  ...newAccounts.value,
]);

const editingAccount = ref<Account | null>(null);
const editingIdx = ref<number | null>(null);

const getCorrectAccount = (account: Account, idx: number) =>
  idx === editingIdx.value && editingAccount.value
    ? editingAccount.value
    : account;

const setEditAccount = (account?: Account, idx?: number) => {
  clearTimeout(timer.value);
  timer.value = undefined;
  if (editingIdx.value === idx) return;
  if (!account || !idx) {
    editingAccount.value = null;
    editingIdx.value = null;
    return;
  }
  editingAccount.value = { ...account };
  editingIdx.value = idx;
};

const timer = ref<number>();

const validateEditAccount = () => {
  timer.value = setTimeout(setEditAccount, 100);
  if (
    editingIdx.value === null ||
    !editingAccount.value ||
    !editingAccount.value.login ||
    (editingAccount.value.recordType === 'local' &&
      !editingAccount.value.password)
  )
    return;

  const isNew = editingIdx.value >= accounts.value.length;
  if (isNew) {
    newAccounts.value.splice(editingIdx.value - accounts.value.length, 1);
    return accountStore.addAccount(editingAccount.value);
  }

  accountStore.updateAccount(editingAccount.value, editingIdx.value);
};

const addEmptyAccount = () => {
  newAccounts.value.push({
    recordType: 'local',
    password: '',
    marks: [],
    login: '',
  });
};

const removeAccount = (idx: number) => {
  const isNew = idx >= accounts.value.length;
  if (isNew) return newAccounts.value.splice(idx - accounts.value.length, 1);
  accountStore.removeAccount(idx);
};

const togglePasswordList = ref<boolean[]>([]); //TODO
const togglePasswordVisible = (idx: number) => {
  const target = togglePasswordList.value[idx];
  togglePasswordList.value[idx] = !target;
};

type RecordTypeOption = { name: string; value: RecordType };
const recordTypeOptions = ref<RecordTypeOption[]>([
  { name: 'LDAP', value: 'LDAP' },
  { name: 'Локальная', value: 'local' },
]);

const setRecordType = (account: Account, option: RecordTypeOption) => {
  account.recordType = option.value;
  if (option.value === 'LDAP') account.password = null;
};
</script>
