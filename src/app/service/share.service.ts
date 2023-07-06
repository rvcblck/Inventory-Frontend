import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  sharedObject: any;
  inventoryData: any;
  constructor() {}
}
