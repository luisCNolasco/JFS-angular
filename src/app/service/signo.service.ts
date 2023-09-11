import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { Signo } from '../model/Signo';

@Injectable({
  providedIn: 'root'
})
export class SignoService extends GenericService<Signo>{

  private signoChange: Subject<Signo[]> = new Subject<Signo[]>
  private messageChange: Subject<string> = new Subject<string>

  private rutaChange: Subject<boolean> = new Subject<boolean>
  
  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/signos`);
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  ///////////////////////////////////
  getSignoChange(){
    return this.signoChange.asObservable();
  }

  setSignoChange(data: Signo[]){
    this.signoChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }
}
