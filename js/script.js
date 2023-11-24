(function(r){
    window.r46=window.r46||function(){(window.r46.q=window.r46.q||[]).push(arguments)};
    var c="https://cdn.rees46.ru",v="/v3.js",s={link:[{href:c,rel:"dns-prefetch"},{href:c,rel:"preconnect"},{href:c+v,rel:"preload",as:"script"}],script:[{src:c+v,async:""}]};
    Object.keys(s).forEach(function(c){s[c].forEach(function(d){var e=document.createElement(c),a;for(a in d)e.setAttribute(a,d[a]);document.head.appendChild(e)})});
})();

r46('init', 'f4c5f4a4700948708a77bf68893c11');

let form_search,
    quick_search,
    full_search,
    request = '';

document.addEventListener("DOMContentLoaded", () => {
    let search_query = false;
    form_search = document.querySelector('.search_results'),
    quick_search = form_search.querySelector('.quick_search__results'),
    full_search = form_search.querySelector('.full_search__results'),
    document.querySelector('.search-input').addEventListener('input', function (){
        if (search_query) clearInterval(search_query);
        search_query = setTimeout(()=> {
            quick_search.innerHTML = '<span class="loader"></span>';
            full_search.innerHTML = '<span class="loader"></span>';
            form_search.classList.add('ready');
            request = this.value;
            searchProduct('suggest', quick_search, this.value);
            searchProduct('search', full_search, this.value);
        }, 550);
    })

    document.querySelector('body').addEventListener('click', function (e){
        if (e.target == this) document.querySelector('.search_results').classList.remove('ready');
    })
});

function searchProduct(type, where, text, page=1, limit=6){
    let data = {};
    data['search_query'] = text;
    if (type == 'search'){
        data['page'] = page;
        data['limit'] = limit;
    }
    r46(type, data, function(response) {
        where.innerHTML = '';
        if (!response['products']){
            where.innerHTML = '<p>Ошибка ответа</p>';
            return false;
        }
        if (!response['products'].length){
            where.innerHTML = '<p>Товаров нет</p>';
        } else {
            insertProduct(response['products'], where);
            if (type == 'search') pagination(response['products_total'], limit, page,where);
        }
    }, function(error) {
        where.innerHTML = '<p>Ошибка</p>';
        console.log(error);
    });
}

function insertProduct(products, where){
        products.forEach((product) => {
        const product_html = document.createElement('div');
        product_html.classList.add('product');
        product_html.innerHTML = `
        <img src="${product['image_url_resized']['120']}" alt="${product['name']}" >
        <div class="product-description">
            <p class="product-name">${product['name']}</p>
            <p class="product-price">${product['price_full_formatted']}</p>
        </div>
        `;
        where.appendChild(product_html);
    })
}

function pagination(product_total, limit, active_page, where){
    const count_page = Math.ceil(product_total / limit);
    let res = '';
    if (count_page < 2) return false;
    const pag = document.createElement('ul');
    pag.classList.add('pagination');
    if (count_page < 7) {
        res += addElemPagination(1, count_page, active_page);
    } else {

            res += addElemPagination(1, 2, active_page);
        if (active_page <= 5){
            res += addElemPagination(3, active_page, active_page);
        } else {
            res += '<li>...</li>';
            res += addElemPagination(active_page-1, active_page, active_page);
        }

        if (active_page < count_page-4){
            if (active_page != 1){
                res += addElemPagination(Number(active_page) + 1, Number(active_page)+1, active_page);
            }
            res += '<li>...</li>';
            res += addElemPagination(count_page - 1, count_page, active_page);
        } else{
            res += addElemPagination(Number(active_page) + 1, count_page, active_page);
        }
    }

    pag.innerHTML = res;
    where.appendChild(pag);
}

function addElemPagination(start, finish, active_page){
    let class_active = '',
        res = '';
    for (let i=start; i<=finish; i++){
        class_active = (active_page == i) ? 'class="active-page"' : '';
        res += '<li onclick="pageSelection(event)" data-page="' + i + '" ' + class_active + '>' + i + '</li>';
    }
    return res;
}

function pageSelection(e){
    searchProduct('search', full_search, request, e.target.getAttribute('data-page'));
}


