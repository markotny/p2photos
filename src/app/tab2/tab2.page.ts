import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonCol, IonGrid, IonRow, IonImg, IonInput } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PhotoService } from '../services/photo.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import * as WebTorrent from 'webtorrent'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonInput, FormsModule, CommonModule, IonImg, IonRow, IonGrid, IonCol, IonIcon, IonFabButton, IonFab, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent]
})
export class Tab2Page implements OnInit, AfterViewInit {

  client!: WebTorrent.Instance;
  torrent?: any;

  files?: File[];

  constructor(public photoService: PhotoService) { }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  
  ngAfterViewInit() {
    this.client = new (<any>window)['WebTorrent']();
    console.log(this.client);
  }
  
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async seed(event: Event)
  {
    
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    // if (!this.files) return;
    
    this.client.seed(files, torrent => {
      console.log('Client is seeding:', torrent)
      const {created, announce, magnetURI, name } = torrent;
      this.torrent = {created, announce, magnetURI, name };
    })
  }
}
