import { defineStore } from 'pinia';
import { useNuxtApp } from '#imports';

const ql = ref<any | unknown | {}>()

export const useContactStore = defineStore('data', {
    state: () => ({
        data: ql
    }),
    actions: {
        async fetchData() {
            const { data } = await useAsyncGql({
                operation: 'contact',
            })
            ql.value = data
        },
    },
});