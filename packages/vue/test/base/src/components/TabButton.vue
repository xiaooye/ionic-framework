<template>
  <ion-tab-button :tab="tab.name" :href="tab.href">
    <ion-icon :icon="tab.icon" />
    <ion-label>{{ tab.value }}</ion-label>
  </ion-tab-button>
</template>

<script>
import { defineComponent } from 'vue';
import { IonIcon, IonLabel, IonTabButton } from '@ionic/vue';

export default defineComponent({
  components: { IonIcon, IonLabel, IonTabButton },
  props: {
    tab: Object
  }
});
</script>
