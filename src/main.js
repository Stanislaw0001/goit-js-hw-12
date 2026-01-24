import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
} from "./js/render-functions.js";

const form = document.querySelector(".form");
let query = "";
let page = 1;
const PER_PAGE = 15;

form.addEventListener("submit", onFormSubmit);
document
    .querySelector(".load-more")
    .addEventListener("click", onLoadMore);

async function onFormSubmit(event) {
    event.preventDefault();
    query = event.currentTarget.elements["search-text"].value.trim();
    if (!query) return;
    
    page = 1;
    clearGallery();
    hideLoadMoreButton();
    await fetchImages();
}

async function onLoadMore() {
    page += 1;
    hideLoadMoreButton();
    await fetchImages();
}

async function fetchImages() {
    try {
        showLoader();
        const data = await getImagesByQuery(query, page, PER_PAGE);
        if (data.hits.length === 0 && page === 1) {
            iziToast.error({
                message: "Sorry, there are no images matching your search query. Please try again.",
            });
            return;
        }
        createGallery(data.hits);
        const totalPages = Math.ceil(data.totalHits / PER_PAGE);
        if (page >= totalPages) {
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
            });
            hideLoadMoreButton();
        } else {
            showLoadMoreButton();
        }

        if (page > 1) {
            smoothScroll();
        }
    } catch {
        iziToast.error({
            message: "Something went wrong."
        });
    } finally {
        hideLoader();
    }
}

function smoothScroll() {
    const card = document.querySelector(".gallery-item");
    if (!card) return;
    const { height } = card.getBoundingClientRect();
    window.scrollBy({
        top: height * 2,
        behavior: "smooth",
    });
}