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