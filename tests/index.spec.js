const assert = require('chai').assert;
const {selectTextAds} = require('../index.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('Text ads function', function(){
    let window = new JSDOM([
        '2023-10-29 18:15',
        'men+shoes',
        1,
        "Velasca | Men's handmade shoes",
        'Every step follows the fine tradition of Italian shoemaking. We only work with the best Italian craftsmen. 100% Made in Italy. Free Shipping and Returns. Express Delivery. No Middlemen. Types: Oxfords, Loafers, Derbies, Monk-Straps, Moccasins, Boat Shoes, Ankles, Boots.',
        'campaigns.velasca.comhttps://campaigns.velasca.com',
        'Text Ad'
      ]);

    it('should return an array', function(){
        const result = selectTextAds(window);
        assert.typeOf(result, 'array')
    })

    it('Array length should be equal to 8', function(){
        const result = selectTextAds(window);
        assert.lengthOf(result[0], 8)
    })
})