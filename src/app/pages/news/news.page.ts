import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentObject, ContentType } from 'src/app/model/content';
import { ContentService } from 'src/app/services/content.service';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: false
})
export class NewsPage implements OnInit {
  back_str: string = '/home';

  loadData: boolean = false;

  contents?: Array<ContentObject> = [];

  hasData: boolean = false;

  pageTitle: string = '';

  no_data_text: string = '';

  constructor(
    private contentCtrl: ContentService,
    private apiCtrl: ControllerService,
    private route: ActivatedRoute,
    private router: Router
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

  openContent(item: ContentObject){
    if(item.content_type == ContentType.Category){
      this.router.navigateByUrl('/tabs/news?content_id=' + item.content_id);
    }else{
      this.router.navigateByUrl('/tabs/news/text?content_id=' + item.content_id);
    }
  }

  async reload(){
    this.loadData = false;

    const text_id: string | null = this.route.snapshot.queryParamMap.get('content_id') || null;

    if(text_id != null){
      let content = await this.contentCtrl.getContent(parseInt(text_id,10));
      let contents = await this.contentCtrl.getCategoryContent(parseInt(text_id,10));

      if(contents.length > 0){
        this.hasData = true;
        this.pageTitle = content.content_name;
        this.contents = contents;
      }else{
        this.hasData = false;
        this.pageTitle = content.content_name;
        this.contents = [];
      }

    }else{
      let root_content = await this.contentCtrl.getRootContent();

      if(root_content.length > 1){
        this.hasData = true;
        this.pageTitle = "News";
        this.contents = root_content;
      }else if(root_content.length == 1){
        this.pageTitle = root_content[0].content_name;

        let contents = await this.contentCtrl.getCategoryContent(root_content[0].content_id);

        console.log(contents);


        if(contents.length > 0){
          this.hasData = true;
          this.contents = contents;
        }else{
          this.hasData = false;
          this.contents = [];
        }
      }else{
        //no data
        this.hasData = false;
        this.contents = [];
      }

    }

    this.loadData = true;
  }

}
