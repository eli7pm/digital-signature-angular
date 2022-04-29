//@ts-ignore
import * as forge from 'node-forge'

export class AppSigner {
  //Generating the PKCS7 file
  generatePKCS7 = async (fileContents: string): Promise<ArrayBuffer> =>{

    //Just for demo purporse, I'm taking the certicate files from local storage.
    const certificatePromise = fetch(
      "./assets/elicert.pem"
    ).then((response) => response.text());
    const privateKeyPromise = fetch(
      "./assets/private.pem"
    ).then((response) => response.text());
    const [certificatePem, privateKeyPem] = await Promise.all([
      certificatePromise,
      privateKeyPromise,
    ]);
    const certificate = forge.pki.certificateFromPem(certificatePem);
    const privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem,"pikiro");

    const p7 = forge.pkcs7.createSignedData();

    p7.content = new forge.util.ByteStringBuffer(fileContents);
    p7.addCertificate(certificate);
    console.log(p7)
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    p7.addSigner({
      key: privateKey,
      certificate: certificate,
      digestAlgorithm: forge.pki.oids['sha256'],
      authenticatedAttributes: [
        {
          type: forge.pki.oids['contentType'],
          value: forge.pki.oids['data'],
        },
        {
          type: forge.pki.oids['messageDigest'],
        },
        {
          type: forge.pki.oids['signingTime'],
          value: Date.toString(),
        },
      ],
    });

    p7.sign({ detached: true });

    return this.stringToArrayBuffer(forge.asn1.toDer(p7.toAsn1()).getBytes());
  }

  //This function is used to convert the string to an Array Buffer
  stringToArrayBuffer(binaryString: string): ArrayBuffer {
    const buffer = new ArrayBuffer(binaryString.length);
    let bufferView = new Uint8Array(buffer);

    for (let i = 0, len = binaryString.length; i < len; i++) {
      bufferView[i] = binaryString.charCodeAt(i);
    }

    return buffer;
  }

}
