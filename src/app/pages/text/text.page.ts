import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ContentObject } from 'src/app/model/content';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/services/data.service';
import { NativeService } from '../../services/native.service';
import { ImageObject } from '../../model/image';
import { AudioComponent } from 'src/app/components/audio/audio.component';


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AudioComponent]
})
export class TextPage implements OnInit {
  currentPage = 'vijesti';

  content!: ContentObject;
  dataLoad: boolean = false;

  main_image: string = '';
  url: string = 'https://file-examples.com/storage/fe1b07b09f67bcb9b96354c/2017/11/file_example_MP3_700KB.mp3';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contentCtrl: DataService,
     private nativeCtrl: NativeService,
  ) { }

  ngOnInit() {
    const id_content = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);
    this.getData(id_content);
  }

  async getData(id: number){
    this.content = await this.contentCtrl.getContent(id);

    //load cache image
    this.main_image = await this.nativeCtrl.getImage(this.content.content_image_obj?.full_url || '');

    this.dataLoad = true;
  }

  openAttachment(item: ImageObject){
    let url = '';
    if(item.image == true){
      url = environment.rest_server.protokol + environment.rest_server.host + '/Assets/multimedia/original/' + item.full_url;
    }else{
      url = environment.rest_server.protokol + environment.rest_server.host + '/Assets/multimedia/' + item.multimedia_file;
    }

    this.nativeCtrl.openInBrowser(url);
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
