class ApiService {

  static BASE_URL = 'http://localhost:8081/'

  _request = async (url, method = 'GET', body) => {
    let data = {
      method: method,
    };
    if (body) {
      data.body = body
    }
    const response = await fetch(BASE_URL + url, body);
    return await response.json();
  }

  getPath = async (body) => {
    const response = await _request('path', 'POST', body);
    return response;
  }

  getNewDisk = async (body) => {
    const response = await _request('new-disk', 'POST', body);
    return response;
  }

  getCurrentDirectory = async () => {
    const response = await _request('current-directory');
    return response;
  }
}

export function getFolder(path, data) {
    return fetch(path, {
        method: "POST",
        body: JSON.stringify({ path: data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
    });
}