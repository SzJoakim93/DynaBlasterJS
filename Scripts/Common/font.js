function Font(img, clipCountX, clipCountY, clipWidth, clipHeight) {
    this.fontImage = new MultipleImage(img, clipCountX, clipCountY, clipWidth, clipHeight);

    this.apply = function(word, x, y) {
        for (var i = 0; i < word.length; i++) {
            if (word.charCodeAt(i)-33 >= 0) {
                this.fontImage.apply(x + i*clipWidth, y, word.charCodeAt(i)-33);
            }
        }
    }
}