import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AUDIO_FILES} from "../constants/audio-files.const";
import {AudioFile} from "../models/audio-file.model";

@Injectable({
  providedIn: 'root'
})

export class CloudService {
  files: AudioFile[] = AUDIO_FILES;

  getFiles(): Observable<AudioFile[]> {
    return of(this.files);
  }

  minId(): number {
    return [...this.files].map((file: AudioFile) => {
      return file.id
    }).sort((a: number, b: number) => {
      return a - b;
    })[0]
  }

  maxId(): number {
    return [...this.files].map((file: AudioFile) => {
      return file.id
    }).sort((a: number, b: number) => {
      return b - a;
    })[0]
  }

  nextId(currentId: number): number {
    return [...this.files].map((file: AudioFile) => {
      return file.id
    }).filter((id: number): boolean => {
      return id > currentId;
    }).sort((a: number, b: number) => {
      return a - b
    })[0]
  }

  prevId(currentId: number): number {
    return [...this.files].map((file: AudioFile) => {
      return file.id
    }).filter((id: number): boolean => {
      return id < currentId;
    }).sort((a: number, b: number) => {
      return b - a;
    })[0]
  }

  next(currentId: number): AudioFile {
    const index: number = this.nextId(currentId);
    return <AudioFile>[...this.files].find((f: AudioFile): boolean => {
      return f.id === index;
    });
  }

  previous(currentId: number): AudioFile {
    const index: number = this.prevId(currentId);
    return <AudioFile>[...this.files].find((f: AudioFile): boolean => {
      return f.id === index;
    });
  }
}
