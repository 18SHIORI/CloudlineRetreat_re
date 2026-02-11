// ==============================
// ハンバーガーメニュー
// ==============================

$(function () {
    const $body = $('body');
    const $hamburger = $('.hamburger');

    // ナビを閉じる共通関数
    function closeNav() {
        $body.removeClass('nav-open');
        $hamburger.removeClass('is-open');
    }

    // ハンバーガー開閉
    $hamburger.on('click', function () {
        $body.toggleClass('nav-open');
        $(this).toggleClass('is-open');
    });

    // ナビ内リンクをクリックしたら必ず閉じる
    // （index.html#experience でも、他ページでもOK）
    $('#navi a').on('click', function () {
        closeNav();
    });

    // マスクを押したら閉じる
    $('.mask').on('click', closeNav);

    // ×ボタンを押したら閉じる（ある場合）
    $('.nav_close').on('click', closeNav);
});

// ==============================
// メインビジュアル
// ==============================

// $(function () {
//     $('.main_visual_video').each(function () {
//         this.playbackRate = 0.5;
//     });
// });

$(function () {
    const cloud = $('.mv_cloud');
    if (cloud.length) {
        cloud.get(0).playbackRate = 1.0;
    }
});

// ==============================
// concept アニメーション
// ==============================
$(function () {
    const $wrap = $('.js-concept-animate');
    if (!$wrap.length) return;

    const $right = $wrap.find('.js-card-right');
    const $left  = $wrap.find('.js-card-left');

    let done = false;

    function inView($el) {
        const top = $el.offset().top;
        const bottom = top + $el.outerHeight();
        const winTop = $(window).scrollTop();
        const winBottom = winTop + $(window).height();

        return winBottom > top + 100 && winTop < bottom;
    }

    function run() {
        if (done) return;
        if (!inView($wrap)) return;

        done = true;

        // ★ここで「全体の遅延」
        setTimeout(function () {
        $right.addClass('is-show');

        // ★左右のズレ
        setTimeout(function () {
            $left.addClass('is-show');
        }, 500);

        }, 800); // ← この数字で「両方の開始」を遅らせる
    }

    $(window).on('scroll load', run);
});

// ========================================
// concept（スマホ）スクロールで文章を切り替え
// ========================================

$(function () {
    const $swap = $('.js-concept-swap');
    if (!$swap.length) return;

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function updateSwap() {
        const winTop = $(window).scrollTop();
        const winH = $(window).height();
        const center = winTop + winH * 0.6; // 基準位置

        $swap.each(function () {
            const $el = $(this);
            const top = $el.offset().top;
            const h = $el.outerHeight();
            const bottom = top + h;

            if (center < top || center > bottom) return;

            const progress = clamp((center - top) / h, 0, 1);

            const step1On = 0.15; // 右の文章
            const step2On = 0.55; // 左の文章

            $el.removeClass('is-step1 is-step2');

            if (progress >= step2On) {
                $el.addClass('is-step2');
            } else if (progress >= step1On) {
                $el.addClass('is-step1');
            }
        });
    }

    updateSwap();
    $(window).on('scroll resize load', updateSwap);
});


// ==============================
// concept_sb
// ==============================

$(function () {
    var $section = $('.js-concept-sb');
    if (!$section.length) return;

    var done = false;     // 1回だけ発火させる
    var timer = null;     // タイマー管理

    $(window).on('scroll load', function () {
        if (done) return;

        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        var sectionTop = $section.offset().top;

        if (scroll + windowHeight > sectionTop + 100) {
        done = true;

        // ★ここが「全体の遅延」：入ってから遅れて開始
        timer = setTimeout(function () {
            $('.js-sb-image').addClass('is-show');

            // 画像が出てから文字（今の800msはここに残す）
            setTimeout(function () {
            $('.js-sb-text').addClass('is-show');
            }, 800);

        }, 700); // ← ここを増やすと「登場が遅くなる」
        }
    });
});

// =============================
// 整う体験（PCだけ）
// =============================
$(function () {
    const mqPC = window.matchMedia("(min-width: 769px)");
    const $steps = $(".step");

    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function updatePCExperience() {
        // PCじゃないなら何もしない（スマホ/タブレット側は触らない）
        if (!mqPC.matches) return;

        const winTop = $(window).scrollTop();
        const winH = $(window).height();
        const center = winTop + winH * 0.5; // 画面中央基準

        $steps.each(function () {
            const $step = $(this);
            const top = $step.offset().top;
            const h = $step.outerHeight();
            const bottom = top + h;

            const active = center >= top && center < bottom;

            // このstep内のshotを番号順に
            const $shots = $step.find(".shot").sort(function (a, b) {
                return Number($(a).data("shot")) - Number($(b).data("shot"));
            });

            // まず全部OFF
            $shots.removeClass("is-visible");
            if (!active) return;

            // step内の進捗（0〜1）
            const progress = clamp((center - top) / h, 0, 1);

            // 2枚を順番に出すタイミング
            const firstOn = 0.30;
            const secondOn = 0.50;

            if ($shots[0] && progress >= firstOn) $($shots[0]).addClass("is-visible");
            if ($shots[1] && progress >= secondOn) $($shots[1]).addClass("is-visible");
        });
    }

    // 初回
    if (mqPC.matches) updatePCExperience();

    // PCだけスクロール監視
    $(window).on("scroll resize", function () {
        if (mqPC.matches) {
            updatePCExperience();
        }
    });

    // 画面幅がPC→SPになったとき、PC用の表示状態をリセット（任意だけど安心）
    function resetAllShots() {
        $(".shot").removeClass("is-visible");
    }

    if (mqPC.addEventListener) {
        mqPC.addEventListener("change", function (e) {
            if (!e.matches) resetAllShots(); // PCじゃなくなったらリセット
            else updatePCExperience();       // PCに戻ったら再計算
        });
    } else {
        mqPC.addListener(function (e) {
            if (!e.matches) resetAllShots();
            else updatePCExperience();
        });
    }
});

// ==============================
// 雲海テラス（reveal + parallax）
// ==============================

$(function () {
    const $reveal = $(".js-reveal");
    const $parallax = $(".js-parallax");

    function revealOnScroll() {
        const winTop = $(window).scrollTop();
        const winH = $(window).height();

        $reveal.each(function () {
            const $el = $(this);
            const offsetTop = $el.offset().top;

            if (winTop + winH * 0.8 > offsetTop) {
                $el.addClass("is-show");
            }
        });
    }

    function parallaxScroll() {
        // ★SPはparallax停止（transform競合防止）
        if (window.matchMedia("(max-width: 768px)").matches) return;

        const winTop = $(window).scrollTop();
        const winH = $(window).height();

        $parallax.each(function () {
            const $el = $(this);
            const $img = $el.find("img");
            const offsetTop = $el.offset().top;

            const distance = winTop + winH / 2 - offsetTop;
            const move = distance * 0.08;

            if ($el.hasClass("is-show")) {
                $img.css("transform", `translateY(${move}px)`);
            }
        });
    }

    // スクロール/リサイズ/読み込みで発火
    $(window).on("scroll resize load", function () {
        revealOnScroll();
        parallaxScroll();
    });

    // 初回
    revealOnScroll();
    parallaxScroll();
});

// =====================================
// 雲海テラス（3枚画像）スマホだけスライダー
// =====================================
$(function () {
    function initTerraceSlider() {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const $slider = $(".cloud-terrace_content_items");

        if (isMobile) {
            if (!$slider.hasClass("slick-initialized")) {
                $slider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                    dots: true,
                    speed: 500,
                    adaptiveHeight: true,
                });
            }
        } else {
            if ($slider.hasClass("slick-initialized")) {
                $slider.slick("unslick");
            }
        }
    }

    initTerraceSlider();
    $(window).on("resize", initTerraceSlider);
});

// ==============================
// 客室 アメニティ スライダー
// ==============================

$(function () {
    const mq = window.matchMedia("(max-width: 960px)");

    function setupAmenitiesSlider() {
        const $list = $(".amenities_list");

        if (mq.matches) {
            if (!$list.hasClass("slick-initialized")) {
                $list.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,   // 3枚目の次に1枚目に戻る
                    arrows: false,
                    dots: true,
                    swipe: true,
                    adaptiveHeight: true
                });
            }
        } else {
            if ($list.hasClass("slick-initialized")) {
                $list.slick("unslick");
            }
        }
    }

    setupAmenitiesSlider();
    mq.addEventListener ? mq.addEventListener("change", setupAmenitiesSlider)
        : mq.addListener(setupAmenitiesSlider);
});

// ==============================
// お料理 スライダー
// ==============================

$(function () {
    $('.meal_gallery_slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,

        autoplay: true,
        autoplaySpeed: 0,     // ★止まる時間をなくす
        speed: 8000,         // ★流れる速さ（大きいほどゆっくり）
        cssEase: 'linear',    // ★一定速度で流す

        arrows: false,
        dots: false,
        pauseOnHover: false,
        pauseOnFocus: false,  // ★フォーカスでも止めない
        draggable: true,
        swipe: true,

        responsive: [
        {
            breakpoint: 1200,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 768,
            settings: { slidesToShow: 1 }
        }
        ]
    });
});

// ==============================
// お品書き アコーディオン
// ==============================

$(function () {
    const $btn = $('.menu_toggle_btn');
    const $menu = $('.js-menu');

    // 最初は閉じておく（CSSで display:none にしてるなら不要だけど保険）
    $menu.hide();

    $btn.on('click', function () {
        const $this = $(this);

        // 連打防止（アニメ中は無効）
        if ($menu.is(':animated')) return;

        // ボタンの見た目（矢印回転用）
        $this.toggleClass('is-open');

        // アコーディオン開閉
        $menu.stop(true, true).slideToggle(900, 'swing', function () {
            // 開いたときだけ、メニューの先頭が見える位置までスクロール（任意）
            if ($this.hasClass('is-open')) {
                $('html, body').animate(
                    { scrollTop: $menu.offset().top - 40 },
                    600
                );
            }
        });
    });
});

// トップへ戻るボタン

// $(function () {
//     const $btn = $(".back-to-top");
//     const mq = window.matchMedia("(min-width: 769px)");

//     let trigger = $(window).height() * 0.5;
//     // 画面を半分スクロールしたら表示

//     function updateTrigger() {
//         trigger = $(window).height() * 0.5;
//     }

//     function onScroll() {
//         if ($(window).scrollTop() > trigger) {
//             $btn.addClass("is-show");
//         } else {
//             $btn.removeClass("is-show");
//         }
//     }

//     function enable() {
//         updateTrigger();
//         $(window).on("scroll.backtotop", onScroll);
//         $(window).on("resize.backtotop", updateTrigger);
//     }

//     function disable() {
//         $(window).off(".backtotop");
//         $btn.removeClass("is-show");
//     }

// $(function () {
//     const $btn = $(".back-to-top");
//     let trigger = $(window).height() * 0.5;

//     function updateTrigger() {
//         trigger = $(window).height() * 0.5;
//     }

//     function onScroll() {
//         if ($(window).scrollTop() > trigger) $btn.addClass("is-show");
//         else $btn.removeClass("is-show");
//     }

//     // ★ここが大事：最初に必ず1回実行
//     updateTrigger();
//     onScroll();

//     // ★スクロール監視を必ず付ける
//     $(window).on("scroll", onScroll);
//     $(window).on("resize", function () {
//         updateTrigger();
//         onScroll();
//     });

//     $btn.on("click", function () {
//         $("html, body").animate({ scrollTop: 0 }, 900);
//     });
// });

// // クリック（PCのみ意味を持つ）
// $btn.on("click", function () {
//     $("html, body").animate({ scrollTop: 0 }, 900);
// });

// // 初期判定
// if (mq.matches) enable();
// else disable();

// // 画面幅が変わったとき
// mq.addEventListener("change", function (e) {
//     if (e.matches) enable();
//     else disable();
// });
// });

// ==============================
// トップへ戻るボタン（PCのみ）
// ==============================

$(function () {
    const $btn = $(".back-to-top");
    const mq = window.matchMedia("(min-width: 769px)");

    // まず非表示（CSSのis-show方式じゃなく、fade方式に寄せる）
    $btn.hide();

    // 表示/非表示の判定
    function onScroll() {
        // 「画面の半分スクロールしたら」を維持
        const trigger = $(window).height() * 1.0;

        if ($(window).scrollTop() > trigger) {
        $btn.stop(true, true).fadeIn(200);
        } else {
        $btn.stop(true, true).fadeOut(200);
        }
    }

    // 有効化（PCのときだけ監視）
    function enable() {
        // 念のため初期状態を反映
        onScroll();

        $(window).on("scroll.backtotop", onScroll);
        $(window).on("resize.backtotop", onScroll);
    }

    // 無効化（SPのときは隠してイベント解除）
    function disable() {
        $(window).off(".backtotop");
        $btn.hide();
    }

    // クリックでトップへ
    $btn.on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 900);
        return false;
    });

    // 初期判定
    if (mq.matches) enable();
    else disable();

    // 画面幅が変わったとき（Safari対策でフォールバック付き）
    if (mq.addEventListener) {
        mq.addEventListener("change", function (e) {
        if (e.matches) enable();
        else disable();
        });
    } else {
        mq.addListener(function (e) {
        if (e.matches) enable();
        else disable();
        });
    }
});

// ==============================
// ページ切り替え
// ==============================

$(document).on("click", "a", function (e) {
    const href = $(this).attr("href");

    if (!href) return;
    if (href.startsWith("#") || href.includes("#")) return;
    if (
        $(this).attr("target") === "_blank" ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
    ) {
        return;
    }

    e.preventDefault();

    // ★ここを追加
    $(".back-to-top").hide();

    $(".page_transition").addClass("is-show");

    setTimeout(function () {
        location.href = href;
    }, 700);
});

// ==============================
// クリップパス（お料理のページ）
// ==============================

$(function () {
    const targets = document.querySelectorAll(".meal_content_image");

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-show");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    targets.forEach((t) => io.observe(t));
});


// 整う体験 セクション遅れて表示
$(function () {
    const $exp = $("#experience");
    if (!$exp.length) return;

    let done = false;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
        if (done) return;
        if (!entry.isIntersecting) return;

        done = true;
        setTimeout(() => {
            $exp.addClass("is-show");
        }, 2000);

        io.disconnect();
        });
    }, {
        threshold: 0,                 // ★ここが重要（0にする）
        rootMargin: "0px 0px -20% 0px"
    });

    io.observe($exp.get(0));
});


$(window).on("load", function () {
    $("body").addClass("is-loaded");
});