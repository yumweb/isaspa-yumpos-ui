const API_KEY = process.env.REACT_APP_PUBLIC_API_KEY;
const BASE_URL = process.env.REACT_APP_PUBLIC_BASE_URL;

const apiKeyHeader = {
  "x-api-key": API_KEY,
};

const get = async (url, signal) => {
  const token = window.localStorage.getItem("yumpos_token");
  const headers = {
    ...apiKeyHeader,
    accept: "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };
  const response = await fetch(`${BASE_URL}${url}`, {
    headers,
    signal,
  });

  if (response.status === 401) {
    // Redirect to the login page
    localStorage.removeItem("yumpos_token");
    window.localStorage.removeItem("yuppos_selected_customer");
    window.localStorage.removeItem("yumpos_cart_items");
    window.location.href = '/';
  } else {
    return response;
  }
};

const post = async (url, body) => {
  const token = window.localStorage.getItem("yumpos_token");
  const headers = {
    ...apiKeyHeader,
    accept: "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };

  return fetch(`${BASE_URL}${url}`, {
    headers,
    body: JSON.stringify(body),
    method: "POST",
  });
};

const patch = async (url, body) => {
  const token = window.localStorage.getItem("yumpos_token");
  const headers = {
    ...apiKeyHeader,
    accept: "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };
  return fetch(`${BASE_URL}${url}`, {
    headers,
    body: JSON.stringify(body),
    method: "PATCH",
  });
};

const put = async (url, body) => {
  const token = window.localStorage.getItem("yumpos_token");
  const headers = {
    ...apiKeyHeader,
    accept: "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };
  return fetch(`${BASE_URL}${url}`, {
    headers,
    body: JSON.stringify(body),
    method: "PUT",
  });
};

const _delete = async (url, body) => {
  const token = window.localStorage.getItem("yumpos_token");
  const headers = {
    ...apiKeyHeader,
    accept: "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    authorization: `Bearer ${token}`,
  };

  return fetch(`${BASE_URL}${url}`, {
    headers,
    body: JSON.stringify(body),
    method: "DELETE",
  });
};

const cancel = async (url, body) => {
  const token = "";
  const headers = {
    ...apiKeyHeader,
    accept: "application/json",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    authorization: token,
  };

  return fetch(`${BASE_URL}${url}`, {
    headers,
    body: JSON.stringify(body),
    method: "DELETE",
  });
};

export default { get, post, patch, put, delete: _delete, cancel };
