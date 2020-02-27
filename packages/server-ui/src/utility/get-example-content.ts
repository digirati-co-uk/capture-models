export function getExampleContent(): Array<{ label: string; manifest: string; thumbnail?: string }> {
  return [
    {
      label: 'Forth Bridge illustrations',
      manifest: 'https://view.nls.uk/manifest/7446/74464117/manifest.json',
      thumbnail: 'https://deriv.nls.uk/dcn4/7443/74438561.4.jpg',
    },
    {
      label: 'Wunder der Vererbung',
      manifest: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
      thumbnail: 'https://dlcs.io/thumbs/wellcome/5/b18035723_0001.JP2/full/73,100/0/default.jpg',
    },
  ];
}
