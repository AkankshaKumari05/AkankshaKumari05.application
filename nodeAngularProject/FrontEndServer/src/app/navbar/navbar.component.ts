import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {

  }
  navigateToSearch(){
    this.toggle();
    var companyDetails=JSON.parse(localStorage.getItem('companyDetails')!);
    if(companyDetails!=undefined){
      localStorage.setItem('localCall', "1");
      this.router.navigateByUrl('/search/' + companyDetails.ticker);
    }
    else{
      this.router.navigateByUrl('/search/home');
    }
    
  }

  toggle(){
    $("#navbarRight").removeClass('show');
  }
  
}
