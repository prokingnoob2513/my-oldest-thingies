import * as bn from './bignum-be-like.js'

function B(x) {return bn.toBigNum(x)}

document.querySelector(".upg0").addEventListener("click", function () { upg(0) });
document.querySelector(".upg1").addEventListener("click", function () { upg(1) });
document.querySelector(".upg2").addEventListener("click", function () { upg(2) });
document.querySelector(".upg3").addEventListener("click", function () { upg(3) });
document.querySelector(".upg0a_unlock").addEventListener("click", function () { upg(11) });
document.querySelector(".upg0a_intupg").addEventListener("click", function () { upg(12) });
document.querySelector(".upg1p").addEventListener("click", function () { upg(10001) });
document.querySelector(".tab-0").addEventListener("click", function () { tab = 0 });
document.querySelector(".tab-1").addEventListener("click", function () { tab = 1 });
document.querySelector(".tab-2").addEventListener("click", function () { tab = 2 });
document.querySelector(".tab-69").addEventListener("click", function () { tab = 69 });
document.querySelector(".set-ex").addEventListener("click", function () { settings('ex') });
document.querySelector(".set-im").addEventListener("click", function () { settings('im') });
document.querySelector(".set-sv").addEventListener("click", function () { settings('sv') });
document.querySelector(".set-rs").addEventListener("click", function () { settings('rs') });
document.querySelector(".set-rs_dp").addEventListener("click", function () {
  document.querySelector(".dp-set").value = 2;
  game.dp = 2;
});

var game = {
  pts: B(1),
  pps: B(0),
  upgs: { // upgrades
    upg0: { amt: B(0), cst: B(1), eff: B(1) },
    upg1: { amt: B(0), cst: B(100), eff: B(1), swn: false },
    upg2: { amt: B(0), cst: B(5000), eff: B(1), swn: false },
    upg3: { amt: B(0), cst: B(100000), eff: B(1), swn: false },
    upg1p: { amt: B(0), cst: B(1e8), swn: false }
  },
  auto: { // automation
    upg0: { u: false, i: 600, b: 1, ic: B(25000) } // u: unlocked, i: interval (ms), b: bulk, ic: interval upg. cost
  },
  nt: 0,
  dp: 2
};

let tab = 0;
var save = game

if (Cookies.get("savefile") != null && Cookies.get("savefile") != "undefined") {
  save = JSON.parse(Cookies.get("savefile"))
  save = {
      pts: B(save.pts),
      pps: B(save.pps),
      upgs: {
        upg0: { amt: B(save.upgs.upg0.amt), cst: B(save.upgs.upg0.cst), eff: B(save.upgs.upg0.eff) },
        upg1: { amt: B(save.upgs.upg1.amt), cst: B(save.upgs.upg1.cst), eff: B(save.upgs.upg1.eff), swn: save.upgs.upg0.swn },
        upg2: { amt: B(save.upgs.upg2.amt), cst: B(save.upgs.upg2.cst), eff: B(save.upgs.upg2.eff), swn: save.upgs.upg1.swn },
        upg3: { amt: B(save.upgs.upg3.amt), cst: B(save.upgs.upg3.cst), eff: B(save.upgs.upg3.eff), swn: save.upgs.upg2.swn },
        upg1p: { amt: B(save.upgs.upg1p.amt), cst: B(save.upgs.upg1p.cst), swn: save.upgs.upg3.swn }
      },
      auto: {
        upg0: { u: save.auto.upg0.u, i: save.auto.upg0.i, b: save.auto.upg0.b, ic: B(save.auto.upg0.ic) }
      },
      nt: save.nt,
      dp: save.dp
    }
  game = save
}

document.querySelector(".dp-set").value = game.dp;
document.querySelector(".set-nt").selectedIndex = game.nt;

function settings(a) {
  if (a == 'ex') {
    settings('sv')
    navigator.clipboard.writeText(btoa(Cookies.get("savefile")));
    $.notify("Save exported!", "info");
  }
  if (a == 'im') {
    save = JSON.parse(atob(prompt("enter your savefile")));
    Cookies.set("savefile", JSON.stringify(save), { expires: 365000 });
    $.notify("Game saved!", "success")
    location.reload();
  }
  if (a == 'sv') {
    save = {
      pts: bn.toString(game.pts, 20),
      pps: bn.toString(game.pps, 20),
      upgs: {
        upg0: { amt: bn.toString(game.upgs.upg0.amt, 20), cst: bn.toString(game.upgs.upg0.cst, 20), eff: bn.toString(game.upgs.upg0.eff, 20) },
        upg1: { amt: bn.toString(game.upgs.upg1.amt, 20), cst: bn.toString(game.upgs.upg1.cst, 20), eff: bn.toString(game.upgs.upg1.eff, 20), swn: game.upgs.upg0.swn },
        upg2: { amt: bn.toString(game.upgs.upg2.amt, 20), cst: bn.toString(game.upgs.upg2.cst, 20), eff: bn.toString(game.upgs.upg2.eff, 20), swn: game.upgs.upg1.swn },
        upg3: { amt: bn.toString(game.upgs.upg3.amt, 20), cst: bn.toString(game.upgs.upg3.cst, 20), eff: bn.toString(game.upgs.upg3.eff, 20), swn: game.upgs.upg2.swn },
        upg1p: { amt: bn.toString(game.upgs.upg1p.amt, 20), cst: bn.toString(game.upgs.upg1p.cst, 20), swn: game.upgs.upg3.swn }
      },
      auto: {
        upg0: { u: game.auto.upg0.u, i: game.auto.upg0.i, b: game.auto.upg0.b, ic: bn.toString(game.auto.upg0.ic, 20) }
      },
      nt: game.nt,
      dp: game.dp
    }
    Cookies.set("savefile", JSON.stringify(save), { expires: 365000 });
    $.notify("Game saved!", "success");
  }
  if (a == 'rs' && prompt("Are you sure? This will GIVE no bonuses! Type 'real' to confirm!") == "real") {
    location.reload();
    Cookies.set("savefile", "REAL", { expires: 0 })
  }
}

document.querySelector(".dp-set").oninput = function () { game.dp = this.value; };

function upg(n) {
  if (n == 0 && bn.meeq(game.pts, game.upgs.upg0.cst)) {
    game.pts = bn.sub(game.pts, game.upgs.upg0.cst);
    if (!bn.equal(game.upgs.upg0.amt, B(0))) {
      game.upgs.upg0.cst = bn.mul(game.upgs.upg0.cst, B(1.5));
    } else {
      game.upgs.upg0.cst = B(10);
    }
    game.upgs.upg0.amt = bn.add(game.upgs.upg0.amt, B(1));
  } else if (n == 1 && bn.meeq(game.pts, game.upgs.upg1.cst)) {
    game.pts = bn.sub(game.pts, game.upgs.upg1.cst);
    game.upgs.upg1.amt = bn.add(game.upgs.upg1.amt, B(1));
    game.upgs.upg1.cst = bn.mul(game.upgs.upg1.cst, B(2.1));
  } else if (n == 2 && bn.meeq(game.pts, game.upgs.upg2.cst)) {
    game.pts = bn.sub(game.pts, game.upgs.upg2.cst);
    game.upgs.upg2.amt = bn.add(game.upgs.upg2.amt, B(1));
    game.upgs.upg2.cst = bn.mul(game.upgs.upg2.cst, B(3.5));
  } else if (n == 3 && bn.meeq(game.pts, game.upgs.upg3.cst)) {
    game.pts = bn.sub(game.pts, game.upgs.upg3.cst);
    game.upgs.upg3.amt = bn.add(game.upgs.upg3.amt, B(1));
    game.upgs.upg3.cst = bn.mul(game.upgs.upg3.cst, B(5));
  } else if (n == 11 && bn.meeq(game.pts, B(15000))) {
    game.pts = bn.sub(game.pts, B(15000));
    game.auto.upg0.u = true;
  } else if (n == 12 && bn.meeq(game.pts, game.auto.upg0.ic)) {
    game.pts = bn.sub(game.pts, game.auto.upg0.ic);
    game.auto.upg0.i -= game.auto.upg0.i * 0.35;
    game.auto.upg0.ic = bn.mul(game.auto.upg0.ic, B(2));
  } else if (n == 10001 && bn.meeq(game.pts, game.upgs.upg1p.cst)) {
    game.pts = bn.sub(game.pts, game.upgs.upg1p.cst);
    game.upgs.upg1p.amt = bn.add(game.upgs.upg1p.amt, B(1));
    game.upgs.upg1p.cst = bn.mul(game.upgs.upg1p.cst, B(11));
  }
}

const gain = setInterval(function () {
  game.pts = bn.add(game.pts, bn.div(game.pps, B(10)));
}, 100);

const autosave = setInterval(function () { settings("sv"); }, 20000);

const update = setInterval(function () {
  game.upgs.upg0.eff = bn.pow(bn.mul(B(1.1), game.upgs.upg1.eff), game.upgs.upg1.amt);
  game.upgs.upg1.eff = bn.pow(bn.mul(B(1.05), game.upgs.upg2.eff), game.upgs.upg2.amt);
  game.upgs.upg2.eff = bn.pow(B(1.025), game.upgs.upg3.amt);
  game.pps = bn.pow(
    bn.mul(game.upgs.upg0.amt, game.upgs.upg0.eff),
    bn.add(bn.div(game.upgs.upg1p.amt, B(100)), B(1))
  );

  // points/s = (upg0 effect * upg0 amount)^(1 + upg1p amount / 100)
  game.nt = document.querySelector(".set-nt").selectedIndex;
  document.getElementById("pts").innerHTML = bn.toString(game.pts, game.dp, game.nt);
  document.getElementById("pps").innerHTML = bn.toString(game.pps, game.dp, game.nt);

  // update upgrade 0
  document.getElementById("upg0").innerHTML = bn.toString(game.upgs.upg0.amt, 2, game.nt);
  document.getElementById("upg0c").innerHTML = bn.toString(game.upgs.upg0.cst, game.dp, game.nt);
  document.getElementById("upg0e").innerHTML = bn.toString(game.upgs.upg0.eff, game.dp, game.nt);

  // update upgrade 1
  document.getElementById("upg1").innerHTML = bn.toString(game.upgs.upg1.amt, 2, game.nt);
  document.getElementById("upg1c").innerHTML = bn.toString(game.upgs.upg1.cst, game.dp, game.nt);
  document.getElementById("upg1e").innerHTML = bn.toString(bn.mul(B(1.1), game.upgs.upg1.eff), game.dp, game.nt);

  // update upgrade 2
  document.getElementById("upg2").innerHTML = bn.toString(game.upgs.upg2.amt, 2, game.nt);
  document.getElementById("upg2c").innerHTML = bn.toString(game.upgs.upg2.cst, game.dp, game.nt);
  document.getElementById("upg2e").innerHTML = bn.toString(bn.mul(B(1.05), game.upgs.upg2.eff), game.dp, game.nt);

  // update upgrade 3
  document.getElementById("upg3").innerHTML = bn.toString(game.upgs.upg3.amt, 2, game.nt);
  document.getElementById("upg3c").innerHTML = bn.toString(game.upgs.upg3.cst, game.dp, game.nt);

  // update upgrade 1p
  document.getElementById("upg1p").innerHTML = bn.toString(game.upgs.upg1p.amt, 2, game.nt);
  document.getElementById("upg1pc").innerHTML = bn.toString(game.upgs.upg1p.cst, game.dp, game.nt);

  // update decimal places
  document.getElementById("dp").innerHTML = game.dp;

  // handle visibility for upgrades and tabs
  if (bn.more(game.upgs.upg0.amt, B(4)) || bn.more(game.upgs.upg1.amt, B(1))) game.upgs.upg1.swn = true;
  if (bn.more(game.upgs.upg1.amt, B(4)) || bn.more(game.upgs.upg2.amt, B(1))) game.upgs.upg2.swn = true;
  if (bn.more(game.upgs.upg2.amt, B(4)) || bn.more(game.upgs.upg3.amt, B(1))) game.upgs.upg3.swn = true;
  if (bn.more(game.pts, B(5e7)) || bn.more(game.upgs.upg1p.amt, B(1))) game.upgs.upg1p.swn = true;

  // show or hide upgrade buttons
  if (game.upgs.upg1.swn) $(".upg1").show();
  if (game.upgs.upg2.swn) {
    $(".upg2").show();
    $(".tab-2").show();
  }
  if (game.upgs.upg3.swn) $(".upg3").show();
  if (game.upgs.upg1p.swn) $(".upg1p").show();

  // show or hide automation elements
  if (game.auto.upg0.u) {
    $(".upg0a_unlock").hide();
    $(".upg0a_intupg").show();
    $(".upg0a_int").show();
  }

  // handle tabs
  if (tab == 0) {
    $(".main").show();
    $(".settings").hide();
    $(".achievements").hide();
    $(".automation").hide();
  } else if (tab == 1) {
    $(".main").hide();
    $(".settings").hide();
    $(".achievements").show();
    $(".automation").hide();
  } else if (tab == 2) {
    $(".main").hide();
    $(".settings").hide();
    $(".achievements").hide();
    $(".automation").show();
  } else if (tab == 69) {
    $(".main").hide();
    $(".settings").show();
    $(".achievements").hide();
    $(".automation").hide();
  }
}, 33);

const upg0a = setInterval(function () {
  if (game.auto.upg0.u) upg(0);
}, game.auto.upg0.i);