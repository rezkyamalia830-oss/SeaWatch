import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import ObservationsPage from '../views/ObservationsPage.vue'
import AddObservationPage from '../views/AddObservationPage.vue'
import LocationsPage from '../views/LocationsPage.vue'
import LocationDetailPage from '../views/LocationDetailPage.vue'
import StatisticsPage from '../views/StatisticsPage.vue'
import HistoryPage from '../views/HistoryPage.vue'
import AIAnalysisPage from '../views/AIAnalysisPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/observations',
    name: 'Observations',
    component: ObservationsPage
  },
  {
  path: '/add-observation',
  name: 'AddObservation',
  component: AddObservationPage
},
{
  path: '/locations',
  name: 'Locations',
  component: LocationsPage
},
{
  path: '/location-detail',
  name: 'LocationDetail',
  component: LocationDetailPage
},
{
  path: '/statistics',
  name: 'Statistics',
  component: StatisticsPage
},
{
  path: '/history',
  name: 'History',
  component: HistoryPage
},
{
  path: '/ai-analysis',
  name: 'AIAnalysis',
  component: AIAnalysisPage
}

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router