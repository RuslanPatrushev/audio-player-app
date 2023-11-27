import {Component, OnInit} from '@angular/core';
import {StreamState} from "../../core/models/stream-state.model";
import {AudioService} from "../../core/services/audio.service";
import {CloudService} from "../../core/services/cloud.service";
import {AudioFile} from "../../core/models/audio-file.model";
import {PLAYER} from "../../core/constants/player.const";
import {Player} from "./model";
import {DISPLAYED_COLUMNS} from "../../core/constants/table.const";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {
  displayedColumns: string[] = DISPLAYED_COLUMNS;
  files: Array<AudioFile> = [];
  state!: StreamState;
  currentFile!: AudioFile;
  protected readonly player: Player = PLAYER;

  constructor(
    private audioService: AudioService,
    private cloudService: CloudService
  ) {
  }

  ngOnInit(): void {
    this.state = this.audioService.state;

    this.cloudService.getFiles().subscribe((files: AudioFile[]): void => {
      this.files = files;
    });

    this.audioService.getState()
      .subscribe((state: StreamState): void => {
        this.state = state;
      });

    this.currentFile = this.files[0]
  }

  playStream(url: string): void {
    this.audioService.playStream(url)
      .subscribe((events: Event): void => {
      });
  }

  openFile(file: AudioFile): void {
    this.currentFile = file;
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause(): void {
    this.audioService.pause();
  }

  play(): void {
    this.audioService.play();
  }

  stop(): void {
    this.audioService.stop();
  }

  next(): void {
    this.openFile(this.cloudService.next(this.currentFile.id));
  }

  previous(): void {
    this.openFile(this.cloudService.previous(this.currentFile.id));
  }

  isFirstPlaying(): boolean {
    return this.currentFile.id === this.minId();
  }

  isLastPlaying(): boolean {
    return this.currentFile.id === this.maxId();
  }

  nextId(): number {
    return this.cloudService.nextId(this.currentFile.id);
  }

  prevId(): number {
    return this.cloudService.prevId(this.currentFile.id);
  }

  maxId(): number {
    return this.cloudService.maxId();
  }

  minId(): number {
    return this.cloudService.minId();
  }

  onSliderChangeEnd(change: Event): void {
    const target: HTMLInputElement = change.target as HTMLInputElement
    this.audioService.seekTo(+target.value);
  }
}
