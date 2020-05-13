import { Injectable } from '@angular/core';
import { CRUDserviceService } from './crudservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  isAuth: boolean;

  constructor(private CrudService: CRUDserviceService) { }


    SignIn() {
      this.isAuth = true;
    }

    SignOut() {
      this.isAuth = false;
    }
}
