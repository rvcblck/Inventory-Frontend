import { Component, OnInit } from '@angular/core';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-warehouse-supplies',
  templateUrl: './warehouse-supplies.component.html',
  styleUrls: ['./warehouse-supplies.component.css']
})
export class WarehouseSuppliesComponent implements OnInit {
  cameraId: any;
  decodedText: any;
  orderDataQrcode: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.requestCameraPermissions();
  }

  requestCameraPermissions(): void {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          this.cameraId = devices[0].id;
          this.startScanner();
        }
      })
      .catch((err) => {
        // handle error
      });
  }

  startScanner(): void {
    const html5QrCode = new Html5Qrcode('reader');
    html5QrCode
      .start(
        this.cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 4 / 3
        },
        (decodedText: string, decodedResult: any) => {
          // Handle the decoded QR code

          if (this.decodedText !== decodedText) {
            this.decodedText = decodedText;
            this.orderService.showOrderUsingQrcode(this.decodedText).subscribe(
              (response) => {
                this.orderDataQrcode = response.data;
                console.log(this.orderDataQrcode);
              },
              (err) => {
                console.log(err);
              }
            );
          }
        },
        (errorMessage: string) => {
          // Ignore or handle parse error
        }
      )
      .catch((err: any) => {
        // Handle start failure
      });
  }
}
