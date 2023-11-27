import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, Subject, Subscriber} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {StreamState} from "../models/stream-state.model";
import * as moment from "moment";
import {EventsEnum} from "../enums/events.enum";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$: Subject<void> = new Subject();
  private audioObj: HTMLAudioElement = new Audio();
  readonly eventEnum = EventsEnum;

  public state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: 1,
    currentTime: 1,
    canplay: false,
    error: false,
  };

  private streamObservable(url: string): Observable<Event> {
    return new Observable((observer: Subscriber<Event>) => {
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event): void => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, Object.values(this.eventEnum), handler);
      return (): void => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.removeEvents(this.audioObj, Object.values(this.eventEnum), handler);
        this.resetState();
      };
    });
  }

  private addEvents(obj: EventTarget, events: EventsEnum[], handler: EventListener): void {
    events.forEach((event: EventsEnum): void => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: EventTarget, events: EventsEnum[], handler: EventListener): void {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: string): Observable<Event> {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play(): void {
    this.audioObj.play();
  }

  pause(): void {
    this.audioObj.pause();
  }

  stop(): void {
    this.stop$.next();
  }

  seekTo(seconds: number): void {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss'): string {
    const momentTime: number = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case this.eventEnum.Canplay:
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case this.eventEnum.Playing:
        this.state.playing = true;
        break;
      case this.eventEnum.Pause:
        this.state.playing = false;
        break;
      case this.eventEnum.Timeupdate:
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case this.eventEnum.Error:
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState(): void {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: 1,
      currentTime: 1,
      canplay: false,
      error: false
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
}
