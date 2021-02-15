class ApiService {

  _apiBase = 'http://localhost:3000/';

  _request = async (url, method = 'GET', body, headers) => {
    let data = {
      method: method,
    };
    if (body) {
      data.body = body
    }
    if (headers) {
      data.headers = headers
    }
    const response = await fetch(this._apiBase + url, data);
    if (!response.ok) {
      throw new Error(`Could not found ${url} received ${response.status}`);
    }
    return await response.json();
  }

  getFolder = async (body) => {
    const response = await this._request('folder', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }

  getPath = async (body) => {
    const response = await this._request('path', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }

  getNewDisk = async (body) => {
    const response = await this._request('new-disk', 'POST', body);
    return response;
  }

  getCurrentDirectory = async () => {
    const response = await this._request('current-directory');
    return response;
  }

  getDiskSelection = async () => {
    const response = await this._request('disk-selection');
    return response;
  }

  rename = async (body) => {
    const response = await this._request('rename', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }

  moveContent = async (body) => {
    const response = await this._request('move-content', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }

  deleteContent = async (body) => {
    const response = await this._request('delete-content', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }

  createFile = async (body) => {
    const response = await this._request('create-file', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }

  createFolder = async (body) => {
    const response = await this._request('create-folder', 'POST', body, {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return response;
  }
}

export default ApiService;