<template>
  <ion-page data-pageid="tabs">
    <ion-content>
      <ion-tabs id="tabs">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <TabButton v-for="tab in tabs" :key="tab.name" :tab="tab" />
          <ion-button id="add-tab" @click="addTab()">Add Tab</ion-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonButton, IonTabBar, IonTabs, IonContent, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle, shield } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref, defineComponent } from 'vue';
import TabButton from '@/components/TabButton.vue';

export default defineComponent({
  components: { IonButton, IonContent, IonTabs, IonTabBar, IonPage, IonRouterOutlet, TabButton },
  setup() {
    const tabs = ref([
      { name: 'tab1', href: '/tabs/tab1', value: 'Tab 1', icon: triangle },
      { name: 'tab2', href: '/tabs/tab2', value: 'Tab 2', icon: ellipse },
      { name: 'tab3', href: '/tabs/tab3', value: 'Tab 3', icon: square },
    ])
    const router = useRouter();
    const addTab = () => {
      router.addRoute({ path: '/tabs/tab4', component: () => import('@/views/Tab4.vue') });
      tabs.value = [
        ...tabs.value,
        {
          name: 'tab4',
          href: '/tabs/tab4',
          icon: shield,
          value: 'Tab 4'
        }
      ]
    }

    return { tabs, addTab }
  }
});
</script>
