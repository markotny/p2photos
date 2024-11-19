import { Component, AfterViewInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonFabButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import * as WebTorrent from 'webtorrent'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonItem, CommonModule, FormsModule, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page implements AfterViewInit {
  client!: WebTorrent.Instance;

  magnetUri?: string;
  fileNames: string[] = [];
  constructor() { }
  
  ngAfterViewInit() {
    this.client = new (<any>window)['WebTorrent']();
  }

  download() {
    if (!this.magnetUri) return;

    this.client.add(this.magnetUri, async torrent => {
      // Got torrent metadata!
      console.log('Client is downloading:', torrent)
    
      await this.share(torrent);
    })
  }

  async share(torrent: WebTorrent.Torrent) {
     if (!navigator.canShare) {
       alert('sharing not supported');
     }
    
    const files: File[] = [];
    
    torrent.files.forEach(torrentFile => {
      torrentFile.getBlob((err, blob) => blob && files.push(new File([blob], torrentFile.name, {type: blob.type})))
    });

    torrent.on('done', () => {
      console.log('done...');
      setTimeout(async () => {
        console.log('files to share', files.length, files, torrent.files)
        if (navigator.canShare({ files })) {
          try {
            await navigator.share({
              files,
              title: "Images",
              text: "Beautiful images",
            });
          } catch (error) {
            alert(`Error: ${(error as any).message}`);
          }
        } else {
          alert(`Your system doesn't support sharing these files.`);
        }
      }, 100);
    });
   }
}
