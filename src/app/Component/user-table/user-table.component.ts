import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { ReportService } from 'src/app/Service/report.service';
import { Report } from '../../Models/report';
import * as moment from 'moment';


@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements AfterViewInit {

  hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  data: Report[] = []

  Page = 0;
  MaxPage = 50;

  hotSettings: Handsontable.GridSettings = {
    data: this.data,
    columns: [
      {
        title: 'Email',
        type: 'text',
        data: 'email',
        readOnly: true
      },
      {
        title: 'Project',
        type: 'text',
        data: 'project',
        readOnly: true
      },
      {
        title: 'Project Type',
        type: 'text',
        data: 'type',
        readOnly: true
      },
      {
        title: 'Question completed',
        type: 'numeric',
        data: 'questionNumber',
        readOnly: true
      },
      {
        title: 'Score',
        type: 'text',
        data: 'score',
        className: 'htRight',
        readOnly: true
      },
      {
        title: 'Total Questions',
        type: 'text',
        data: 'totalQuestions',
        className: 'htCenter',
        readOnly: true
      },
      {
        title: 'Role',
        type: 'text',
        data: 'role',
        className: 'htRight',
        readOnly: true
      },
      {
        title: 'View All Answer',
        type: 'text',
        data: 'model',
      },
      {
        title: 'Report Date and Time',
        type: 'text',
        data: 'reportDateTime',
        readOnly: true
      }
    ],
    rowHeaders: true,
    colHeaders: true,
    filters: true,
    dropdownMenu: true,
    rowHeights: 50,
    height: 400,
    stretchH: 'all',
    fixedColumnsLeft: 3,
    manualColumnResize: true,
    manualRowResize: true,
    contextMenu: true,
    viewportColumnRenderingOffset: 10,
    manualColumnMove: true,
    manualRowMove: true,
    autoWrapRow: true,
    licenseKey: 'non-commercial-and-evaluation',

  };

  constructor(private reportService: ReportService) { }

  ngAfterViewInit(): void {
    let hot = this.hotRegisterer.getInstance(this.id);
    this.reportService.getAdminReport().subscribe(res => {
      res.content.forEach(element=> {
        element.reportDateTime = moment(element.reportDateTime).format('DD/MM/YYYY HH:MM:SS');
        this.data.push(element)
      });
      this.MaxPage = res.totalPages ;
      hot.loadData(this.data)
      hot.render()
      this.Page++;
    })

    hot.addHook('afterScrollVertically', () => {
      const element = document.getElementsByClassName('wtHolder')[0]
      if (element) {
        if (element.scrollTop + element.clientHeight >= element.scrollHeight -50 && this.Page < this.MaxPage) {
          this.reportService.getAdminReport(this.Page).subscribe(res => {
            res.content.forEach((element: Report) => {
              element.reportDateTime = moment(element.reportDateTime).format('DD/MM/YYYY HH:MM:SS');
              this.data.push(element)
            });
            this.MaxPage = res.totalPages ;
            hot.updateData(this.data)
            hot.render()
            this.Page++;
          })
        }
      }
    }
    )

  }


}
