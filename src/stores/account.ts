import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Account } from '../types/account.ts';

export const useAccountStore = defineStore(
  'account',
  () => {
    const accounts = ref<Account[]>([]);

    const addAccount = (account: Account) => {
      accounts.value.push(account);
    };

    const updateAccount = (account: Account, idx: number) => {
      accounts.value[idx] = account;
    };

    const removeAccount = (idx: number) => {
      accounts.value = accounts.value.filter((_, i) => i !== idx);
    };

    return {
      accounts,
      addAccount,
      updateAccount,
      removeAccount,
    };
  },
  { persist: true },
);
