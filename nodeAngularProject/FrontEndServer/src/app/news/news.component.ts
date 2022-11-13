import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { companyNewsDetail } from '../app-interface/companyNewsDetailModel';
import { NewsModalComponent } from '../news-modal/news-modal.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @Input() NewDetailData: any;
  constructor(
    private newsModalService: NgbModal
  ) { }

  ngOnInit(): void {
  }
  
  openNewsDetail(news: companyNewsDetail){
    const newsModalRef = this.newsModalService.open(NewsModalComponent);
    newsModalRef.componentInstance.news = news;
  }

}
