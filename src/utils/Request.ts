export async function Request(
  requestType: string,
  url: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 305) {
        resolve(xhr.responseText); //OK
      } else {
        reject(xhr.statusText); //Error
      }
    };
    xhr.open(requestType, url, true); //Async
    xhr.send();
  });
}
