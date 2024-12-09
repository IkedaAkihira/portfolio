function getCardHTMLText(title, description, workPath, thumbnailPath) {
    return '' +
    `<div class="card my-4">` +
    `    <div class="row">` +
    `        <div class="col-xl-3 col-sm-4">` +
    `            <img src="${thumbnailPath}" class="img-fluid rounded"/>` +
    `        </div>` +
    `        <div class="col-xl-9 col-sm-8">` +
    `            <div class="card-body m-0">` +
    `                <h3 class="card-title">` +
    `                    <span class="mx-2">${title}</span>` +
    `                    <a href="${workPath}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary mx-2">プレイ</a>` +
    `                </h3>` +
    `                <p class="card-text fs-6 mb-2">` +
    `                    ${description}` +
    `                </p>` +
    `            </div>` +
    `        </div>` +
    `    </div>` +
    `</div>`;
}

const req = new XMLHttpRequest();
req.addEventListener('load', ()=>{
    const datas = JSON.parse(req.responseText);
    console.log(datas);
    const cards = document.getElementById('cards');

    for(const data of datas) {
        cards.innerHTML += getCardHTMLText(data.title, data.description, data.url, data.thumbnail);
    }
});

req.open('GET', './data.json');
req.send();