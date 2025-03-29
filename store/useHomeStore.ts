import { defineStore } from 'pinia';
import { useNuxtApp } from '#imports';
import type { GqlError } from 'nuxt-graphql-client'

const _data = ref()
const _error = ref()

export const useHomeStore = defineStore('data', {
    state: () => ({
        data: _data,
        error: _error
    }),

    actions: {
        async fetchData() {
            const { data, error, } = await useAsyncGql({
                operation: 'home',
            })
            _data.value = data
            _error.value = error

            if (error.value) {
                console.log("store error:", error.value)
            }
        },
    },

    persist:true

});