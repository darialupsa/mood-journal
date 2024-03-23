import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import {
  DATE_FORMATS2,
  EMOTIONS,
  EmotionDTO,
  date_db_format,
  date_display_shortdate_format,
  date_time_format,
} from 'src/app/shared/model/mood-journal.model';
import {
  MoodJournalService,
  MoodsPageSize,
} from 'src/app/shared/services/mood-journal.service';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import Chart from 'chart.js/auto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],

  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS2 }],
})
export class ChartComponent implements OnInit, OnDestroy {
  constructor(
    private moodJournalService: MoodJournalService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  authUser;
  isLoading = false;
  routerSubscription: Subscription;
  chartType: string;
  yearInPixelsData = {};

  range: {
    minDate: moment.Moment;
    maxDate: moment.Moment;
  };

  year = moment().year();
  startDate = moment().subtract(1, 'months').startOf('day');
  endDate = moment().endOf('day');
  chart: Chart;
  chartOptions: any;

  ngOnInit(): void {
    this.authUser = this.authService.getAuthUser();

    this.routerSubscription = this.route.data.subscribe((routerData) => {
      this.chartType = routerData['chart'];
      switch (this.chartType) {
        case 'ActivitiesPerDay':
          this.loadActivitiesPerDayData(true);
          break;
        case 'EmotionEvolution':
          this.loadEmotionEvolutionData(true);
          break;
        case 'YearInPixels':
          this.loadYearInPixelsData();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  getPixelColor(month: number, day: number) {
    const score =
      this.yearInPixelsData[
        `${this.year}-${String(month).padStart(2, '0')}-${String(day).padStart(
          2,
          '0'
        )}`
      ];
    return score ? EMOTIONS[score].color : '#e4f4f988';
  }

  initActivitiesPerDayChart() {
    this.chartOptions = {
      plugins: {
        // title: {
        //   display: true,
        //   text: 'Number of activities / day',
        //   font: {
        //     size: 18, // Dimensiunea fontului
        //     family: 'Arial', // Fontul familiei
        //     weight: 'normal', // Greutatea fontului (ex: bold, normal)
        //   },
        //   color: '#3294a7', // Culoarea textului titlului
        // },
        // subtitle: {
        //   display: true,
        //   text: `${moment()
        //     .subtract(1, 'months')
        //     .format('D MMMM')} - ${moment().format('D MMMM')}`,
        //   font: {
        //     size: 12,
        //     family: 'Arial',
        //     weight: 'normal',
        //   },
        //   padding: { top: 0, bottom: 40 },
        // },
        legend: {
          display: false,
        },
        tooltip: {
          position: 'nearest',
          backgroundColor: '#dbeaedc7',
          padding: 20,
          titleColor: 'black',
          bodyColor: 'black',
          titleMarginBottom: 10,
          displayColors: false,
        },
        animation: {
          type: 'easeInSine', // De exemplu, animație liniară
        },
      },
    };
    this.chart = new Chart(
      document.getElementById('chart') as HTMLCanvasElement,
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Number of activities',
              data: [],
              backgroundColor: '#8ccfdbb8',
            },
          ],
        },
        options: this.chartOptions,
      }
    );
  }
  loadActivitiesPerDayData(initChart?) {
    this.isLoading = true;
    forkJoin(
      this.moodJournalService.getChartActivitiesPerDay(
        this.startDate.format(date_db_format),
        this.endDate.format(date_db_format)
      ),
      this.moodJournalService.getDateRange()
    ).subscribe(([data, range]) => {
      this.range = {
        minDate: moment(range.minDate, date_db_format),
        maxDate: moment(range.maxDate, date_db_format),
      };
      this.isLoading = false;
      if (data) {
        if (initChart) {
          this.initActivitiesPerDayChart();
        }

        this.chart.data.labels = data.map((row) =>
          moment(row.date, 'yyyy-MM-DD').format(date_display_shortdate_format)
        );
        this.chart.data.datasets[0].data = data.map((row) => row.count);
        setTimeout(() => {
          this.chart.update();
        }, 0);
      }
    });
  }

  initEmotionEvolutionChart() {
    this.chartOptions = {
      scales: {
        x: {
          ticks: {
            display: false,
            autoSkip: false,
            // callback: () => '',
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: false,
            stepSize: 1,
            precision: 0,
            callback: (value: number) => {
              return EMOTIONS[value]?.name;
            },
            color: (context) => {
              const value = context.tick.value;
              return EMOTIONS[value]?.color;
            },
          },
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          titleMarginBottom: 20,
          external: this.externalTooltipHandler,
        },
      },
    };
    this.chart = new Chart(
      document.getElementById('chart') as HTMLCanvasElement,
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Emotion',
              data: [],
              borderColor: '#8ccfdbb8',
              pointStyle: 'circle', // Forma punctelor
              pointBackgroundColor: (context) => {
                // Calculează culoarea în funcție de valoarea punctului
                const value: number = context.dataset.data?.length
                  ? (context.dataset.data[context.dataIndex] as number)
                  : 1;
                return EMOTIONS[value]?.color;
              },
              pointBorderColor: 'transparent',
              pointRadius: 5, // Raza punctelor
              pointHoverRadius: 8, // Raza punctelor la hover,
            },
          ],
        },
        options: this.chartOptions,
      }
    );
  }
  loadEmotionEvolutionData(initChart?) {
    this.isLoading = true;
    forkJoin(
      this.moodJournalService.getChartEmotionEvolution(
        this.startDate.format(date_db_format),
        this.endDate.format(date_db_format)
      ),
      this.moodJournalService.getDateRange()
    ).subscribe(([data, range]) => {
      this.range = {
        minDate: moment(range.minDate, date_db_format),
        maxDate: moment(range.maxDate, date_db_format),
      };
      this.isLoading = false;
      if (data) {
        if (initChart) {
          this.initEmotionEvolutionChart();
        }
        this.chart.data.labels = data.map((row) =>
          moment(row.date, date_db_format).format(
            date_display_shortdate_format + ' ' + date_time_format
          )
        );
        this.chart.data.datasets[0].data = data.map((row) => row.score);
        this.chartOptions.scales.x.ticks.callback = (
          value: string,
          index,
          ticks
        ) => {
          return index > 0 &&
            moment(data[index].date, date_db_format).format(
              date_display_shortdate_format
            ) ==
              moment(data[index - 1].date, date_db_format).format(
                date_display_shortdate_format
              )
            ? ''
            : moment(data[index].date, date_db_format).format(
                date_display_shortdate_format
              );
        };

        this.chart.update();
      }
    });
  }

  loadYearInPixelsData() {
    this.isLoading = true;
    forkJoin(
      this.moodJournalService.getChartYearInPixels(this.year),
      this.moodJournalService.getDateRange()
    ).subscribe(([data, range]) => {
      this.range = {
        minDate: moment(range.minDate, date_db_format),
        maxDate: moment(range.maxDate, date_db_format),
      };
      this.isLoading = false;
      if (data) {
        this.yearInPixelsData = data.reduce((acc, obj) => {
          acc[obj.date] = obj.score;
          return acc;
        }, {});
      }
    });
  }

  updateInterval(value): boolean {
    this.startDate = this.startDate.subtract(value, 'months');
    this.endDate = this.endDate.subtract(value, 'months');
    return true;
  }

  getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';

      const table = document.createElement('table');
      table.style.margin = '0px';

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  externalTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';

      const table = document.createElement('table');
      table.style.margin = '0px';

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement('thead');

      titleLines.forEach((title) => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = '0';
        tr.style.color = 'black';

        const th = document.createElement('th');
        th.style.borderWidth = '0';
        const text = document.createTextNode(title);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const emotionNo = body[0].split(' ')[1];

        const span = document.createElement('span');
        span.style.background = EMOTIONS[emotionNo].color;
        span.style.borderColor = EMOTIONS[emotionNo].color;
        span.style.borderWidth = '2px';
        span.style.marginRight = '10px';
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.display = 'inline-block';

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';

        const td = document.createElement('td');
        td.style.borderWidth = '0';
        td.style.color = EMOTIONS[emotionNo].color;

        const text = document.createTextNode(EMOTIONS[emotionNo].name);

        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector('table');

      // Remove old children
      while (tableRoot?.firstChild) {
        tableRoot?.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.background = 'white';
    tooltipEl.style['box-shadow'] = '0 2px 10px rgba(0, 0, 0, 0.2)';
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 20 + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = '10px ';
  };
}
