import { Component } from "@angular/core";
import {AppSigner} from './app.signer';
import PSPDFKit from "pspdfkit";

const signing = new AppSigner;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["app.component.css"]
})
export class AppComponent {
  title = "PSPDFKit for Web Angular Example";

  ngAfterViewInit() {
    PSPDFKit.load({
      // Use the assets directory URL as a base URL. PSPDFKit will download its library assets from here.
      baseUrl: location.protocol + "//" + location.host + "/assets/",
      document: "/assets/Document.pdf",
      container: "#pspdfkit-container",
      styleSheets: ["/assets/utf8.css"]
    }).then(async (instance) => {
      const buttons = {
          type: "custom",
          title: "Finish Signing",
          className: "finish-signing",
          name: "sign",
          async onPress() {
            // When "Finish Signing" is pressed, after the user
            // has added an ink signature, we proceed to apply
            // a digital signature to the document. From this
            // point on the integrity of the file is guaranteed.
            try {
              // @ts-ignore
              await instance.signDocument(null, signing.generatePKCS7);
              console.log("New signature added to the document!", signing.generatePKCS7);
            } catch (error) {
              console.error(error);
            }
          },
      };
      // For the sake of this demo, store the PSPDFKit for Web instance
      // on the global object so that you can open the dev tools and
      // play with the PSPDFKit API.
      (window as any).instance = await instance;
     // @ts-ignore
      instance.setToolbarItems([...PSPDFKit.defaultToolbarItems, buttons])

    });
  }
}
