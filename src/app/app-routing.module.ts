import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginLayoutComponent } from './components/login/layout/login-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { FullLayoutComponent } from './shared/full-layout/full-layout.component';
import { MoodsComponent } from './components/moods/moods.component';
import { MoodComponent } from './components/moods/mood/mood.component';
import { ChartComponent } from './components/chart/chart.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginLayoutComponent },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        children: [
          {
            path: '',
            component: MoodsComponent,
          },
          {
            path: 'mood',
            component: MoodComponent,
          },
          {
            path: 'chart-activities-count',
            component: ChartComponent,
            data: { chart: 'ActivitiesPerDay' },
          },
          {
            path: 'chart-emotion-evolution',
            component: ChartComponent,
            data: { chart: 'EmotionEvolution' },
          },
          {
            path: 'year-in-pixels',
            component: ChartComponent,
            data: { chart: 'YearInPixels' },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
