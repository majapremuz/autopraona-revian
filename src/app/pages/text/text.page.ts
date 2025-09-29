import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentObject, ContentType } from 'src/app/model/content';
import { ContentService } from 'src/app/services/content.service';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: false
})
export class TextPage implements OnInit {
  back_str: string = '/tabs/news';

  loadData: boolean = false;

  content_item?: ContentObject;

  hasData: boolean = false;

  pageTitle: string = '';

  no_data_text: string = '';

  constructor(
    private contentCtrl: ContentService,
    private apiCtrl: ControllerService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.reload();

    this.contentCtrl.newData.subscribe(item => {
      if(item == true){
        this.reload();
      }
    });

    this.no_data_text = await this.apiCtrl.translateWord("MESSAGES.NO_CONTENT_DATA");
  }

  async reload(){
    this.loadData = false;

    const text_id: string | null = this.route.snapshot.queryParamMap.get('content_id') || null;

    if(text_id != null){
      this.content_item = await this.contentCtrl.getContent(parseInt(text_id,10));
      
      if(this.content_item != undefined){
    
        if(this.content_item.content_type == "content" as ContentType){
          this.hasData = true;
          this.pageTitle = this.content_item.content_name;
        }else{
          this.hasData = false;
        }
      }else{
        //no permission or no content
        this.hasData = false;
      }

      //console.log(this.content_item);
    }else{
      // do not send id
      this.hasData = false;
    }
    this.loadData = true;
  }
}
