$(document).ready(function () {

    const moveElement = (element, target, screenSize, append = true, after = false) => {
        if (screen.width < screenSize) {
            if (after) {
                for (let i = 0; i < $(element).length; i++) {
                    $(target).eq(i).after($(element).eq($(target).length === 1 ? 0 : i))
                }
            } else {
                if (append) {
                    for (let i = 0; i < $(element).length; i++) {
                        $(element).eq(i).appendTo($(target).eq($(target).length === 1 ? 0 : i))
                    }
                } else {
                    for (let i = 0; i < $(element).length; i++) {
                        $(element).eq(i).prependTo($(target).eq($(target).length === 1 ? 0 : i))
                    }
                }
            }
        }
    }

    if (screen.width < 600) {
        $('.doctors__photo').wrap('<div class="doctors__mobile-wrapper"></div>');
        $('.medium-block__icon').wrap('<div class="medium-block__mobile-wrapper"></div>');

    }
    moveElement('.header__account', '.mobile-menu__bottom', 991);
    moveElement('.header__promo-btn', '.mobile-menu__bottom', 991);
    moveElement('.header__phone-box', '.header__middle', 991);
    moveElement('.header__appointment-btn', '.header__bottom', 991);
    moveElement('.doctors__worktime', '.doctors__mobile-wrapper', 600);
    moveElement('.medium-block__text', '.medium-block__mobile-wrapper', 600);
    moveElement('.large-block--fw .large-block__bg', '.large-block--fw .large-block__content', 1200);
    moveElement('.footer__worktime', '.footer__phone-box', 600, false, true);
    moveElement('.footer__account', '.footer__phone-box', 600, false, true);
    moveElement('.footer__license ', '.footer__col:last-child .footer__col-inner', 600);
    moveElement('.doctor-appointment .text-w-sideblock .common-btn', '.btn-wrapper--grid', 767);

    $('.js-adaptive-height').each(function () {
        let maxHeight = 0;
        $(this).find('.large-block__content > *').each(function () {
            if ($(this).height() > maxHeight) {
                maxHeight = $(this).height();
            }
        });
        maxHeight += 100;
        console.log(maxHeight);
        $(this).css('height', maxHeight)
    })

    /*--Overflow scroll glitch fix---*/
    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();


    let renderClickableBG = (isDark, elementToClose, id, renderParent = $('body'), blockScroll = true) => {
        renderParent.append(`<div class="clickable-bg" id=${id}></div>`);
        if (blockScroll) {
            $('body').css({
                'padding-right': scrollWidth,
                'overflow-y': 'hidden',

            });
        }
        if (isDark) {
            $('.clickable-bg').addClass('clickable-bg--dark').fadeOut(1).fadeIn(400);
        }
        $(document).on('click', '.clickable-bg', function () {
            $(this).remove();
            if (elementToClose) {
                elementToClose.removeClass('opened');
                if (blockScroll) {
                    $('body').css({
                        'padding-right': 0,
                        'overflow-y': 'auto',
                    });
                }
            }
        })
    }

    // Mobile menu

    const toggleMobileMenu = (mobileMenu) => {
        if (mobileMenu.hasClass('opened')) {
            mobileMenu.removeClass('opened');
            $('body').css({
                'padding-right': 0,
                'overflow-y': 'auto',
            });
        } else {
            mobileMenu.addClass('opened');
        }
    }

    $(document).on('click', '.js-open-mobile-menu', function () {
        const mobileMenu = $('.mobile-menu')
        toggleMobileMenu(mobileMenu);
        renderClickableBG(true, mobileMenu, 'mobile-menu-bg')
    })

    $(document).on('click', '.js-close-mobile-menu', function () {
        toggleMobileMenu($('.mobile-menu'));
        $('#mobile-menu-bg').remove();
    })

    // Sliders

    const promoSlider = new Swiper('.js-promo-slider', {
        pagination: {
            el: '.promo__pagination',
            clickable: true,
        }
    });

    const commonSlider = new Swiper('.js-common-slider', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,

        pagination: {
            el: '.common-slider__pagination',
        },

        navigation: {
            nextEl: '.common-slider__arrow--next',
            prevEl: '.common-slider__arrow--prev',
        },
        breakpoints: {
            767: {
                slidesPerView: 2,
                spaceBetween: 20,
            }
        }
    });

    // Modals

    const openModal = (modal, bgId) => {
        $('.modal').removeClass('opened');
        $(bgId).remove();
        modal.addClass('opened');
        renderClickableBG(true, modal, bgId, modal)
    }

    const closeModal = (modal, bg=null) => {
        modal.removeClass('opened');
        if (bg) {
            bg.remove();
        }
        $('body').css({
            'padding-right': 0,
            'overflow-y': 'auto',
        });
    }


    $(document).on('click', '.js-open-modal', function () {
        const modal = $($(this).attr('data-modal'));
        openModal(modal, 'modal-bg')
    });

    $(document).on('click', '.js-close-modal', function () {
        const modal = $(this).parents('.modal');
        const bg = $(this).parents('.modal').find('#modal-bg');
        closeModal(modal, bg);
    });

    // Nav menus

    if (screen.width > 990) {
        $(document).on('mouseover', '.header__nav-item', function () {
            const submenuParent = $(this);
            const submenu = $(this).next('.header__nav-submenu');
            if (submenu.length > 0 && !submenuParent.hasClass('active')) {
                $('.header__nav-item').removeClass('active');
                $('.header__nav-submenu').removeClass('opened');
                $('#submenu-bg').remove();
                submenuParent.addClass('active');
                submenu.addClass('opened');
                renderClickableBG(false, submenu, 'submenu-bg', $('body'), false)
                $('#submenu-bg').on('click', function () {
                    submenuParent.removeClass('active');
                })
                submenu.find('.js-close').on('click', function () {
                    closeModal(submenu, $('#submenu-bg'));
                    submenuParent.removeClass('active');
                })
            }
        });
        $(document).on('mouseout', '.header__nav-item', function () {
            const submenuParent = $(this);
            const submenu = $(this).next('.header__nav-submenu');
            setTimeout(function () {
                if (submenu.length > 0 && submenu[0].parentNode.querySelectorAll('.header__nav-submenu:hover').length === 0) {
                    submenuParent.removeClass('active');
                    closeModal(submenu, $('#submenu-bg'));
                }
            }, 350)
        });
        $(document).on('mouseleave', '.header__nav-submenu', function () {
            const submenuParent = $(this).prev('.header__nav-item');
            const submenu = $(this)
            setTimeout(function () {
                if (submenuParent[0].parentNode.querySelectorAll('.header__nav-submenu:hover').length === 0) {
                    submenuParent.removeClass('active');
                    closeModal(submenu, $('#submenu-bg'));
                }
            }, 350)
        });
    } else {
        $(document).on('click', '.mobile-menu__nav-submenu-toggle', function (e) {
            e.preventDefault();
            const submenuParent = $(this).parent('.mobile-menu__nav-item');
            const submenu = submenuParent.next('.mobile-menu__nav-submenu');
            if (submenu.length > 0) {
                submenu.addClass('opened');
                submenu.find('.js-menu-back').on('click', function () {
                    submenu.removeClass('opened');
                });
            }
        });
    }

    // Tabs

    $(document).on('click', '.js-tab-control', function (e) {
        e.preventDefault();
        $(this).find('input[type=radio]').prop('checked', true);
        $(this).siblings('.js-tab-control.active').removeClass('active');
        $(this).addClass('active');
        $(this).parents('.tabs').find('.tabs__tab.visible').removeClass('visible');
        const tabElem = $('#' + $(this).attr('data-tab'));
        tabElem.addClass('visible');
    });

    $(document).on('click', '.js-select', function () {
        const select = $(this);
        const options = $(this).next('.js-select-options');

        if (!select.hasClass('active')) {
            renderClickableBG(false, $(this).next('.js-select-options'), 'mobile-tabs-bg', $('body'), false)
            $('#mobile-tabs-bg').on('click', function () {
                select.removeClass('active');
            });
        } else {
            $('#mobile-tabs-bg').remove();
        }
        select.toggleClass('active');
        options.toggleClass('opened');
    })

    $(document).on('click', '.js-select-options > *', function () {
        const options = $(this).parent('.js-select-options');
        const select = options.prev('.js-select');
        select.find('.js-select-val').text($(this).text());
        options.removeClass('opened');
        select.removeClass('active');
        $('#mobile-tabs-bg').remove();
    });

    // Accordion
    $(document).on('click', '.js-accordion-toggle', function () {
        $(this).toggleClass('active');
        $(this).next('.js-accordion-content').slideToggle(300, function () {
            $(this).toggleClass('opened');
        });
    });

    /*--Maps--*/
    function loadScript(url, callback) {

        var script = document.createElement("script");

        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" ||
                    script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    let check_if_load = false;
    const checkLoadMap = () => {
        if (!check_if_load) {
            check_if_load = true;
            loadScript("https://api-maps.yandex.ru/2.1/?apikey=04709a29-6f21-442a-9cb5-272b39900456&lang=ru_RU", function () {
                ymaps.ready(init);
            });
        }
    }

    let myMap;

    function init() {
        const mapJsonPath = $('.map-container').attr('data-json');
        let myGeoObjects = [];


        $.getJSON(mapJsonPath, function (data) {
            data.forEach(point => {
                const balloonInner =
                    `<div class="custom-balloon">
                        <div class="custom-balloon__bg"></div>
                        <div class="custom-balloon__text"><b>${point.name}</b></div>
                        <div class="custom-balloon__text">${point.address}</div>
                    </div>`

                const placemark = new ymaps.Placemark(point.coords, {
                        balloonContent: balloonInner,
                    },
                    {
                        hideIconOnBalloonOpen: false,
                        balloonOffset: [4, -37],
                        iconLayout: 'default#image',
                        iconImageHref: point.icon
                    }
                );
                myGeoObjects.push(placemark)
            })
            myGeoObjects.forEach(item => {
                myMap.geoObjects.add(item);
            })
        });

        myMap = new ymaps.Map('contacts-map', {
            center: [48.925382, 40.401703],
            zoom: 15,
            controls: ['zoomControl'],
        });

        myMap.behaviors.disable('scrollZoom');

    }

    if ($('.map-container').length > 0) {
        checkLoadMap();
    }

    // Forms

    $(document).on('click', '.form-group--checkbox', function (e) {
        e.preventDefault();
        const cb = $(this).find('input[type=checkbox]');
        cb.prop('checked', !cb.prop('checked'));
        $(this).find('.js-custom-cb').toggleClass('checked');
    });

    // Misc

    if (screen.width < 768) {
        $('.adaptive-table--worktime th:last-child, .adaptive-table--worktime td:last-child').remove();
    }

    $('.typography ul > li, .typography ol > li').each(function () {
        if ($(this).find('ul, ol').length > 0) {
            $(this).addClass('no-list-style');
        }
    });

    $('.typography table').wrap('<div class="adaptive-table"></div>');

    $('.js-read-more-container').each(function () {
        if ($(this).height() < 175) {
            $(this).parents('.js-read-more-wrapper').addClass('disabled');
        }
    })

    let initialFoldedHeight;
    let initialText;



    $(document).on('click', '.js-read-more-toggle', function () {
        let initialHeight = $(this).siblings('.js-read-more-container').height();
        if (!$(this).hasClass('opened')) {
            $(this).parent('.js-read-more-wrapper').addClass('opened')
            initialFoldedHeight = $(this).parent('.js-read-more-wrapper').height();
            initialText = $(this).text()
            $(this).parent('.js-read-more-wrapper').animate({
                height: initialHeight + 40
            }, 300);
            $(this).addClass('opened');
            $(this).text('Свернуть');
        } else {
            $(this).parent('.js-read-more-wrapper').removeClass('opened')
            $(this).parent('.js-read-more-wrapper').animate({
                height: initialFoldedHeight + 40
            }, 300);
            $(this).removeClass('opened');
            $(this).text(initialText);
        }
    });

    const renderStars = (element) => {
        const rating = element.attr('data-rating');
        let c = 0;
        element.find('.stars__item').removeClass('filled').each(function () {
            if (c < rating) {
                $(this).addClass('filled');
                c++;
            }
        })
    }

    $('.js-stars').each(function () {
        renderStars($(this));
    })

    $('.js-stars-input .stars__item').on('click', function () {
        const val = $(this).attr('data-val');
        $(this).siblings('.stars__input').val(val);
        $(this).parents('.js-stars-input').attr('data-rating', val);
        renderStars($(this).parents('.js-stars-input'));
    });

    let elements = document.querySelectorAll("input[type='tel']");
    elements.forEach(function (element) {
        let dynamicMask = IMask(element, {
            mask: [
                {
                    mask: '+{7}(#00)000-00-00',
                    definitions: {
                        '#': /[12345690]/
                    }
                },
                {
                    mask: '{#}(000)000-00-00',
                    definitions: {
                        '#': /[8]/
                    }
                }, {
                    mask: '{+#}(000)000-00-00',
                    definitions: {
                        '#': /[+7]/
                    }
                },
            ]
        });
    });

    $('.js-scroll-to').on('click', function () {
        const elementToScroll = '#' + $(this).attr('data-scroll');
        $([document.documentElement, document.body]).animate({
            scrollTop: $(elementToScroll).offset().top - 40
        }, 1000);
    });


    const cookiesModal = $('#modal-cookies');

    if (Cookies.get('modal') !== '1') {
        cookiesModal.addClass('opened')
    }


    $('.js-close-cookies').on('click', function () {
        closeModal(cookiesModal);
        Cookies.set('modal', '1')
    });



});


