import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { companyNewsDetail } from '../app-interface/companyNewsDetailModel';

@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.css']
})
export class NewsModalComponent implements OnInit {
  @Input() public news!: companyNewsDetail;
  fbSrc!: string;
  constructor(public newsModalService: NgbActiveModal) { }

  ngOnInit() {
    this.fbSrc = 'https://www.facebook.com/sharer/sharer.php?u=' +
      encodeURIComponent(this.news.url) + '&amp;src=sdkpreparse';
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

}
