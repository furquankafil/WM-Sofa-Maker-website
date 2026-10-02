/* WM Sofa Maker — interactions (vanilla JS + GSAP progressive enhancement) */
(function(){
  "use strict";
  document.documentElement.classList.remove("no-js");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------- Lucide ---------- */
  try{ if(window.lucide){ window.lucide.createIcons(); } }catch(e){}

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader(){
    if(!header) return;
    if(window.scrollY > 40){ header.classList.add("scrolled"); }
    else if(!header.classList.contains("solid")){ header.classList.remove("scrolled"); }
  }
  window.addEventListener("scroll", onScrollHeader, {passive:true});
  onScrollHeader();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("menuBtn");
  var mMenu = document.getElementById("mobileMenu");
  var mClose = document.getElementById("mobileClose");
  function setMenu(open){
    if(!mMenu || !burger) return;
    mMenu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if(open){
      var links = mMenu.querySelectorAll(".mlink");
      links.forEach(function(a,i){ a.style.transitionDelay = (0.06*i+0.08)+"s"; });
      var first = mMenu.querySelector(".mlink"); if(first) first.focus({preventScroll:true});
    } else { document.body.style.overflow = ""; }
  }
  if(burger && mMenu){
    burger.addEventListener("click", function(){ setMenu(true); });
    if(mClose) mClose.addEventListener("click", function(){ setMenu(false); });
    mMenu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ setMenu(false); }); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape"){ setMenu(false); closeLightbox(); } });
  }

  /* ---------- Hero intro + parallax ---------- */
  function heroIntro(){
    var lines = document.querySelectorAll(".reveal-line > span");
    if(prefersReduced || !hasGSAP){ lines.forEach(function(s){ s.style.transform="none"; }); return; }
    try{
      if(window.ScrollTrigger && window.gsap){ gsap.registerPlugin(ScrollTrigger); }
      gsap.set(lines, {yPercent:110, y:0});
      gsap.to(lines, {yPercent:0, duration:1.25, stagger:0.14, ease:"power3.out"});
      var bg = document.querySelector(".hero-bg img");
      if(bg){
        gsap.fromTo(bg,{scale:1.14},{scale:1.04,duration:2.4,ease:"power2.out"});
        if(window.ScrollTrigger){
          gsap.to(bg,{yPercent:10,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
        }
      }
    }catch(e){
      lines.forEach(function(s){ s.style.transform="none"; });
    }
  }
  if(document.readyState==="complete"){ heroIntro(); }
  else{ window.addEventListener("load", heroIntro); setTimeout(heroIntro, 1600); }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window && !prefersReduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },{threshold:0.12, rootMargin:"0px 0px -6% 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  } else { revealEls.forEach(function(el){ el.classList.add("in"); }); }

  /* ---------- Active nav link ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  if("IntersectionObserver" in window && sections.length){
    var navIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          navLinks.forEach(function(a){
            var href = a.getAttribute("href")||"";
            a.classList.toggle("active", href === "#"+en.target.id);
          });
        }
      });
    },{rootMargin:"-40% 0px -55% 0px"});
    sections.forEach(function(s){ navIO.observe(s); });
  }

  /* ---------- Craft steps: sticky image swap ---------- */
  var craftImg = document.getElementById("craftImage");
  var steps = document.querySelectorAll(".step[data-img]");
  if(steps.length && "IntersectionObserver" in window){
    var stepIO = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          steps.forEach(function(s){ s.classList.remove("active"); });
          en.target.classList.add("active");
          var src = en.target.getAttribute("data-img");
          if(craftImg && src && craftImg.getAttribute("src")!==src){
            craftImg.style.opacity = "0";
            var pre = new Image();
            pre.onload = function(){ craftImg.src = src; craftImg.style.opacity="1"; };
            pre.src = src;
          }
        }
      });
    },{rootMargin:"-35% 0px -45% 0px"});
    steps.forEach(function(s){ stepIO.observe(s); });
    if(steps[0]) steps[0].classList.add("active");
  }

  /* ---------- Configurator ---------- */
  var state = { fabric:"Bouclé · Oat", colour:"Oatmeal", config:"3-Seater", comfort:"Medium-Plush" };
  var fabricMap = {
    "Bouclé · Oat":      {img:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1400&auto=format&fit=crop", cap:"Bouclé · Oat — soft looped weave"},
    "Linen · Sand":      {img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop", cap:"Linen · Sand — breathable plain weave"},
    "Velvet · Moss":     {img:"https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop", cap:"Velvet · Moss — low-sheen cotton velvet"},
    "Leather · Cognac":  {img:"https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1400&auto=format&fit=crop", cap:"Leather · Cognac — full-grain, burnished"}
  };
  var colourDots = {
    "Oatmeal":"#D9CFC0","Sand":"#CBBFA9","Moss":"#7A7A5A","Charcoal":"#33302B","Terracotta":"#B06A4A","Indigo":"#3A445E"
  };
  var cfgImg = document.getElementById("configImage");
  var cfgCap = document.getElementById("configCap");
  var sumFabric = document.getElementById("sumFabric");
  var sumColour = document.getElementById("sumColour");
  var sumConfig = document.getElementById("sumConfig");
  var sumComfort = document.getElementById("sumComfort");
  function renderSummary(){
    if(sumFabric) sumFabric.textContent = state.fabric;
    if(sumColour) sumColour.textContent = state.colour;
    if(sumConfig) sumConfig.textContent = state.config;
    if(sumComfort) sumComfort.textContent = state.comfort;
  }
  function bindGroup(id, key, after){
    var g = document.getElementById(id);
    if(!g) return;
    g.querySelectorAll("[data-value]").forEach(function(btn){
      btn.addEventListener("click", function(){
        g.querySelectorAll("[data-value]").forEach(function(b){ b.setAttribute("aria-pressed","false"); });
        btn.setAttribute("aria-pressed","true");
        state[key] = btn.getAttribute("data-value");
        if(after) after(state[key], btn);
        renderSummary();
      });
    });
  }
  bindGroup("fabricGroup","fabric", function(val){
    var m = fabricMap[val];
    if(m && cfgImg){ cfgImg.style.opacity="0"; setTimeout(function(){ cfgImg.src=m.img; cfgImg.alt=m.cap; cfgImg.style.opacity="1"; },220); }
    if(m && cfgCap) cfgCap.textContent = m.cap;
  });
  bindGroup("colourGroup","colour");
  bindGroup("configGroup","config");
  bindGroup("comfortGroup","comfort");
  // colour swatch dot tint on sofa preview (subtle, honest preview aid)
  var colourGroup = document.getElementById("colourGroup");
  if(colourGroup){
    colourGroup.querySelectorAll("[data-value]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var c = colourDots[btn.getAttribute("data-value")];
        if(cfgImg && c && !prefersReduced){ cfgImg.style.filter = "saturate(.92)"; }
      });
    });
  }
  renderSummary();
  var buildBtn = document.getElementById("buildSofaBtn");
  if(buildBtn){
    buildBtn.addEventListener("click", function(){
      var msg = "Hi WM Sofa Maker, I'd like a custom sofa — Fabric: "+state.fabric+", Colour: "+state.colour+", Configuration: "+state.config+", Comfort: "+state.comfort+".";
      var ta = document.getElementById("enqMessage");
      if(ta){ ta.value = msg; }
      var contact = document.getElementById("contact");
      if(contact){ contact.scrollIntoView({behavior: prefersReduced ? "auto" : "smooth"}); }
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImage");
  var lbCap = document.getElementById("lbCaption");
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lbIndex = 0;
  function openLightbox(i){
    if(!lb || !galleryItems.length) return;
    lbIndex = (i+galleryItems.length)%galleryItems.length;
    var btn = galleryItems[lbIndex];
    var img = btn.querySelector("img");
    if(lbImg && img){ lbImg.src = img.src.replace("w=800","w=1600"); lbImg.alt = img.alt; }
    if(lbCap) lbCap.textContent = btn.getAttribute("data-caption") || (img ? img.alt : "");
    lb.classList.add("open");
    lb.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox(){
    if(!lb || !lb.classList.contains("open")) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  window.closeLightbox = closeLightbox;
  galleryItems.forEach(function(btn,i){
    btn.addEventListener("click", function(){ openLightbox(i); });
  });
  var prev = document.getElementById("lbPrev"), next = document.getElementById("lbNext"), closeB = document.getElementById("lbClose");
  if(prev) prev.addEventListener("click", function(e){ e.stopPropagation(); openLightbox(lbIndex-1); });
  if(next) next.addEventListener("click", function(e){ e.stopPropagation(); openLightbox(lbIndex+1); });
  if(closeB) closeB.addEventListener("click", closeLightbox);
  if(lb) lb.addEventListener("click", function(e){ if(e.target===lb) closeLightbox(); });
  document.addEventListener("keydown", function(e){
    if(!lb || !lb.classList.contains("open")) return;
    if(e.key==="ArrowRight") openLightbox(lbIndex+1);
    if(e.key==="ArrowLeft") openLightbox(lbIndex-1);
  });

  /* ---------- Brand statement rotator ---------- */
  var quotes = [
    "Every detail begins with the space, the lifestyle and the comfort you want.",
    "Beautiful sofas, thoughtfully designed and carefully crafted.",
    "Proportions, materials and stitching — considered, not decorated."
  ];
  var qEl = document.getElementById("brandQuote");
  var dotsBox = document.getElementById("quoteDots");
  var qi = 0, qTimer = null;
  function showQuote(i){
    qi = (i+quotes.length)%quotes.length;
    if(qEl){
      qEl.style.opacity="0";
      setTimeout(function(){ qEl.textContent = "\u201C"+quotes[qi]+"\u201D"; qEl.style.opacity="1"; },250);
    }
    if(dotsBox){
      dotsBox.querySelectorAll("button").forEach(function(d,di){ d.classList.toggle("active", di===qi); });
    }
  }
  if(qEl && dotsBox && quotes.length){
    quotes.forEach(function(_,i){
      var d = document.createElement("button");
      d.type="button"; d.setAttribute("aria-label","Show statement "+(i+1));
      if(i===0) d.classList.add("active");
      d.addEventListener("click", function(){ showQuote(i); restartQuotes(); });
      dotsBox.appendChild(d);
    });
    function restartQuotes(){ if(qTimer) clearInterval(qTimer); if(!prefersReduced){ qTimer=setInterval(function(){ showQuote(qi+1); },6000); } }
    restartQuotes();
  }

  /* ---------- Enquiry form (demo) ---------- */
  var form = document.getElementById("enquiryForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("enqName");
      var phone = document.getElementById("enqPhone");
      var ok = true;
      [name, phone].forEach(function(f){
        if(f && !f.value.trim()){ f.style.borderColor="#E0655A"; ok=false; }
        else if(f){ f.style.borderColor=""; }
      });
      if(!ok) return;
      var success = document.getElementById("formSuccess");
      if(success){
        success.style.display="block";
        success.innerHTML = "<strong>Thank you"+(name && name.value ? ", "+escapeHtml(name.value.split(" ")[0]) : "")+".</strong> Your enquiry has been noted for this demo. We\u2019ll connect WhatsApp + call buttons once your real number is added.";
      }
      try{
        var data = {
          name: name? name.value : "",
          phone: phone? phone.value : "",
          email: (document.getElementById("enqEmail")||{}).value || "",
          type: (document.getElementById("enqType")||{}).value || "",
          style: (document.getElementById("enqStyle")||{}).value || "",
          message: (document.getElementById("enqMessage")||{}).value || "",
          at: new Date().toISOString()
        };
        localStorage.setItem("wm-enquiry-demo", JSON.stringify(data));
      }catch(err){}
      form.reset(); renderSummary();
    });
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if(yr) yr.textContent = new Date().getFullYear();

  /* ---------- Product "View Design" -> prefill enquiry ---------- */
  document.querySelectorAll("[data-product]").forEach(function(link){
    link.addEventListener("click", function(){
      var ta = document.getElementById("enqMessage");
      if(ta){ ta.value = "Hi WM Sofa Maker, I'm interested in \""+link.getAttribute("data-product")+"\". Please share fabric options and pricing."; }
    });
  });
})();
