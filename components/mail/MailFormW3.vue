<script lang="ts" setup>

/**
 * TODO: If honeypot does not work against bots then configure for captcha.
 * Web3Forms
 */

const form = ref({
    access_key: useRuntimeConfig().public.FORM_API,
    subject: "Email from thomasjt.com",
    name: "",
    email: "",
    message: "",
})

const result = ref<string>("")
const status = ref<string>("ready")

const dict: Map<string, string> = new Map()
dict.set('ready', 'Tell me.')
dict.set('loading', 'Sending.')
dict.set('success', 'Thanking You. Will Read!')
dict.set('error', 'Ooops, error. Contact Dev!')

const message = computed(() => {
    return dict.get(status.value)
})

const submitForm = async () => {
    try {
        status.value = "loading"
        const response = await $fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: form.value,
        })
        result.value = response.message
        if (response.success) {
            status.value = "success"
        } else {
            status.value = "error"
        }
    } catch (error) {
        status.value = "error"
        result.value = "Something went wrong!"
    } finally {
        // Reset form after submission
        form.value.name = ""
        form.value.email = ""
        form.value.message = ""

        // Clear result and status after 5 seconds
        setTimeout(() => {
            result.value = ""
            status.value = "ready"
        }, 5000)
    }
}
</script>

<template>
    <div class="action" data-vis="none">
        <form @submit.prevent="submitForm">
            <label for="name">
                <input type="text" name="name" id="name" v-model="form.name" placeholder="Name" required />
            </label>
            <label for="email">
                <input type="email" name="email" id="email" v-model="form.email" placeholder="Email" required />
            </label>
            <label for="message">
                <textarea name="message" id="message" v-model="form.message" rows="6"
                    placeholder="My message is about.." required></textarea>
            </label>
            <button type="submit">Send</button>
            <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
            <h2>{{ message }}</h2>
        </form>
    </div>
</template>

<style lang="scss" scoped>
::placeholder {
    font-size: 16px;
}

form * {
    font-family: $sans-ui;
    color: $accent2;
    font-weight: 400;
    caret-color: $accent2;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;

    h2 {
        font-size: 20px;
        color: $accent2;
    }

    label ::placeholder {
        color: $accent1;
    }

    input {
        width: 100%;
        padding: 10px;
        font-size: 16px;
    }

    input,
    textarea {
        background-color: $secondary;
        color: $primary;
        border: none;
        border-bottom: 5px solid $accent2;
        outline: none;
    }

    button {
        width: 70px;
        padding: 7px;
        text-align: center;
        border: 1px solid $accent2;
        transition: background-color 0.3s ease-in-out;
        cursor: pointer;
        background-color: none;
        color: $primary;
        z-index: 200;
    }

    textarea {
        width: 100%;
        padding: 10px;
        resize: none;
        font-size: 16px;
    }

    button:hover {
        border-radius: 10px;
        background-color: $accent1;
    }
}
</style>