<script setup lang="ts">
import SplitType from "split-type"
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useHomeStore } from "~/store/useHomeStore"

// PINIA 🍍
const store = useHomeStore()

const { $gsap } = useNuxtApp()

onMounted(() => {
  $gsap.registerPlugin(ScrollTrigger)
  
  let sections = $gsap.utils.toArray(".split")
  sections.forEach((sec: any) => {
    const splitTxt = new SplitType(sec, { types: "words" })
    $gsap.from(splitTxt.words, {
      autoAlpha: 0,
      y: +20,
      scrollTrigger: {
        trigger: sec,
        start: "top 40%",
        scrub: false,
        end: "top 90%",
        toggleActions: "play none none reverse",
      },
      transformOrigin: "top",
      stagger: 0.1,
      duration: 0.2,
    })
  })
})
</script>

<template>
  <footer class="footer">
    <div class="footer__col1">
      <section class="footer__contact">
        <div class="footer__contact__title split">
          {{ store.data.contact?.emailTitle }}
        </div>
        <div class="split">{{ store.data.contact?.email }}</div>
      </section>

      <section class="footer__address">
        <div class="footer__address__title split">
          {{ store.data.contact?.addressTitle }}
        </div>
        <div class="split">{{ store.data.contact?.address }}</div>
      </section>
    </div>

    <div class="footer__col2">
      <section class="footer__social">
        <div class="footer__social__title split">Social</div>
        <div v-for="social in store.data.socials" :key="social.id">
          <NuxtLink :to="social.socialURL as string" rel="noopener" target="_blank">
            <div class="split">{{ social.name }}</div>
          </NuxtLink>
        </div>
      </section>
    </div>

    <div class="footer__col3">
      <div class="intro split">{{ store.data.form?.formIntro }}</div>
      <MailFormW3 />
    </div>

    <div class="made">Created by Thomas</div>
  </footer>
</template>

<style lang="scss" scoped>
.split {
  -webkit-font-kerning: none;
  font-kerning: none;
}

section {
  margin-bottom: 100px;
}

.intro {
  max-width: 400px;
  margin-bottom: 50px;
  font-size: 20px;
  color: $accent2;
}

.made {
  align-self: flex-end;
  margin: 0 20px 20px 0;
  white-space: nowrap;
  text-align: right;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  padding-top: 100px;
  font-family: "Lexend", "Lexend Fallback: Arial", sans-serif;
  color: #1e201e;
  font-size: 15px;
  color: #e7f6f2;
  background-color: #1e201e;
  padding: 100px 20px 0 20px;
  min-height: 600px;

  &__contact {
    &__title {
      color: $accent2;
    }
  }

  &__address {
    &__title {
      color: $accent2;
    }
  }

  &__social {
    &__title {
      color: $accent2;
    }
  }

  &__col1 {
    flex-flow: column;
  }

  &__col2 {
    margin-right: 0%;

    @include this-and-above("md") {
      flex-wrap: nowrap;
    }

    @include this-and-above("lg") {
      margin-right: 20%;
    }

    @include this-and-above("xl") {
      margin-right: 33%;
    }
  }

  &__col3 {
    flex-grow: 1;
  }
}
</style>
