import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "54179353-52b74677f97422d49d8297fd1";

export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
          safesearch: true,
          page,
      per_page: 15,
    },
  });
  return response.data;
}