function t_onReady(t) {
    "loading" != document.readyState ? t() : document.addEventListener("DOMContentLoaded", t)
}

function t_addClass(t, e) {
    document.body.classList ? t.classList.add(e) : t.className += (t.className ? " " : "") + e
}

function t_removeClass(t, e) {
    document.body.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\s+)" + e + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "")
}

function t_removeEl(t) {
    t && t.parentNode && t.parentNode.removeChild(t)
}

function t_outerWidth(t) {
    var e = getComputedStyle(t),
        n = e.width,
        o = e.marginLeft,
        i = e.marginRight;
    return "auto" === n && (n = 0), "auto" === o && (o = 0), "auto" === i && (i = 0), n = parseInt(n) + parseInt(o) + parseInt(i)
}
var version, version;
(window.isSearchBot = !1, /Bot/i.test(navigator.userAgent) && (window.isSearchBot = !0), window.isMobile = !1, window.$isMobile = !1, /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (window.isMobile = !0, window.$isMobile = !0), window.isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent), window.isiOS = !1, /iPhone|iPad|iPod/i.test(navigator.userAgent) && (window.isiOS = !0), window.isiOSChrome = !!navigator.userAgent.match("CriOS"), window.isFirefox = /firefox/i.test(navigator.userAgent), window.isOpera = !!window.opr && !!window.opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0, window.isiOSVersion = "", window.isiOS) && (null !== (version = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)) && (window.isiOSVersion = [parseInt(version[1], 10), parseInt(version[2], 10), parseInt(version[3] || 0, 10)]));
(window.isSafari = !1, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && (window.isSafari = !0), window.isIE = !!document.documentMode, window.isSafariVersion = "", window.isSafari) && (null !== (version = navigator.appVersion.match(/Version\/(\d+)\.(\d+)\.?(\d+)? Safari/)) && (window.isSafariVersion = [parseInt(version[1], 10), parseInt(version[2], 10), parseInt(version[3] || 0, 10)]));

function t_throttle(t, e, n) {
    var o, i;
    return e || (e = 250),
        function() {
            var a = n || this,
                r = +new Date,
                l = arguments;
            o && r < o + e ? (clearTimeout(i), i = setTimeout((function() {
                o = r, t.apply(a, l)
            }), e)) : (o = r, t.apply(a, l))
        }
}

function t_onFuncLoad(t, e, n) {
    if ("function" == typeof window[t]) e();
    else {
        var o = Date.now(),
            i = new Error(t + " is undefined"),
            a = function() {
                throw i
            };
        setTimeout((function i() {
            var r = Date.now();
            "function" != typeof window[t] ? ("complete" === document.readyState && r - o > 5e3 && "function" != typeof window[t] && a(), setTimeout(i, n || 100)) : e()
        }))
    }
}
window.browserLang = (window.navigator.userLanguage || window.navigator.language).toUpperCase().slice(0, 2), window.tildaBrowserLang = window.browserLang, t_onReady((function() {
        var t = document.getElementById("allrecords");
        if (t) var e = t.getAttribute("data-tilda-project-lang");
        e && (window.browserLang = e)
    })), t_onReady((function() {
        var t = window.navigator.userAgent,
            e = -1 !== t.indexOf("Instagram"),
            n = -1 !== t.indexOf("FBAV"),
            o = -1 !== t.indexOf("YaSearchBrowser"),
            i = -1 !== t.indexOf("SamsungBrowser"),
            a = -1 !== t.indexOf("DuckDuckGo"),
            r;
        if (-1 !== t.indexOf("Android") && (n || e || o || i || a)) {
            var l = document.createElement("p");
            l.style.lineHeight = "100px", l.style.padding = "0", l.style.margin = "0", l.style.height = "auto", l.style.position = "absolute", l.style.opacity = "0.001", l.innerText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", document.body.appendChild(l);
            var d = 100 / l.getBoundingClientRect().height;
            l.parentNode.removeChild(l), d < .98 && document.body.insertAdjacentHTML("beforeend", '<style>.t396 [data-elem-type="text"] .tn-atom {zoom: ' + 100 * d + "%;}</style>")
        }
    })), t_onReady((function() {
        // setTimeout((function() {
        //     var t = document.querySelector("html"),
        //         e = document.body,
        //         n = document.querySelector(".t-tildalabel"),
        //         o = Math.max(e.scrollHeight, e.offsetHeight, e.clientHeight, t.offsetHeight);
        //     if ((document.getElementById("tildacopy") || n) && n.querySelectorAll("div")) o + 70 > window.innerHeight && n && n.setAttribute("style", "display: block !important; visibility: visible !important; position: relative !important; width: 100% !important; pointer-events: all !important; opacity: 1 !important; margin: 0 !important; z-index: 1 !important");
        //     else {
        //         for (var i = document.body.childNodes, a = [], r = 0; r < i.length; r++) {
        //             var l = i[r];
        //             8 === l.nodeType && a.push(l)
        //         }
        //         for (var r = 0; r < a.length; r++) - 1 !== a[r].nodeValue.indexOf("'t remove this l") && document.getElementById("allrecords").insertAdjacentHTML("afterend", '<div class="t-tildalabel t-tildalabel-free" style="display: block !important; visibility: visible !important; position: relative !important; width: 100% !important; pointer-events: all !important; opacity: 1 !important; margin: 0 !important; z-index: 99900 !important"><div class="t-tildalabel-free__main"><a href="https://tilda.cc" target="_blank" style="padding-bottom:12px; display: block;"><img style="width:40px;" src="https://static.tildacdn.com/img/tildacopy.png"></a><div style="padding-bottom: 15px;">This site was made on <a href="https://tilda.cc" target="_blank" style="text-decoration: none; color:inherit;">Tilda — a website builder</a> that helps to&nbsp;create a&nbsp;website without any code</div><a href="https://tilda.cc/registration/" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 13px; border-radius: 50px; background-color: #fa8669; color: #fff; text-decoration: none;">Create a website</a></div><div class="t-tildalabel-free__links-wr"><a class="t-tildalabel-free__txt-link" href="https://help' + ("RU" === window.browserLang ? "-ru" : "") + '.tilda.cc/white-label" target="_blank">' + ("RU" === window.browserLang ? "Как удалить этот лейбл" : "How to remove this block") + "?</a></div></div>")
        //     }
        // }), 500)
    })), t_onReady((function() {
        if (!window.isMobile && "yes" !== document.getElementById("allrecords").getAttribute("data-blocks-animationoff") && !1 === window.isSearchBot) {
            for (var t = document.querySelectorAll(".r"), e = 0; e < t.length; e++) {
                var n, o = (n = t[e]).getAttribute("style");
                o && -1 !== o.indexOf("background-color") && n.setAttribute("data-animationappear", "off")
            }
            for (var i = document.querySelectorAll('.r:not([data-animationappear="off"]):not([data-screen-min]):not([data-screen-max])'), e = 0; e < i.length; e++) {
                var n, a = (n = i[e]).getBoundingClientRect().top + window.pageYOffset,
                    r = window.pageYOffset + window.innerHeight + 300;
                t_addClass(n, a > 1e3 && a > r ? "r_hidden" : "r_showed"), t_addClass(n, "r_anim")
            }

            function l() {
                if (i.length)
                    for (var t = i.length - 1; t >= 0; t--) {
                        var e = i[t],
                            n, o = 0;
                        e.getBoundingClientRect().top + window.pageYOffset < (o = e.offsetHeight <= 100 ? window.pageYOffset + window.innerHeight : window.pageYOffset + window.innerHeight - 100) && (t_removeClass(e, "r_hidden"), t_addClass(e, "r_showed"), (i = Array.prototype.slice.call(i)).splice(t, 1))
                    }
            }
            window.addEventListener("scroll", t_throttle(l, 200)), setTimeout((function() {
                l()
            }))
        }
        var d = document.querySelector("html"),
            s = document.body;
        "none" === d.style.display && (d.style.display = "block");
        var c = document.querySelector(".t-tildalabel"),
            u;
        (u = s ? Math.max(s.scrollHeight, s.offsetHeight, s.clientHeight, d.offsetHeight) : d.offsetHeight) + 70 < window.innerHeight ? c && (c.style.display = "none") : c && c.setAttribute("style", "display: block !important")
    })),
    function() {
        function t() {
            window.winWidth = window.innerWidth, window.winHeight = window.innerHeight
        }

        function e() {
            for (var t = window.isMobile ? document.documentElement.clientWidth : window.innerWidth, e = document.querySelectorAll(".r[data-screen-max], .r[data-screen-min]"), n, o, i, a = 0; a < e.length; a++) {
                var r = e[a];
                if ("yes" === r.getAttribute("data-connect-with-tab")) return;
                i = getComputedStyle(r).display, (n = r.getAttribute("data-screen-max")) || (n = 1e4), (o = r.getAttribute("data-screen-min")) || (o = 0), n = parseInt(n), (o = parseInt(o)) <= n && (t <= n && t > o ? "block" !== i && (r.style.display = "block") : "none" !== i && (r.style.display = "none"))
            }
        }
        t_onReady((function() {
            t(), e(), window.addEventListener("resize", t_throttle(t, 200)), window.addEventListener("resize", t_throttle(e, 200))
        }))
    }(),
    function() {
        function t() {
            for (var t = document.querySelectorAll(".t-cover__carrier"), e = 0, n = 0; n < t.length; n++) {
                var o, i;
                if ((i = (o = t[n]).style).height.indexOf("vh") > -1) {
                    e = parseInt(i.height, 10) / 100;
                    var a = document.createElement("div");
                    a.id = "tempDiv", a.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100vh;visibility:hidden;", document.body.appendChild(a);
                    var r = document.getElementById("tempDiv"),
                        l = parseInt(getComputedStyle(r).height.replace("px", ""));
                    t_removeEl(r);
                    var d = Math.round(l * e) + "px",
                        s = o.closest(".t-cover");
                    if (s) var c = s.querySelector(".t-cover__filter"),
                        u = s.querySelector(".t-cover__wrapper");
                    c && (c.style.height = d), u && (u.style.height = d), i.height = s.style.height = d
                }
            }
            var p = document.querySelectorAll("[data-height-correct-vh]"),
                h = window.innerHeight;
            e = 0;
            for (var n = 0; n < p.length; n++) {
                var o, i;
                (i = (o = p[n]).style).height.indexOf("vh") > -1 && (e = parseInt(i.height) / 100, d = h + "px", i.height = d)
            }
        }
        window.isMobile && (t_onReady((function() {
            setTimeout(t, 400)
        })), window.addEventListener("load", (function() {
            setTimeout(t, 400)
        })), window.innerWidth < 480 ? (t_onReady((function() {
            for (var t = document.querySelectorAll('[data-customstyle="yes"]'), e = document.querySelectorAll("[field] span, [field] strong, [field] em"), n = 0; n < t.length; n++) {
                var o = t[n];
                parseInt(getComputedStyle(o).fontSize.replace("px", "")) > 26 && (o.style.fontSize = null, o.style.lineHeight = null)
            }
            for (var n = 0; n < e.length; n++) {
                var o = e[n];
                parseInt(getComputedStyle(o).fontSize.replace("px", "")) > 26 && (o.style.fontSize = null)
            }
            for (var i = document.querySelectorAll('.t-text:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-name:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-title:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-descr:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-heading:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-text-impact:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-subtitle:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"])'), n = 0; n < i.length; n++) {
                var o, a = (o = i[n]).getAttribute("style");
                if (a && a.indexOf("font-size") > -1 && parseInt(getComputedStyle(o).fontSize.replace("px", "")) > 26)
                    if ("rem" === o.getAttribute("data-auto-correct-font-size")) {
                        var r = a.replace(/font-size.*px;/gi, "font-size: 1.6rem;").replace("line-height", "lineheight");
                        o.setAttribute("style", r)
                    } else {
                        var r = a.replace("font-size", "fontsize").replace("line-height", "lineheight");
                        o.setAttribute("style", r)
                    }
            }
        })), window.addEventListener("load", (function() {
            for (var t = window.innerWidth, e = document.querySelectorAll('.r:not([data-record-type="396"])'), n = [], o = 0; o < e.length; o++) {
                var i = e[o],
                    a = getComputedStyle(i);
                "none" !== a.display && "hidden" !== a.visibility && "0" !== a.opacity && n.push(i)
            }
            for (var o = 0; o < n.length; o++)
                for (var i, r = (i = n[o]).querySelectorAll('div:not([data-auto-correct-mobile-width="false"]):not(.tn-elem):not(.tn-atom):not(.tn-atom__sbs-anim-wrapper):not(.tn-atom__prx-wrapper):not(.tn-atom__videoiframe):not(.tn-atom__sticky-wrapper):not(.t-store__relevants__container):not(.t-slds__items-wrapper):not(.js-product-controls-wrapper):not(.js-product-edition-option):not(.t-product__option-variants)'), l = 0; l < r.length; l++) {
                    var d = r[l],
                        s = t_outerWidth(d);
                    if (s > t) {
                        if ("yes" === d.getAttribute("[data-customstyle]") && "false" === d.parentNode.getAttribute("[data-auto-correct-mobile-width]")) return;
                        console.log("Block not optimized for mobile width. Block width:" + s + " Block id:" + i.getAttribute("id")), console.log(d), i.style.overflow = "auto", s - 3 > t && (i.style.wordBreak = "break-all")
                    }
                }
        }))) : window.innerWidth < 900 && t_onReady((function() {
            for (var t = document.querySelectorAll('[data-customstyle="yes"]'), e = document.querySelectorAll("[field] span, [field] strong, [field] em"), n = 0; n < t.length; n++) {
                var o = t[n];
                parseInt(getComputedStyle(o).fontSize.replace("px", "")) > 30 && (o.style.fontSize = null, o.style.lineHeight = null)
            }
            for (var n = 0; n < e.length; n++) {
                var o = e[n];
                parseInt(getComputedStyle(o).fontSize.replace("px", "")) > 30 && (o.style.fontSize = null)
            }
            for (var i = document.querySelectorAll('.t-text:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-name:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-title:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-descr:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-heading:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-text-impact:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"]), .t-subtitle:not(.tn-elem):not(.tn-atom):not([data-auto-correct-line-height="false"])'), n = 0; n < i.length; n++) {
                var o, a = (o = i[n]).getAttribute("style");
                if (a && a.indexOf("font-size") > -1 && parseInt(getComputedStyle(o).fontSize.replace("px", "")) > 30)
                    if ("rem" === o.getAttribute("data-auto-correct-font-size")) {
                        var r = a.replace(/font-size.*px;/gi, "font-size: 1.6rem;").replace("line-height", "lineheight");
                        o.setAttribute("style", r)
                    } else {
                        var r = a.replace("font-size", "fontsize").replace("line-height", "lineheight");
                        o.setAttribute("style", r)
                    }
            }
        })))
    }(), t_onReady((function() {
        setTimeout((function() {
            for (var t = document.querySelectorAll('a[href^="http"][target="_blank"]'), e = 0; e < t.length; e++) {
                var n = t[e],
                    o = n.getAttribute("rel") || "";
                "" === o ? n.setAttribute("rel", "noopener") : -1 === o.indexOf("noopener") && n.setAttribute("rel", o + " noopener")
            }
        }), 2500)
    })),
    function(t, e) {
        t.onerror = function(e, n, o, i, a) {
            "object" != typeof t.t_jserrors && (t.t_jserrors = []), t.t_jserrors.push({
                message: e,
                filename: n,
                lineno: o,
                colno: i,
                error: a
            })
        }
    }(window, Math);