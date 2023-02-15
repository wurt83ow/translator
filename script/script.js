'use strict';

const formAddCard = document.querySelector('#form_addcard'),
    searchTextElem = document.querySelector('#search_text');

let words = JSON.parse(localStorage.getItem("words") || '[]');
rerender(words);

let foundWords = [];

formAddCard.addEventListener('submit', addWordCard);
searchTextElem.addEventListener('input', searchWordCards);

function searchWordCards(event) {
    event.preventDefault();

    const searchQuery = event.target.value.toLowerCase();

    if (!searchQuery) {
        rerender(words);
        return;
    }

    foundWords = words.filter(elem => elem.original.toLowerCase().includes(searchQuery) ||
        elem.translate.toLowerCase().includes(searchQuery));

    foundWords.forEach(elem => {
        if (elem.translate.toLowerCase().includes(searchQuery)) {
            elem.upside = true;
        }
    });

    rerender(foundWords);
}

function addWordCard(event) {

    event.preventDefault();

    const fields = ['original', 'translate', 'color'],
        word = {};

    fields.forEach(field => {
        word[field] = event.target[field].value;
        event.target[field].value = '';
    });

    word.id = 'card' + randomID();
    word.upside = false;

    words.push(word);

    rerender(words);

}

function removeWordCard(card) {
    words = words.filter(elem => elem.id !== card.id);
    rerender(words);
}

function rerender(words) {

    const cards = document.querySelector('.cards');
    cards.innerText = '';

    localStorage.setItem("words", JSON.stringify(words));

    for (let i = 0; i < words.length; i++) {

        const word = words[i],
            {
                card,
                original,
                translate,
                close
            } = createCardElements();

        close.addEventListener('click', removeWordCard.bind(null, word));

        card.addEventListener('dblclick', event => {
            turnTheCard(event.target);
        });

        card.id = word.id;
        card.style.backgroundColor = word.color;

        close.innerText = '✖';
        original.innerText = word.original;
        translate.innerText = word.translate;
        translate.classList.add('cards_item_hide');

        card.append(original, translate, close);
        cards.appendChild(card);

        if (word.upside) {
            turnTheCard(card, true);
        }
    }
}

function createCardElements() {

    const fields = ['card', 'original', 'translate', 'close'],
        card_obj = {};

    fields.forEach(field => {
        card_obj[field] = document.createElement('div');
        card_obj[field].classList.add(`cards_item_${field}`);
    });

    return card_obj;
}

function turnTheCard(card, turned = false) {
    let pref = 'cards_item',
        sClose = `${pref}_close`,
        sCard = `${pref}_card`,
        sHide = `${pref}_hide`;

    if (card.classList.contains(sClose)) {
        return;
    } else if (!card.classList.contains(sCard)) {
        card = card.parentElement;
    }

    const word = words.find(elem => elem.id === card.id);

    word.upside = turned || !word.upside;

    for (let elem of card.children) {
        if (elem.classList.contains(sClose)) {
            continue;
        }
        elem.classList.toggle(sHide);
    }

    const cardStyle = card.style,
        closeStyle = card.children[2].style,
        upside = word.upside;

    cardStyle.transform = `rotateY(${upside ? '180deg' : '360deg'})`;
    closeStyle.left = upside ? '-22px' : '';
    closeStyle.right = upside ? '' : '-22px';
}

function randomID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}