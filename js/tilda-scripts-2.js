function t396_init(recid) {
    var data = '';
    var res = t396_detectResolution();
    var ab = $('#rec' + recid).find('.t396__artboard');
    window.tn_window_width = $(window).width();
    window.tn_scale_factor = Math.round((window.tn_window_width / res) * 100) / 100;
    t396_initTNobj();
    t396_switchResolution(res);
    t396_updateTNobj();
    t396_artboard_build(data, recid);
    $(window).resize(function() {
        tn_console('>>>> t396: Window on Resize event >>>>');
        t396_waitForFinalEvent(function() {
            if ($isMobile) {
                var ww = $(window).width();
                if (ww != window.tn_window_width) {
                    t396_doResize(recid)
                }
            } else {
                t396_doResize(recid)
            }
        }, 500, 'resizeruniqueid' + recid)
    });
    $(window).on("orientationchange", function() {
        tn_console('>>>> t396: Orient change event >>>>');
        t396_waitForFinalEvent(function() {
            t396_doResize(recid)
        }, 600, 'orientationuniqueid' + recid)
    });
    $(window).on('load', function() {
        t396_allelems__renderView(ab);
        if (typeof t_lazyload_update === 'function' && ab.css('overflow') === 'auto') {
            ab.bind('scroll', t_throttle(function() {
                if (window.lazy === 'y' || $('#allrecords').attr('data-tilda-lazy') === 'yes') {
                    t_onFuncLoad('t_lazyload_update', function() {
                        t_lazyload_update()
                    })
                }
            }, 500))
        }
        if (window.location.hash !== '' && ab.css('overflow') === 'visible') {
            ab.css('overflow', 'hidden');
            setTimeout(function() {
                ab.css('overflow', 'visible')
            }, 1)
        }
    });
    var rec = $('#rec' + recid);
    if (rec.attr('data-connect-with-tab') == 'yes') {
        rec.find('.t396').bind('displayChanged', function() {
            var ab = rec.find('.t396__artboard');
            t396_allelems__renderView(ab)
        })
    }
    if (isSafari) rec.find('.t396').addClass('t396_safari');
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    if (isScaled && !isTildaModeEdit) t396_scaleBlock(recid)
}

function t396_getRotateValue(matrix) {
    console.log(matrix);
    var values = matrix.split('(')[1].split(')')[0].split(',');
    var a = values[0];
    var b = values[1];
    var c = values[2];
    var d = values[3];
    var scale = Math.sqrt(a * a + b * b);
    var sin = b / scale;
    var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle
}

function t396_scaleBlock(recid) {
    var isFirefox = navigator.userAgent.search("Firefox") !== -1;
    var res = t396_detectResolution();
    var rec = $('#rec' + recid);
    var $ab = rec.find('.t396__artboard');
    var abWidth = $ab.width();
    var updatedBlockHeight = Math.floor($ab.height() * window.tn_scale_factor);
    var ab_height_vh = t396_ab__getFieldValue($ab, 'height_vh');
    window.tn_scale_offset = (abWidth * window.tn_scale_factor - abWidth) / 2;
    if (ab_height_vh != '') {
        var ab_min_height = t396_ab__getFieldValue($ab, 'height');
        var ab_max_height = t396_ab__getHeight($ab);
        var scaledMinHeight = ab_min_height * window.tn_scale_factor;
        updatedBlockHeight = (scaledMinHeight >= ab_max_height) ? scaledMinHeight : ab_max_height
    }
    $ab.addClass('t396__artboard_scale');
    var scaleStr = isFirefox ? ('transform: scale(' + window.tn_scale_factor + ') !important;') : ('zoom: ' + window.tn_scale_factor + ';');
    var styleStr = '<style class="t396__scale-style">' + '.t-rec#rec' + recid + ' { overflow: visible; }' + '#rec' + recid + ' .t396__carrier,' + '#rec' + recid + ' .t396__filter,' + '#rec' + recid + ' .t396__artboard {' + 'height: ' + updatedBlockHeight + 'px !important;' + 'width: 100vw !important;' + 'max-width: 100%;' + '}' + '<style>';
    $ab.append(styleStr);
    rec.find('.t396__elem').each(function() {
        var $el = $(this);
        var containerProp = t396_elem__getFieldValue($el, 'container');
        if (containerProp === 'grid') {
            if (isFirefox) {
                var scaleProp = 'scale(' + window.tn_scale_factor + ')';
                var transformMatrix = $el.find('.tn-atom').css('transform');
                var rotatation = (transformMatrix && transformMatrix !== 'none') ? t396_getRotateValue(transformMatrix) : null;
                if (rotatation) {
                    $el.find('.tn-atom').css('transform-origin', 'center');
                    scaleProp = scaleProp + ' rotate(' + rotatation + 'deg)'
                }
                $el.find('.tn-atom').css('transform', scaleProp)
            } else {
                $el.css('zoom', window.tn_scale_factor);
                if ($el.attr('data-elem-type') === 'text' && res < 1200) $el.find('.tn-atom').css('-webkit-text-size-adjust', 'auto');
                $el.find('.tn-atom').css('transform-origin', 'center')
            }
        }
    })
}

function t396_doResize(recid) {
    var isFirefox = navigator.userAgent.search("Firefox") !== -1;
    var ww;
    var rec = $('#rec' + recid);
    if ($isMobile) {
        ww = $(window).width()
    } else {
        ww = window.innerWidth
    }
    var res = t396_detectResolution();
    rec.find('.t396__scale-style').remove();
    if (!isFirefox) {
        rec.find('.t396__elem').css('zoom', '');
        rec.find('.t396__elem .tn-atom').css('transform-origin', '')
    }
    var ab = rec.find('.t396__artboard');
    var abWidth = ab.width();
    window.tn_window_width = ww;
    window.tn_scale_factor = Math.round((window.tn_window_width / res) * 100) / 100;
    window.tn_scale_offset = (abWidth * window.tn_scale_factor - abWidth) / 2;
    t396_switchResolution(res);
    t396_updateTNobj();
    t396_ab__renderView(ab);
    t396_allelems__renderView(ab);
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    if (isScaled && !isTildaModeEdit) t396_scaleBlock(recid)
}

function t396_detectResolution() {
    var ww;
    if ($isMobile) {
        ww = $(window).width()
    } else {
        ww = window.innerWidth
    }
    var res;
    res = 1200;
    if (ww < 1200) {
        res = 960
    }
    if (ww < 960) {
        res = 640
    }
    if (ww < 640) {
        res = 480
    }
    if (ww < 480) {
        res = 320
    }
    return (res)
}

function t396_initTNobj() {
    tn_console('func: initTNobj');
    window.tn = {};
    window.tn.canvas_min_sizes = ["320", "480", "640", "960", "1200"];
    window.tn.canvas_max_sizes = ["480", "640", "960", "1200", ""];
    window.tn.ab_fields = ["height", "width", "bgcolor", "bgimg", "bgattachment", "bgposition", "filteropacity", "filtercolor", "filteropacity2", "filtercolor2", "height_vh", "valign"]
}

function t396_updateTNobj() {
    tn_console('func: updateTNobj');
    if (typeof window.zero_window_width_hook != 'undefined' && window.zero_window_width_hook == 'allrecords' && $('#allrecords').length) {
        window.tn.window_width = parseInt($('#allrecords').width())
    } else {
        window.tn.window_width = parseInt($(window).width())
    }
    if ($isMobile) {
        window.tn.window_height = parseInt($(window).height())
    } else {
        window.tn.window_height = parseInt(window.innerHeight)
    }
    if (window.tn.curResolution == 1200) {
        window.tn.canvas_min_width = 1200;
        window.tn.canvas_max_width = window.tn.window_width
    }
    if (window.tn.curResolution == 960) {
        window.tn.canvas_min_width = 960;
        window.tn.canvas_max_width = 1200
    }
    if (window.tn.curResolution == 640) {
        window.tn.canvas_min_width = 640;
        window.tn.canvas_max_width = 960
    }
    if (window.tn.curResolution == 480) {
        window.tn.canvas_min_width = 480;
        window.tn.canvas_max_width = 640
    }
    if (window.tn.curResolution == 320) {
        window.tn.canvas_min_width = 320;
        window.tn.canvas_max_width = 480
    }
    window.tn.grid_width = window.tn.canvas_min_width;
    window.tn.grid_offset_left = parseFloat((window.tn.window_width - window.tn.grid_width) / 2)
}
var t396_waitForFinalEvent = (function() {
    var timers = {};
    return function(callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId"
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId])
        }
        timers[uniqueId] = setTimeout(callback, ms)
    }
})();

function t396_switchResolution(res, resmax) {
    tn_console('func: switchResolution');
    if (typeof resmax == 'undefined') {
        if (res == 1200) resmax = '';
        if (res == 960) resmax = 1200;
        if (res == 640) resmax = 960;
        if (res == 480) resmax = 640;
        if (res == 320) resmax = 480
    }
    window.tn.curResolution = res;
    window.tn.curResolution_max = resmax
}

function t396_artboard_build(data, recid) {
    tn_console('func: t396_artboard_build. Recid:' + recid);
    tn_console(data);
    var ab = $('#rec' + recid).find('.t396__artboard');
    t396_ab__renderView(ab);
    ab.find('.tn-elem').each(function() {
        var item = $(this);
        if (item.attr('data-elem-type') == 'text') {
            t396_addText(ab, item)
        }
        if (item.attr('data-elem-type') == 'image') {
            t396_addImage(ab, item)
        }
        if (item.attr('data-elem-type') == 'shape') {
            t396_addShape(ab, item)
        }
        if (item.attr('data-elem-type') == 'button') {
            t396_addButton(ab, item)
        }
        if (item.attr('data-elem-type') == 'video') {
            t396_addVideo(ab, item)
        }
        if (item.attr('data-elem-type') == 'html') {
            t396_addHtml(ab, item)
        }
        if (item.attr('data-elem-type') == 'tooltip') {
            t396_addTooltip(ab, item)
        }
        if (item.attr('data-elem-type') == 'form') {
            t396_addForm(ab, item)
        }
        if (item.attr('data-elem-type') == 'gallery') {
            t396_addGallery(ab, item)
        }
    });
    $('#rec' + recid).find('.t396__artboard').removeClass('rendering').addClass('rendered');
    if (ab.attr('data-artboard-ovrflw') == 'visible') {
        $('#allrecords').css('overflow', 'hidden')
    }
    if ($isMobile) {
        $('#rec' + recid).append('<style>@media only screen and (min-width:1366px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio:2) {.t396__carrier {background-attachment:scroll!important;}}</style>')
    }
}

function t396_ab__renderView(ab) {
    var fields = window.tn.ab_fields;
    for (var i = 0; i < fields.length; i++) {
        t396_ab__renderViewOneField(ab, fields[i])
    }
    var ab_min_height = t396_ab__getFieldValue(ab, 'height');
    var ab_max_height = t396_ab__getHeight(ab);
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
    if (isScaled && !isTildaModeEdit && ab_height_vh != '') var scaledMinHeight = parseInt(ab_min_height, 10) * window.tn_scale_factor;
    var offset_top = 0;
    if (ab_min_height == ab_max_height || (scaledMinHeight && scaledMinHeight >= ab_max_height)) {
        offset_top = 0
    } else {
        var ab_valign = t396_ab__getFieldValue(ab, 'valign');
        if (ab_valign == 'top') {
            offset_top = 0
        } else if (ab_valign == 'center') {
            if (scaledMinHeight) {
                offset_top = parseFloat((ab_max_height - scaledMinHeight) / 2).toFixed(1)
            } else {
                offset_top = parseFloat((ab_max_height - ab_min_height) / 2).toFixed(1)
            }
        } else if (ab_valign == 'bottom') {
            if (scaledMinHeight) {
                offset_top = parseFloat((ab_max_height - scaledMinHeight)).toFixed(1)
            } else {
                offset_top = parseFloat((ab_max_height - ab_min_height)).toFixed(1)
            }
        } else if (ab_valign == 'stretch') {
            offset_top = 0;
            ab_min_height = ab_max_height
        } else {
            offset_top = 0
        }
    }
    ab.attr('data-artboard-proxy-min-offset-top', offset_top);
    ab.attr('data-artboard-proxy-min-height', ab_min_height);
    ab.attr('data-artboard-proxy-max-height', ab_max_height);
    var filter = ab.find('.t396__filter');
    var carrier = ab.find('.t396__carrier');
    var abHeightVh = t396_ab__getFieldValue(ab, 'height_vh');
    abHeightVh = parseFloat(abHeightVh);
    if (window.isMobile && abHeightVh) {
        var height = document.documentElement.clientHeight * parseFloat(abHeightVh / 100);
        ab.css('height', height);
        filter.css('height', height);
        carrier.css('height', height)
    }
}

function t396_addText(ab, el) {
    tn_console('func: addText');
    var fields_str = 'top,left,width,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addImage(ab, el) {
    tn_console('func: addImage');
    var fields_str = 'img,width,filewidth,fileheight,top,left,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    el.find('img').on("load", function() {
        t396_elem__renderViewOneField(el, 'top');
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != '') {
            setTimeout(function() {
                t396_elem__renderViewOneField(el, 'top')
            }, 2000)
        }
    }).each(function() {
        if (this.complete) $(this).trigger('load')
    });
    el.find('img').on('tuwidget_done', function(e, file) {
        t396_elem__renderViewOneField(el, 'top')
    })
}

function t396_addShape(ab, el) {
    tn_console('func: addShape');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addButton(ab, el) {
    tn_console('func: addButton');
    var fields_str = 'top,left,width,height,container,axisx,axisy,caption,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    return (el)
}

function t396_addVideo(ab, el) {
    tn_console('func: addVideo');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    var viel = el.find('.tn-atom__videoiframe');
    var viatel = el.find('.tn-atom');
    viatel.css('background-color', '#000');
    var vihascover = viatel.attr('data-atom-video-has-cover');
    if (typeof vihascover == 'undefined') {
        vihascover = ''
    }
    if (vihascover == 'y') {
        viatel.click(function() {
            var viifel = viel.find('iframe');
            if (viifel.length) {
                var foo = viifel.attr('data-original');
                viifel.attr('src', foo)
            }
            viatel.css('background-image', 'none');
            viatel.find('.tn-atom__video-play-link').css('display', 'none')
        })
    }
    var autoplay = t396_elem__getFieldValue(el, 'autoplay');
    var showinfo = t396_elem__getFieldValue(el, 'showinfo');
    var loop = t396_elem__getFieldValue(el, 'loop');
    var mute = t396_elem__getFieldValue(el, 'mute');
    var startsec = t396_elem__getFieldValue(el, 'startsec');
    var endsec = t396_elem__getFieldValue(el, 'endsec');
    var tmode = $('#allrecords').attr('data-tilda-mode');
    var url = '';
    var viyid = viel.attr('data-youtubeid');
    if (typeof viyid != 'undefined' && viyid != '') {
        url = '//www.youtube.com/embed/';
        url += viyid + '?rel=0&fmt=18&html5=1';
        url += '&showinfo=' + (showinfo == 'y' ? '1' : '0');
        if (loop == 'y') {
            url += '&loop=1&playlist=' + viyid
        }
        if (startsec > 0) {
            url += '&start=' + startsec
        }
        if (endsec > 0) {
            url += '&end=' + endsec
        }
        if (mute == 'y') {
            url += '&mute=1'
        }
        if (vihascover == 'y') {
            url += '&autoplay=1';
            var instFlag = 'y';
            var iframeClass = '';
            if (autoplay == 'y' && mute == 'y' && window.lazy == 'y') {
                instFlag = 'lazy';
                iframeClass = ' class="t-iframe"'
            }
            viel.html('<iframe id="youtubeiframe"' + iframeClass + ' width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="' + instFlag + '"></iframe>');
            if (autoplay == 'y' && mute == 'y' && window.lazy == 'y') {
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});<\/script>')
            }
            if (autoplay == 'y' && mute == 'y') {
                viatel.trigger('click')
            }
        } else {
            if (typeof tmode != 'undefined' && tmode == 'edit') {} else {
                if (autoplay == 'y') {
                    url += '&autoplay=1'
                }
            }
            if (window.lazy == 'y') {
                viel.html('<iframe id="youtubeiframe" class="t-iframe" width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="lazy"></iframe>');
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});<\/script>')
            } else {
                viel.html('<iframe id="youtubeiframe" width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>')
            }
        }
    }
    var vivid = viel.attr('data-vimeoid');
    if (typeof vivid != 'undefined' && vivid > 0) {
        url = '//player.vimeo.com/video/';
        url += vivid + '?color=ffffff&badge=0';
        if (showinfo == 'y') {
            url += '&title=1&byline=1&portrait=1'
        } else {
            url += '&title=0&byline=0&portrait=0'
        }
        if (loop == 'y') {
            url += '&loop=1'
        }
        if (mute == 'y') {
            url += '&muted=1'
        }
        if (vihascover == 'y') {
            url += '&autoplay=1';
            viel.html('<iframe data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
        } else {
            if (typeof tmode != 'undefined' && tmode == 'edit') {} else {
                if (autoplay == 'y') {
                    url += '&autoplay=1'
                }
            }
            if (window.lazy == 'y') {
                viel.html('<iframe class="t-iframe" data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});<\/script>')
            } else {
                viel.html('<iframe src="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
            }
        }
    }
}

function t396_addHtml(ab, el) {
    tn_console('func: addHtml');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addTooltip(ab, el) {
    tn_console('func: addTooltip');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits,tipposition';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    var pinEl = el.find('.tn-atom__pin');
    var tipEl = el.find('.tn-atom__tip');
    var tipopen = el.attr('data-field-tipopen-value');
    if (isMobile || (typeof tipopen != 'undefined' && tipopen == 'click')) {
        t396_setUpTooltip_mobile(el, pinEl, tipEl)
    } else {
        t396_setUpTooltip_desktop(el, pinEl, tipEl)
    }
    setTimeout(function() {
        $('.tn-atom__tip-img').each(function() {
            var foo = $(this).attr('data-tipimg-original');
            if (typeof foo != 'undefined' && foo != '') {
                $(this).attr('src', foo)
            }
        })
    }, 3000)
}

function t396_addForm(ab, el) {
    tn_console('func: addForm');
    var fields_str = 'width,top,left,';
    fields_str += 'inputs,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addGallery(ab, el) {
    tn_console('func: addForm');
    var fields_str = 'width,height,top,left,';
    fields_str += 'imgs,container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_elem__setFieldValue(el, prop, val, flag_render, flag_updateui, res) {
    if (res == '') res = window.tn.curResolution;
    if (res < 1200 && prop != 'zindex') {
        el.attr('data-field-' + prop + '-res-' + res + '-value', val)
    } else {
        el.attr('data-field-' + prop + '-value', val)
    }
    if (flag_render == 'render') elem__renderViewOneField(el, prop);
    if (flag_updateui == 'updateui') panelSettings__updateUi(el, prop, val)
}

function t396_elem__getFieldValue(el, prop) {
    var res = window.tn.curResolution;
    var r;
    if (res < 1200) {
        if (res == 960) {
            r = el.attr('data-field-' + prop + '-res-960-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-value')
            }
        }
        if (res == 640) {
            r = el.attr('data-field-' + prop + '-res-640-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-960-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-value')
                }
            }
        }
        if (res == 480) {
            r = el.attr('data-field-' + prop + '-res-480-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-640-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-res-960-value');
                    if (typeof r == 'undefined') {
                        r = el.attr('data-field-' + prop + '-value')
                    }
                }
            }
        }
        if (res == 320) {
            r = el.attr('data-field-' + prop + '-res-320-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-480-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-res-640-value');
                    if (typeof r == 'undefined') {
                        r = el.attr('data-field-' + prop + '-res-960-value');
                        if (typeof r == 'undefined') {
                            r = el.attr('data-field-' + prop + '-value')
                        }
                    }
                }
            }
        }
    } else {
        r = el.attr('data-field-' + prop + '-value')
    }
    return (r)
}

function t396_elem__renderView(el) {
    tn_console('func: elem__renderView');
    var fields = el.attr('data-fields');
    if (!fields) {
        return !1
    }
    fields = fields.split(',');
    for (var i = 0; i < fields.length; i++) {
        t396_elem__renderViewOneField(el, fields[i])
    }
}

function t396_elem__renderViewOneField(el, field) {
    var value = t396_elem__getFieldValue(el, field);
    if (field == 'left') {
        value = t396_elem__convertPosition__Local__toAbsolute(el, field, value);
        el.css('left', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'top') {
        var ab = el.parents('.t396__artboard');
        value = t396_elem__convertPosition__Local__toAbsolute(el, field, value);
        el.css('top', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'width') {
        value = t396_elem__getWidth(el, value);
        el.css('width', parseFloat(value).toFixed(1) + 'px');
        var eltype = el.attr('data-elem-type');
        if (eltype == 'tooltip') {
            var pinSvgIcon = el.find('.tn-atom__pin-icon');
            if (pinSvgIcon.length > 0) {
                var pinSize = parseFloat(value).toFixed(1) + 'px';
                pinSvgIcon.css({
                    'width': pinSize,
                    'height': pinSize
                })
            }
            el.css('height', parseInt(value).toFixed(1) + 'px')
        }
        if (eltype == 'gallery') {
            var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');
            var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');
            if (borderStyle == 'none' || typeof borderStyle == 'undefined' || typeof borderWidth == 'undefined' || borderWidth == '') borderWidth = 0;
            value = value * 1 - borderWidth * 2;
            el.css('width', parseFloat(value).toFixed(1) + 'px');
            el.find('.t-slds__main').css('width', parseFloat(value).toFixed(1) + 'px');
            el.find('.tn-atom__slds-img').css('width', parseFloat(value).toFixed(1) + 'px')
        }
    }
    if (field == 'height') {
        var eltype = el.attr('data-elem-type');
        if (eltype == 'tooltip') {
            return
        }
        value = t396_elem__getHeight(el, value);
        el.css('height', parseFloat(value).toFixed(1) + 'px');
        if (eltype === 'gallery') {
            var borderWidth = t396_elem__getFieldValue(el, 'borderwidth');
            var borderStyle = t396_elem__getFieldValue(el, 'borderstyle');
            if (borderStyle == 'none' || typeof borderStyle == 'undefined' || typeof borderWidth == 'undefined' || borderWidth == '') borderWidth = 0;
            value = value * 1 - borderWidth * 2;
            el.css('height', parseFloat(value).toFixed(1) + 'px');
            el.find('.tn-atom__slds-img').css('height', parseFloat(value).toFixed(1) + 'px');
            el.find('.t-slds__main').css('height', parseFloat(value).toFixed(1) + 'px')
        }
    }
    if (field == 'container') {
        t396_elem__renderViewOneField(el, 'left');
        t396_elem__renderViewOneField(el, 'top')
    }
    if (field == 'width' || field == 'height' || field == 'fontsize' || field == 'fontfamily' || field == 'letterspacing' || field == 'fontweight' || field == 'img') {
        t396_elem__renderViewOneField(el, 'left');
        t396_elem__renderViewOneField(el, 'top')
    }
    if (field == 'inputs') {
        value = el.find('.tn-atom__inputs-textarea').val();
        try {
            t_zeroForms__renderForm(el, value)
        } catch (err) {}
    }
}

function t396_elem__convertPosition__Local__toAbsolute(el, field, value) {
    var ab = el.parents('.t396__artboard');
    var blockVAlign = t396_ab__getFieldValue(ab, 'valign');
    var isScaled = t396_ab__getFieldValue(ab, 'upscale') === 'window';
    var isTildaModeEdit = $('#allrecords').attr('data-tilda-mode') == 'edit';
    var isFirefox = navigator.userAgent.search("Firefox") !== -1;
    var isScaledFirefox = !isTildaModeEdit && isScaled && isFirefox;
    var isScaledNotFirefox = !isTildaModeEdit && isScaled && !isFirefox;
    var el_axisy = t396_elem__getFieldValue(el, 'axisy');
    value = parseInt(value);
    if (field == 'left') {
        var el_container, offset_left, el_container_width, el_width;
        var container = t396_elem__getFieldValue(el, 'container');
        if (container === 'grid') {
            el_container = 'grid';
            offset_left = window.tn.grid_offset_left;
            el_container_width = window.tn.grid_width
        } else {
            el_container = 'window';
            offset_left = 0;
            el_container_width = window.tn.window_width
        }
        var el_leftunits = t396_elem__getFieldValue(el, 'leftunits');
        if (el_leftunits === '%') {
            value = t396_roundFloat(el_container_width * value / 100)
        }
        if (!isTildaModeEdit && isScaled) {
            if (container === 'grid' && isFirefox) value = value * window.tn_scale_factor
        } else {
            value = offset_left + value
        }
        var el_axisx = t396_elem__getFieldValue(el, 'axisx');
        if (el_axisx === 'center') {
            el_width = t396_elem__getWidth(el);
            if (isScaledFirefox && el_container !== 'window') {
                el_container_width *= window.tn_scale_factor;
                el_width *= window.tn_scale_factor
            }
            value = el_container_width / 2 - el_width / 2 + value
        }
        if (el_axisx === 'right') {
            el_width = t396_elem__getWidth(el);
            if (isScaledFirefox && el_container !== 'window') {
                el_container_width *= window.tn_scale_factor;
                el_width *= window.tn_scale_factor
            }
            value = el_container_width - el_width + value
        }
    }
    if (field === 'top') {
        var el_container, offset_top, el_container_height, el_height;
        var ab = el.parent();
        var container = t396_elem__getFieldValue(el, 'container');
        if (container === 'grid') {
            el_container = 'grid';
            offset_top = parseFloat(ab.attr('data-artboard-proxy-min-offset-top'));
            el_container_height = parseFloat(ab.attr('data-artboard-proxy-min-height'))
        } else {
            el_container = 'window';
            offset_top = 0;
            el_container_height = parseFloat(ab.attr('data-artboard-proxy-max-height'))
        }
        var el_topunits = t396_elem__getFieldValue(el, 'topunits');
        if (el_topunits === '%') {
            value = (el_container_height * (value / 100))
        }
        if (isScaledFirefox && el_container !== 'window') {
            value *= window.tn_scale_factor
        }
        if (isScaledNotFirefox && el_container !== 'window') {
            offset_top = blockVAlign === 'stretch' ? 0 : (offset_top / window.tn_scale_factor)
        }
        value = offset_top + value;
        var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
        var ab_min_height = t396_ab__getFieldValue(ab, 'height');
        var ab_max_height = t396_ab__getHeight(ab);
        if (isScaled && !isTildaModeEdit && ab_height_vh != '') {
            var scaledMinHeight = parseInt(ab_min_height, 10) * window.tn_scale_factor
        }
        if (el_axisy === 'center') {
            el_height = t396_elem__getHeight(el);
            if (el.attr('data-elem-type') === 'image') {
                el_width = t396_elem__getWidth(el);
                var fileWidth = t396_elem__getFieldValue(el, 'filewidth');
                var fileHeight = t396_elem__getFieldValue(el, 'fileheight');
                if (fileWidth && fileHeight) {
                    var ratio = parseInt(fileWidth) / parseInt(fileHeight);
                    el_height = el_width / ratio
                }
            }
            if (isScaledFirefox && el_container !== 'window') {
                if (blockVAlign !== 'stretch') {
                    el_container_height = el_container_height * window.tn_scale_factor
                } else {
                    if (scaledMinHeight) {
                        el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                    } else {
                        el_container_height = ab.height()
                    }
                }
                el_height *= window.tn_scale_factor
            }
            if (!isTildaModeEdit && isScaled && !isFirefox && el_container !== 'window' && blockVAlign === 'stretch') {
                if (scaledMinHeight) {
                    el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                } else {
                    el_container_height = ab.height()
                }
                el_container_height = el_container_height / window.tn_scale_factor
            }
            value = el_container_height / 2 - el_height / 2 + value
        }
        if (el_axisy === 'bottom') {
            el_height = t396_elem__getHeight(el);
            if (el.attr('data-elem-type') === 'image') {
                el_width = t396_elem__getWidth(el);
                var fileWidth = t396_elem__getFieldValue(el, 'filewidth');
                var fileHeight = t396_elem__getFieldValue(el, 'fileheight');
                if (fileWidth && fileHeight) {
                    var ratio = parseInt(fileWidth) / parseInt(fileHeight);
                    el_height = el_width / ratio
                }
            }
            if (isScaledFirefox && el_container !== 'window') {
                if (blockVAlign !== 'stretch') {
                    el_container_height = el_container_height * window.tn_scale_factor
                } else {
                    if (scaledMinHeight) {
                        el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                    } else {
                        el_container_height = ab.height()
                    }
                }
                el_height *= window.tn_scale_factor
            }
            if (!isTildaModeEdit && isScaled && !isFirefox && el_container !== 'window' && blockVAlign === 'stretch') {
                if (scaledMinHeight) {
                    el_container_height = scaledMinHeight > ab_max_height ? scaledMinHeight : ab_max_height
                } else {
                    el_container_height = ab.height()
                }
                el_container_height = el_container_height / window.tn_scale_factor
            }
            value = el_container_height - el_height + value
        }
    }
    return (value)
}

function t396_ab__setFieldValue(ab, prop, val, res) {
    if (res == '') res = window.tn.curResolution;
    if (res < 1200) {
        ab.attr('data-artboard-' + prop + '-res-' + res, val)
    } else {
        ab.attr('data-artboard-' + prop, val)
    }
}

function t396_ab__getFieldValue(ab, prop) {
    var res = window.tn.curResolution;
    var r;
    if (res < 1200) {
        if (res == 960) {
            r = ab.attr('data-artboard-' + prop + '-res-960');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '')
            }
        }
        if (res == 640) {
            r = ab.attr('data-artboard-' + prop + '-res-640');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-960');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '')
                }
            }
        }
        if (res == 480) {
            r = ab.attr('data-artboard-' + prop + '-res-480');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-640');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '-res-960');
                    if (typeof r == 'undefined') {
                        r = ab.attr('data-artboard-' + prop + '')
                    }
                }
            }
        }
        if (res == 320) {
            r = ab.attr('data-artboard-' + prop + '-res-320');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-480');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '-res-640');
                    if (typeof r == 'undefined') {
                        r = ab.attr('data-artboard-' + prop + '-res-960');
                        if (typeof r == 'undefined') {
                            r = ab.attr('data-artboard-' + prop + '')
                        }
                    }
                }
            }
        }
    } else {
        r = ab.attr('data-artboard-' + prop)
    }
    return (r)
}

function t396_ab__renderViewOneField(ab, field) {
    var value = t396_ab__getFieldValue(ab, field)
}

function t396_allelems__renderView(ab) {
    tn_console('func: allelems__renderView: abid:' + ab.attr('data-artboard-recid'));
    ab.find(".tn-elem").each(function() {
        t396_elem__renderView($(this))
    })
}

function t396_ab__filterUpdate(ab) {
    var filter = ab.find('.t396__filter');
    var c1 = filter.attr('data-filtercolor-rgb');
    var c2 = filter.attr('data-filtercolor2-rgb');
    var o1 = filter.attr('data-filteropacity');
    var o2 = filter.attr('data-filteropacity2');
    if ((typeof c2 == 'undefined' || c2 == '') && (typeof c1 != 'undefined' && c1 != '')) {
        filter.css("background-color", "rgba(" + c1 + "," + o1 + ")")
    } else if ((typeof c1 == 'undefined' || c1 == '') && (typeof c2 != 'undefined' && c2 != '')) {
        filter.css("background-color", "rgba(" + c2 + "," + o2 + ")")
    } else if (typeof c1 != 'undefined' && typeof c2 != 'undefined' && c1 != '' && c2 != '') {
        filter.css({
            background: "-webkit-gradient(linear, left top, left bottom, from(rgba(" + c1 + "," + o1 + ")), to(rgba(" + c2 + "," + o2 + ")) )"
        })
    } else {
        filter.css("background-color", 'transparent')
    }
}

function t396_ab__getHeight(ab, ab_height) {
    if (typeof ab_height == 'undefined') ab_height = t396_ab__getFieldValue(ab, 'height');
    ab_height = parseFloat(ab_height);
    var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
    if (ab_height_vh != '') {
        ab_height_vh = parseFloat(ab_height_vh);
        if (isNaN(ab_height_vh) === !1) {
            var ab_height_vh_px = parseFloat(window.tn.window_height * parseFloat(ab_height_vh / 100));
            if (ab_height < ab_height_vh_px) {
                ab_height = ab_height_vh_px
            }
        }
    }
    return (ab_height)
}

function t396_hex2rgb(hexStr) {
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b]
}
String.prototype.t396_replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement)
};

function t396_elem__getWidth(el, value) {
    if (typeof value == 'undefined') value = parseFloat(t396_elem__getFieldValue(el, 'width'));
    var el_widthunits = t396_elem__getFieldValue(el, 'widthunits');
    if (el_widthunits == '%') {
        var el_container = t396_elem__getFieldValue(el, 'container');
        if (el_container == 'window') {
            value = parseFloat(window.tn.window_width * parseFloat(parseInt(value) / 100))
        } else {
            value = parseFloat(window.tn.grid_width * parseFloat(parseInt(value) / 100))
        }
    }
    return (value)
}

function t396_elem__getHeight(el, value) {
    if (typeof value == 'undefined') value = t396_elem__getFieldValue(el, 'height');
    value = parseFloat(value);
    if (el.attr('data-elem-type') == 'shape' || el.attr('data-elem-type') == 'video' || el.attr('data-elem-type') == 'html' || el.attr('data-elem-type') == 'gallery') {
        var el_heightunits = t396_elem__getFieldValue(el, 'heightunits');
        if (el_heightunits == '%') {
            var ab = el.parent();
            var ab_min_height = parseFloat(ab.attr('data-artboard-proxy-min-height'));
            var ab_max_height = parseFloat(ab.attr('data-artboard-proxy-max-height'));
            var el_container = t396_elem__getFieldValue(el, 'container');
            if (el_container == 'window') {
                value = parseFloat(ab_max_height * parseFloat(value / 100))
            } else {
                value = parseFloat(ab_min_height * parseFloat(value / 100))
            }
        }
    } else if (el.attr('data-elem-type') == 'button') {
        value = value
    } else {
        value = parseFloat(el.innerHeight())
    }
    return (value)
}

function t396_roundFloat(n) {
    n = Math.round(n * 100) / 100;
    return (n)
}

function tn_console(str) {
    if (window.tn_comments == 1) console.log(str)
}

function t396_setUpTooltip_desktop(el, pinEl, tipEl) {
    var timer;
    pinEl.mouseover(function() {
        $('.tn-atom__tip_visible').each(function() {
            var thisTipEl = $(this).parents('.t396__elem');
            if (thisTipEl.attr('data-elem-id') != el.attr('data-elem-id')) {
                t396_hideTooltip(thisTipEl, $(this))
            }
        });
        clearTimeout(timer);
        if (tipEl.css('display') == 'block') {
            return
        }
        t396_showTooltip(el, tipEl)
    });
    pinEl.mouseout(function() {
        timer = setTimeout(function() {
            t396_hideTooltip(el, tipEl)
        }, 300)
    })
}

function t396_setUpTooltip_mobile(el, pinEl, tipEl) {
    pinEl.on('click', function(e) {
        if (tipEl.css('display') == 'block' && $(e.target).hasClass("tn-atom__pin")) {
            t396_hideTooltip(el, tipEl)
        } else {
            t396_showTooltip(el, tipEl)
        }
    });
    var id = el.attr("data-elem-id");
    $(document).click(function(e) {
        var isInsideTooltip = ($(e.target).hasClass("tn-atom__pin") || $(e.target).parents(".tn-atom__pin").length > 0);
        if (isInsideTooltip) {
            var clickedPinId = $(e.target).parents(".t396__elem").attr("data-elem-id");
            if (clickedPinId == id) {
                return
            }
        }
        t396_hideTooltip(el, tipEl)
    })
}

function t396_hideTooltip(el, tipEl) {
    tipEl.css('display', '');
    tipEl.css({
        "left": "",
        "transform": "",
        "right": ""
    });
    tipEl.removeClass('tn-atom__tip_visible');
    el.css('z-index', '')
}

function t396_showTooltip(el, tipEl) {
    var pos = el.attr("data-field-tipposition-value");
    if (typeof pos == 'undefined' || pos == '') {
        pos = 'top'
    };
    var elSize = el.height();
    var elTop = el.offset().top;
    var elBottom = elTop + elSize;
    var elLeft = el.offset().left;
    var elRight = el.offset().left + elSize;
    var winTop = $(window).scrollTop();
    var winWidth = $(window).width();
    var winBottom = winTop + $(window).height();
    var tipElHeight = tipEl.outerHeight();
    var tipElWidth = tipEl.outerWidth();
    var padd = 15;
    if (pos == 'right' || pos == 'left') {
        var tipElRight = elRight + padd + tipElWidth;
        var tipElLeft = elLeft - padd - tipElWidth;
        if ((pos == 'right' && tipElRight > winWidth) || (pos == 'left' && tipElLeft < 0)) {
            pos = 'top'
        }
    }
    if (pos == 'top' || pos == 'bottom') {
        var tipElRight = elRight + (tipElWidth / 2 - elSize / 2);
        var tipElLeft = elLeft - (tipElWidth / 2 - elSize / 2);
        if (tipElRight > winWidth) {
            var rightOffset = -(winWidth - elRight - padd);
            tipEl.css({
                "left": "auto",
                "transform": "none",
                "right": rightOffset + "px"
            })
        }
        if (tipElLeft < 0) {
            var leftOffset = -(elLeft - padd);
            tipEl.css({
                "left": leftOffset + "px",
                "transform": "none"
            })
        }
    }
    if (pos == 'top') {
        var tipElTop = elTop - padd - tipElHeight;
        var tipElBottom = elBottom + padd + tipElHeight;
        if (winBottom > tipElBottom && winTop > tipElTop) {
            pos = 'bottom'
        }
    }
    if (pos == 'bottom') {
        var tipElTop = elTop - padd - tipElHeight;
        var tipElBottom = elBottom + padd + tipElHeight;
        if (winBottom < tipElBottom && winTop < tipElTop) {
            pos = 'top'
        }
    }
    tipEl.attr('data-tip-pos', pos);
    tipEl.css('display', 'block');
    tipEl.addClass('tn-atom__tip_visible');
    el.css('z-index', '1000')
}

function t396_hex2rgba(hexStr, opacity) {
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b, parseFloat(opacity)]
}

function t446_init(recid) {
    var el = $('#rec' + recid);
    var mobile = el.find('.t446__mobile');
    var fixedBlock = mobile.css('position') === 'fixed' && mobile.css('display') === 'block';
    setTimeout(function() {
        el.find('.t-menu__link-item:not(.t-menusub__target-link):not(.tooltipstered):not(.t794__tm-link)').on('click', function() {
            if ($(this).is(".t-menu__link-item.tooltipstered, .t-menu__link-item.t-menusub__target-link, .t-menu__link-item.t794__tm-link, .t-menu__link-item.t966__tm-link, .t-menu__link-item.t978__tm-link")) {
                return
            }
            if (fixedBlock) {
                mobile.trigger('click')
            }
        });
        el.find('.t-menusub__link-item').on('click', function() {
            if (fixedBlock) {
                mobile.trigger('click')
            }
        })
    }, 500)
}

function t446_setLogoPadding(recid) {
    if ($(window).width() > 980) {
        var t446__menu = $('#rec' + recid + ' .t446');
        var t446__logo = t446__menu.find('.t446__logowrapper');
        var t446__leftpart = t446__menu.find('.t446__leftwrapper');
        var t446__rightpart = t446__menu.find('.t446__rightwrapper');
        t446__leftpart.css("padding-right", t446__logo.width() / 2 + 50);
        t446__rightpart.css("padding-left", t446__logo.width() / 2 + 50)
    }
}

function t446_checkOverflow(recid, menuheight) {
    var t446__menu = $('#rec' + recid + ' .t446');
    var t446__rightwr = t446__menu.find('.t446__rightwrapper');
    var t446__rightmenuwr = t446__rightwr.find('.t446__rightmenuwrapper');
    var t446__rightadditionalwr = t446__rightwr.find('.t446__additionalwrapper');
    var t446__burgeroverflow = t446__rightwr.find('.t446__burgerwrapper_overflow');
    var t446__burgerwithoutoverflow = t446__rightwr.find('.t446__burgerwrapper_withoutoverflow');
    if (menuheight > 0) {
        var t446__height = menuheight
    } else {
        var t446__height = 80
    }
    if ($(window).width() > 980 && (t446__rightmenuwr.width() + t446__rightadditionalwr.width()) > t446__rightwr.width()) {
        t446__menu.css("height", t446__height * 2);
        t446__rightadditionalwr.css("float", "right");
        t446__burgeroverflow.css("display", "table-cell");
        t446__burgerwithoutoverflow.css("display", "none")
    } else {
        if (t446__menu.height() > t446__height) {
            t446__menu.css("height", t446__height)
        }
        if (t446__rightadditionalwr.css("float") == "right") {
            t446__rightadditionalwr.css("float", "none")
        }
        t446__burgeroverflow.css("display", "none");
        t446__burgerwithoutoverflow.css("display", "table-cell")
    }
}

function t446_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1)
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1)
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1)
    }
    if (pathname == "") {
        pathname = "/"
    }
    $(".t446__list_item a[href='" + url + "']").addClass("t-active");
    $(".t446__list_item a[href='" + url + "/']").addClass("t-active");
    $(".t446__list_item a[href='" + pathname + "']").addClass("t-active");
    $(".t446__list_item a[href='/" + pathname + "']").addClass("t-active");
    $(".t446__list_item a[href='" + pathname + "/']").addClass("t-active");
    $(".t446__list_item a[href='/" + pathname + "/']").addClass("t-active")
}

function t446_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t446_navLinks = $("#rec" + recid + " .t446__list_item a:not(.tooltipstered)[href*='#']");
        if (t446_navLinks.length > 0) {
            t446_catchScroll(t446_navLinks)
        }
    }
}

function t446_catchScroll(t446_navLinks) {
    var t446_clickedSectionId = null,
        t446_sections = new Array(),
        t446_sectionIdTonavigationLink = [],
        t446_interval = 100,
        t446_lastCall, t446_timeoutId;
    t446_navLinks = $(t446_navLinks.get().reverse());
    t446_navLinks.each(function() {
        var t446_cursection = t446_getSectionByHref($(this));
        if (typeof t446_cursection.attr("id") != "undefined") {
            t446_sections.push(t446_cursection)
        }
        t446_sectionIdTonavigationLink[t446_cursection.attr("id")] = $(this)
    });
    t446_updateSectionsOffsets(t446_sections);
    t446_sections.sort(function(a, b) {
        return b.attr("data-offset-top") - a.attr("data-offset-top")
    });
    $(window).bind('resize', t_throttle(function() {
        t446_updateSectionsOffsets(t446_sections)
    }, 200));
    $('.t446').bind('displayChanged', function() {
        t446_updateSectionsOffsets(t446_sections)
    });
    setInterval(function() {
        t446_updateSectionsOffsets(t446_sections)
    }, 5000);
    t446_highlightNavLinks(t446_navLinks, t446_sections, t446_sectionIdTonavigationLink, t446_clickedSectionId);
    t446_navLinks.click(function() {
        var t446_clickedSection = t446_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t446_clickedSection.attr("id") != "undefined") {
            t446_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t446_clickedSectionId = t446_getSectionByHref($(this)).attr("id")
        }
    });
    $(window).scroll(function() {
        var t446_now = new Date().getTime();
        if (t446_lastCall && t446_now < (t446_lastCall + t446_interval)) {
            clearTimeout(t446_timeoutId);
            t446_timeoutId = setTimeout(function() {
                t446_lastCall = t446_now;
                t446_clickedSectionId = t446_highlightNavLinks(t446_navLinks, t446_sections, t446_sectionIdTonavigationLink, t446_clickedSectionId)
            }, t446_interval - (t446_now - t446_lastCall))
        } else {
            t446_lastCall = t446_now;
            t446_clickedSectionId = t446_highlightNavLinks(t446_navLinks, t446_sections, t446_sectionIdTonavigationLink, t446_clickedSectionId)
        }
    })
}

function t446_updateSectionsOffsets(sections) {
    $(sections).each(function() {
        var t446_curSection = $(this);
        t446_curSection.attr("data-offset-top", t446_curSection.offset().top)
    })
}

function t446_getSectionByHref(curlink) {
    var t446_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (t446_curLinkValue[0] == '/') {
        t446_curLinkValue = t446_curLinkValue.substring(1)
    }
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t446_curLinkValue.substring(1) + "']")
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t446_curLinkValue.substring(1) + "']")
    }
}

function t446_highlightNavLinks(t446_navLinks, t446_sections, t446_sectionIdTonavigationLink, t446_clickedSectionId) {
    var t446_scrollPosition = $(window).scrollTop(),
        t446_valueToReturn = t446_clickedSectionId;
    if (t446_sections.length != 0 && t446_clickedSectionId == null && t446_sections[t446_sections.length - 1].attr("data-offset-top") > (t446_scrollPosition + 300)) {
        t446_navLinks.removeClass('t-active');
        return null
    }
    $(t446_sections).each(function(e) {
        var t446_curSection = $(this),
            t446_sectionTop = t446_curSection.attr("data-offset-top"),
            t446_id = t446_curSection.attr('id'),
            t446_navLink = t446_sectionIdTonavigationLink[t446_id];
        if (((t446_scrollPosition + 300) >= t446_sectionTop) || (t446_sections[0].attr("id") == t446_id && t446_scrollPosition >= $(document).height() - $(window).height())) {
            if (t446_clickedSectionId == null && !t446_navLink.hasClass('t-active')) {
                t446_navLinks.removeClass('t-active');
                t446_navLink.addClass('t-active');
                t446_valueToReturn = null
            } else {
                if (t446_clickedSectionId != null && t446_id == t446_clickedSectionId) {
                    t446_valueToReturn = null
                }
            }
            return !1
        }
    });
    return t446_valueToReturn
}

function t446_setPath() {}

function t446_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t446").each(function() {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor)
            }
        })
    } else {
        $(".t446").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes")
        })
    }
}

function t446_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t446").each(function() {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
                }
                appearoffset = parseInt(appearoffset, 10);
                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        el.css("top", "-50px");
                        el.css("visibility", "visible");
                        el.animate({
                            "opacity": "1",
                            "top": "0px"
                        }, 200, function() {})
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden")
                }
            }
        })
    }
}

function t446_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t446").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow
            } else {
                var menushadowvalue = '0.' + menushadow
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            }
        })
    }
}

function t446_createMobileMenu(recid) {
    var window_width = $(window).width(),
        el = $("#rec" + recid),
        menu = el.find(".t446"),
        burger = el.find(".t446__mobile");
    if (menu.hasClass('t446__mobile_burgerhook')) {
        burger.find('.t446__mobile_burger').wrap('<a href="#menuopen"></a>')
    } else {
        burger.click(function(e) {
            menu.fadeToggle(300);
            $(this).toggleClass("t446_opened")
        })
    }
    $(window).bind('resize', t_throttle(function() {
        window_width = $(window).width();
        if (window_width > 980) {
            menu.fadeIn(0)
        }
    }, 200));
    el.find('.t-menu__link-item').on('click', function() {
        if (!$(this).hasClass('t966__tm-link') && !$(this).hasClass('t978__tm-link')) {
            t446_hideMenuOnMobile($(this), el)
        }
    });
    el.find('.t446__logowrapper2 a').on('click', function() {
        t446_hideMenuOnMobile($(this), el)
    })
}

function t446_hideMenuOnMobile($this, el) {
    if ($(window).width() < 960) {
        var url = $this.attr('href').trim();
        var menu = el.find('.t446');
        var burger = el.find('.t446__mobile');
        if (url.length && url[0] === '#') {
            burger.removeClass('t446_opened');
            if (menu.is('.t446__positionabsolute')) {
                menu.fadeOut(0)
            } else {
                menu.fadeOut(300)
            }
            return !0
        }
    }
}

function t448_setHeight(recid) {
    var el = $("#rec" + recid);
    var coverheight = el.find(".t-cover").height();
    var coverwrapper = el.find(".t448-cover__wrapper");
    var textheight = el.find(".t448__wrapper").innerHeight();
    var imgheight = el.find(".t448__screenshot").height();
    var height = textheight + imgheight;
    var newheight = coverheight - imgheight;
    var container = el.find(".t448");
    var attr = container.attr("data-crop-image");
    if (typeof attr !== typeof undefined && attr !== !1) {
        container.addClass("t448__no-overflow");
        container.css("height", coverwrapper.height())
    }
    if (coverheight > height) {
        el.addClass("t448__stretched");
        coverwrapper.css("height", newheight);
        if (typeof attr !== typeof undefined && attr !== !1) {
            container.removeClass("t448__no-overflow");
            container.css("height", "")
        }
    } else {
        el.removeClass("t448__stretched");
        coverwrapper.css("height", "")
    }
}

function t678_onSuccess(t678_form) {
    var t678_inputsWrapper = t678_form.find('.t-form__inputsbox');
    var t678_inputsHeight = t678_inputsWrapper.height();
    var t678_inputsOffset = t678_inputsWrapper.offset().top;
    var t678_inputsBottom = t678_inputsHeight + t678_inputsOffset;
    var t678_targetOffset = t678_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t678_target = t678_targetOffset - 200
    } else {
        var t678_target = t678_targetOffset - 100
    }
    if (t678_targetOffset > $(window).scrollTop() || ($(document).height() - t678_inputsBottom) < ($(window).height() - 100)) {
        t678_inputsWrapper.addClass('t678__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: t678_target
        }, 400);
        setTimeout(function() {
            t678_inputsWrapper.addClass('t678__inputsbox_hidden')
        }, 400)
    }
    var successurl = t678_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}