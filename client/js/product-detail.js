const mainImage = document.querySelector("#mainImage");
const thumbnails = document.querySelectorAll(".thumbnail");
const breadcrumb = document.querySelector(".breadcrumb .container");


const params = new URLSearchParams(window.location.search);
const productId =Number(params.get("id"));

fetch("../data/products.json")
    .then(function(response){
        return response.json();
    })
    .then(function(products){
        const product=products.find(function(p){
            return p.id===productId;
        });
        if(!product){
            window.location.href="./products.html";
            return;
        }
        const related = products.filter(function(p) {
        return p.category === product.category && p.id !== product.id;
        });
        renderProduct(product);
        renderRelatedProducts(related);

    });

function renderProduct(product){
    document.title = `${product.name} — XMart`;
    const category = product.category;
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    //Breadcrumbs
    breadcrumb.innerHTML = `
        <a href="./index.html">Home</a>
        <span>/</span>
        <a href="./products.html?category=${product.category}">${capitalized}</a>
        <span>/</span>
        <p>${product.name}</p>
    `;
}