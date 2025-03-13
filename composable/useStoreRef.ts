import { shallowRef, toRef, type ShallowRef } from 'vue'
import type { Ref } from 'vue'

const store: Ref<Record<string, ShallowRef<HTMLElement | null>>> = shallowRef({})

export const useStoreRef = () => {

    const addElem = (key: string, el: ShallowRef<HTMLElement | null>) => {
        store.value[key] = el
    }

    const getElem = (key: string) => {
        const sRef = toRef(store.value[key])
        return { sRef }
    }

    return { addElem, getElem }
}



