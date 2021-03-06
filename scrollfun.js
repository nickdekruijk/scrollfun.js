/*

Usage example:
var scrollElement = new ScrollFun({
    selector: '.element',
    start: 0,
    end: document.querySelector('.element').offsetHeight,
    styles: {
        translateY: [0, -window.innerHeight/2, 'px'],
        scale: [1, 1.5],
        opacity: [1, 0.6],
        grayscale: [1, 0],
        brightness: [1, 10],
        blur: [0, 30, 'px'],
    }
});

*/

window.ScrollFun = function(options) {
    function val(v, e, n) { return typeof v === "function" ? v(e, n) : v; } // Helper function to check if a value is a function or not
    // Default settings
    this.option = {
        selector: '.element',
        start: 0,
        end: 1000,
        limitWithin: false,
        styles: {},
    }

    // Merge defaults and options into settings to use
    Object.assign(this.option, options);

    // Set _this so we can access it from anywhere
    var _this = this;

    // update() method triggered by every scroll event
    this.update = function(t) {
        const transformStyles = ['perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'translateX', 'translateY', 'translateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];
        const filterStyles = ['blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'saturate', 'sepia'];

        let scrollTop = document.documentElement.scrollTop;

        document.querySelectorAll(_this.option.selector).forEach(function(element, n) {
            let transform = '';
            let filter = '';
            let start = val(_this.option.start, element, n);
            let percentage = (scrollTop - start) / (val(_this.option.end, element, n) - start);
            if (_this.option.limitWithin) {
                if (percentage < 0) percentage = 0;
                if (percentage > 1) percentage = 1;
            }
            if (_this.option.styles) {
                Object.keys(_this.option.styles).forEach(function(style) {
                    let styleValue = (val(_this.option.styles[style][1], element, n) - val(_this.option.styles[style][0], element, n)) * percentage + val(_this.option.styles[style][0], element, n);
                    if (transformStyles.indexOf(style) != -1) {
                        transform += ' ' + style + '(' + styleValue + (_this.option.styles[style][2] || '') + ')';
                    } else if (filterStyles.indexOf(style) != -1) {
                        filter += ' ' + style + '(' + styleValue + (_this.option.styles[style][2] || '') + ')';
                    } else {
                        element.style[style] = styleValue + (_this.option.styles[style][2] || '');
                    }
                });
            }

            if (transform) {
                element.style['transform'] = transform;
            }

            if (filter) {
                element.style['filter'] = filter;
            }
        });
    }

    // Setup onscroll and resize events and do initial update()
    window.addEventListener('scroll', this.update);
    window.addEventListener('resize', this.update);
    this.update();
}

window.getOffset = function(element) {
    var el = element;
    var offsetLeft = 0;
    var offsetTop = 0;
    do {
        offsetLeft += el.offsetLeft;
        offsetTop += el.offsetTop;
        el = el.offsetParent;
    } while (el);

    return {
        top: offsetTop,
        left: offsetLeft,
    }
}

window.ClassMagic = function(options) {
    // Default settings
    this.option = {
        selector: '.element',
        className: 'active',
        start: .5,
        end: .5,
    }

    // Merge defaults and options into settings to use
    Object.assign(this.option, options);

    // Set _this so we can access it from anywhere
    var _this = this;

    // update() method triggered by every scroll event
    this.update = function() {
        let scrollTop = document.documentElement.scrollTop;
        let windowHeight = window.innerHeight;
        document.querySelectorAll(_this.option.selector).forEach(function(element, n) {
            offsetTop = getOffset(element).top;
            var topPosition = (offsetTop - scrollTop) / windowHeight;
            var bottomPosition = 1 - (offsetTop + element.offsetHeight - scrollTop) / windowHeight;
            if (bottomPosition > _this.option.start && topPosition > _this.option.end) {
                element.classList.add(_this.option.className);
            } else {
                element.classList.remove(_this.option.className);
            }
        });
    }

    // Setup onscroll and resize events and do initial update()
    window.addEventListener('scroll', this.update);
    window.addEventListener('resize', this.update);
    this.update();
}

window.Sticky = function(options) {
    function val(v, e, n) { return typeof v === "function" ? v(e, n) : v; } // Helper function to check if a value is a function or not
    // Default settings
    this.option = {
        selector: '.element',
        className: 'sticky',
        start: 100,
    }

    // Merge defaults and options into settings to use
    this.option = Object.assign(this.option, options);

    // Set _this so we can access it from anywhere
    var _this = this;

    // update() method triggered by every scroll event
    this.update = function() {
        let scrollTop = document.documentElement.scrollTop;
        document.querySelectorAll(_this.option.selector).forEach(function(element, n) {
            if (scrollTop >= val(_this.option.start, element, n)) {
                element.classList.add(_this.option.className);
            } else {
                element.classList.remove(_this.option.className);
            }
        });
    }

    // Setup onscroll and resize events and do initial update()
    window.addEventListener('scroll', this.update);
    window.addEventListener('resize', this.update);
    this.update();
}

function scrollBodyTo(destination, duration = 200, easing = 'linear', callback) {

    const easings = {
        linear(t) {
            return t;
        },
        easeInQuad(t) {
            return t * t;
        },
        easeOutQuad(t) {
            return t * (2 - t);
        },
        easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        easeInCubic(t) {
            return t * t * t;
        },
        easeOutCubic(t) {
            return (--t) * t * t + 1;
        },
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        easeInQuart(t) {
            return t * t * t * t;
        },
        easeOutQuart(t) {
            return 1 - (--t) * t * t * t;
        },
        easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        easeInQuint(t) {
            return t * t * t * t * t;
        },
        easeOutQuint(t) {
            return 1 + (--t) * t * t * t * t;
        },
        easeInOutQuint(t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };

    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    if (destination > documentHeight - windowHeight) {
        destination = documentHeight - windowHeight;
    }
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in window === false) {
        window.scroll(0, destinationOffsetToScroll);
        if (callback) {
            callback();
        }
        return;
    }

    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = easings[easing](time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

        if (window.pageYOffset === destinationOffsetToScroll) {
            if (callback) {
                callback();
            }
            return;
        }

        requestAnimationFrame(scroll);
    }

    scroll();
}
