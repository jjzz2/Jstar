const KEY = "USER_TOKEN";
//仿真用户与浏览器的交互过程
//只要获取了其的token那么就说明其是已经登录了，然后对其进行setItem,getItem等一系列的操作
export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getToken() {
  return localStorage.getItem(KEY) || "";
}

export function removeToken() {
  localStorage.removeItem(KEY);
}
