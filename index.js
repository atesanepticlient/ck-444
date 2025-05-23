// import fetch from "node-fetch"

const url = "http://asiaapi.net/API";
const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: '{"hall":"941370","key":"ea847187a6ac1bb273648692c83df371","cmd":"getGamesList","img":"game_img_2"}',
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
