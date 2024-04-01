import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { LoginModule } from './components/login/login.module';
import { FullLayoutComponent } from './shared/full-layout/full-layout.component';
import { MotivationalPanelComponent } from './components/motivational-panel/motivational-panel.component';
import { MoodsComponent } from './components/moods/moods.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MoodComponent } from './components/moods/mood/mood.component';
import { ChartComponent } from './components/chart/chart.component';
import { MoodCalendarComponent } from './components/mood-calendar/mood-calendar.component';
import { ConfirmationDialog } from './shared/confirmation-dialog/confirmation-dialog';
import { AddActivityDialogComponent } from './components/moods/add-activity-dialog/add-activity-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FullLayoutComponent,
    MotivationalPanelComponent,
    MoodsComponent,
    MoodComponent,
    ChartComponent,
    MoodCalendarComponent,
    ConfirmationDialog,
    AddActivityDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    HttpClientModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatIconModule,
    LoginModule,
    MatMomentDateModule,
    InfiniteScrollModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
