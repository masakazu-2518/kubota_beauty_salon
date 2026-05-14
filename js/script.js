const btnOpen = document.querySelector("#menu-open");
const btnClose = document.querySelector("#menu-close");
const menuPanel = document.querySelector(".menu-container");
const menuLinks = document.querySelectorAll(".menu a");

btnOpen.addEventListener("click", () => {
  menuPanel.classList.add("panel-open");
});

btnClose.addEventListener("click", () => {
  menuPanel.classList.remove("panel-open");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuPanel.classList.remove("panel-open");
  });
});

// ここまでボタン---------------------------------
// consept-------------------------------------
// ローディングアニメーション
const loadingElement = document.getElementById("loading");
const targetSection = document.querySelector(".concept");

let progress = 0;

// 10ミリ秒ごとに数値を加算
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 画面内に入ったらカウント
        const intervalId = setInterval(() => {
          progress++;
          loadingElement.textContent = progress + "%";
          // 100%　終了　フェードアウト
          if (progress >= 100) {
            clearInterval(intervalId);
            loadingElement.classList.add("fade-out");
          }
        }, 12);
        // 一度実行したら監視終了
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
// 10％見えたら実行
observer.observe(targetSection);
// ----------------------------------------------
// ふわっと---------------------------------------
// 監視対象実行
const animateFade = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        {
          opacity: [0, 1],
          filter: ["blur(.4rem)", "blur(0)"],
        },
        {
          duration: 2000,
          easing: "ease",
          fill: "forwards",
        }
      );
    }
  });
};

// 監視設定
const fadeObserver = new IntersectionObserver(animateFade);
// .fadein監視　指示
const fadeElements = document.querySelectorAll(".feature, .stylist");
fadeElements.forEach((fadeElement) => {
  fadeObserver.observe(fadeElement);
});

// レーダーチャート-------------------------------

const root = document.querySelector(".momoRadar");

const DSSAS = ["第一印象", "清潔感", "信頼感", "安定感", "誠実性"];
const max = 5;
const Base_Price = 4800;

const options = {
  brow: { label: "眉カット", price: 500, add: [0.25, 0.35, 0.2, 0.3, 0.25] },
  nail: { label: "ネイルケア(爪)", price: 500, add: [0.15, 0.25, 0.15, 0.2, 0.2] },
  scalp: { label: "スカルプクレンジング", price: 1500, add: [0.2, 0.45, 0.3, 0.2, 0.3] },
  face: { label: "フェイスパック", price: 500, add: [0.2, 0.3, 0.25, 0.1, 0.2] },
  lip: { label: "リップケア", price: 500, add: [0.2, 0.2, 0.2, 0.3, 0.25] },
  nose: { label: "ノーズケア(ワックス)", price: 1000, add: [0.3, 0.2, 0.25, 0.1, 0.2] },
};
const Base_Score = [3.9, 3.8, 3.7, 3.8, 3.8];

const Buttons = root.querySelectorAll(".momoRadar-Btn");
const totalPrice = root.querySelector(".momoRadar-totalPrice");
const Count = root.querySelector(".momoRadar-choice-Count");
const Value = root.querySelector(".momoRadar-valueTotal");

// Idがついている要素-用紙の指示
const Canvas = document.getElementById("momoRadarChart");

// オプション選択
const selected = new Set();

const chart = new Chart(Canvas, {
  type: "radar",
  data: {
    labels: DSSAS,
    // チャートカラー設定
    datasets: [
      {
        label: "現在値",
        data: Base_Score,
        backgoundColor: "rgba(20,40,80,0.2)",
        borderColor: "rgba(20,40,80,1)",
        pointBackgroundColor: "rgba(20,40,80,1)",
        pointBorderColor: "#fff",
      },
    ],
  },
  options: {
    responsive: true,
    // CSSでサイズ管理
    maitainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max,
        ticks: {
          stepSize: 1,
        },
      },
    },
  },
});

function calcScore() {
  const DSSASAdd = Array(DSSAS.length).fill(0);
  selected.forEach((key) => {
    const opt = options[key];
    opt.add.forEach((v, i) => (DSSASAdd[i] += v));
  });
  // ベースに加算する
  const raw = Base_Score.map((b, i) => b + DSSASAdd[i]);
  // toFixedの数字は小数点
  const limit = raw.map((v) => Math.max(0, Math.min(max, Number(v.toFixed(2)))));

  return limit;
}

function calcPrice() {
  let total = Base_Price;
  selected.forEach((key) => {
    const opt = options[key];
    total += Number(opt.price);
  });
  return total;
}

function render() {
  const score = calcScore();
  const total = calcPrice();

  if (totalPrice) totalPrice.textContent = `¥${total.toLocaleString()}`;
  if (Count) Count.textContent = String(selected.size);

  if (Value) {
    Value.textContent = `現在値` + DSSAS.map((name, i) => `${name}:${score[i].toFixed(2)}`).join(" / ");
  }

  // Chartの更新
  chart.data.datasets[0].data = score;
  chart.update();
}

Buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.opt;
    if (!key || !options[key]) return;

    if (selected.has(key)) {
      selected.delete(key);
      btn.classList.remove("is-active");
      btn.setAttribute("aria-pressed", "false");
    } else {
      selected.add(key);
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
    }

    render();
  });

  btn.setAttribute("aria-pressed", "false");

  render();
});

// 雪-----------------------------------------------
const containerSnow = document.querySelector("#particle-container");

const createParticle = () => {
  const particle = document.createElement("div");
  particle.classList.add("particle");

  // ランダム
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.top = `${Math.random() * 100}vh`;

  containerSnow.appendChild(particle);

  // 一定時間後に削除
  setTimeout(() => {
    particle.remove();
  }, 5000);
  // 5秒
};
setInterval(createParticle, 200);
