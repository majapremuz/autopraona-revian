import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { CachedImageComponent } from 'src/app/components/cached-image/cached-image.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vijesti',
  templateUrl: './vijesti.page.html',
  styleUrls: ['./vijesti.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CachedImageComponent]
})
export class VijestiPage implements OnInit {
  currentPage = 'vijesti';

  dataLoad: boolean = false;
  translate: any = [];

  contents: Array<ContentObject> = [];
  category!: ContentObject;

  main_image: string = '';

  constructor(
    private router: Router,
    private dataCtrl: ControllerService
  ) { }
  


  ngOnInit() {
  this.getData();
}

  async getData(){
    let url = `/${environment.rest_server.functions.api}/content/contents_main_group_offline`;
    console.log('Fetching data from URL:', url);

    // show loader
    await this.dataCtrl.showLoader();

    // get data from server
    let data = await this.dataCtrl.getServer(url, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);

        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });

    // hide loader
    await this.dataCtrl.hideLoader();


        if (data != undefined) {
        console.log('raw response:', data);

        const items = Array.isArray(data.data?.data) ? data.data.data : [];

        this.contents = items.map((item: ContentApiInterface) => new ContentObject(item));

        console.log('parsed contents:', this.contents);

        this.dataLoad = true;

        if (this.contents.length > 0) {
          this.main_image = this.contents[0].content_image_obj?.full_url || '';
        }
      }
  }

  openCategory(id: number){
    this.router.navigateByUrl('/categories/' + id);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToCijenik() {
    this.router.navigate(['/cijenik']);
  }

  goToVijesti() {
    this.router.navigate(['/vijesti']);
  }

  goToKontakt() {
    this.router.navigate(['/kontakt']);
  }

  goToProfil() {
    this.router.navigate(['/profil']);
  }

}
