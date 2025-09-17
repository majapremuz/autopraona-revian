import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { DataService } from 'src/app/services/data.service';
import { NativeService } from 'src/app/services/native.service';
import { CachedImageComponent } from 'src/app/components/cached-image/cached-image.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CachedImageComponent]
})
export class CategoriesPage implements OnInit {
  currentPage = 'vijesti';

  dataLoad: boolean = false;
  translate: any = [];

  contents: Array<ContentObject> = [];
  category!: ContentObject;

  main_image: string = '';

  constructor(
    private router: Router,
    private dataCtrl: ControllerService,
    private route: ActivatedRoute,
    private contentCtrl: DataService,
    private nativeCtrl: NativeService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    const id_content = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);
    this.getData(id_content);
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
  }

  async getData(id_content: number){
    this.category = await this.contentCtrl.getContent(id_content);
    let categories = await this.contentCtrl.getCategoryContent(id_content);

    console.log('categories', categories);

    if(categories.length > 0){
      this.contents = [];
      categories.map((item) => {
        this.contents.push(item);
      })
    }

    //load cache image
    // load cache image
      if (this.category.content_image_obj?.full_url) {
        try {
          this.main_image = await this.nativeCtrl.getImage(this.category.content_image_obj.full_url);
        } catch (e) {
          console.error('Error loading image', e);
          this.main_image = ''; // fallback if image fails
        }
      } else {
        this.main_image = ''; // no image
      }

    this.dataLoad = true;
  }

  openCategory(id: number){
    this.router.navigateByUrl('/text/' + id);
  }

  openText(content: ContentObject){
    this.router.navigateByUrl('/text/' + content.content_id);
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
