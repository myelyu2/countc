(async function($) {
  "use strict"; // Start of use strict

  const demoSceneId = '868c9f0b-0610-4c2c-897d-5a887c713d25'
  const publishableToken = 'bcc6047c-d8a5-4418-aafc-be30f3162d48'
  const container = document.getElementById('hello-plan')
  const floorPlan = new FloorPlanEngine(container)

  let active = {}

  floorPlan.loadScene(demoSceneId, { publishableToken }).then(() => {
    floorPlan.on('mousemove', highlightResources, floorPlan)
    // highlight nodes in plan based on random data every five seconds
    getOccupancy(floorPlan)
    setInterval(() => {
      getOccupancy(floorPlan)
    }, 5000)
  })

  function highlightResources(evt) {
    const pos = evt.pos
    const infoPos = [pos[0], pos[1] - 0.5]
    let { spaces, assets } = this.getResourcesFromPosition(pos)
    highlight(spaces, 'space', [150, 200, 250])
    // highlight(assets, 'asset', [250, 150, 50])
    setInfoWindow(infoPos)
  }
  function highlight(items, type, color) {
    if (!items.length) {
      if (active[type]) active[type].node.setHighlight()
      delete active[type]
      return
    }
    let item = items[0]
    if (active[type]?.id === item.id) return
    else if (active[type]) active[type].node.setHighlight()
    item.node.setHighlight({ fill: color })
    active[type] = item
  }
  function setInfoWindow(infoPos) {
    if (active.asset || active.space) {
      // const assetCount = active.space.assets.length
      const html = `<b>${active.space.usage}</b>${
        active.asset?.name || ''
      }`
      if (active.infoWindow) active.infoWindow.set({ pos: infoPos, html })
      else
        active.infoWindow = floorPlan.addInfoWindow({
          pos: infoPos,
          html,
          height: 100,
          width: 150,
          closeButton: false
        })
    } else if (active.infoWindow) {
      active.infoWindow.remove()
      delete active.infoWindow
    }
  }

  function getOccupancy(floorPlan) {
    const spaces = floorPlan.state.resources.spaces
    const workSpaces = spaces.filter((space) => space.program === 'work')
    const meetSpaces = spaces.filter((space) => space.program === 'meet')
    const commonSpaces = spaces.filter((space) => space.program === 'common')


    const occupiedClr = [227, 108, 100]
    const freeClr = [100, 179, 121]

    const meetingCount = meetSpaces.length
    let meetingCountOccupied = 0
    // get oocupancy for meeting rooms and color them
    // best to reference the spaces via external ids
    // https://developers.archilogic.com/floor-plan-engine/guide.html#spaces-and-furniture
    meetSpaces.forEach((space, i) => {
      // replace with external API response
      // 60% chance a room is occupied
      let isOccupied = Math.random() > 0.4
      if (isOccupied) meetingCountOccupied++
      let fill = isOccupied ? occupiedClr : freeClr
      space.node.setHighlight({ fill })
    })

    const commonCount = commonSpaces.length
    let commonCoutOccupied = 0
    
    commonSpaces.forEach((space, i) => {
      let isOccupied = Math.random() > 0.4
      if (isOccupied) commonCoutOccupied++
      let fill = isOccupied ? occupiedClr : freeClr
      space.node.setHighlight({ fill })
    })


    // get oocupancy for desks and color them
    let deskCount = 0
    let deskCountOccupied = 0
    workSpaces.forEach((space, i) => {
      space.assets.forEach((id, j) => {
        let asset = floorPlan.state.resources.assets.find(
          (f) => f.id === id
        )
        // best to reference the desks via external ids
        // https://developers.archilogic.com/floor-plan-engine/guide.html#spaces-and-furniture
        let isTable = asset.tags && asset.tags.includes('work table')
        if (!isTable) return
        deskCount++
        // replace with external API response
        // 40% chance a desk is occupied
        let isOccupied = Math.random() > 0.6
        if (isOccupied) deskCountOccupied++
        let fill = isOccupied ? occupiedClr : freeClr
        asset.node.setHighlight({ fill })
      })
    })
    // update display
    dataEl.setAttribute('style', 'display: inline-block;')
    const meetPct = Math.round((meetingCountOccupied / meetingCount) * 100)
    meetingCounterEl.innerHTML =
      `<span class="count">${meetingCountOccupied} / ${meetingCount}</span>` +
      getDonout(10, meetPct / 100)

    const commonPct = Math.round((commonCountOccupied / commonCount) * 100)
    commonCounterEl.innerHTML =
      `<span class="count">${meetingCountOccupied} / ${meetingCount}</span>` +
      getDonout(10, commonPct / 100)

    const deskPct = Math.round((deskCountOccupied / deskCount) * 100)
    deskCounterEl.innerHTML =
      `<span class="count">${deskCountOccupied} / ${deskCount}</span>` +
      getDonout(10, deskPct / 100)
  }
  function getDonout(r, pct) {
    let l = Math.PI * r * 2,
      a = l * pct,
      b = l - a
    return `<svg width="30px" height="30px">
      <circle
        style="stroke-dasharray: ${a} ${l}; stroke-dashoffset: 0; stroke: rgb(227, 108, 100); stroke-width: 7.5; fill: none"
        r="${r}" cx="50%" cy="50%"/>
      <circle
        style="stroke-dasharray: ${b} ${l}; stroke-dashoffset: ${-a}; stroke: rgb(100, 179, 121); stroke-width: 7.5; fill: none"
        r="${r}" cx="50%" cy="50%"/>
    </svg>`
  }


  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict
