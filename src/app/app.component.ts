import {
  style,
  transition,
  trigger,
  animate,
  query,
  group,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

const baseStyles = style({
  // display: 'block',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnim', [
      transition(':increment', [
        style({
          position: 'relative',
          overflow: 'hidden',
        }),
        query(':enter, :leave', [baseStyles], { optional: true }),

        // query(
        //   ':enter',
        //   [
        //     style({
        //       opacity: '0',
        //     }),
        //   ],
        //   { optional: true }
        // ),
        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-in',
                style({
                  opacity: '0',
                  transform: 'translateX(-50px)',
                })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({
                opacity: '0',
                transform: 'translateX(50px)',
              }),
              animate(
                '300ms 120ms ease-out',
                style({
                  opacity: '1',
                  transform: 'translateX(0)',
                })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),

      transition(':decrement', [
        style({
          position: 'relative',
          overflow: 'hidden',
        }),
        query(':enter, :leave', [baseStyles], { optional: true }),

        // query(
        //   ':enter',
        //   [
        //     style({
        //       opacity: '0',
        //     }),
        //   ],
        //   { optional: true }
        // ),
        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-in',
                style({
                  opacity: '0',
                  transform: 'translateX(50px)',
                })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({
                opacity: '0',
                transform: 'translateX(-50px)',
              }),
              animate(
                '300ms 120ms ease-out',
                style({
                  opacity: '1',
                  transform: 'translateX(0)',
                })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),

      transition('* => secondary', [
        style({
          position: 'relative',
        }),
        query(':enter, :leave', [baseStyles], { optional: true }),

        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-in',
                style({
                  opacity: '0',
                  transform: 'scale(0.8)',
                })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({
                opacity: '0',
                transform: 'scale(1.2)',
              }),
              animate(
                '300ms 120ms ease-out',
                style({
                  opacity: '1',
                  transform: 'scale(1)',
                })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),

      transition('secondary => *', [
        style({
          position: 'relative',
        }),
        query(':enter, :leave', [baseStyles], { optional: true }),

        group([
          query(
            ':leave',
            [
              animate(
                '300ms ease-in',
                style({
                  opacity: '0',
                  transform: 'scale(1.25)',
                })
              ),
            ],
            { optional: true }
          ),
          query(
            ':enter',
            [
              style({
                opacity: '0',
                transform: 'scale(0.8)',
              }),
              animate(
                '300ms 120ms ease-out',
                style({
                  opacity: '1',
                  transform: 'scale(1)',
                })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),

    trigger('bgAnim', [
      transition(':leave', [animate(1000, style({ opacity: 0 }))]),
    ]),

    trigger('fadeAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(400, style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  backgrounds: string[] = [
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fG5pZ2h0JTIwc2t5fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=60',
  ];
  loadingBGImage?: boolean;

  // dateTime?: Date;
  dateTime?: Observable<Date>;

  ngOnInit() {
    // this.dateTime = new Date();
    // timer(0, 1000).subscribe(() => {
    //   this.dateTime = new Date();
    // });
    this.dateTime = timer(0, 1000).pipe(
      map(() => {
        return new Date();
      })
    );
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) {
      const tab = outlet.activatedRouteData['tab'];
      if (!tab) return 'secondary';
      return tab;
    }
  }

  async changeBGImage() {
    this.loadingBGImage = true;
    // get request will download image so use fetch
    const result = await fetch('https://source.unsplash.com/random/1920x1080', {
      method: 'HEAD',
    });

    const alreadyGot = this.backgrounds.includes(result.url);
    if (alreadyGot) {
      // this is the same image as we currently have, so re-run the function to get another image
      this.changeBGImage();
    }

    this.backgrounds.push(result.url);
  }

  onBGImageLoad(imgEvent: Event) {
    // BG image has loaded, now remove the old BG image from the backgrounds array
    const imgElement = imgEvent.target as HTMLImageElement;
    const src = imgElement.src;
    this.backgrounds = this.backgrounds.filter((b) => b === src);
    // this.backgrounds = [src]
    this.loadingBGImage = false;
  }
}
